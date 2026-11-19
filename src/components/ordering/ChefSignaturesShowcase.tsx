'use client'

import { Sparkles, Plus, Minus, Check } from 'lucide-react'
import { CHEF_SIGNATURES, type ChefSignatureItem } from '@/lib/ordering/foodImages'

interface ChefSignaturesShowcaseProps {
  getItemQty: (id: string, name: string) => number
  onAdd: (item: ChefSignatureItem) => void
  onDecrement: (id: string, name: string) => void
}

/**
 * ChefSignaturesShowcase
 * Curated horizontal gallery of PM Zaika's most celebrated dishes:
 * - Editorial serif typography
 * - Verified authentic photography
 * - Regal gold borders & glassmorphic velvet cards
 */
export function ChefSignaturesShowcase({
  getItemQty,
  onAdd,
  onDecrement,
}: ChefSignaturesShowcaseProps) {
  return (
    <section className="mb-8 pt-1">
      {/* Header with Royal Crown & Gold Filigree */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
            <Sparkles className="w-3 h-3 fill-amber-300" />
          </div>
          <div>
            <h3
              className="text-xs sm:text-sm font-bold uppercase tracking-[0.18em] text-transparent bg-clip-text bg-gradient-to-r from-[#ffe49e] via-[#f7d77a] to-[#d4af37]"
              style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}
            >
              Chef&apos;s Royal Signatures
            </h3>
            <p className="text-[10px] text-amber-200/60 font-medium tracking-wide">
              Handcrafted Awadhi &amp; Tandoori masterpieces
            </p>
          </div>
        </div>
        <span
          className="text-[9px] font-bold uppercase tracking-wider text-amber-300 px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30"
          style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}
        >
          Must Try
        </span>
      </div>

      {/* Horizontal Carousel */}
      <div className="flex gap-3.5 overflow-x-auto pb-3 pt-1 no-scrollbar scrollbar-hide -mx-3 px-3 snap-x snap-mandatory">
        {CHEF_SIGNATURES.map((dish) => {
          const qty = getItemQty(dish.id, dish.name)
          const price = Math.round(dish.pricePaise / 100)
          const isVeg = dish.veg === 'veg'

          return (
            <div
              key={dish.id}
              className="snap-start shrink-0 w-[240px] sm:w-[260px] rounded-2xl bg-gradient-to-b from-[#1e1133]/95 via-[#170c26]/95 to-[#12071f]/95 backdrop-blur-md border border-amber-500/20 hover:border-amber-400/50 shadow-[0_8px_25px_-5px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,235,170,0.06)] overflow-hidden group transition-all duration-300 flex flex-col justify-between"
            >
              {/* Photo with Tag Badge */}
              <div className="relative h-32 w-full overflow-hidden bg-[#241335]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={dish.imageUrl}
                  alt={dish.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#150a22] via-black/20 to-transparent" />

                {/* Tag Badge */}
                <span
                  className="absolute top-2.5 left-2.5 text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-amber-300 border border-amber-400/40"
                  style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}
                >
                  {dish.tag}
                </span>

                {/* Diet Dot in Corner */}
                <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-[3px] bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: isVeg ? '#4caf50' : '#e53935' }}
                  />
                </div>
              </div>

              {/* Content Box */}
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4
                    className="text-sm font-semibold text-[#fbf7f0] group-hover:text-amber-200 transition-colors line-clamp-1 mb-1 tracking-wide"
                    style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}
                  >
                    {dish.name}
                  </h4>
                  <p className="text-[11px] text-amber-100/50 line-clamp-2 leading-relaxed mb-3 font-light">
                    {dish.description}
                  </p>
                </div>

                {/* Price & Action Row */}
                <div className="flex items-center justify-between pt-2 border-t border-amber-500/10">
                  <span
                    className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ffe49e] via-[#f7d77a] to-[#d4af37]"
                    style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}
                  >
                    ₹{price}
                  </span>

                  {qty === 0 ? (
                    <button
                      type="button"
                      onClick={() => onAdd(dish)}
                      className="px-3.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase transition-all bg-[#180e25] hover:bg-gradient-to-r hover:from-[#d4af37] hover:to-[#f7d77a] text-amber-300 hover:text-stone-950 border border-amber-400/40 shadow-sm flex items-center gap-1 active:scale-95 cursor-pointer"
                    >
                      <Plus className="w-3 h-3 stroke-[2.5]" />
                      <span>ADD</span>
                    </button>
                  ) : (
                    <div className="flex items-center rounded-full bg-gradient-to-r from-[#d4af37] via-[#f7d77a] to-[#d4af37] text-stone-950 shadow-md px-1 py-0.5">
                      <button
                        type="button"
                        onClick={() => onDecrement(dish.id, dish.name)}
                        className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-black/10 active:scale-90"
                      >
                        <Minus className="w-3 h-3 stroke-[2.5]" />
                      </button>
                      <span className="w-5 text-center text-xs font-black">{qty}</span>
                      <button
                        type="button"
                        onClick={() => onAdd(dish)}
                        className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-black/10 active:scale-90"
                      >
                        <Plus className="w-3 h-3 stroke-[2.5]" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
