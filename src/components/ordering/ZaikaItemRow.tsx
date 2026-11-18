'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
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
  categoryId,
  onAdd,
  onDecrement,
  onOpenDetail,
}: ZaikaItemRowProps) {
  const [justAdded, setJustAdded] = useState(false)

  const price = Math.round(pricePaise / 100)
  const isVeg = veg === 'veg'
  const isEgg = veg === 'egg'
  const isNonVeg = veg === 'nonveg' || (!isVeg && !isEgg && veg !== 'none')

  // Resolve image if item doesn't already have one
  const resolvedImage = imageUrl || getFoodImage(name, categoryId)

  const handleAdd = () => {
    if (!available) return
    onAdd()
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 800)
  }

  return (
    <div
      className={`group py-3 sm:py-3.5 px-3 rounded-xl transition-all cursor-pointer ${
        !isLast ? 'border-b border-white/[0.06]' : ''
      } ${available ? 'hover:bg-white/[0.04]' : 'opacity-40 cursor-not-allowed'} ${
        quantity > 0 ? 'bg-[#f5a623]/[0.06]' : ''
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
      <div className="flex items-center justify-between gap-3 sm:gap-4">
        {/* Left Side: Diet Badge + Dish Name + Description */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-start gap-2.5">
            {/* Fine-dining Veg / Non-Veg badge */}
            <span
              className="mt-0.5 w-3.5 h-3.5 rounded-xs border flex items-center justify-center shrink-0"
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

            {/* Dish Name (Full title, never cramped or truncated) */}
            <div className="flex-1 min-w-0">
              <h3 className="text-[14px] sm:text-[15px] font-semibold text-[#f2f0f7] group-hover:text-white transition-colors leading-snug">
                {name}
              </h3>

              {/* Clean description on its own line with breathing room */}
              {description && (
                <p className="text-xs text-[#a09bb0] mt-1 leading-relaxed line-clamp-2">
                  {description}
                </p>
              )}

              {/* Mobile price display when an image is present */}
              <div className="flex items-center gap-2 mt-1.5 sm:hidden">
                <span className="text-sm font-bold text-[#f5be51] font-mono">
                  ₹{price}
                </span>
                {quantity > 0 && (
                  <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-[#f5a623]/20 text-[#fbd578]">
                    {quantity} in cart
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Food Image Thumbnail + Price & Add Button */}
        <div
          className="flex items-center gap-3 sm:gap-4 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Price (Visible on larger screens or beside image) */}
          <span className="hidden sm:inline text-sm sm:text-base font-bold text-[#f5be51] font-mono tracking-tight text-right min-w-[50px]">
            ₹{price}
          </span>

          {/* Delicious Food Image Thumbnail (Appetizing visual presentation) */}
          {resolvedImage && (
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-[#d4a234]/25 shadow-md bg-[#1f1728]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resolvedImage}
                alt={name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.parentElement!.style.display = 'none'
                }}
              />
            </div>
          )}

          {/* Interactive ADD / Quantity Button */}
          {available && (
            quantity === 0 ? (
              <button
                type="button"
                onClick={handleAdd}
                className={`px-3 py-1.5 rounded-lg text-xs font-black tracking-wider uppercase transition-all shadow-sm active:scale-95 flex items-center gap-1 ${
                  justAdded
                    ? 'scale-105 bg-[#f5a623] text-[#1a1100]'
                    : 'bg-[#d4a234]/15 hover:bg-[#f5a623] text-[#f5be51] hover:text-[#1a1100] border border-[#d4a234]/40'
                }`}
                title={`Add ${name}`}
                aria-label={`Add ${name}`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>ADD</span>
              </button>
            ) : (
              <div className="flex items-center rounded-lg overflow-hidden border border-[#f5a623]/60 bg-[#1e1526] shadow-md">
                <button
                  type="button"
                  onClick={onDecrement}
                  className="w-7 h-7 flex items-center justify-center text-[#f5a623] hover:bg-[#f5a623]/20 active:scale-90 transition-all"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-6 text-center text-xs font-black text-[#fbd578]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={handleAdd}
                  className="w-7 h-7 flex items-center justify-center text-[#f5a623] hover:bg-[#f5a623]/20 active:scale-90 transition-all"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}
