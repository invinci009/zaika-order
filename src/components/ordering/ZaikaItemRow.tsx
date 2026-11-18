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
 * Semi-solid luxury dining card (not fully transparent):
 * - Solid dark velvet backing for crystal-clear readability
 * - Distinct, verified food photo for each item alongside its details
 * - Clean diet badge, title, price, and gold add/stepper control
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

  // Resolve unique image for this dish
  const resolvedImage = imageUrl || getFoodImage(name, categoryId)

  const handleAdd = () => {
    if (!available) return
    onAdd()
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 600)
  }

  return (
    <div
      className={`group rounded-2xl p-3 sm:p-3.5 mb-2.5 transition-all select-none border backdrop-blur-md shadow-lg shadow-black/40 ${
        available
          ? 'bg-[#180e25]/92 border-amber-500/20 hover:border-amber-400/50 hover:bg-[#1f1230]/95 cursor-pointer'
          : 'bg-[#140b1e]/60 border-white/5 opacity-40 cursor-not-allowed'
      } ${quantity > 0 ? 'ring-1 ring-amber-400/60 bg-[#1f1230]' : ''}`}
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
        {/* Left Side: Diet Badge + Name + Description + Price & Add Button */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {/* Refined Veg / Non-Veg badge */}
              <span
                className="w-3.5 h-3.5 rounded-xs border flex items-center justify-center shrink-0"
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

              <h3 className="text-[14px] sm:text-[15px] font-bold text-[#f7f2ea] group-hover:text-amber-200 transition-colors leading-snug truncate">
                {name}
              </h3>
            </div>

            {description && (
              <p className="text-[11px] sm:text-xs text-amber-200/55 line-clamp-2 leading-relaxed mb-2">
                {description}
              </p>
            )}
          </div>

          {/* Price & Action Row */}
          <div className="flex items-center gap-3 mt-1.5" onClick={(e) => e.stopPropagation()}>
            <span className="text-[15px] sm:text-base font-black font-serif text-[#f7d77a] tracking-tight">
              ₹{price}
            </span>

            {available && (
              quantity === 0 ? (
                <button
                  type="button"
                  onClick={handleAdd}
                  className={`px-3 py-1 rounded-xl text-xs font-black tracking-wider uppercase transition-all shadow-xs flex items-center gap-1 active:scale-95 cursor-pointer ${
                    justAdded
                      ? 'bg-amber-400 text-[#120816] scale-105'
                      : 'bg-amber-400/15 hover:bg-amber-400 text-amber-300 hover:text-[#120816] border border-amber-400/35'
                  }`}
                  aria-label={`Add ${name}`}
                >
                  {justAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>ADDED</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>ADD</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="flex items-center rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f6d77a] text-[#120816] shadow-sm px-1 py-0.5">
                  <button
                    type="button"
                    onClick={onDecrement}
                    className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-black/10 active:scale-90 transition-all cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3 h-3 stroke-[2.5]" />
                  </button>
                  <span className="w-6 text-center text-xs font-black">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={handleAdd}
                    className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-black/10 active:scale-90 transition-all cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3 h-3 stroke-[2.5]" />
                  </button>
                </div>
              )
            )}
          </div>
        </div>

        {/* Right Side: High-Resolution Food Photo */}
        {resolvedImage && (
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 border border-amber-400/25 shadow-md bg-[#241335]">
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
      </div>
    </div>
  )
}
