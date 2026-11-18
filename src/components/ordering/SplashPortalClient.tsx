'use client'

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { SplashScreen } from './SplashScreen'

interface SplashPortalClientProps {
  menuHref: string
  restaurantName: string
}

export function SplashPortalClient({ menuHref, restaurantName }: SplashPortalClientProps) {
  const router = useRouter()

  const handleComplete = useCallback(() => {
    router.push(menuHref)
  }, [router, menuHref])

  return <SplashScreen onComplete={handleComplete} restaurantName={restaurantName} />
}
