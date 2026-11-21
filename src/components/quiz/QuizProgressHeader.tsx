'use client'

import { ArrowLeft, Phone } from 'lucide-react'

interface QuizProgressHeaderProps {
  restaurantName: string
  logoUrl?: string | null
  currentStep: number
  totalSteps: number
  onBack: () => void
  canGoBack: boolean
}

export default function QuizProgressHeader({
  restaurantName,
  logoUrl,
  currentStep,
  totalSteps,
  onBack,
  canGoBack,
}: QuizProgressHeaderProps) {
  const progressPercent = Math.round((currentStep / totalSteps) * 100)

  return (
    <div className="w-full max-w-lg mx-auto space-y-3">
      {/* Top row with restaurant info & back button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {canGoBack && (
            <button
              type="button"
              onClick={onBack}
              className="p-2 -ml-2 rounded-xl text-amber-200/70 hover:text-amber-100 hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Previous question"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#1b1028] flex items-center justify-center overflow-hidden shrink-0 shadow-md border border-amber-400/60 p-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoUrl || '/logo.png'}
                alt={restaurantName}
                className="w-full h-full object-contain rounded-full"
                onError={(e) => {
                  e.currentTarget.src = '/logo.png'
                }}
              />
            </div>
            <div>
              <span className="text-sm font-heading font-black tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#ffe49e] via-[#f7d77a] to-[#d4af37] truncate block max-w-[180px] sm:max-w-xs leading-none">
                {restaurantName || 'PM Zaika Restaurant'}
              </span>
              <span className="font-script text-[11px] text-amber-200/80 font-normal block leading-tight mt-0.5">
                Indian ‖ Chinese ‖ Tandoor ‖ Rolls
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="tel:7488260572"
            className="flex items-center gap-1 text-[11px] font-bold text-amber-200 bg-amber-400/10 hover:bg-amber-400/20 px-2.5 py-1 rounded-full border border-amber-400/30 transition-colors shadow-xs"
            title="Helpline: +91 74882 60572"
          >
            <Phone className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">Call:</span>
            <span>74882 60572</span>
          </a>
          <div className="text-xs font-semibold text-amber-200/70 bg-[#170e24] px-2.5 py-1 rounded-full border border-amber-500/25">
            Step <span className="text-amber-400 font-bold">{currentStep}</span> of {totalSteps}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-[#201230] rounded-full overflow-hidden p-0.5 border border-amber-500/20">
        <div
          className="h-full rounded-full transition-all duration-300 ease-out shadow-xs"
          style={{
            width: `${progressPercent}%`,
            background: 'linear-gradient(90deg, #bf8d2c 0%, #f6d47b 50%, #d4af37 100%)',
          }}
        />
      </div>
    </div>
  )
}
