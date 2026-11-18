'use client'

import { useEffect, useState } from 'react'

interface SplashScreenProps {
  onComplete: () => void
  restaurantName?: string
}

export function SplashScreen({ onComplete, restaurantName }: SplashScreenProps) {
  const [phase, setPhase] = useState<'entering' | 'showing' | 'leaving'>('entering')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('showing'), 100)
    const t2 = setTimeout(() => setPhase('leaving'), 2800)
    const t3 = setTimeout(() => onComplete(), 3400)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onComplete])

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden transition-all duration-700 ease-in-out ${
        phase === 'leaving' ? 'opacity-0 -translate-y-8 pointer-events-none' : 'opacity-100 translate-y-0'
      }`}
      style={{
        background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 40%, #0f0f23 100%)',
      }}
    >
      {/* Mandala Corner — Top Left */}
      <div
        className="absolute -top-8 -left-8 w-48 h-48 pointer-events-none select-none"
        style={{ opacity: 0.1 }}
      >
        <MandalaCorner />
      </div>

      {/* Mandala Corner — Top Right (flipped) */}
      <div
        className="absolute -top-8 -right-8 w-48 h-48 pointer-events-none select-none"
        style={{ opacity: 0.1, transform: 'scaleX(-1)' }}
      >
        <MandalaCorner />
      </div>

      {/* Mandala Corner — Bottom Left (flipped Y) */}
      <div
        className="absolute -bottom-8 -left-8 w-48 h-48 pointer-events-none select-none"
        style={{ opacity: 0.1, transform: 'scaleY(-1)' }}
      >
        <MandalaCorner />
      </div>

      {/* Mandala Corner — Bottom Right (flipped both) */}
      <div
        className="absolute -bottom-8 -right-8 w-48 h-48 pointer-events-none select-none"
        style={{ opacity: 0.1, transform: 'scale(-1)' }}
      >
        <MandalaCorner />
      </div>

      {/* Subtle radial glow behind logo */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 45%, rgba(212,162,52,0.08) 0%, transparent 70%)',
        }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-5 px-8">

        {/* Crown Logo */}
        <div
          style={{
            opacity: phase === 'entering' ? 0 : 1,
            transform: phase === 'entering' ? 'scale(0.6) translateY(16px)' : 'scale(1) translateY(0)',
            transition: 'opacity 0.9s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.9s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transitionDelay: '0.1s',
          }}
        >
          <PmCrownEmblem />
        </div>

        {/* Restaurant Name */}
        <div
          className="text-center"
          style={{
            opacity: phase === 'entering' ? 0 : 1,
            transform: phase === 'entering' ? 'translateY(24px)' : 'translateY(0)',
            transition: 'opacity 0.7s ease-out, transform 0.7s ease-out',
            transitionDelay: '0.75s',
          }}
        >
          {/* "ZAIKA" in large gold */}
          <div
            className="font-brand text-6xl sm:text-7xl leading-none"
            style={{
              background: 'linear-gradient(135deg, #f0c14b 0%, #d4a234 50%, #b8860b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontFamily: 'var(--font-onstage), "On Stage Serial Xbold", var(--font-bruce), "Bruce Forever", Rajdhani, sans-serif',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              textShadow: 'none',
            }}
          >
            Zaika
          </div>

          {/* "Restaurant" in script below */}
          <div
            style={{
              opacity: phase === 'entering' ? 0 : 1,
              transition: 'opacity 0.6s ease-out',
              transitionDelay: '0.9s',
            }}
          >
            <span
              className="font-script text-2xl sm:text-3xl"
              style={{
                color: '#d4a234',
                display: 'block',
                marginTop: '-4px',
                letterSpacing: '0.03em',
              }}
            >
              Restaurant
            </span>
          </div>
        </div>

        {/* Thin gold divider line */}
        <div
          style={{
            width: phase === 'entering' ? '0px' : '180px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #d4a234, transparent)',
            transition: 'width 0.8s ease-out',
            transitionDelay: '1.0s',
          }}
        />

        {/* Tagline */}
        <div
          style={{
            opacity: phase === 'entering' ? 0 : 1,
            letterSpacing: phase === 'entering' ? '0.5em' : '0.15em',
            transition: 'opacity 0.8s ease-out, letter-spacing 0.8s ease-out',
            transitionDelay: '1.3s',
          }}
        >
          <p
            className="text-center text-xs sm:text-sm font-medium uppercase"
            style={{ color: 'rgba(240, 193, 75, 0.75)' }}
          >
            Indian &nbsp;‖&nbsp; Chinese &nbsp;‖&nbsp; Tandoor &nbsp;‖&nbsp; Rolls
          </p>
        </div>

        {/* Subtle contact info */}
        <div
          style={{
            opacity: phase === 'entering' ? 0 : 0.5,
            transition: 'opacity 0.6s ease-out',
            transitionDelay: '1.8s',
          }}
        >
          <p className="text-xs text-center" style={{ color: 'rgba(212, 162, 52, 0.6)' }}>
            zaikarestaurant81
          </p>
        </div>
      </div>

      {/* Loading indicator at bottom */}
      <div
        className="absolute bottom-10 left-0 right-0 flex justify-center"
        style={{
          opacity: phase === 'entering' ? 0 : 1,
          transition: 'opacity 0.4s ease-out',
          transitionDelay: '1.5s',
        }}
      >
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: '#d4a234',
                animation: `dotPulse 1.4s ease-in-out ${i * 0.2}s infinite`,
                opacity: 0.6,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes dotPulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
          40% { transform: scale(1); opacity: 0.9; }
        }
      `}</style>
    </div>
  )
}

