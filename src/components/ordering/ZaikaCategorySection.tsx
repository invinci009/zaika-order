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
      className="scroll-mt-32 animate-fade-in-up"
      style={{ animationDelay: `${animationDelay}ms`, animationFillMode: 'both' }}
    >
      {/* Category Header — gold bar matching brochure */}
      <div className="zaika-category-header mb-1">
        <div className="zaika-category-line flex-shrink-0 w-5" />
        <div
          className="px-4 py-1.5 rounded-sm flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #e8a317 0%, #d4a234 100%)',
            boxShadow: '0 2px 12px rgba(212, 162, 52, 0.25)',
          }}
        >
          <h2
            className="text-xs font-black tracking-widest uppercase"
            style={{ color: '#0f0f1a', fontFamily: 'Rajdhani, var(--font-heading), sans-serif' }}
          >
            {name}
          </h2>
        </div>
        <div className="zaika-category-line flex-1" />
      </div>

      {/* Items container */}
      <div
        className="rounded-xl overflow-hidden mb-6"
        style={{
          background: 'rgba(31, 32, 65, 0.6)',
          border: '1px solid rgba(212, 162, 52, 0.15)',
          backdropFilter: 'blur(4px)',
        }}
      >
        {children}
      </div>
    </section>
  )
}
