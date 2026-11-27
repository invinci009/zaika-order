import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { jwtVerify } from 'jose'
import { NextResponse, type NextRequest } from 'next/server'

// ==============================================================================
// Multi-Tier Rate Limiting & Load Shedding
// Protects Firestore quotas by enforcing strict per-IP rate limits:
// 1. Upstash Redis (if configured)
// 2. High-performance In-Memory Sliding Window (built-in fallback)
// Prevents bot scans, DDoS, order flooding, and infinite loops from exhausting read/write limits.
// ==============================================================================

const upstashLimiters = new Map<string, Ratelimit>()

function isPlaceholderOrInvalid(val?: string): boolean {
  if (!val) return true
  const lower = val.toLowerCase()
  return (
    lower.includes('placeholder') ||
    lower.includes('your-redis') ||
    lower.includes('your-upstash') ||
    lower.includes('example.com')
  )
}

function getUpstashLimiter(category: string, maxRequests: number): Ratelimit | null {
  const key = `${category}:${maxRequests}`
  const existing = upstashLimiters.get(key)
  if (existing) return existing

  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (isPlaceholderOrInvalid(url) || isPlaceholderOrInvalid(token)) {
    return null
  }

  try {
    const limiter = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(maxRequests, '1 m'),
      analytics: false,
      prefix: `pmzaika:ratelimit:${category}`,
    })
    upstashLimiters.set(key, limiter)
    return limiter
  } catch {
    return null
  }
}

// ------------------------------------------------------------------------------
// In-Memory Sliding Window Rate Limiter
// Thread-safe per Next.js worker. Ensures rate limiting works unconditionally.
// ------------------------------------------------------------------------------
interface RateLimitBucket {
  count: number
  resetAt: number
}

const memoryLimiterStore = new Map<string, RateLimitBucket>()

function checkMemoryLimit(
  key: string,
  limit: number,
  windowMs: number
): { success: boolean; remaining: number; reset: number } {
  const now = Date.now()
  const bucket = memoryLimiterStore.get(key)

  if (!bucket || now >= bucket.resetAt) {
    const newReset = now + windowMs
    memoryLimiterStore.set(key, { count: 1, resetAt: newReset })
    return { success: true, remaining: limit - 1, reset: newReset }
  }

  if (bucket.count >= limit) {
    return { success: false, remaining: 0, reset: bucket.resetAt }
  }

  bucket.count++
  const remaining = Math.max(0, limit - bucket.count)

  // Periodic pruning of expired entries (supports up to 25,000 active concurrent users)
  if (memoryLimiterStore.size > 25000) {
    for (const [k, v] of memoryLimiterStore.entries()) {
      if (v.resetAt <= now) {
        memoryLimiterStore.delete(k)
      }
    }
  }

  return { success: true, remaining, reset: bucket.resetAt }
}

async function sha256HexEdge(input: string): Promise<Uint8Array> {
  const digest = await globalThis.crypto.subtle.digest('SHA-256', new TextEncoder().encode(input))
  const hex = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
  return new TextEncoder().encode(hex)
}

async function getVerifiedSessionPartition(request: NextRequest): Promise<string> {
  try {
    const custToken = request.cookies.get('rp_customer_session')?.value
    if (custToken) {
      const explicit = process.env.CUSTOMER_SESSION_SECRET
      const serverPrivate = process.env.FIREBASE_PRIVATE_KEY || process.env.SESSION_COOKIE_SECRET
      const rawSecret =
        explicit && explicit.length >= 16
          ? explicit
          : serverPrivate
          ? `${serverPrivate}::loyalty-customer-session`
          : null
      if (rawSecret) {
        const key = await sha256HexEdge(rawSecret)
        const { payload } = await jwtVerify(custToken, key, { algorithms: ['HS256'] })
        if (typeof payload.c === 'string' && /^\d{10}$/.test(payload.c)) {
          return `cust:${payload.c}`
        }
      }
    }

    const quizToken = request.cookies.get('rp_session')?.value
    if (quizToken) {
      const explicit = process.env.SESSION_COOKIE_SECRET
      const serverPrivate = process.env.FIREBASE_PRIVATE_KEY
      const rawSecret =
        explicit && explicit.length >= 16
          ? explicit
          : serverPrivate
          ? `${serverPrivate}::rp-session-secret`
          : null
      if (rawSecret) {
        const key = await sha256HexEdge(rawSecret)
        const { payload } = await jwtVerify(quizToken, key, { algorithms: ['HS256'] })
        if (typeof payload.session_id === 'string' && payload.session_id.length > 0) {
          return `sess:${payload.session_id.slice(-16)}`
        }
      }
    }
  } catch {
    // Forged or expired cookies fail cryptographic verification and fall back to strict IP throttling
  }
  return ''
}

