'use client'

export function MandalaBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Deep Plum/Eggplant Radial Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 20% 30%, rgba(45, 28, 58, 0.4) 0%, rgba(20, 13, 27, 0.95) 75%, #0f0914 100%)',
        }}
      />

      {/* Prominent Left-Side Mandala (Matching the user screenshot) */}
      <div
        className="absolute -left-36 top-24 w-[520px] h-[520px] sm:w-[620px] sm:h-[620px] sm:-left-44 opacity-[0.14] select-none"
        style={{ transformOrigin: 'center center' }}
      >
        <BrochureMandala />
      </div>

      {/* Subtle Repeating Mandala on Middle-Right */}
      <div
        className="absolute -right-40 top-[55%] w-[480px] h-[480px] sm:w-[580px] sm:h-[580px] opacity-[0.11] select-none"
        style={{ transformOrigin: 'center center' }}
      >
        <BrochureMandala />
      </div>

      {/* Subtle Repeating Mandala on Bottom-Left */}
      <div
        className="absolute -left-36 bottom-[-100px] w-[500px] h-[500px] opacity-[0.12] select-none"
        style={{ transformOrigin: 'center center' }}
      >
        <BrochureMandala />
      </div>
    </div>
  )
}

/**
 * Exact replica of the floral mandala from the PM Zaika physical menu brochure:
 * - Concentric center with sunburst star rays
 * - Pearl bead circle ring
 * - Scalloped petal arches with internal droplets
 * - Pointed lotus petals with double outline
 * - Large radiating outer floral petal crown with diamond tips
 */
function BrochureMandala() {
  const spokes16 = Array.from({ length: 16 }, (_, i) => i * (360 / 16))
  const spokes32 = Array.from({ length: 32 }, (_, i) => i * (360 / 32))

  return (
    <svg
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <g stroke="#ffffff" strokeWidth="1" opacity="0.9">
        {/* Core Center Rings */}
        <circle cx="250" cy="250" r="14" strokeWidth="1.2" />
        <circle cx="250" cy="250" r="24" strokeWidth="0.8" />
        <circle cx="250" cy="250" r="38" strokeWidth="1" />
        <circle cx="250" cy="250" r="54" strokeWidth="0.8" />
        <circle cx="250" cy="250" r="72" strokeWidth="1.2" />
        <circle cx="250" cy="250" r="102" strokeWidth="0.9" />
        <circle cx="250" cy="250" r="132" strokeWidth="1.2" />
        <circle cx="250" cy="250" r="172" strokeWidth="0.8" />
        <circle cx="250" cy="250" r="215" strokeWidth="1" />

        {/* Center 16 Starburst Triangle Rays */}
        {spokes16.map((deg) => (
          <g key={`star-${deg}`} transform={`rotate(${deg} 250 250)`}>
            <polygon points="250,226 253,237 247,237" fill="#ffffff" opacity="0.3" stroke="none" />
          </g>
        ))}

        {/* Pearl Beads Ring (at r=46) */}
        {spokes16.map((deg) => (
          <circle
            key={`bead-${deg}`}
            cx={250 + 46 * Math.cos((deg * Math.PI) / 180)}
            cy={250 + 46 * Math.sin((deg * Math.PI) / 180)}
            r="3"
            strokeWidth="0.8"
          />
        ))}

        {/* Scalloped Floral Arches (r=54 to r=72) */}
        {spokes16.map((deg) => (
          <g key={`arch-${deg}`} transform={`rotate(${deg} 250 250)`}>
            <path
              d="M 239.5 196 C 242 184, 258 184, 260.5 196"
              strokeWidth="1"
            />
            {/* Droplet inside arch */}
            <circle cx="250" cy="190" r="1.8" fill="#ffffff" opacity="0.6" stroke="none" />
          </g>
        ))}

        {/* Intermediate Lotus Petals (r=72 to r=102) */}
        {spokes16.map((deg) => (
          <g key={`mid-petal-${deg}`} transform={`rotate(${deg} 250 250)`}>
            {/* Outer pointed petal */}
            <path
              d="M 235 178 C 240 160, 250 148, 250 148 C 250 148, 260 160, 265 178"
              strokeWidth="1"
            />
            {/* Inner echo petal */}
            <path
              d="M 239 178 C 243 166, 250 156, 250 156 C 250 156, 257 166, 261 178"
              strokeWidth="0.7"
              opacity="0.7"
            />
            {/* Petal center vein */}
            <line x1="250" y1="178" x2="250" y2="152" strokeWidth="0.6" strokeDasharray="2 2" />
          </g>
        ))}

        {/* Outer Pearl Ring (at r=117) */}
        {spokes32.map((deg) => (
          <circle
            key={`outer-bead-${deg}`}
            cx={250 + 117 * Math.cos((deg * Math.PI) / 180)}
            cy={250 + 117 * Math.sin((deg * Math.PI) / 180)}
            r="2.2"
            strokeWidth="0.7"
          />
        ))}

        {/* Large Pointed Floral Lotus Petals (r=132 to r=172) */}
        {spokes16.map((deg) => (
          <g key={`large-petal-${deg}`} transform={`rotate(${deg} 250 250)`}>
            <path
              d="M 224 118 C 232 94, 250 78, 250 78 C 250 78, 268 94, 276 118"
              strokeWidth="1.2"
            />
            {/* Inner petal layer */}
            <path
              d="M 230 118 C 237 101, 250 88, 250 88 C 250 88, 263 101, 270 118"
              strokeWidth="0.8"
              opacity="0.7"
            />
            {/* Leaf eyelet */}
            <circle cx="250" cy="100" r="3.2" strokeWidth="0.8" />
          </g>
        ))}

        {/* Outermost Radiating Flourish Crown (r=172 to r=245) */}
        {spokes16.map((deg) => (
          <g key={`crown-petal-${deg + 11.25}`} transform={`rotate(${deg + 11.25} 250 250)`}>
            {/* Big majestic floral petal */}
            <path
              d="M 216 78 C 228 42, 250 8, 250 8 C 250 8, 272 42, 284 78"
              strokeWidth="1.2"
            />
            {/* Inner echo */}
            <path
              d="M 226 78 C 234 52, 250 24, 250 24 C 250 24, 266 52, 274 78"
              strokeWidth="0.8"
              opacity="0.6"
            />
            {/* Center vein */}
            <line x1="250" y1="78" x2="250" y2="16" strokeWidth="0.7" opacity="0.6" />
            {/* Diamond tip flourish */}
            <polygon points="250,5 252.5,8 250,11 247.5,8" fill="#ffffff" opacity="0.5" stroke="none" />
          </g>
        ))}

        {/* Radiating Spoke Lines connecting the layers */}
        {spokes16.map((deg) => (
          <line
            key={`spoke-${deg}`}
            x1="250"
            y1="250"
            x2={250 + 245 * Math.cos((deg * Math.PI) / 180)}
            y2={250 + 245 * Math.sin((deg * Math.PI) / 180)}
            strokeWidth="0.4"
            opacity="0.3"
          />
        ))}
      </g>
    </svg>
  )
}
