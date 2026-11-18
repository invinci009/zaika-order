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
  isLast,
  onAdd,
  onDecrement,
  onOpenDetail,
}: ZaikaItemRowProps) {
  const [justAdded, setJustAdded] = useState(false)

  const price = Math.round(pricePaise / 100)
  const dotClass =
    veg === 'veg' ? 'diet-dot diet-dot-veg' :
    veg === 'nonveg' ? 'diet-dot diet-dot-nonveg' :
    veg === 'egg' ? 'diet-dot diet-dot-egg' : ''

  const handleAdd = () => {
    if (!available) return
    onAdd()
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 800)
  }

  return (
    <div
      className={`flex items-start gap-2.5 px-3.5 py-2.5 group transition-colors ${
        available ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'
      } ${!isLast ? 'border-b' : ''}`}
      style={{
        borderColor: 'rgba(212, 162, 52, 0.1)',
        background: quantity > 0 ? 'rgba(212, 162, 52, 0.04)' : 'transparent',
      }}
      onClick={() => {
        if (!available) return
        if (hasOptions && onOpenDetail) {
          onOpenDetail()
        } else {
          handleAdd()
        }
      }}
    >
      {/* Left: diet dot + name + description */}
      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <div className="flex items-start gap-2">
          {/* Diet indicator */}
          {dotClass && (
            <span
              className={dotClass}
              style={{ marginTop: '3px', flexShrink: 0 }}
              aria-label={veg === 'veg' ? 'Vegetarian' : veg === 'egg' ? 'Egg' : 'Non-vegetarian'}
            />
          )}
          {/* Name */}
          <span
            className="text-sm font-medium leading-tight flex-1"
            style={{ color: available ? '#f5f5f0' : '#6b6b88' }}
          >
            {name}
          </span>
        </div>
        {description && (
          <p
            className="text-xs leading-relaxed ml-5"
            style={{ color: '#7a7a9a' }}
          >
            {description}
          </p>
        )}
        {!available && (
          <span className="text-[10px] ml-5 font-medium" style={{ color: '#e53935' }}>
            Currently unavailable
          </span>
        )}
      </div>

      {/* Right: image (optional) + price + cart control */}
      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
        {/* Item image (small thumbnail) */}
        {imageUrl && (
          <div
            className="w-14 h-14 rounded-lg overflow-hidden mb-1"
            style={{ border: '1px solid rgba(212, 162, 52, 0.2)' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.parentElement!.style.display = 'none' }}
            />
          </div>
        )}

        {/* Price */}
        <span
          className="text-sm font-bold"
          style={{ color: '#d4a234' }}
        >
          ₹{price}
        </span>

        {/* Cart control */}
        {available && (
          quantity === 0 ? (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleAdd() }}
              className={`flex items-center gap-0.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all active:scale-95 ${
                justAdded ? 'scale-110' : ''
              }`}
              style={{
                background: justAdded
                  ? 'rgba(212, 162, 52, 0.3)'
                  : 'rgba(212, 162, 52, 0.12)',
                border: '1px solid rgba(212, 162, 52, 0.4)',
                color: '#d4a234',
              }}
              aria-label={`Add ${name}`}
            >
              <Plus className="w-3 h-3" />
              <span>ADD</span>
            </button>
          ) : (
            <div
              className="flex items-center gap-0 rounded-md overflow-hidden"
              style={{ border: '1px solid rgba(212, 162, 52, 0.4)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => onDecrement()}
                className="w-7 h-7 flex items-center justify-center transition-colors"
                style={{
                  background: 'rgba(212, 162, 52, 0.1)',
                  color: '#d4a234',
                }}
                aria-label="Remove one"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span
                className="w-6 text-center text-xs font-black"
                style={{ color: '#f0c14b' }}
              >
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => handleAdd()}
                className="w-7 h-7 flex items-center justify-center transition-colors"
                style={{
                  background: 'rgba(212, 162, 52, 0.2)',
                  color: '#d4a234',
                }}
                aria-label="Add one more"
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