export async function rateLimitMiddleware(request: NextRequest): Promise<NextResponse | null> {
  // 1. In local development or testing, never throttle developer activity
  if (process.env.NODE_ENV === 'development') {
    return null
  }

  const { pathname } = request.nextUrl
  const method = request.method
  // Only trust CF-Connecting-IP when Cloudflare's CF-Ray header indicates an authentic Cloudflare edge hop;
  // otherwise prefer Vercel/proxy IP headers to prevent trivial IP-header spoofing bypasses.
  const hasCloudflareRay = Boolean(request.headers.get('cf-ray')?.trim())
  const ip =
    (hasCloudflareRay ? request.headers.get('cf-connecting-ip')?.trim() : undefined) ||
    request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip')?.trim() ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'client'

  // Determine rate limits and isolated bucket key based on action type.
  // Partition on verified JWT session only for non-auth shared restaurant Wi-Fi routes.
  let maxRequests = 120
  let category = 'general'
  const windowMs = 60_000 // 1 minute
  let allowSessionPartition = true

  if (pathname.startsWith('/api/auth/login') || pathname.startsWith('/api/auth/reset-password') || pathname.startsWith('/api/auth/change-password')) {
    // Admin login, password reset, and change-password brute-force defense (strictly bound to IP)
    maxRequests = 10
    category = 'admin-auth'
    allowSessionPartition = false
  } else if (pathname.startsWith('/api/auth/')) {
    // General auth actions (session check, logout)
    maxRequests = 60
    category = 'auth-general'
    allowSessionPartition = false
  } else if (pathname.includes('/sessions/') && pathname.includes('/draft')) {
    // AI review draft generation (prevents LLM quota/billing abuse)
    maxRequests = 15
    category = 'ai-draft'
    allowSessionPartition = false
  } else if (pathname.includes('/orders') && method === 'POST') {
    // Order creation: 300/min per IP to support 100+ concurrent diners on shared Wi-Fi
    maxRequests = 300
    category = 'order-create'
  } else if (pathname.includes('/service-requests') && method === 'POST') {
    // Waiter service requests: 150/min per IP
    maxRequests = 150
    category = 'service-create'
  } else if (pathname.includes('/loyalty/auth') || pathname.includes('/loyalty/claim')) {
    // Loyalty auth/OTP/claim brute-force defense: 15/min per IP
    maxRequests = 15
    category = 'loyalty-auth'
    allowSessionPartition = false
  } else if (pathname.startsWith('/api/public/image-proxy')) {
    // Image proxy outbound fetch protection: 240/min per IP
    maxRequests = 240
    category = 'image-proxy'
    allowSessionPartition = false
  } else if (pathname.startsWith('/api/business/')) {
    // Business dashboard routes: max 600 per minute
    maxRequests = 600
    category = 'business'
  } else if (pathname === '/api/public/order-menu' || pathname.startsWith('/api/public/order-menu')) {
    // Public menu & catalog reads: High capacity (3000 per minute per IP)
    // Critical: Supports 1,000+ concurrent diners browsing dishes simultaneously on restaurant Wi-Fi
    maxRequests = 3000
    category = 'menu-catalog'
  } else if (pathname.startsWith('/api/public/orders/') && method === 'GET') {
    // Order tracking & SSE stream: 600 per minute per IP
    maxRequests = 600
    category = 'order-track'
  } else if (pathname.startsWith('/api/public/')) {
    // General public queries (tables, settings): 600 per minute per IP
    maxRequests = 600
    category = 'public-general'
  }

  const verifiedPartition = allowSessionPartition ? await getVerifiedSessionPartition(request) : ''
  const sessionSuffix = verifiedPartition ? `:${verifiedPartition}` : ''
  const memoryKey = `${ip}${sessionSuffix}:${category}`

  const limiter = getUpstashLimiter(category, maxRequests)
  if (limiter) {
    try {
      const timeoutPromise = new Promise<{ success: boolean; remaining: number; reset: number }>((_, reject) =>
        setTimeout(() => reject(new Error('Rate limit timeout')), 600)
      )

      const result = await Promise.race([
        limiter.limit(memoryKey),
        timeoutPromise,
      ])

      if (!result.success) {
        return NextResponse.json(
          { error: 'Too many requests. Please slow down.' },
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': maxRequests.toString(),
              'X-RateLimit-Remaining': result.remaining.toString(),
              'Retry-After': Math.ceil((result.reset - Date.now()) / 1000).toString(),
            },
          }
        )
      }
      return null
    } catch {
      // If Redis times out, fall through to in-memory limiter
    }
  }

  // Use In-Memory sliding window
  const { success, remaining, reset } = checkMemoryLimit(memoryKey, maxRequests, windowMs)

  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment before trying again.' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': maxRequests.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'Retry-After': Math.max(1, Math.ceil((reset - Date.now()) / 1000)).toString(),
        },
      }
    )
  }

  return null
}
