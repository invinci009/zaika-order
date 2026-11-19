'use client'

import { useState } from 'react'
import { Plus, Minus, Check } from 'lucide-react'
import { getFoodImage } from '@/lib/ordering/foodImages'

interface ZaikaItemRowProps {
  id: string
  name: string
  description?: string | null
  pricePaise: number
  veg?: string | null
  available?: boolean
  imageUrl?: string | null
  quantity: number
  hasOptions?: boolean
  isLast?: boolean
  categoryId?: string
  onAdd: () => void
  onDecrement: () => void
  onOpenDetail?: () => void
}

/**
 * ZaikaItemRow
 * Handcrafted fine-dining menu card:
 * - Elegant editorial serif typography for dish names
 * - Authentic Indian culinary diet indicator (FSSAI standard)
 * - Harmonious right-anchored food photo with integrated floating ADD stepper
 * - Deep velvet glassmorphic backing with delicate gold hairline stroke
 */
export function ZaikaItemRow({
  name,
  description,
  pricePaise,
  veg,
  available = true,
  imageUrl,
  quantity,
  hasOptions,
  categoryId,
  onAdd,
  onDecrement,
  onOpenDetail,
}: ZaikaItemRowProps) {
  const [justAdded, setJustAdded] = useState(false)

  const price = Math.round(pricePaise / 100)
  const isVeg = veg === 'veg'
  const isEgg = veg === 'egg'

  // Resolve unique appetizing image for this dish
  const resolvedImage = imageUrl || getFoodImage(name, categoryId)

  const handleAdd = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    if (!available) return
    onAdd()
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 600)
  }

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDecrement()
  }

  return (
    <article
      className={`group relative rounded-2xl p-3 sm:p-3.5 mb-3 transition-all duration-300 select-none border backdrop-blur-md ${
        available
          ? 'bg-gradient-to-r from-[#1a0f28]/95 via-[#1e1232]/95 to-[#160d24]/95 border-amber-500/15 hover:border-amber-400/40 hover:-translate-y-0.5 shadow-[0_6px_22px_-4px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,235,170,0.06)] cursor-pointer'
          : 'bg-[#140b1e]/60 border-white/5 opacity-40 cursor-not-allowed'
      } ${quantity > 0 ? 'ring-1 ring-amber-400/50 shadow-[0_0_20px_rgba(212,175,55,0.12)]' : ''}`}
      onClick={() => {
        if (!available) return
        if (hasOptions && onOpenDetail) {
          onOpenDetail()
        } else {
          handleAdd()
        }
      }}
    >
      <div className="flex items-center justify-between gap-3 sm:gap-4">
        {/* Left: Dish Information & Price */}
        <div className="flex-1 min-w-0 pr-1">
          {/* Diet Dot + Dish Name */}
          <div className="flex items-baseline gap-2 mb-1">
            {/* Authentic Indian FSSAI-style dietary symbol */}
            <span
              className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-[3px] border shrink-0 translate-y-0.5"
              style={{
                borderColor: isVeg ? '#2e7d32' : isEgg ? '#e65100' : '#c62828',
                backgroundColor: isVeg ? 'rgba(46,125,50,0.12)' : isEgg ? 'rgba(230,81,0,0.12)' : 'rgba(198,40,40,0.12)',
              }}
              title={isVeg ? 'Vegetarian' : isEgg ? 'Contains Egg' : 'Non-Vegetarian'}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: isVeg ? '#4caf50' : isEgg ? '#ff9800' : '#e53935',
                }}
              />
            </span>

            <h3
              className="text-[15px] sm:text-[16px] font-semibold text-[#fbf7f0] group-hover:text-[#ffe49e] transition-colors leading-snug tracking-wide"
              style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}
            >
              {name}
            </h3>
          </div>

          {/* Optional Culinary Description */}
          {description && (
            <p className="text-[11px] sm:text-xs text-amber-100/55 line-clamp-2 leading-relaxed mb-1.5 font-light">
              {description}
            </p>
          )}

          {/* Price display with royal rupee glyph */}
          <div className="flex items-center gap-2 mt-1">
            <span
              className="text-[15px] sm:text-[16px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ffe49e] via-[#f7d77a] to-[#d4af37] tracking-tight"
              style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}
            >
              ₹{price}
            </span>

            {/* Subtle portion/available indicator */}
            {!available && (
              <span className="text-[10px] font-medium text-rose-400/80 uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/10">
                Sold Out
              </span>
            )}
          </div>
        </div>

        {/* Right: Food Image with Overlapping Floating ADD Pill */}
        {resolvedImage ? (
          <div className="relative shrink-0 pb-2">
            <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-2xl overflow-hidden border border-amber-400/25 shadow-md bg-[#231234]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resolvedImage}
                alt={name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.parentElement!.parentElement!.style.display = 'none'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Floating ADD / Quantity Controller centered over photo base */}
            {available && (
              <div
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 z-10"
                onClick={(e) => e.stopPropagation()}
              >
                {quantity === 0 ? (
                  <button
                    type="button"
                    onClick={handleAdd}
                    className={`px-3.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase transition-all duration-200 shadow-md flex items-center gap-1 active:scale-95 cursor-pointer backdrop-blur-md ${
                      justAdded
                        ? 'bg-amber-400 text-stone-950 scale-105'
                        : 'bg-[#180e25]/95 hover:bg-gradient-to-r hover:from-[#d4af37] hover:to-[#f7d77a] text-amber-300 hover:text-stone-950 border border-amber-400/40 shadow-black/60'
                    }`}
                    aria-label={`Add ${name}`}
                  >
                    {justAdded ? (
                      <>
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>ADDED</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3 h-3 stroke-[3]" />
                        <span>ADD</span>
                      </>
                    )}
                  </button>
                ) : (
                  <div className="flex items-center rounded-full bg-gradient-to-r from-[#d4af37] via-[#f7d77a] to-[#d4af37] text-stone-950 shadow-lg shadow-amber-500/25 px-1 py-0.5 border border-amber-300/40">
                    <button
                      type="button"
                      onClick={handleDecrement}
                      className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-black/10 active:scale-90 transition-all cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3 stroke-[3]" />
                    </button>
                    <span className="w-6 text-center text-xs font-black">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={handleAdd}
                      className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-black/10 active:scale-90 transition-all cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3 stroke-[3]" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Fallback when no photo exists: right-aligned CTA */
          available && (
            <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
              {quantity === 0 ? (
                <button
                  type="button"
                  onClick={handleAdd}
                  className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all bg-[#180e25]/95 hover:bg-gradient-to-r hover:from-[#d4af37] hover:to-[#f7d77a] text-amber-300 hover:text-stone-950 border border-amber-400/40 shadow-md cursor-pointer active:scale-95 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>ADD</span>
                </button>
              ) : (
                <div className="flex items-center rounded-full bg-gradient-to-r from-[#d4af37] via-[#f7d77a] to-[#d4af37] text-stone-950 shadow-lg px-1.5 py-0.5">
                  <button
                    type="button"
                    onClick={handleDecrement}
                    className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-black/10 active:scale-90"
                  >
                    <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                  <span className="w-6 text-center text-xs font-black">{quantity}</span>
                  <button
                    type="button"
                    onClick={handleAdd}
                    className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-black/10 active:scale-90"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </article>
  )
}
