'use client'

import { useEffect, useState } from 'react'

interface SplashScreenProps {
  onComplete: () => void
  restaurantName?: string
  table?: string
  phone?: string
  helpline?: string
  address?: string
}

export function SplashScreen({
  onComplete,
  restaurantName = 'PM Zaika Restaurant',
  table,
  phone = '+91 74882 60572',
  helpline = '95257 48843',
  address = 'PM Zaika Restaurant, Shersha Road, Gur Ki Mandi, Infront of Bank of India, Patna - 800007, Bihar',
}: SplashScreenProps) {
  const [phase, setPhase] = useState<'entering' | 'showing' | 'leaving'>('entering')
  const [stepIndex, setStepIndex] = useState(0)

  const steps = [
    '✨ Curating Royal Awadhi Delicacies...',
    '🌿 Sourcing Hand-Pounded Saffron & Spices...',
    '🍽️ Welcome to PM Zaika Restaurant...',
  ]

  useEffect(() => {
    const t0 = setTimeout(() => setPhase('showing'), 40)
    const s1 = setTimeout(() => setStepIndex(1), 320)
    const s2 = setTimeout(() => setStepIndex(2), 620)
    const tLeave = setTimeout(() => setPhase('leaving'), 850)
    const tEnd = setTimeout(() => onComplete(), 1100)

    return () => {
      clearTimeout(t0)
      clearTimeout(s1)
      clearTimeout(s2)
      clearTimeout(tLeave)
      clearTimeout(tEnd)
    }
  }, [onComplete])

  return (
    <div
      onClick={onComplete}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-between py-4 sm:py-6 px-4 sm:px-6 overflow-hidden transition-all duration-700 ease-in-out select-none cursor-pointer ${
        phase === 'leaving' ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        background: 'radial-gradient(ellipse 90% 85% at 50% 32%, #140d24 0%, #0a0614 55%, #040208 100%)',
      }}
    >
      {/* 1. Luminous Golden Ambient Halo Glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background: 'radial-gradient(circle at 50% 36%, rgba(245, 158, 11, 0.16) 0%, rgba(212, 162, 52, 0.06) 42%, transparent 70%)',
          animation: 'ambientBreath 4s ease-in-out infinite alternate',
        }}
      />

      {/* 2. Slow-Rotating Sacred Geometry Awadhi Mandala Watermark */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] sm:w-[760px] sm:h-[760px] pointer-events-none opacity-[0.09]"
        style={{
          animation: 'mandalaRotate 120s linear infinite',
        }}
      >
        <SacredAwadhiMandala />
      </div>

      {/* 3. Floating Golden Stardust Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { top: '18%', left: '16%', delay: '0s', size: 3, dur: '3.6s' },
          { top: '24%', left: '84%', delay: '1.2s', size: 2.5, dur: '4.2s' },
          { top: '42%', left: '10%', delay: '0.6s', size: 2, dur: '3.8s' },
          { top: '58%', left: '88%', delay: '1.8s', size: 3.5, dur: '4.5s' },
          { top: '72%', left: '22%', delay: '0.9s', size: 2.5, dur: '3.9s' },
          { top: '32%', left: '76%', delay: '2.1s', size: 2, dur: '4.1s' },
          { top: '50%', left: '26%', delay: '1.5s', size: 3, dur: '3.5s' },
          { top: '15%', left: '60%', delay: '2.4s', size: 2, dur: '4.8s' },
        ].map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              background: '#FDEBD3',
              boxShadow: '0 0 10px rgba(245, 158, 11, 0.9), 0 0 20px rgba(245, 158, 11, 0.5)',
              animation: `stardustDrift ${star.dur} ease-in-out ${star.delay} infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* Top Header Badge */}
      <header
        className="relative z-10 w-full flex items-center justify-center pt-1"
        style={{
          opacity: phase === 'entering' ? 0 : 1,
          transform: phase === 'entering' ? 'translateY(-14px)' : 'translateY(0)',
          transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div className="flex items-center gap-2 px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#180e28]/90 border border-[#f59e0b]/35 shadow-lg backdrop-blur-md">
          <span className="text-[#f59e0b] text-xs">✦</span>
          <span className="text-[10px] sm:text-[11px] font-bold text-amber-200 tracking-widest uppercase">
            {table ? `TABLE ${table} • ROYAL GUEST WELCOME` : 'ROYAL AWADHI HERITAGE • ESTD. PATNA'}
          </span>
          <span className="text-[#f59e0b] text-xs">✦</span>
        </div>
      </header>

      {/* Main Center Content: Grand Medallion Logo, Culinary Tagline, and Restaurant Card */}
      <div className="relative z-10 flex flex-col items-center gap-2.5 sm:gap-3.5 my-auto max-w-[400px] w-full text-center">
        {/* Official PM Zaika Medallion Logo — Large Focal Emblem */}
        <div
          className="relative flex items-center justify-center my-1"
          style={{
            opacity: phase === 'entering' ? 0 : 1,
            transform: phase === 'entering' ? 'scale(0.76) translateY(20px)' : 'scale(1) translateY(0)',
            transition: 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
            transitionDelay: '0.08s',
          }}
        >
          {/* Luminous Pulsing Gold Halo Ring behind Logo */}
          <div
            className="absolute -inset-4 sm:-inset-5 rounded-full pointer-events-none border border-amber-400/45"
            style={{
              boxShadow: '0 0 60px rgba(245, 158, 11, 0.6), inset 0 0 36px rgba(245, 158, 11, 0.28)',
              animation: 'ambientBreath 3.5s ease-in-out infinite alternate',
            }}
          />

          {/* Medallion Container */}
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full overflow-hidden shadow-[0_16px_55px_rgba(0,0,0,0.95),0_0_45px_rgba(245,158,11,0.4)] border-2 border-[#f59e0b] bg-black/95 p-1 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt={restaurantName}
              className="w-full h-full object-contain rounded-full select-none"
            />
          </div>
        </div>

        {/* Imperial Jewel Divider */}
        <div
          className="flex items-center justify-center gap-2.5 my-0.5"
          style={{
            opacity: phase === 'entering' ? 0 : 1,
            width: phase === 'entering' ? '0px' : '220px',
            transition: 'opacity 0.85s ease-out, width 0.85s ease-out',
            transitionDelay: '0.35s',
          }}
        >
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#f59e0b]/60 to-[#f59e0b]" />
          <span className="text-[#f59e0b] text-[10px] select-none font-black">◈</span>
          <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#f59e0b]/60 to-[#f59e0b]" />
        </div>

        {/* Haute-Cuisine Spaced Tagline */}
        <div
          style={{
            opacity: phase === 'entering' ? 0 : 1,
            letterSpacing: phase === 'entering' ? '0.35em' : '0.18em',
            transition: 'opacity 0.8s ease-out, letter-spacing 0.8s ease-out',
            transitionDelay: '0.5s',
          }}
        >
          <p className="text-center text-[10.5px] sm:text-xs font-bold uppercase select-none text-[#F3E8D2]">
            INDIAN <span className="text-[#f59e0b] px-0.5 font-black">◈</span> CHINESE <span className="text-[#f59e0b] px-0.5 font-black">◈</span> TANDOOR <span className="text-[#f59e0b] px-0.5 font-black">◈</span> ROLLS
          </p>
        </div>

        {/* Detailed Restaurant Information Glass Card */}
        <div
          className="w-full mt-1.5 p-3 rounded-2xl bg-[#150d24]/85 border border-[#f59e0b]/30 shadow-2xl backdrop-blur-md text-center space-y-2"
          style={{
            opacity: phase === 'entering' ? 0 : 1,
            transform: phase === 'entering' ? 'translateY(16px)' : 'translateY(0)',
            transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
            transitionDelay: '0.9s',
          }}
        >
          {/* Row 1: Rating & Location Pill */}
          <div className="flex items-center justify-center gap-2 flex-wrap text-[11px] font-semibold text-amber-100">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/35 text-amber-300">
              <span className="text-amber-400">★</span> 4.8 Royal Dining
            </span>
            <span className="text-white/30">•</span>
            <span className="text-amber-200/90">Gur Ki Mandi, Patna - 800007, Bihar</span>
          </div>

          {/* Row 2: Contact & Helpline */}
          <div className="text-[11px] text-amber-200/80 flex items-center justify-center gap-1.5 flex-wrap">
            <span className="text-amber-400 font-bold">Helpline:</span>
            <span className="font-semibold text-white tracking-wide">{phone}</span>
            {helpline && (
              <>
                <span className="text-white/30">•</span>
                <span className="text-amber-300 font-medium">{helpline}</span>
              </>
            )}
          </div>

          {/* Row 3: Full Address & Social Handle */}
          <div className="pt-1 border-t border-[#f59e0b]/15 flex items-center justify-between gap-2 text-[10px] text-amber-200/75 px-1 text-left">
            <span className="leading-snug">{address}</span>
            <span className="font-semibold text-amber-300 shrink-0">@zaikarestaurant81</span>
          </div>
        </div>
      </div>

      {/* Bottom Loading Progress Bar, Dynamic Steps & Pearls */}
      <footer
        className="relative z-10 w-full max-w-[340px] flex flex-col items-center gap-2.5 pb-1"
        style={{
          opacity: phase === 'entering' ? 0 : 1,
          transition: 'opacity 0.6s ease-out',
          transitionDelay: '1.1s',
        }}
      >
        {/* Dynamic Culinary Stage Label */}
        <div className="h-5 flex items-center justify-center">
          <p
            key={stepIndex}
            className="text-[11px] sm:text-xs font-medium text-amber-200 tracking-wide animate-in fade-in zoom-in-95 duration-300 text-center"
          >
            {steps[stepIndex]}
          </p>
        </div>

        {/* 24K Liquid Gold Smooth Progress Bar */}
        <div className="w-full h-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 overflow-hidden relative shadow-inner">
          <div
            className="h-full rounded-full transition-all duration-[3300ms] ease-out"
            style={{
              width: phase === 'entering' ? '4%' : '100%',
              background: 'linear-gradient(90deg, #F59E0B 0%, #FDE08B 45%, #FFFFFF 75%, #F59E0B 100%)',
              boxShadow: '0 0 12px rgba(245, 158, 11, 0.8), 0 0 24px rgba(245, 158, 11, 0.4)',
            }}
          />
        </div>

        {/* 3 Golden Pulsing Pearls & Skip Button */}
        <div className="w-full flex items-center justify-between px-1 pt-0.5">
          {/* Pearls */}
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #F5C76D 40%, #D48016 100%)',
                  boxShadow: '0 0 8px rgba(245, 158, 11, 0.9)',
                  animation: `pearlBreath 1.4s ease-in-out ${i * 0.22}s infinite alternate`,
                }}
              />
            ))}
          </div>

          {/* Quick Skip Link */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onComplete()
            }}
            className="text-[10px] font-bold tracking-wider uppercase text-amber-300/80 hover:text-amber-200 transition-colors flex items-center gap-1"
          >
            <span>Skip to Menu</span>
            <span className="text-amber-400">→</span>
          </button>
        </div>
      </footer>

      <style>{`
        @keyframes ambientBreath {
          0% { transform: scale(0.96); opacity: 0.7; }
          100% { transform: scale(1.05); opacity: 1; }
        }
        @keyframes mandalaRotate {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes stardustDrift {
          0% { transform: translateY(0px) scale(0.8); opacity: 0.3; }
          50% { opacity: 0.95; }
          100% { transform: translateY(-20px) scale(1.15); opacity: 0.2; }
        }
        @keyframes pearlBreath {
          0% { transform: scale(0.7); opacity: 0.4; }
          100% { transform: scale(1.25); opacity: 1; filter: brightness(1.2); }
        }
      `}</style>
    </div>
  )
}



