'use client'

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { SplashScreen } from './SplashScreen'

interface SplashPortalClientProps {
  menuHref: string
  restaurantName?: string
  table?: string
  phone?: string
  helpline?: string
  address?: string
}

export function SplashPortalClient({
  menuHref,
  restaurantName = 'PM Zaika Restaurant',
  table,
  phone = '+91 74882 60572',
  helpline = '95257 48843',
  address = 'Phulwari Sharif, Patna',
}: SplashPortalClientProps) {
  const router = useRouter()

  const handleComplete = useCallback(() => {
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
