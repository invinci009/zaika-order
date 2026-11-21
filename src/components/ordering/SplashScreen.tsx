'use client'

import { useEffect, useState } from 'react'

interface SplashScreenProps {
  onComplete: () => void
  restaurantName?: string
}

export function SplashScreen({ onComplete, restaurantName = 'PM Zaika' }: SplashScreenProps) {
  const [phase, setPhase] = useState<'entering' | 'showing' | 'leaving'>('entering')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('showing'), 80)
    const t2 = setTimeout(() => setPhase('leaving'), 3200)
    const t3 = setTimeout(() => onComplete(), 3900)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [onComplete])

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden transition-all duration-700 ease-in-out select-none ${
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
          background: 'radial-gradient(circle at 50% 38%, rgba(245, 158, 11, 0.16) 0%, rgba(212, 162, 52, 0.06) 40%, transparent 68%)',
          animation: 'ambientBreath 4s ease-in-out infinite alternate',
        }}
      />

      {/* 2. Slow-Rotating Sacred Geometry Awadhi Mandala Watermark */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] sm:w-[780px] sm:h-[780px] pointer-events-none opacity-[0.09]"
        style={{
          animation: 'mandalaRotate 120s linear infinite',
        }}
      >
        <SacredAwadhiMandala />
      </div>

      {/* 3. Floating Golden Stardust Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { top: '22%', left: '18%', delay: '0s', size: 3, dur: '3.6s' },
          { top: '28%', left: '82%', delay: '1.2s', size: 2.5, dur: '4.2s' },
          { top: '45%', left: '12%', delay: '0.6s', size: 2, dur: '3.8s' },
          { top: '60%', left: '86%', delay: '1.8s', size: 3.5, dur: '4.5s' },
          { top: '70%', left: '24%', delay: '0.9s', size: 2.5, dur: '3.9s' },
          { top: '35%', left: '74%', delay: '2.1s', size: 2, dur: '4.1s' },
          { top: '52%', left: '28%', delay: '1.5s', size: 3, dur: '3.5s' },
          { top: '18%', left: '62%', delay: '2.4s', size: 2, dur: '4.8s' },
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

      {/* 4. Main Royal Brand Content */}
      <div className="relative z-10 flex flex-col items-center gap-5 px-6 max-w-[420px] w-full text-center">

        {/* Imperial Crown Crest */}
        <div
          style={{
            opacity: phase === 'entering' ? 0 : 1,
            transform: phase === 'entering' ? 'scale(0.72) translateY(24px)' : 'scale(1) translateY(0)',
            transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
            transitionDelay: '0.05s',
          }}
        >
          <ImperialCrownEmblem />
        </div>

        {/* Brand Title: ZAIKA Restaurant */}
        <div
          className="flex flex-col items-center"
          style={{
            opacity: phase === 'entering' ? 0 : 1,
            transform: phase === 'entering' ? 'translateY(22px)' : 'translateY(0)',
            transition: 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
            transitionDelay: '0.35s',
          }}
        >
          {/* "ZAIKA" with 24K Liquid Gold Foil Gradient & Specular Shadow */}
          <h1
            className="text-6xl sm:text-7xl font-black uppercase leading-none select-none"
            style={{
              fontFamily: 'var(--font-cinzel), Cinzel, "Playfair Display", Georgia, serif',
              letterSpacing: '0.18em',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #FDE08B 22%, #F59E0B 52%, #FFF3CC 74%, #D97706 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 4px 22px rgba(245, 158, 11, 0.42))',
            }}
          >
            Zaika
          </h1>

          {/* "Restaurant" in Romantic Champagne Gold Calligraphy Script */}
          <div
            style={{
              opacity: phase === 'entering' ? 0 : 1,
              transition: 'opacity 0.8s ease-out',
              transitionDelay: '0.55s',
            }}
          >
            <span
              className="text-2xl sm:text-3xl block italic font-medium select-none"
              style={{
                fontFamily: 'var(--font-script), "Kaushan Script", "Playfair Display", cursive',
                letterSpacing: '0.04em',
                color: '#FDEBD3',
                marginTop: '-4px',
                textShadow: '0 2px 14px rgba(245, 158, 11, 0.38)',
              }}
            >
              Restaurant
            </span>
          </div>
        </div>

        {/* Imperial Jewel Divider */}
        <div
          className="flex items-center justify-center gap-2.5 my-1"
          style={{
            opacity: phase === 'entering' ? 0 : 1,
            width: phase === 'entering' ? '0px' : '220px',
            transition: 'opacity 0.9s ease-out, width 0.9s ease-out',
            transitionDelay: '0.75s',
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
            letterSpacing: phase === 'entering' ? '0.45em' : '0.22em',
            transition: 'opacity 0.85s ease-out, letter-spacing 0.85s ease-out',
            transitionDelay: '0.95s',
          }}
        >
          <p className="text-center text-[11px] sm:text-xs font-bold uppercase select-none text-[#F3E8D2]">
            INDIAN <span className="text-[#f59e0b] px-1 font-black">◈</span> CHINESE <span className="text-[#f59e0b] px-1 font-black">◈</span> TANDOOR <span className="text-[#f59e0b] px-1 font-black">◈</span> ROLLS
          </p>
        </div>

        {/* Chic Luxury Social & Heritage Pill */}
        <div
          style={{
            opacity: phase === 'entering' ? 0 : 1,
            transform: phase === 'entering' ? 'translateY(10px)' : 'translateY(0)',
            transition: 'opacity 0.75s ease-out, transform 0.75s ease-out',
            transitionDelay: '1.2s',
          }}
        >
          <div className="px-3.5 py-1 rounded-full bg-[#140b20]/75 border border-[#f59e0b]/25 shadow-md flex items-center gap-2 text-[#cfc5db] text-[11px] font-medium tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] animate-pulse" />
            <span>zaikarestaurant81</span>
            <span className="text-white/30">•</span>
            <span className="text-[#f59e0b] text-[10px] font-bold uppercase tracking-wider">Awadhi Dining</span>
          </div>
        </div>
      </div>

      {/* 5. Glamorous Golden Pulsing Pearl Loading Indicator */}
      <div
        className="absolute bottom-10 left-0 right-0 flex flex-col items-center justify-center gap-2"
        style={{
          opacity: phase === 'entering' ? 0 : 1,
          transition: 'opacity 0.6s ease-out',
          transitionDelay: '1.4s',
        }}
      >
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{
                background: 'linear-gradient(135deg, #FFFFFF 0%, #F5C76D 40%, #D48016 100%)',
                boxShadow: '0 0 10px rgba(245, 158, 11, 0.9), 0 0 18px rgba(245, 158, 11, 0.45)',
                animation: `pearlBreath 1.5s ease-in-out ${i * 0.22}s infinite alternate`,
              }}
            />
          ))}
        </div>
      </div>

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
 * Imperial PM Zaika Royal Seal Emblem
 * Features:
 * - 24K Polished Metallic Gold Gradients
 * - 32-Pearl Beaded Guilloché Halo
 * - 4 Cardinal Starburst Diamonds
 * - Handcrafted Sculpted Awadhi Crown with 5 Pearl Peaks & Central Faceted Jewel
 * - Imperial Velvet Arch Band & Gemstone Rivets
 * - Ornate "★ PM ★" Royal Monogram Scroll
 */
