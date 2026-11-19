import React from 'react'

interface ZaikaCategorySectionProps {
  id: string
  name: string
  children: React.ReactNode
  animationDelay?: number
}

/**
 * ZaikaCategorySection
 * Regal gold foil ribbon category divider inspired by luxury Awadhi royal menus:
 * - Handcrafted metallic gold foil ribbon with sculpted bullet end
 * - Deep espresso classical serif typography
 * - Delicate filigree gradient hairline with diamond terminal
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
      className="scroll-mt-28 mb-8 animate-fade-in-up"
      style={{ animationDelay: `${animationDelay}ms`, animationFillMode: 'both' }}
    >
      {/* Category Header Ribbon */}
      <div className="flex items-center gap-3 mb-3.5 pt-3">
        <div
          className="inline-flex items-center gap-1.5 px-5 sm:px-6 py-1.5 rounded-r-full rounded-l-md shadow-lg select-none relative overflow-hidden group border border-amber-300/40"
          style={{
            background: 'linear-gradient(90deg, #996d19 0%, #f6d47b 32%, #fbe6a2 55%, #dfb448 82%, #8c6014 100%)',
            boxShadow: '0 4px 18px rgba(212, 175, 55, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
          }}
        >
          {/* Subtle metallic shine sweep animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

          {/* Micro diamond ornament */}
          <span className="text-[9px] text-[#2c1a00] opacity-70">◈</span>

          <h2
            className="text-[12px] sm:text-[13px] font-bold tracking-[0.2em] uppercase text-[#190d00] drop-shadow-[0_1px_0_rgba(255,255,255,0.4)]"
            style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}
          >
            {name}
          </h2>
        </div>

        {/* Decorative gold hairline rule with soft fade */}
        <div className="flex-1 h-[1px] bg-gradient-to-r from-amber-400/50 via-amber-500/20 to-transparent" />
      </div>

      {/* Items list */}
      <div className="space-y-1">
        {children}
      </div>
    </section>
  )
}
