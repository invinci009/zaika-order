'use client'

import { useEffect } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { RefreshCw, Phone, Home, Sparkles, AlertTriangle } from 'lucide-react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function OrderSlugError({ error, reset }: ErrorProps) {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const slug = (params?.slug as string) || 'pm-zaika'
  const table = searchParams?.get('table') || ''

  useEffect(() => {
    // Client-side logging for diagnostics
    console.error('Ordering Portal Client Error:', error)
  }, [error])

  const handleRecover = () => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem('pm_zaika_cart')
        window.localStorage.removeItem('pm_zaika_live_order')
      } catch {}
    }
    reset()
  }

  const handleReturnHome = () => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem('pm_zaika_cart')
      } catch {}
    }
    const query = table ? `?table=${encodeURIComponent(table)}` : ''
    router.push(`/order/${slug}${query}`)
  }

  return (
    <div
      className="relative min-h-screen text-[#f5f0e8] flex items-center justify-center p-4 overflow-hidden selection:bg-amber-500 selection:text-black font-sans"
      style={{
        background: 'radial-gradient(ellipse 90% 85% at 50% 32%, #140d24 0%, #0a0614 55%, #040208 100%)',
      }}
    >
      {/* Ambient Pulsing Gold Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 36%, rgba(245, 158, 11, 0.16) 0%, rgba(212, 162, 52, 0.05) 45%, transparent 70%)',
        }}
      />

      <main className="relative z-10 w-full max-w-sm text-center">
        <div className="p-7 sm:p-8 rounded-[28px] bg-[#150d24]/90 border border-amber-500/35 shadow-2xl backdrop-blur-xl space-y-5">
          {/* Official PM Zaika Medallion Logo */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full p-1 bg-black/90 border-2 border-[#f59e0b] shadow-[0_8px_32px_rgba(245,158,11,0.35)] shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="PM Zaika Restaurant"
              className="w-full h-full object-contain rounded-full select-none"
            />
          </div>

          {/* Concierge Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Dining Concierge Assistance</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ffe49e] via-[#f7d77a] to-[#d4af37]">
              Restoring Your Menu
            </h1>
            <p className="text-xs text-amber-200/80 leading-relaxed max-w-[280px] mx-auto">
              We encountered a brief hiccup loading your dining session. Tap below to refresh your royal menu cleanly.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={handleRecover}
              className="w-full h-11 rounded-2xl bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:brightness-110 text-[#140b20] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 active:scale-[0.98] transition cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 stroke-[2.5]" />
              <span>Refresh Menu</span>
            </button>

            <button
              type="button"
              onClick={handleReturnHome}
              className="w-full h-10 rounded-2xl bg-[#1d1230] hover:bg-[#25173e] border border-amber-500/25 text-amber-200 font-bold text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition cursor-pointer"
            >
              <Home className="w-3.5 h-3.5 text-amber-400" />
              <span>Back to Table Welcome</span>
            </button>

            <a
              href="tel:+917488260572"
              className="w-full h-10 rounded-2xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Waiter / Staff: +91 74882 60572</span>
            </a>
          </div>

          {/* Footer Note */}
          <div className="pt-2 border-t border-amber-500/15 text-[10.5px] text-amber-200/50 leading-relaxed">
            PM Zaika Restaurant, Shersha Road, Gur Ki Mandi, Infront of Bank of India, Patna - 800007, Bihar
          </div>
        </div>
      </main>
    </div>
  )
}
