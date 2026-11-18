'use client'

import { ShoppingBag, ArrowRight } from 'lucide-react'

interface ZaikaCartBarProps {
  itemCount: number
  totalPaise: number
  checkoutHref: string
  onViewCart: () => void
}

function formatPrice(paise: number): string {
  return `₹${Math.round(paise / 100)}`
}

/**
 * ZaikaCartBar
 * Ultra-refined floating gold cart bar matching PM Zaika royal branding
 */
export function ZaikaCartBar({ itemCount, totalPaise, onViewCart }: ZaikaCartBarProps) {
  if (itemCount === 0) return null

  return (
    <div className="zaika-cart-bar fixed bottom-4 left-0 right-0 z-40 px-3 pointer-events-none">
      <div className="max-w-2xl mx-auto pointer-events-auto">
        <button
          type="button"
          onClick={onViewCart}
          className="flex items-center justify-between gap-3 w-full py-3 px-4 rounded-2xl transition-all active:scale-[0.98] cursor-pointer shadow-2xl relative overflow-hidden group"
          style={{
            background: 'linear-gradient(90deg, #bf8d2c 0%, #f6d47b 35%, #eed48f 65%, #a6741b 100%)',
            boxShadow: '0 8px 30px rgba(212, 175, 55, 0.35), 0 2px 8px rgba(0,0,0,0.5)',
          }}
          aria-label="View current cart"
        >
          {/* Subtle shine animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

          {/* Left: Bag Icon + Count */}
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#140b00]/15 shadow-inner">
              <ShoppingBag className="w-4 h-4 text-[#140b00] stroke-[2.5]" />
            </div>
            <div className="text-left">
              <p className="text-xs font-black uppercase tracking-wider text-[#140b00] leading-tight">
                {itemCount} {itemCount === 1 ? 'Dish' : 'Dishes'} in Order
              </p>
              <p className="text-[11px] font-bold text-[#140b00]/75">
                Tap to review &amp; place order
              </p>
            </div>
          </div>

          {/* Right: Total + Arrow */}
          <div className="flex items-center gap-2 relative z-10">
            <span className="text-base sm:text-lg font-black font-serif text-[#140b00] tracking-tight">
              {formatPrice(totalPaise)}
            </span>
            <div className="w-7 h-7 rounded-full bg-[#140b00] text-amber-300 flex items-center justify-center shadow-xs">
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}
