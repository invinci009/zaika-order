import 'server-only'
import { createHash } from 'crypto'
import type { NextRequest } from 'next/server'
import { getAdminAuth } from './admin'

// ==============================================================================
// Firebase Auth Helpers
// ==============================================================================
// Server-side authentication helpers for dashboard users.
// ==============================================================================

export interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
  emailVerified: boolean
}

interface CachedAuthEntry {
  user: AuthUser
  expiresAt: number
}

const AUTH_CACHE_TTL_MS = 20_000
const MAX_AUTH_CACHE_SIZE = 500

declare global {
  var __rp_authSessionCache: Map<string, CachedAuthEntry> | undefined
  var __rp_authInFlight: Map<string, Promise<AuthUser | null>> | undefined
  var __rp_revokedBeforeMs: Map<string, number> | undefined
}

const authSessionCache = (globalThis.__rp_authSessionCache ??= new Map<string, CachedAuthEntry>())
const authInFlight = (globalThis.__rp_authInFlight ??= new Map<string, Promise<AuthUser | null>>())
const revokedBeforeMs = (globalThis.__rp_revokedBeforeMs ??= new Map<string, number>())

function hashSessionToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

function readJwtClaimsUnsafe(token: string): { iat?: number; exp?: number } | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const json = Buffer.from(parts[1], 'base64url').toString('utf8')
    const parsed = JSON.parse(json)
    return parsed && typeof parsed === 'object' ? (parsed as { iat?: number; exp?: number }) : null
  } catch {
    return null
  }
}

/**
 * Immediately invalidate cached Firebase session validations on logout or password rotation.
 */
export function invalidateAuthSessionCache(token?: string, uid?: string): void {
  if (token) {
    authSessionCache.delete(hashSessionToken(token))
  }
  if (uid) {
    revokedBeforeMs.set(uid, Date.now())
    for (const [k, v] of authSessionCache.entries()) {
      if (v.user.uid === uid) {
        authSessionCache.delete(k)
      }
    }
  }
}

/**
 * Validate a Firebase ID token or session cookie and return the user info.
 * Short 20s verified cache (with explicit instant purge on logout/password reset) avoids
 * paying a ~200ms Google Identity Toolkit HTTP roundtrip on every dashboard poll.
 */
export async function validateSession(token: string): Promise<AuthUser | null> {
  if (!token || typeof token !== 'string') return null

  const tokenHash = hashSessionToken(token)
  const now = Date.now()
  const cached = authSessionCache.get(tokenHash)
  if (cached && cached.expiresAt > now) {
    const uidRevokedAt = revokedBeforeMs.get(cached.user.uid) || 0
    if (uidRevokedAt <= now - AUTH_CACHE_TTL_MS) {
      return cached.user
    }
    authSessionCache.delete(tokenHash)
  }

  const inflight = authInFlight.get(tokenHash)
  if (inflight) {
    return inflight
  }

  const verifyPromise = (async (): Promise<AuthUser | null> => {
    const auth = getAdminAuth()
    let user: AuthUser | null = null

    // 1. First verify as a long-lived Firebase session cookie (checkRevoked = true enforces logout/password rotation)
    try {
      const decoded = await auth.verifySessionCookie(token, true)
      user = {
        uid: decoded.uid,
        email: decoded.email || null,
        displayName: decoded.name || null,
        emailVerified: decoded.email_verified || false,
      }
    } catch (err) {
      const code =
        typeof err === 'object' && err !== null && 'code' in err
          ? String((err as { code?: unknown }).code)
          : ''
      if (code === 'auth/session-cookie-revoked') return null
      // Session cookie verification failed, fall back to ID token
    }

    // 2. Fall back to standard Firebase ID token (checkRevoked = true)
    if (!user) {
      try {
        const decoded = await auth.verifyIdToken(token, true)
        user = {
          uid: decoded.uid,
          email: decoded.email || null,
          displayName: decoded.name || null,
          emailVerified: decoded.email_verified || false,
        }
      } catch {
        return null
      }
    }

    if (user) {
      const claims = readJwtClaimsUnsafe(token)
      const expMs = typeof claims?.exp === 'number' ? claims.exp * 1000 : Infinity
      const expiresAt = Math.min(expMs, Date.now() + AUTH_CACHE_TTL_MS)
      if (expiresAt > Date.now()) {
        if (authSessionCache.size >= MAX_AUTH_CACHE_SIZE) {
          const ts = Date.now()
          for (const [k, v] of authSessionCache.entries()) {
            if (v.expiresAt <= ts) authSessionCache.delete(k)
          }
          if (authSessionCache.size >= MAX_AUTH_CACHE_SIZE) {
            authSessionCache.clear()
          }
        }
        authSessionCache.set(tokenHash, { user, expiresAt })
      }
    }

    return user
  })()

  authInFlight.set(tokenHash, verifyPromise)
  try {
    return await verifyPromise
  } finally {
    authInFlight.delete(tokenHash)
  }
}

/**
 * Extract the session from an incoming request.
 * Accepts `Authorization: Bearer <token>` OR the `firebase_token` cookie
 * (dashboard client components rely on the httpOnly cookie — they never
 * send an Authorization header, and <img> tags can't either).
 */
export async function getSessionFromRequest(request: NextRequest): Promise<AuthUser | null> {
  const authHeader = request.headers.get('authorization')
  const idToken = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : request.cookies.get('firebase_token')?.value
  if (!idToken) return null
  return validateSession(idToken)
}

/**
 * Create a custom session token for a user.
 * This can be used to create session cookies after Firebase Auth login.
 */
export async function createSessionToken(uid: string, expiresIn = 60 * 60 * 24 * 7): Promise<string> {
  const auth = getAdminAuth()
  return auth.createCustomToken(uid, {
    expiresIn,
  })
}

/**
 * Get or create a user by email.
 * Useful for first-time dashboard setup.
 */
export async function getOrCreateUser(email: string, password: string): Promise<AuthUser> {
  const auth = getAdminAuth()
  try {
    const user = await auth.getUserByEmail(email)
    return {
      uid: user.uid,
      email: user.email || null,
      displayName: user.displayName || null,
      emailVerified: user.emailVerified,
    }
  } catch {
    // User doesn't exist, create them
    const user = await auth.createUser({
      email,
      password,
      emailVerified: false,
    })
    return {
      uid: user.uid,
      email: user.email || null,
      displayName: user.displayName || null,
      emailVerified: false,
    }
  }
}

/**
 * Update a user's password.
 */
export async function updateUserPassword(uid: string, newPassword: string): Promise<void> {
  const auth = getAdminAuth()
  await auth.updateUser(uid, { password: newPassword })
}

/**
 * Delete a user.
 */
export async function deleteUser(uid: string): Promise<void> {
  const auth = getAdminAuth()
  await auth.deleteUser(uid)
}
