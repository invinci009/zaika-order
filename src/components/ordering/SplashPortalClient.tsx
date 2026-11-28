'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect } from 'react'
import { SplashScreen } from './SplashScreen'

interface SplashPortalClientProps {
  menuHref: string
  restaurantName?: string
  table?: string
  phone?: string
  helpline?: string
  address?: string
}

const SPLASH_SEEN_KEY = 'pmz_splash_seen'

export function SplashPortalClient({
  menuHref,
  restaurantName = 'PM Zaika Restaurant',
  table,
  phone = '+91 74882 60572',
  helpline = '95257 48843',
  address = 'PM Zaika Restaurant, Shersha Road, Gur Ki Mandi, Infront of Bank of India, Patna - 800007, Bihar',
}: SplashPortalClientProps) {
  const router = useRouter()

  useEffect(() => {
    router.prefetch(menuHref)
    // Pre-warm catalog HTTP/CDN cache while royal emblem animates
    try {
      const slug = menuHref.split('/')[2] || 'pm-zaika'
      fetch(`/api/public/order-menu?slug=${encodeURIComponent(slug)}`).catch(() => {})
      if (sessionStorage.getItem(SPLASH_SEEN_KEY) === '1') {
        router.replace(menuHref)
      }
    } catch {}
  }, [router, menuHref])

  const handleComplete = useCallback(() => {
    try {
      sessionStorage.setItem(SPLASH_SEEN_KEY, '1')
    } catch {}
    router.push(menuHref)
  }, [router, menuHref])

  return (
    <SplashScreen
      onComplete={handleComplete}
      restaurantName={restaurantName}
      table={table}
      phone={phone}
      helpline={helpline}
      address={address}
    />
  )
}