/* PM Crown Emblem SVG Component */
function PmCrownEmblem() {
  return (
    <div
      className="relative"
      style={{
        width: 100,
        height: 100,
        filter: 'drop-shadow(0 0 20px rgba(212, 162, 52, 0.4))',
      }}
    >
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" width="100" height="100">
        {/* Outer circle wreath */}
        <circle cx="50" cy="50" r="47" stroke="#d4a234" strokeWidth="1.2" fill="none" opacity="0.6"/>
        <circle cx="50" cy="50" r="44" stroke="#d4a234" strokeWidth="0.5" fill="none" opacity="0.4"/>

        {/* Crown shape */}
        <path
          d="M25 62 L28 42 L38 54 L50 32 L62 54 L72 42 L75 62 Z"
          fill="url(#goldGrad)"
          stroke="#f0c14b"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />

        {/* Crown base */}
        <rect x="23" y="62" width="54" height="8" rx="2" fill="url(#goldGrad)" stroke="#f0c14b" strokeWidth="0.5"/>

        {/* Crown jewels */}
        <circle cx="50" cy="36" r="3" fill="#f0c14b"/>
        <circle cx="37" cy="51" r="2" fill="#f0c14b" opacity="0.9"/>
        <circle cx="63" cy="51" r="2" fill="#f0c14b" opacity="0.9"/>

        {/* PM text below crown */}
        <text
          x="50"
          y="80"
          textAnchor="middle"
          fill="#d4a234"
          fontSize="9"
          fontWeight="bold"
          fontFamily="Rajdhani, sans-serif"
          letterSpacing="2"
        >
          PM
        </text>

        {/* Small decorative dots on wreath */}
        <g fill="#d4a234" opacity="0.5">
          <circle cx="50" cy="4" r="1.5"/>
          <circle cx="50" cy="96" r="1.5"/>
          <circle cx="4" cy="50" r="1.5"/>
          <circle cx="96" cy="50" r="1.5"/>
          <circle cx="17" cy="17" r="1"/>
          <circle cx="83" cy="17" r="1"/>
          <circle cx="17" cy="83" r="1"/>
          <circle cx="83" cy="83" r="1"/>
        </g>

        <defs>
          <linearGradient id="goldGrad" x1="25" y1="32" x2="75" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f0c14b"/>
            <stop offset="50%" stopColor="#d4a234"/>
            <stop offset="100%" stopColor="#b8860b"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

/* Mandala corner decoration */
function MandalaCorner() {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full animate-mandala-rotate" style={{ transformOrigin: '0 0' }}>
      {/* Spider-web style corner mandala matching brochure */}
      <g stroke="#d4a234" strokeWidth="0.6" opacity="0.9">
        {/* Radiating lines from corner */}
        <line x1="0" y1="0" x2="200" y2="0"/>
        <line x1="0" y1="0" x2="200" y2="50"/>
        <line x1="0" y1="0" x2="200" y2="100"/>
        <line x1="0" y1="0" x2="200" y2="150"/>
        <line x1="0" y1="0" x2="200" y2="200"/>
        <line x1="0" y1="0" x2="150" y2="200"/>
        <line x1="0" y1="0" x2="100" y2="200"/>
        <line x1="0" y1="0" x2="50" y2="200"/>
        <line x1="0" y1="0" x2="0" y2="200"/>
      </g>
      {/* Concentric arc rings */}
      <g stroke="#d4a234" fill="none" opacity="0.7">
        <path d="M0,40 Q40,0 40,0" strokeWidth="0.5"/>
        <path d="M0,80 Q80,0 80,0" strokeWidth="0.5"/>
        <path d="M0,120 Q120,0 120,0" strokeWidth="0.5"/>
        <path d="M0,160 Q160,0 160,0" strokeWidth="0.5"/>
        <path d="M0,200 Q200,0 200,0" strokeWidth="0.5"/>
      </g>
      {/* Diamond gems at intersections */}
      <g fill="#d4a234" opacity="0.7">
        <polygon points="40,2 42,4 40,6 38,4"/>
        <polygon points="2,40 4,42 2,44 0,42"/>
        <polygon points="80,2 82,4 80,6 78,4"/>
        <polygon points="2,80 4,82 2,84 0,82"/>
        <polygon points="120,2 122,4 120,6 118,4"/>
        <polygon points="2,120 4,122 2,124 0,122"/>
        <polygon points="160,2 162,4 160,6 158,4"/>
        <polygon points="2,160 4,162 2,164 0,162"/>
      </g>
      {/* Intersection dots */}
      <g fill="#d4a234" opacity="0.5">
        <circle cx="40" cy="40" r="2"/>
        <circle cx="80" cy="40" r="1.5"/>
        <circle cx="40" cy="80" r="1.5"/>
        <circle cx="120" cy="40" r="1.5"/>
        <circle cx="80" cy="80" r="2"/>
        <circle cx="40" cy="120" r="1.5"/>
        <circle cx="160" cy="40" r="1.5"/>
        <circle cx="120" cy="80" r="1.5"/>
        <circle cx="80" cy="120" r="1.5"/>
        <circle cx="40" cy="160" r="1.5"/>
      </g>
    </svg>
  )
}
