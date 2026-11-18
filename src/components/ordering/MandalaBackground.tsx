export function MandalaBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Top-left corner */}
      <div
        className="absolute -top-10 -left-10 w-56 h-56 opacity-[0.07]"
        style={{ transformOrigin: '0 0' }}
      >
        <CornerMandala />
      </div>
      {/* Top-right corner */}
      <div
        className="absolute -top-10 -right-10 w-56 h-56 opacity-[0.07]"
        style={{ transform: 'scaleX(-1)', transformOrigin: '100% 0' }}
      >
        <CornerMandala />
      </div>
      {/* Bottom-left corner */}
      <div
        className="absolute -bottom-10 -left-10 w-56 h-56 opacity-[0.07]"
        style={{ transform: 'scaleY(-1)', transformOrigin: '0 100%' }}
      >
        <CornerMandala />
      </div>
      {/* Bottom-right corner */}
      <div
        className="absolute -bottom-10 -right-10 w-56 h-56 opacity-[0.07]"
        style={{ transform: 'scale(-1)', transformOrigin: '100% 100%' }}
      >
        <CornerMandala />
      </div>
      {/* Radial gradient center glow */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(212,162,52,0.03) 0%, transparent 70%)',
        }}
      />
    </div>
  )
}

function CornerMandala() {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <g stroke="#d4a234" strokeWidth="0.6" opacity="0.9">
        <line x1="0" y1="0" x2="200" y2="0"/>
        <line x1="0" y1="0" x2="200" y2="66.7"/>
        <line x1="0" y1="0" x2="200" y2="133.3"/>
        <line x1="0" y1="0" x2="200" y2="200"/>
        <line x1="0" y1="0" x2="133.3" y2="200"/>
        <line x1="0" y1="0" x2="66.7" y2="200"/>
        <line x1="0" y1="0" x2="0" y2="200"/>
        <line x1="0" y1="0" x2="166.7" y2="100"/>
        <line x1="0" y1="0" x2="100" y2="166.7"/>
      </g>
      <g stroke="#d4a234" fill="none">
        <path d="M0,40 Q40,0 40,0" strokeWidth="0.5" opacity="0.7"/>
        <path d="M0,80 Q80,0 80,0" strokeWidth="0.5" opacity="0.7"/>
        <path d="M0,120 Q120,0 120,0" strokeWidth="0.5" opacity="0.7"/>
        <path d="M0,160 Q160,0 160,0" strokeWidth="0.5" opacity="0.7"/>
        <path d="M0,200 Q200,0 200,0" strokeWidth="0.5" opacity="0.65"/>
      </g>
      <g fill="#d4a234">
        <polygon points="40,2 42,5 40,8 38,5" opacity="0.7"/>
        <polygon points="2,40 5,42 8,40 5,38" opacity="0.7"/>
        <polygon points="80,2 82,5 80,8 78,5" opacity="0.7"/>
        <polygon points="2,80 5,82 8,80 5,78" opacity="0.7"/>
        <polygon points="120,2 122,5 120,8 118,5" opacity="0.6"/>
        <polygon points="2,120 5,122 8,120 5,118" opacity="0.6"/>
        <polygon points="160,2 162,5 160,8 158,5" opacity="0.5"/>
        <polygon points="2,160 5,162 8,160 5,158" opacity="0.5"/>
      </g>
      <g fill="#d4a234" opacity="0.5">
        <circle cx="40" cy="40" r="2.5"/>
        <circle cx="80" cy="40" r="1.8"/>
        <circle cx="40" cy="80" r="1.8"/>
        <circle cx="80" cy="80" r="2.2"/>
        <circle cx="120" cy="40" r="1.5"/>
        <circle cx="40" cy="120" r="1.5"/>
        <circle cx="120" cy="80" r="1.5"/>
        <circle cx="80" cy="120" r="1.5"/>
        <circle cx="120" cy="120" r="1.8"/>
        <circle cx="160" cy="40" r="1.2"/>
        <circle cx="40" cy="160" r="1.2"/>
      </g>
    </svg>
  )
}