/**
 * Sacred Awadhi Mandala Background Watermark
 * Exquisite multi-layered sacred geometry with concentric lotus petals, pearls, and starburst rays.
 */
function SacredAwadhiMandala() {
  const spokes16 = Array.from({ length: 16 }, (_, i) => i * 22.5)
  const spokes32 = Array.from({ length: 32 }, (_, i) => i * 11.25)

  return (
    <svg
      viewBox="0 0 600 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <g stroke="#F5C76D" strokeWidth="0.9" opacity="0.95">
        {/* Core Concentric Circles */}
        <circle cx="300" cy="300" r="16" strokeWidth="1.2" />
        <circle cx="300" cy="300" r="28" strokeWidth="0.8" />
        <circle cx="300" cy="300" r="46" strokeWidth="1.1" />
        <circle cx="300" cy="300" r="66" strokeWidth="0.8" />
        <circle cx="300" cy="300" r="88" strokeWidth="1.2" />
        <circle cx="300" cy="300" r="124" strokeWidth="0.9" />
        <circle cx="300" cy="300" r="160" strokeWidth="1.3" />
        <circle cx="300" cy="300" r="208" strokeWidth="0.8" />
        <circle cx="300" cy="300" r="260" strokeWidth="1.2" />

        {/* Center 16 Starburst Triangle Rays */}
        {spokes16.map((deg) => (
          <g key={`star-${deg}`} transform={`rotate(${deg} 300 300)`}>
            <polygon points="300,272 303.5,284 296.5,284" fill="#F5C76D" opacity="0.4" stroke="none" />
          </g>
        ))}

        {/* Pearl Beads Ring (at r=56) */}
        {spokes16.map((deg) => (
          <circle
            key={`bead-${deg}`}
            cx={300 + 56 * Math.cos((deg * Math.PI) / 180)}
            cy={300 + 56 * Math.sin((deg * Math.PI) / 180)}
            r="3.5"
            strokeWidth="0.9"
          />
        ))}

        {/* Scalloped Floral Arches (r=66 to r=88) */}
        {spokes16.map((deg) => (
          <g key={`arch-${deg}`} transform={`rotate(${deg} 300 300)`}>
            <path d="M 288 234 C 291 220, 309 220, 312 234" strokeWidth="1.1" />
            <circle cx="300" cy="226" r="2.2" fill="#F5C76D" opacity="0.6" stroke="none" />
          </g>
        ))}

        {/* Intermediate Pointed Lotus Petals (r=88 to r=124) */}
        {spokes16.map((deg) => (
          <g key={`mid-petal-${deg}`} transform={`rotate(${deg} 300 300)`}>
            <path d="M 282 212 C 288 190, 300 176, 300 176 C 300 176, 312 190, 318 212" strokeWidth="1.1" />
            <path d="M 286 212 C 291 197, 300 185, 300 185 C 300 185, 309 197, 314 212" strokeWidth="0.7" opacity="0.75" />
            <line x1="300" y1="212" x2="300" y2="180" strokeWidth="0.6" strokeDasharray="3 2" />
          </g>
        ))}

        {/* Intermediate Pearl Ring (at r=142) */}
        {spokes32.map((deg) => (
          <circle
            key={`outer-bead-${deg}`}
            cx={300 + 142 * Math.cos((deg * Math.PI) / 180)}
            cy={300 + 142 * Math.sin((deg * Math.PI) / 180)}
            r="2.6"
            strokeWidth="0.8"
          />
        ))}

        {/* Large Pointed Floral Lotus Petals (r=160 to r=208) */}
        {spokes16.map((deg) => (
          <g key={`large-petal-${deg}`} transform={`rotate(${deg} 300 300)`}>
            <path d="M 268 140 C 278 110, 300 92, 300 92 C 300 92, 322 110, 332 140" strokeWidth="1.3" />
            <path d="M 276 140 C 284 119, 300 104, 300 104 C 300 104, 316 119, 324 140" strokeWidth="0.8" opacity="0.7" />
            <circle cx="300" cy="118" r="3.8" strokeWidth="0.9" />
          </g>
        ))}

        {/* Outermost Radiating Flourish Crown (r=208 to r=295) */}
        {spokes16.map((deg) => (
          <g key={`crown-petal-${deg + 11.25}`} transform={`rotate(${deg + 11.25} 300 300)`}>
            <path d="M 258 92 C 274 48, 300 8, 300 8 C 300 8, 326 48, 342 92" strokeWidth="1.3" />
            <path d="M 270 92 C 280 60, 300 26, 300 26 C 300 26, 320 60, 330 92" strokeWidth="0.8" opacity="0.6" />
            <line x1="300" y1="92" x2="300" y2="16" strokeWidth="0.8" opacity="0.6" />
            <polygon points="300,5 303,8 300,11 297,8" fill="#F5C76D" opacity="0.6" stroke="none" />
          </g>
        ))}

        {/* Connecting Axis Lines */}
        {spokes16.map((deg) => (
          <line
            key={`spoke-${deg}`}
            x1="300"
            y1="300"
            x2={300 + 295 * Math.cos((deg * Math.PI) / 180)}
            y2={300 + 295 * Math.sin((deg * Math.PI) / 180)}
            strokeWidth="0.4"
            opacity="0.25"
          />
        ))}
      </g>
    </svg>
  )
}
