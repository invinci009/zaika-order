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
 * Curated horizontal gallery of PM Zaika's most celebrated dishes.
 * Gives rich photographic hunger appeal without cluttering the typographic brochure menu.
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
            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.16em] text-transparent bg-clip-text bg-gradient-to-r from-[#ffe49e] via-[#f7d77a] to-[#d4af37]">
              Chef&apos;s Royal Signatures
            </h3>
            <p className="text-[10px] text-amber-200/60 font-medium">Handcrafted Awadhi &amp; Tandoori masterpieces</p>
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300/80 px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/25">
          Must Try
        </span>
      </div>

      {/* Horizontal Carousel */}
      <div className="flex gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar scrollbar-hide -mx-3 px-3 snap-x snap-mandatory">
        {CHEF_SIGNATURES.map((dish) => {
          const qty = getItemQty(dish.id, dish.name)
          const price = Math.round(dish.pricePaise / 100)
          const isVeg = dish.veg === 'veg'

          return (
            <div
              key={dish.id}
              className="snap-start shrink-0 w-[240px] sm:w-[260px] rounded-2xl bg-[#180f24]/90 backdrop-blur-md border border-amber-500/25 hover:border-amber-400/50 shadow-lg shadow-black/40 overflow-hidden group transition-all duration-300 flex flex-col justify-between"
            >
              {/* Photo with Tag Badge */}
              <div className="relative h-32 w-full overflow-hidden bg-[#241335]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={dish.imageUrl}
                  alt={dish.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#180f24] via-transparent to-black/30" />

                {/* Tag Badge */}
                <span className="absolute top-2 left-2 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-amber-300 border border-amber-400/30">
                  {dish.tag}
                </span>

                {/* Diet Dot */}
                <span
                  className="absolute top-2 right-2 w-4 h-4 rounded-xs border flex items-center justify-center bg-black/60 backdrop-blur-md"
                  style={{ borderColor: isVeg ? '#4caf50' : '#e53935' }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: isVeg ? '#4caf50' : '#e53935' }}
                  />
                </span>
              </div>

              {/* Content Body */}
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#f7f2ea] group-hover:text-amber-200 transition-colors line-clamp-1 leading-snug">
                    {dish.name}
                  </h4>
                  <p className="text-[11px] text-amber-200/55 mt-1 line-clamp-2 leading-relaxed">
                    {dish.description}
                  </p>
                </div>

                {/* Price & Action Row */}
                <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-amber-500/15">
                  <span className="text-sm font-bold text-[#f7d77a] font-serif">
                    ₹{price}
                  </span>

                  {qty === 0 ? (
                    <button
                      type="button"
                      onClick={() => onAdd(dish)}
                      className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-400/15 hover:bg-amber-400 hover:text-[#120816] text-amber-300 border border-amber-400/40 transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
                    >
                      <Plus className="w-3 h-3 stroke-[2.5]" />
                      <span>Add</span>
                    </button>
                  ) : (
                    <div className="flex items-center rounded-full bg-gradient-to-r from-[#d4af37] to-[#f6d77a] text-[#120816] shadow-sm px-1 py-0.5">
                      <button
                        type="button"
                        onClick={() => onDecrement(dish.id, dish.name)}
                        className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-black/10 active:scale-90 transition-all cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-2.5 h-2.5 stroke-[2.5]" />
                      </button>
                      <span className="w-4 text-center text-xs font-black">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => onAdd(dish)}
                        className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-black/10 active:scale-90 transition-all cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-2.5 h-2.5 stroke-[2.5]" />
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
