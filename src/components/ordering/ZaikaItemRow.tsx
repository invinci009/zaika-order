'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'

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
  onAdd,
  onDecrement,
  onOpenDetail,
}: ZaikaItemRowProps) {
  const [justAdded, setJustAdded] = useState(false)

  const price = Math.round(pricePaise / 100)
  const dotColor =
    veg === 'veg' ? '#4caf50' :
    veg === 'nonveg' ? '#e53935' :
    veg === 'egg' ? '#ff9800' : null

  const handleAdd = () => {
    if (!available) return
    onAdd()
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 800)
  }

  return (
    <div
      className={`group flex items-center justify-between py-1.5 px-2 rounded-lg transition-colors cursor-pointer ${
        available ? 'hover:bg-white/[0.04]' : 'opacity-40 cursor-not-allowed'
      } ${quantity > 0 ? 'bg-[rgba(245,166,35,0.06)]' : ''}`}
      onClick={() => {
        if (!available) return
        if (hasOptions && onOpenDetail) {
          onOpenDetail()
        } else {
          handleAdd()
        }
      }}
    >
      {/* Left: Optional diet dot + Item Name */}
      <div className="flex items-center gap-2 min-w-0 pr-4">
        {dotColor && (
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: dotColor }}
            title={veg === 'veg' ? 'Veg' : veg === 'egg' ? 'Egg' : 'Non-Veg'}
          />
        )}
        <span
          className="text-[13px] sm:text-sm font-medium tracking-wide text-[#e8e7ee] group-hover:text-white transition-colors truncate"
          style={{ fontFamily: 'var(--font-sans), sans-serif' }}
        >
          {name}
        </span>
        {description && (
          <span className="hidden sm:inline text-[11px] text-[#8e8a9c] truncate ml-1">
            • {description}
          </span>
        )}
      </div>

      {/* Right: Price + Elegant Add / Quantity Adjuster */}
      <div className="flex items-center gap-2.5 shrink-0" onClick={(e) => e.stopPropagation()}>
        {/* Clean price number matching the brochure */}
        <span
          className="text-[13px] sm:text-sm font-medium tracking-wider text-[#e8e7ee] min-w-[36px] text-right font-mono"
        >
          {price}
        </span>

        {/* Interactive Cart Control (subtle, clean, and gold) */}
        {available && (
          quantity === 0 ? (
            <button
              type="button"
              onClick={handleAdd}
              className={`w-6 h-6 rounded-md flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 active:scale-90 ${
                justAdded ? 'scale-110 bg-[#f5a623] text-[#1a1100]' : 'bg-white/10 hover:bg-[#f5a623] hover:text-[#1a1100] text-[#e8e7ee]'
              }`}
              title={`Add ${name}`}
              aria-label={`Add ${name}`}
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div
              className="flex items-center rounded-md overflow-hidden border border-[#f5a623]/50 bg-[#1f1728]"
            >
              <button
                type="button"
                onClick={onDecrement}
                className="w-6 h-6 flex items-center justify-center text-[#f5a623] hover:bg-[#f5a623]/20 active:scale-90 transition-all"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-5 text-center text-xs font-black text-[#fbd578]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={handleAdd}
                className="w-6 h-6 flex items-center justify-center text-[#f5a623] hover:bg-[#f5a623]/20 active:scale-90 transition-all"
                aria-label="Increase quantity"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )
        )}
      </div>
    </div>
  )
}
