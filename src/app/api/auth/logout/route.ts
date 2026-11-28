import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest, invalidateAuthSessionCache } from '@/lib/firebase/auth'
import { getAdminAuth } from '@/lib/firebase/admin'

export async function POST(request: NextRequest) {
  // Revoke session server-side if user is authenticated
  const token = request.cookies.get('firebase_token')?.value
  try {
    const user = await getSessionFromRequest(request)
    if (user?.uid) {
      await getAdminAuth().revokeRefreshTokens(user.uid).catch(() => {})
      invalidateAuthSessionCache(token, user.uid)
    } else if (token) {
      invalidateAuthSessionCache(token)
    }
  } catch (err) {
    console.warn('Logout server-side token revocation warning:', err)
  }

  const response = NextResponse.json({ success: true })
  response.cookies.set('firebase_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })

  return response
}
