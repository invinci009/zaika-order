import React from 'react'

interface ZaikaCategorySectionProps {
  id: string
  name: string
  children: React.ReactNode
  animationDelay?: number
}

/**
 * ZaikaCategorySection
 * Authentic recreation of PM Zaika's physical brochure category header:
 * - Sleek, metallic gold foil ribbon extending from the left margin
 * - Rounded right bullet edge
 * - Deep espresso uppercase typography with wide letter tracking
 * - Delicate filigree line extending to the right
 */
export function ZaikaCategorySection({
  id,
  name,
  children,
  animationDelay = 0,
}: ZaikaCategorySectionProps) {
  return (
    <section
      id={`cat-${id}`}
      className="scroll-mt-28 mb-10 animate-fade-in-up"
      style={{ animationDelay: `${animationDelay}ms`, animationFillMode: 'both' }}
    >
      {/* Category Header Ribbon (Matches brochure 1:1) */}
      <div className="flex items-center gap-3 mb-3 pt-2">
        <div
          className="inline-flex items-center px-5 sm:px-7 py-2 rounded-r-full rounded-l-xs shadow-lg select-none relative overflow-hidden group"
          style={{
            background: 'linear-gradient(90deg, #bf8d2c 0%, #f6d47b 35%, #eed48f 65%, #a6741b 100%)',
            boxShadow: '0 4px 18px rgba(212, 175, 55, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.45)',
          }}
        >
          {/* Subtle metallic shine sweep */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

          <h2
            className="text-xs sm:text-[13px] font-black tracking-[0.18em] uppercase text-[#140b00] drop-shadow-xs"
            style={{ fontFamily: 'var(--font-heading), serif' }}
          >
            {name}
          </h2>
        </div>

        {/* Decorative gold hairline rule */}
        <div className="flex-1 h-[1px] bg-gradient-to-r from-amber-400/40 via-amber-500/20 to-transparent" />
      </div>

      {/* Items list — Spacious, elegant dining rows */}
      <div className="space-y-1">
        {children}
      </div>
    </section>
  )
}
