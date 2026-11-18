'use client'

import { useState } from 'react'
import { List, X } from 'lucide-react'

interface ZaikaCategoryJumpProps {
  categories: Array<{ id: string; name: string }>
}

export function ZaikaCategoryJump({ categories }: ZaikaCategoryJumpProps) {
  const [open, setOpen] = useState(false)

  const scrollTo = (id: string) => {
    const el = document.getElementById(`cat-${id}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    setOpen(false)
  }

  return (
    <>
      {/* FAB Button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed right-4 z-40 w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-lg"
        style={{
          bottom: 'calc(env(safe-area-inset-bottom) + 80px)',
          background: 'linear-gradient(135deg, #d4a234, #e8a317)',
          boxShadow: '0 4px 16px rgba(212, 162, 52, 0.4)',
        }}
        aria-label="Jump to category"
      >
        <List className="w-5 h-5" style={{ color: '#0f0f1a' }} />
      </button>

      {/* Overlay */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(10, 10, 20, 0.7)', backdropFilter: 'blur(4px)' }}
            onClick={() => setOpen(false)}
          />
          <div
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl p-4 pb-safe max-h-[70vh] overflow-y-auto no-scrollbar"
            style={{
              background: 'linear-gradient(180deg, #1f2041 0%, #1a1a2e 100%)',
              border: '1px solid rgba(212, 162, 52, 0.3)',
              borderBottom: 'none',
              boxShadow: '0 -4px 32px rgba(0,0,0,0.5)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className="text-sm font-black tracking-widest uppercase"
                style={{ color: '#d4a234' }}
              >
                Menu Sections
              </h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(212, 162, 52, 0.1)', color: '#d4a234' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => scrollTo(cat.id)}
                  className="text-left px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all active:scale-95"
                  style={{
                    background: 'rgba(212, 162, 52, 0.08)',
                    border: '1px solid rgba(212, 162, 52, 0.2)',
                    color: '#f5f5f0',
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  )
}