function ImperialCrownEmblem() {
  const spokes32 = Array.from({ length: 32 }, (_, i) => i * 11.25)

  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{
        width: 140,
        height: 140,
        filter: 'drop-shadow(0 0 28px rgba(245, 158, 11, 0.45)) drop-shadow(0 4px 12px rgba(0, 0, 0, 0.8))',
      }}
    >
      <svg
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          {/* Metallic 24K Gold Gradient */}
          <linearGradient id="gold24k" x1="20" y1="20" x2="140" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="18%" stopColor="#FFF1B8" />
            <stop offset="42%" stopColor="#F5C76D" />
            <stop offset="68%" stopColor="#D48016" />
            <stop offset="90%" stopColor="#9E5D00" />
            <stop offset="100%" stopColor="#FDE49E" />
          </linearGradient>

          {/* Crown Body Rich Gradient */}
          <linearGradient id="crownGrad" x1="40" y1="42" x2="120" y2="108" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="25%" stopColor="#FDE394" />
            <stop offset="55%" stopColor="#E59E1B" />
            <stop offset="85%" stopColor="#B36B00" />
            <stop offset="100%" stopColor="#784400" />
          </linearGradient>

          {/* Deep Velvet Shield Center */}
          <radialGradient id="shieldVelvet" cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor="#1c1130" />
            <stop offset="65%" stopColor="#10081c" />
            <stop offset="100%" stopColor="#08030f" />
          </radialGradient>

          {/* Ruby Gemstone Gradient */}
          <radialGradient id="rubyGrad" cx="40%" cy="35%" r="50%">
            <stop offset="0%" stopColor="#FF7B93" />
            <stop offset="60%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#7F1D1D" />
          </radialGradient>

          {/* Emerald Gemstone Gradient */}
          <radialGradient id="emeraldGrad" cx="40%" cy="35%" r="50%">
            <stop offset="0%" stopColor="#86EFAC" />
            <stop offset="60%" stopColor="#16A34A" />
            <stop offset="100%" stopColor="#14532D" />
          </radialGradient>
        </defs>

        {/* 1. Outer Thin Beaded Ring */}
        <circle cx="80" cy="80" r="75" stroke="url(#gold24k)" strokeWidth="1.2" opacity="0.85" />
        <circle cx="80" cy="80" r="71" stroke="url(#gold24k)" strokeWidth="0.6" strokeDasharray="3 3" opacity="0.65" />
        <circle cx="80" cy="80" r="67" stroke="url(#gold24k)" strokeWidth="1.0" opacity="0.9" />

        {/* 2. 32 Beaded Pearl Halo */}
        {spokes32.map((deg) => (
          <circle
            key={deg}
            cx={80 + 69 * Math.cos((deg * Math.PI) / 180)}
            cy={80 + 69 * Math.sin((deg * Math.PI) / 180)}
            r="1.4"
            fill="url(#gold24k)"
            opacity="0.9"
          />
        ))}

        {/* 3. 4 Cardinal Starburst Diamonds (North, South, East, West) */}
        {[
          { x: 80, y: 7 },
          { x: 80, y: 153 },
          { x: 7, y: 80 },
          { x: 153, y: 80 },
        ].map((pt, idx) => (
          <g key={idx}>
            <polygon
              points={`${pt.x},${pt.y - 4} ${pt.x + 3},${pt.y} ${pt.x},${pt.y + 4} ${pt.x - 3},${pt.y}`}
              fill="url(#gold24k)"
            />
            <circle cx={pt.x} cy={pt.y} r="1" fill="#FFFFFF" />
          </g>
        ))}

        {/* 4. Velvet Obsidian Inner Shield Disk */}
        <circle cx="80" cy="80" r="58" fill="url(#shieldVelvet)" stroke="url(#gold24k)" strokeWidth="1.5" />
        <circle cx="80" cy="80" r="55" stroke="url(#gold24k)" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.4" />

        {/* 5. Handcrafted Sculpted Imperial Crown */}
        <g id="crown">
          {/* Back Velvet Cushion Shadow */}
          <path
            d="M 44 86 C 44 68, 62 60, 80 60 C 98 60, 116 68, 116 86 Z"
            fill="#090412"
            opacity="0.75"
          />

          {/* Main Crown Faceted Body (5 Regal Peaks) */}
          <path
            d="M 42 86 L 46 58 L 61 72 L 80 44 L 99 72 L 114 58 L 118 86 Z"
            fill="url(#crownGrad)"
            stroke="url(#gold24k)"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />

          {/* Inner Filigree Contour Highlights */}
          <path
            d="M 48 84 L 51 64 L 62 74 L 80 50 L 98 74 L 109 64 L 112 84 Z"
            fill="none"
            stroke="#FFF5D6"
            strokeWidth="0.8"
            opacity="0.6"
          />

          {/* Crown Arch Cutout at bottom center */}
          <path
            d="M 64 86 Q 80 78 96 86 Z"
            fill="#0f071c"
            stroke="url(#gold24k)"
            strokeWidth="0.8"
          />

          {/* Crown Base Velvet Headband */}
          <path
            d="M 40 86 Q 80 80 120 86 L 119 96 Q 80 90 41 96 Z"
            fill="url(#gold24k)"
            stroke="#FFE7A3"
            strokeWidth="0.9"
          />

          {/* Headband Inset Gemstones (Alternating Ruby & Emerald) */}
          <circle cx="52" cy="90.5" r="2.2" fill="url(#rubyGrad)" stroke="#FFEAA7" strokeWidth="0.5" />
          <circle cx="66" cy="88" r="2.2" fill="url(#emeraldGrad)" stroke="#FFEAA7" strokeWidth="0.5" />
          <circle cx="80" cy="87" r="2.6" fill="url(#rubyGrad)" stroke="#FFFFFF" strokeWidth="0.6" />
          <circle cx="94" cy="88" r="2.2" fill="url(#emeraldGrad)" stroke="#FFEAA7" strokeWidth="0.5" />
          <circle cx="108" cy="90.5" r="2.2" fill="url(#rubyGrad)" stroke="#FFEAA7" strokeWidth="0.5" />

          {/* 5 Peak Crown Pearl Jewels */}
          <circle cx="46" cy="58" r="3.2" fill="#FFFFFF" stroke="url(#gold24k)" strokeWidth="1" />
          <circle cx="61" cy="72" r="2.6" fill="#FFFFFF" stroke="url(#gold24k)" strokeWidth="0.8" />
          <circle cx="80" cy="44" r="4.2" fill="#FFFFFF" stroke="url(#gold24k)" strokeWidth="1.2" />
          <circle cx="99" cy="72" r="2.6" fill="#FFFFFF" stroke="url(#gold24k)" strokeWidth="0.8" />
          <circle cx="114" cy="58" r="3.2" fill="#FFFFFF" stroke="url(#gold24k)" strokeWidth="1" />

          {/* Sparkling Diamond Crest Jewel on Highest Peak */}
          <polygon
            points="80,33 83.5,39 80,44 76.5,39"
            fill="url(#gold24k)"
            stroke="#FFFFFF"
            strokeWidth="0.7"
          />
          <circle cx="80" cy="39" r="1.2" fill="#FFFFFF" />

          {/* Crown Scepter Rays radiating from center jewel */}
          <line x1="80" y1="28" x2="80" y2="31" stroke="url(#gold24k)" strokeWidth="1" opacity="0.8" />
          <line x1="72" y1="34" x2="75" y2="36" stroke="url(#gold24k)" strokeWidth="0.8" opacity="0.6" />
          <line x1="88" y1="34" x2="85" y2="36" stroke="url(#gold24k)" strokeWidth="0.8" opacity="0.6" />
        </g>

        {/* 6. Royal Monogram Banner: "★ PM ★" */}
        <g id="monogram">
          <text
            x="80"
            y="114"
            textAnchor="middle"
            fill="url(#gold24k)"
            fontSize="12"
            fontWeight="800"
            letterSpacing="3.5"
            style={{
              fontFamily: 'var(--font-cinzel), Cinzel, Georgia, serif',
            }}
          >
            PM
          </text>

          {/* Flanking Micro Stars */}
          <polygon points="58,110 59.5,113 62.5,113.5 60.2,115.5 61,118.5 58,116.8 55,118.5 55.8,115.5 53.5,113.5 56.5,113" fill="url(#gold24k)" />
          <polygon points="102,110 103.5,113 106.5,113.5 104.2,115.5 105,118.5 102,116.8 99,118.5 99.8,115.5 97.5,113.5 100.5,113" fill="url(#gold24k)" />

          {/* Fine Curved Monogram Underline */}
          <path
            d="M 54 122 Q 80 126 106 122"
            stroke="url(#gold24k)"
            strokeWidth="0.8"
            fill="none"
            opacity="0.75"
          />
          <circle cx="80" cy="124" r="1.2" fill="url(#gold24k)" />
        </g>
      </svg>
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
