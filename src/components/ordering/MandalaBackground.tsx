'use client'

/**
 * MandalaBackground
 * Exact reproduction of the brochure background from user reference:
 * - Deep dark eggplant/purple canvas gradient
 * - Single prominent, finely-etched floral mandala watermark placed on the left
 * - Subtle bottom-corner radial glow
 */
export function MandalaBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Deep Royal Eggplant Gradient Canvas */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(165deg, #231630 0%, #170e22 45%, #0f0817 100%)',
        }}
      />

      {/* Subtle warm radial highlight */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 15% 35%, rgba(68, 38, 92, 0.28) 0%, transparent 60%)',
        }}
      />

      {/* Prominent Floral Mandala Watermark (Matches user screenshot 1:1) */}
      <div
        className="absolute -left-[140px] sm:-left-[180px] top-[10%] w-[580px] h-[580px] sm:w-[760px] sm:h-[760px] opacity-[0.11] pointer-events-none"
        style={{ transformOrigin: 'center center' }}
      >
        <DetailedBrochureMandala />
      </div>

      {/* Faint repeating echo mandala far bottom-right for tall scroll depth */}
      <div
        className="absolute -right-[160px] top-[60%] w-[520px] h-[520px] sm:w-[680px] sm:h-[680px] opacity-[0.07] pointer-events-none"
        style={{ transformOrigin: 'center center' }}
      >
        <DetailedBrochureMandala />
      </div>
    </div>
  )
}

function DetailedBrochureMandala() {
  const spokes16 = Array.from({ length: 16 }, (_, i) => i * 22.5)
  const spokes32 = Array.from({ length: 32 }, (_, i) => i * 11.25)

  return (
    <svg
      viewBox="0 0 600 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <g stroke="#ffffff" strokeWidth="0.9" opacity="0.95">
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
            <polygon points="300,272 303.5,284 296.5,284" fill="#ffffff" opacity="0.4" stroke="none" />
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
            <path
              d="M 288 234 C 291 220, 309 220, 312 234"
              strokeWidth="1.1"
            />
            <circle cx="300" cy="226" r="2.2" fill="#ffffff" opacity="0.6" stroke="none" />
          </g>
        ))}

        {/* Intermediate Pointed Lotus Petals (r=88 to r=124) */}
        {spokes16.map((deg) => (
          <g key={`mid-petal-${deg}`} transform={`rotate(${deg} 300 300)`}>
            <path
              d="M 282 212 C 288 190, 300 176, 300 176 C 300 176, 312 190, 318 212"
              strokeWidth="1.1"
            />
            <path
              d="M 286 212 C 291 197, 300 185, 300 185 C 300 185, 309 197, 314 212"
              strokeWidth="0.7"
              opacity="0.75"
            />
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
            <path
              d="M 268 140 C 278 110, 300 92, 300 92 C 300 92, 322 110, 332 140"
              strokeWidth="1.3"
            />
            <path
              d="M 276 140 C 284 119, 300 104, 300 104 C 300 104, 316 119, 324 140"
              strokeWidth="0.8"
              opacity="0.7"
            />
            <circle cx="300" cy="118" r="3.8" strokeWidth="0.9" />
          </g>
        ))}

        {/* Outermost Radiating Flourish Crown (r=208 to r=295) */}
        {spokes16.map((deg) => (
          <g key={`crown-petal-${deg + 11.25}`} transform={`rotate(${deg + 11.25} 300 300)`}>
            <path
              d="M 258 92 C 274 48, 300 8, 300 8 C 300 8, 326 48, 342 92"
              strokeWidth="1.3"
            />
            <path
              d="M 270 92 C 280 60, 300 26, 300 26 C 300 26, 320 60, 330 92"
              strokeWidth="0.8"
              opacity="0.6"
            />
            <line x1="300" y1="92" x2="300" y2="16" strokeWidth="0.8" opacity="0.6" />
            <polygon points="300,5 303,8 300,11 297,8" fill="#ffffff" opacity="0.6" stroke="none" />
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
