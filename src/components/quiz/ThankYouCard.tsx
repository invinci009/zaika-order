'use client'

import { Heart, Sparkles, CheckCircle2, MapPin, Share2, Phone, Utensils } from 'lucide-react'
import Link from 'next/link'

interface ThankYouCardProps {
  restaurantName: string
  slug?: string
}

export default function ThankYouCard({ restaurantName, slug }: ThankYouCardProps) {
  const handleShare = async () => {
    if (typeof window === 'undefined') return
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${restaurantName} — Fine Dining Restaurant & Banquet`,
          text: `Check out ${restaurantName} on Phulwari Rd, Near Shaheed Bhagat Singh Chowk, Birla Colony, Phulwari Sharif, Patna, Bihar 801505!`,
          url,
        })
      } catch {}
    } else {
      navigator.clipboard.writeText(url)
      alert('Restaurant link copied to clipboard!')
    }
  }

  return (
    <main className="relative z-10 w-full max-w-md mx-auto my-auto py-3 sm:py-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="p-6 sm:p-8 rounded-3xl bg-[#170e24]/95 backdrop-blur-xl border border-amber-500/30 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_35px_rgba(212,175,55,0.08)] text-center space-y-5 sm:space-y-6 text-[#f5f0e8]">
        {/* Celebration Monogram */}
        <div className="relative mx-auto w-20 h-20">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-[#bf8d2c] via-[#f6d47b] to-[#a6741b] text-[#120816] flex items-center justify-center shadow-xl shadow-amber-500/30 border-2 border-amber-300">
            <Heart className="w-10 h-10 fill-[#120816] stroke-[#120816] drop-shadow-sm animate-pulse" />
          </div>
          <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-amber-400 shadow-md border border-amber-300 text-black">
            <Sparkles className="w-3.5 h-3.5 fill-black" />
          </div>
        </div>

        {/* Title & Shukriya Badge */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-[11px] font-bold text-amber-300 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Shukriya! धन्यवाद</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ffe49e] via-[#f7d77a] to-[#d4af37] tracking-tight leading-tight uppercase">
            Thank you for dining with us!
          </h1>

          <p className="text-xs sm:text-sm text-amber-100/70 leading-relaxed max-w-xs mx-auto">
            Your honest thoughts help the chef and team at{' '}
            <strong className="text-amber-200 font-bold">{restaurantName || 'PM Zaika Restaurant'}</strong> maintain
            the highest culinary standard.
          </p>
        </div>

        {/* Verified Feedback Badge Card */}
        <div className="p-4 rounded-2xl bg-[#140b1e]/90 border border-amber-500/25 text-left space-y-2 shadow-inner">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Feedback Recorded Successfully</span>
            </div>
            <span className="text-[10px] font-semibold text-amber-300 bg-amber-400/15 px-2 py-0.5 rounded-full border border-amber-400/30">
              Verified Diner
            </span>
          </div>
          <p className="text-xs text-amber-200/60 leading-relaxed">
            Our management team and kitchen staff review every response to continually perfect our royal Awadhi recipes, tandoori specialties, and hospitality. We look forward to hosting you again soon!
          </p>
        </div>

        {/* Customer Helpline & Quick Action Buttons */}
        <div className="space-y-2.5 pt-1">
          {/* Primary: Direct Call to Restaurant */}
          <a
            href="tel:7488260572"
            className="w-full h-12 rounded-xl text-[#120816] font-black shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 text-sm transition-all duration-200 cursor-pointer active:scale-95"
            style={{
              background: 'linear-gradient(90deg, #bf8d2c 0%, #f6d47b 35%, #eed48f 65%, #a6741b 100%)',
            }}
          >
            <Phone className="w-4 h-4 stroke-[2.5]" />
            <span>Call Restaurant: +91 74882 60572</span>
          </a>

          {/* Secondary Buttons Row */}
          <div className="grid grid-cols-2 gap-2">
            <a
              href="https://www.google.com/maps/search/?api=1&query=Phulwari+Rd+Near+Shaheed+Bhagat+Singh+Chowk+Birla+Colony+Phulwari+Sharif+Patna"
              target="_blank"
              rel="noopener noreferrer"
              className="h-11 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-amber-500/25 text-amber-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Directions</span>
            </a>

            <button
              type="button"
              onClick={handleShare}
              className="h-11 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-amber-500/25 text-amber-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Share Place</span>
            </button>
          </div>

          {slug && (
            <Link
              href={`/order/${slug}`}
              className="inline-flex items-center justify-center w-full h-11 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-200 font-bold transition-all text-xs active:scale-[0.98] gap-1.5"
            >
              <Utensils className="w-3.5 h-3.5 text-amber-400" />
              <span>Browse Full Menu &amp; Order</span>
            </Link>
          )}
        </div>
      </div>
    </main>
  )
}
