'use client'

import { useState } from 'react'
import { Plus, Minus, Check } from 'lucide-react'

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
 * Fine-dining, typographic menu row styled after PM Zaika's physical brochure:
 * - Clean dish title with delicate veg/non-veg emblem
 * - Dotted leader line connecting dish name to price
 * - Elegant warm champagne gold numerals
 * - Discreet, tasteful gold plus interaction (no noisy discount badges)
 * - Compact gold capsule stepper when item is added to cart
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
  isLast,
  onAdd,
  onDecrement,
  onOpenDetail,
}: ZaikaItemRowProps) {
  const [justAdded, setJustAdded] = useState(false)

  const price = Math.round(pricePaise / 100)
  const isVeg = veg === 'veg'
  const isEgg = veg === 'egg'
  const isNonVeg = veg === 'nonveg' || (!isVeg && !isEgg && veg !== 'none')

  const handleAdd = () => {
    if (!available) return
    onAdd()
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 600)
  }

  return (
    <div
      className={`group py-2.5 sm:py-3 px-2 sm:px-3 rounded-xl transition-all cursor-pointer select-none ${
        !isLast ? 'border-b border-white/[0.04]' : ''
      } ${available ? 'hover:bg-white/[0.03]' : 'opacity-40 cursor-not-allowed'} ${
        quantity > 0 ? 'bg-amber-400/[0.05]' : ''
      }`}
      onClick={() => {
        if (!available) return
        if (hasOptions && onOpenDetail) {
          onOpenDetail()
        } else {
          handleAdd()
        }
      }}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left Side: Diet Indicator + Name + Description */}
        <div className="flex items-start gap-2.5 min-w-0 flex-1">
          {/* Refined Fine-Dining Veg / Non-Veg emblem */}
          <span
            className="mt-1 w-3.5 h-3.5 rounded-xs border flex items-center justify-center shrink-0"
            style={{
              borderColor: isVeg ? '#4caf50' : isEgg ? '#ff9800' : '#e53935',
            }}
            title={isVeg ? 'Vegetarian' : isEgg ? 'Egg' : 'Non-Vegetarian'}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: isVeg ? '#4caf50' : isEgg ? '#ff9800' : '#e53935',
              }}
            />
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2">
              <h3 className="text-[14px] sm:text-[15px] font-medium text-[#f6f2ea] group-hover:text-[#ffe49e] transition-colors leading-snug tracking-wide">
                {name}
              </h3>
            </div>

            {description && (
              <p className="text-[11px] sm:text-xs text-amber-200/50 mt-0.5 leading-relaxed line-clamp-1 sm:line-clamp-2">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Dotted Leader Line (Classic high-end restaurant menu detail) */}
        <div className="hidden sm:block flex-1 border-b border-dotted border-amber-500/20 mx-2 self-center" />

        {/* Right Side: Price + Subtle Gold Add / Stepper */}
        <div
          className="flex items-center gap-3 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Price in warm champagne gold */}
          <span className="text-[14px] sm:text-[15px] font-bold text-[#f7d77a] font-serif tracking-tight text-right min-w-[45px]">
            ₹{price}
          </span>

          {/* Understated, Classy Interaction Control */}
          {available && (
            quantity === 0 ? (
              <button
                type="button"
                onClick={handleAdd}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border transition-all duration-200 flex items-center justify-center cursor-pointer shadow-xs active:scale-90 ${
                  justAdded
                    ? 'bg-amber-400 text-[#120816] border-amber-300 scale-105'
                    : 'border-amber-400/35 text-amber-300/90 hover:bg-amber-400 hover:text-[#120816] hover:border-amber-400 hover:shadow-amber-400/20 bg-amber-400/[0.04]'
                }`}
                title={`Add ${name}`}
                aria-label={`Add ${name}`}
              >
                {justAdded ? (
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                ) : (
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                )}
              </button>
            ) : (
              <div className="flex items-center rounded-full bg-gradient-to-r from-[#d4af37] to-[#f6d77a] text-[#120816] shadow-md shadow-amber-500/20 px-1 py-0.5">
                <button
                  type="button"
                  onClick={onDecrement}
                  className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-black/10 active:scale-90 transition-all cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3 h-3 stroke-[2.5]" />
                </button>
                <span className="w-5 text-center text-xs font-black tracking-tight">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={handleAdd}
                  className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-black/10 active:scale-90 transition-all cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3 h-3 stroke-[2.5]" />
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}
