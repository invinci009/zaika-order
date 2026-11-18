'use client'

import { ShoppingBag, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface ZaikaCartBarProps {
  itemCount: number
  totalPaise: number
  checkoutHref: string
  onViewCart: () => void
}

function formatPrice(paise: number): string {
  return `₹${Math.round(paise / 100)}`
}

export function ZaikaCartBar({ itemCount, totalPaise, checkoutHref, onViewCart }: ZaikaCartBarProps) {
  if (itemCount === 0) return null

  return (
    <div className="zaika-cart-bar">
      <div className="max-w-2xl mx-auto px-3">
        <Link
          href={checkoutHref}
          className="flex items-center justify-between gap-3 w-full py-2.5 px-4 rounded-xl transition-all active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, #d4a234 0%, #e8a317 100%)',
            boxShadow: '0 4px 20px rgba(212, 162, 52, 0.4)',
          }}
          onClick={onViewCart}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.15)' }}
            >
              <ShoppingBag className="w-4 h-4" style={{ color: '#0f0f1a' }} />
            </div>
            <div>
              <p className="text-xs font-black" style={{ color: '#0f0f1a' }}>
                {itemCount} {itemCount === 1 ? 'item' : 'items'} added
              </p>
              <p className="text-[10px] font-medium" style={{ color: 'rgba(15,15,26,0.7)' }}>
                View full cart
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-base font-black" style={{ color: '#0f0f1a' }}>
              {formatPrice(totalPaise)}
            </span>
            <ChevronRight className="w-4 h-4" style={{ color: '#0f0f1a' }} />
          </div>
        </Link>
      </div>
    </div>
  )
}
