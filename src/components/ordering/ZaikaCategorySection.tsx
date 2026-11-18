interface ZaikaCategorySectionProps {
  id: string
  name: string
  children: React.ReactNode
  animationDelay?: number
}

export function ZaikaCategorySection({ id, name, children, animationDelay = 0 }: ZaikaCategorySectionProps) {
  return (
    <section
      id={`cat-${id}`}
      className="scroll-mt-28 mb-10 animate-fade-in-up"
      style={{ animationDelay: `${animationDelay}ms`, animationFillMode: 'both' }}
    >
      {/* Category Header — Gold rounded pill badge matching the brochure image */}
      <div className="flex items-center mb-3.5">
        <div
          className="inline-flex items-center px-6 py-1.5 rounded-r-full rounded-l-sm shadow-md"
          style={{
            background: 'linear-gradient(90deg, #f5a623 0%, #f7b733 45%, #fbd578 100%)',
            boxShadow: '0 3px 14px rgba(245, 166, 35, 0.3)',
          }}
        >
          <h2
            className="text-[13px] sm:text-sm font-black tracking-widest uppercase text-[#1a1100]"
            style={{ fontFamily: 'var(--font-heading), sans-serif' }}
          >
            {name}
          </h2>
        </div>
      </div>

      {/* Items list — Spacious, un-congested list */}
      <div className="space-y-1">
        {children}
      </div>
    </section>
  )
}
