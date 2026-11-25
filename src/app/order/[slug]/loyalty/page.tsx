'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import {
  Loader2,
  Sparkles,
  History,
  Crown,
  UtensilsCrossed,
  Check,
  ChevronRight,
  ShieldCheck,
  Gift,
  Phone,
  User,
  ArrowRight,
  LogOut,
  AlertCircle,
} from 'lucide-react'
import { formatPaise } from '@/lib/ordering/rules.mjs'

// --- Fine-line Architectural Mandala Background ---
const ArchitecturalMandalaSvg = ({
  className = '',
  strokeColor = '#D9B9E8',
  strokeWidth = 0.85,
}: {
  className?: string
  strokeColor?: string
  strokeWidth?: number
}) => {
  const petals = Array.from({ length: 16 }, (_, i) => i * 22.5)
  const pearls = Array.from({ length: 24 }, (_, i) => i * 15)

  return (
    <svg
      viewBox="0 0 360 360"
      className={`pointer-events-none select-none ${className}`}
      fill="none"
      aria-hidden="true"
    >
      <g transform="translate(180 180)">
        <circle r="36" stroke={strokeColor} strokeWidth={strokeWidth} />
        <circle r="54" stroke={strokeColor} strokeWidth={strokeWidth} />
        <circle r="76" stroke={strokeColor} strokeWidth={strokeWidth} />
        <circle r="118" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} strokeOpacity="0.65" />
        <circle r="164" stroke={strokeColor} strokeWidth={strokeWidth * 0.7} strokeOpacity="0.5" />
        {pearls.map((deg) => (
          <circle
            key={`p-${deg}`}
            cx="0"
            cy="-65"
            r="2.4"
            transform={`rotate(${deg})`}
            stroke={strokeColor}
            strokeWidth={strokeWidth * 0.9}
          />
        ))}
        {petals.map((deg) => (
          <path
            key={`petal-${deg}`}
            d="M 0 -76 C 14 -100 14 -112 0 -118 C -14 -112 -14 -100 0 -76 Z"
            transform={`rotate(${deg})`}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        ))}
      </g>
    </svg>
  )
}

// PM Zaika Royal Club & VIP Portal — Dark Luxury Royal Edition
export default function LoyaltyHubPage() {
  const params = useParams<{ slug: string }>()
  const searchParams = useSearchParams()
  const slug = params?.slug || 'default'
  const tableParam = searchParams.get('table') || ''
  const token = searchParams.get('token') || ''

  const [loading, setLoading] = useState(true)
  const [customer, setCustomer] = useState<{
    customerId: string
    name: string
    phone: string
    tier?: string
  } | null>(null)
  const [snapshot, setSnapshot] = useState<{
    availablePoints: number
    earnedTotal: number
    redeemedTotal: number
  } | null>(null)
  const [orders, setOrders] = useState<
    Array<{
      id: string
      orderNumber: string
      totalPaise: number
      fulfilment: string
      createdAt: string
      tableLabel?: string | null
      loyaltyPointsEarned?: number
      items: Array<{ itemName: string; quantity: number; pricePaise?: number }>
    }>
  >([])
  const [rewards, setRewards] = useState<
    Array<{ id: string; name: string; description?: string; pointsCost: number; discountPaise: number }>
  >([])
  const [historyTab, setHistoryTab] = useState<'all' | 'earned' | 'redeemed'>('all')
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [claiming, setClaiming] = useState(false)
  const [claimMsg, setClaimMsg] = useState<string | null>(null)

  const menuHref = useMemo(() => {
    const q = new URLSearchParams()
    if (tableParam) q.set('table', tableParam)
    if (token) q.set('token', token)
    const qs = q.toString()
    return `/order/${slug}/menu${qs ? `?${qs}` : ''}`
  }, [slug, tableParam, token])

  const formatDisplayPhone = (rawPhone?: string | null) => {
    if (!rawPhone) return ''
    const digits = rawPhone.replace(/\D/g, '').replace(/^91/, '').slice(-10)
    if (digits.length === 10) return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`
    return rawPhone.startsWith('+') ? rawPhone : `+91 ${rawPhone}`
  }

  const checkSession = useCallback(async () => {
    try {
      const res = await fetch('/api/public/loyalty/auth', { cache: 'no-store' })
      if (!res.ok) {
        setCustomer(null)
        setSnapshot(null)
        setOrders([])
        setLoading(false)
        return
      }
      const data = await res.json().catch(() => null)
      if (data?.customer) {
        setCustomer({
          customerId: data.customer.customerId,
          name: data.customer.name,
          phone: data.customer.phone || data.customer.customerId,
          tier: data.customer.tier || 'Royal Club Tier I',
        })
        setSnapshot(data.snapshot || { availablePoints: 0, earnedTotal: 0, redeemedTotal: 0 })
        if (Array.isArray(data.orders)) setOrders(data.orders)
      }
    } catch {}
    setLoading(false)
  }, [])

  const loadRewards = useCallback(async () => {
    try {
      const res = await fetch('/api/public/loyalty/rewards', { cache: 'no-store' })
      const data = await res.json().catch(() => ({}))
      if (Array.isArray(data.rewards)) setRewards(data.rewards)
    } catch {}
  }, [])

  useEffect(() => {
    checkSession()
    loadRewards()
  }, [checkSession, loadRewards])

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError(null)
    const cleaned = phone.replace(/\D/g, '').replace(/^91/, '').slice(-10)
    if (!/^[6-9]\d{9}$/.test(cleaned)) {
      setAuthError('Please enter a valid 10-digit Indian mobile number.')
      return
    }
    setAuthLoading(true)
    try {
      const res = await fetch('/api/public/loyalty/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'phone-login', phone: cleaned, name: name.trim() || undefined }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Authentication failed')
      setCustomer({
        customerId: data.customer.customerId,
        name: data.customer.name,
        phone: data.customer.phone || data.customer.customerId,
        tier: data.customer.tier || 'Royal Club Tier I',
      })
      setSnapshot(data.snapshot)
      if (Array.isArray(data.orders)) setOrders(data.orders)
      try {
        localStorage.setItem('rp_customer_phone', data.customer.customerId)
        if (data.customer.name) localStorage.setItem('rp_customer_name', data.customer.name)
      } catch {}
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Sign in failed')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleClaimPoints = async () => {
    setClaiming(true)
    setClaimMsg(null)
    try {
      const res = await fetch('/api/public/loyalty/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setClaimMsg('Loyalty points successfully credited!')
        checkSession()
      } else {
        setClaimMsg(data.error || 'Could not claim points. Points accrue on meal delivery.')
      }
    } catch {
      setClaimMsg('Network error claiming points.')
    } finally {
      setClaiming(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/public/loyalty/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' }),
      })
      try {
        localStorage.removeItem('rp_customer_phone')
        localStorage.removeItem('rp_customer_name')
      } catch {}
    } catch {}
    setCustomer(null)
    setSnapshot(null)
    setOrders([])
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07030b] flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-full overflow-hidden border border-[#f59e0b]/40 shadow-2xl p-1 bg-[#140b20] mb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="PM Zaika Restaurant" className="w-full h-full object-contain rounded-full" />
        </div>
        <Loader2 className="w-7 h-7 text-[#f59e0b] animate-spin" />
        <p className="text-xs text-[#8e829c] font-medium mt-3">Loading PM Zaika Royal Club...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#07030b] text-[#f5efe6] selection:bg-[#f59e0b]/30 pb-20">
      {/* Sticky Header with 1-tap back to food order */}
      <header className="sticky top-0 z-30 bg-[#0d0617]/90 backdrop-blur-md border-b border-[#2b1942] px-4 py-3 shadow-lg">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-3">
          <Link
            href={menuHref}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] hover:from-[#b45309] hover:to-[#d97706] text-[#140b20] text-xs font-black transition-all shadow-md active:scale-95"
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Open Menu</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full overflow-hidden border border-[#f59e0b]/50 p-0.5 bg-[#140b20]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="PM Zaika" className="w-full h-full object-contain rounded-full" />
            </div>
            <span className="text-xs sm:text-sm font-black text-white tracking-wide uppercase">
              PM Zaika Royal Club
            </span>
          </div>

          {customer ? (
            <button
              type="button"
              onClick={handleLogout}
              className="text-xs font-bold text-[#8e829c] hover:text-rose-400 flex items-center gap-1 transition-colors cursor-pointer"
              title="Sign out of Royal Pass"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          ) : (
            <div className="w-14" />
          )}
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-5 space-y-4">
        {customer ? (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Royal VIP Pass Card */}
            <div className="relative p-5 rounded-3xl bg-gradient-to-br from-[#1a0c2e] via-[#24103e] to-[#120722] text-white shadow-2xl overflow-hidden border border-[#f59e0b]/35">
              <ArchitecturalMandalaSvg
                className="absolute -right-16 top-1/2 -translate-y-1/2 w-64 h-64 opacity-25"
                strokeColor="#E8D2F5"
                strokeWidth={1}
              />

              <div className="relative z-10 flex items-center justify-between gap-2 pb-3 border-b border-white/10">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-[#f59e0b]/20 border border-[#f59e0b]/50 flex items-center justify-center shrink-0">
                    <Crown className="w-4 h-4 text-[#f59e0b]" />
                  </div>
                  <span className="text-[10px] font-black tracking-widest uppercase text-[#fcd34d] truncate">
                    {customer.tier || 'ROYAL VIP MEMBER • TIER I'}
                  </span>
                </div>
                {tableParam && (
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-[10px] font-bold text-[#fdebd3] shrink-0">
                    Table {tableParam}
                  </span>
                )}
              </div>

              {/* Guest Profile Chip */}
              <div className="relative z-10 my-3 p-3 rounded-2xl bg-[#0e051c]/80 border border-[#f59e0b]/20 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f59e0b] to-[#b45309] text-[#140b20] font-black text-sm flex items-center justify-center shrink-0 shadow-md">
                    {customer.name ? customer.name.charAt(0).toUpperCase() : 'Z'}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-sm font-black text-white leading-tight truncate">
                        {customer.name || 'Honored Guest'}
                      </p>
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[9px] font-bold text-emerald-400">
                        <Check className="w-2.5 h-2.5 stroke-[3]" /> VIP Active
                      </span>
                    </div>
                    <p className="text-xs font-mono font-bold text-[#fcd34d]/90 mt-0.5 tracking-wider">
                      {formatDisplayPhone(customer.phone)}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[9.5px] font-bold text-[#8e829c] uppercase block">Points Rate</span>
                  <span className="text-xs font-black text-[#f59e0b]">+20 / order</span>
                </div>
              </div>

              {/* Points Balance */}
              <div className="relative z-10 pt-1 flex items-end justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8e829c] block">
                    Available Balance
                  </span>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white leading-none">
                      {snapshot?.availablePoints ?? 0}
                    </span>
                    <span className="text-xs font-black text-[#f59e0b] tracking-wider">PTS</span>
                  </div>
                  {snapshot && (snapshot.earnedTotal > 0 || snapshot.redeemedTotal > 0) && (
                    <p className="text-[10px] text-[#8e829c] mt-1.5">
                      Lifetime: {snapshot.earnedTotal} earned • {snapshot.redeemedTotal} redeemed
                    </p>
                  )}
                </div>

                <Link
                  href={menuHref}
                  className="h-10 px-4 rounded-full bg-gradient-to-r from-[#d97706] to-[#f59e0b] hover:from-[#b45309] hover:to-[#d97706] text-[#140b20] text-xs font-black shadow-lg shadow-[#f59e0b]/25 flex items-center gap-1.5 transition-all shrink-0 active:scale-95"
                >
                  <span>Redeem on Menu</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Direct Points Claim Card */}
            <div className="p-4 rounded-2xl bg-[#140b20] border border-[#2b1942] flex items-center justify-between gap-3 shadow-lg">
              <div>
                <p className="font-extrabold text-xs text-white">Claim Dining Loyalty Points</p>
                <p className="text-[11px] text-[#8e829c] mt-0.5">Points credit automatically upon meal delivery</p>
              </div>
              <button
                type="button"
                onClick={handleClaimPoints}
                disabled={claiming}
                className="px-3.5 py-1.5 rounded-xl bg-[#1d102f] hover:bg-[#281440] border border-[#2b1942] text-[#f59e0b] font-bold text-xs disabled:opacity-50 transition-colors shrink-0 cursor-pointer"
              >
                {claiming ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Claim'}
              </button>
            </div>
            {claimMsg && (
              <p className="text-xs text-center font-bold text-[#f59e0b] animate-in fade-in duration-200">
                {claimMsg}
              </p>
            )}

            {/* Previous Orders */}
            {orders.length > 0 && (
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-[#f59e0b]" />
                    <span>Your Dining History ({orders.length})</span>
                  </h3>
                  <Link href={menuHref} className="text-[11px] font-bold text-[#f59e0b] hover:underline">
                    Reorder Dishes →
                  </Link>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {orders.map((o) => (
                    <div
                      key={o.id}
                      className="p-3.5 rounded-2xl bg-[#140b20] border border-[#2b1942] text-xs space-y-2 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-black text-white">#{o.orderNumber}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                          {o.fulfilment === 'completed' || o.fulfilment === 'served' ? 'Served' : o.fulfilment}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#8e829c] space-y-0.5">
                        {o.items?.map((item: any, idx: number) => (
                          <p key={idx} className="truncate">
                            <strong className="text-white">{item.quantity}x</strong> {item.itemName}
                          </p>
                        ))}
                      </div>
                      <div className="pt-2 border-t border-[#2b1942] flex items-center justify-between">
                        <span className="font-black text-white">{formatPaise(o.totalPaise)}</span>
                        <span className="text-[10px] font-black text-[#f59e0b] bg-[#f59e0b]/15 border border-[#f59e0b]/30 px-2 py-0.5 rounded-full">
                          +{o.loyaltyPointsEarned || 20} pts
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIP Perks Catalog */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-[#f59e0b]" />
                  <span>Royal Club Rewards Catalog</span>
                </h3>
                <div className="flex gap-1 text-[10px] font-bold">
                  {(['all', 'earned', 'redeemed'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setHistoryTab(t)}
                      className={`px-2.5 py-1 rounded-lg transition-colors ${
                        historyTab === t
                          ? 'bg-[#f59e0b] text-[#140b20]'
                          : 'bg-[#180e28] text-[#8e829c] hover:text-white'
                      }`}
                    >
                      {t.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                {rewards.length > 0 ? (
                  rewards.map((r) => (
                    <div
                      key={r.id}
                      className="p-3 rounded-2xl bg-[#140b20] border border-[#2b1942] flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-bold text-white">{r.name}</p>
                        <p className="text-[11px] text-[#8e829c]">
                          {r.description || 'Complimentary Royal Club perk'}
                        </p>
                      </div>
                      <span className="text-[11px] font-black text-[#f59e0b] bg-[#f59e0b]/15 border border-[#f59e0b]/30 px-2.5 py-0.5 rounded-full shrink-0">
                        {r.pointsCost} pts
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-3.5 rounded-2xl bg-[#140b20] border border-[#2b1942] flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-white">Instant ₹50 Bill Discount</p>
                      <p className="text-[11px] text-[#8e829c]">Apply at checkout for 50 Royal Points</p>
                    </div>
                    <span className="text-[11px] font-black text-[#f59e0b] bg-[#f59e0b]/15 border border-[#f59e0b]/30 px-2.5 py-0.5 rounded-full shrink-0">
                      50 pts
                    </span>
                  </div>
                )}
              </div>
            </div>

            <Link
              href={menuHref}
              className="block w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] hover:from-[#b45309] hover:to-[#d97706] text-[#140b20] text-center text-xs font-black shadow-lg shadow-[#f59e0b]/25 transition-all"
            >
              Return to Food Menu &amp; Order →
            </Link>
          </div>
        ) : (
          /* Sign In to Royal Club Card */
          <div className="p-6 rounded-3xl bg-[#140b20] border border-[#2b1942] shadow-2xl space-y-5 text-center relative overflow-hidden animate-in fade-in duration-300">
            <ArchitecturalMandalaSvg
              className="absolute -right-20 -top-20 w-72 h-72 opacity-20"
              strokeColor="#E8D2F5"
              strokeWidth={1}
            />

            <div className="relative z-10 w-16 h-16 mx-auto rounded-2xl bg-[#1d102f] border border-[#f59e0b]/35 flex items-center justify-center shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="PM Zaika" className="w-12 h-12 object-contain rounded-full" />
            </div>

            <div className="relative z-10 space-y-1">
              <h2 className="text-xl font-black text-white">Sign in to PM Zaika Royal Club</h2>
              <p className="text-xs text-[#8e829c] leading-relaxed max-w-sm mx-auto">
                Enter your mobile number to view loyalty points, unlock discounts, and earn 20 points on every
                dine-in order.
              </p>
            </div>

            {authError && (
              <div className="relative z-10 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handlePhoneSubmit} className="relative z-10 space-y-3.5 text-left">
              <div>
                <label className="text-xs font-bold text-[#8e829c] block mb-1">Mobile Number (10 digits)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-[#f59e0b]">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-11 pl-12 pr-3 rounded-xl bg-[#0d0617] border border-[#2b1942] focus:border-[#f59e0b] text-white text-xs font-mono font-bold placeholder-[#5a4d6b] outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#8e829c] block mb-1">Your Name (Optional)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8e829c]">
                    <User className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="text"
                    placeholder="e.g. Amanullah"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-11 pl-10 pr-3 rounded-xl bg-[#0d0617] border border-[#2b1942] focus:border-[#f59e0b] text-white text-xs placeholder-[#5a4d6b] outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] hover:from-[#b45309] hover:to-[#d97706] text-[#140b20] font-black text-xs shadow-lg shadow-[#f59e0b]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {authLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#140b20]" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Access Royal Club Points</span>
                  </>
                )}
              </button>
            </form>

            <div className="relative z-10 pt-2 border-t border-[#2b1942]">
              <Link
                href={menuHref}
                className="text-xs text-[#f59e0b] hover:text-[#fbbf24] font-bold inline-flex items-center gap-1 transition-colors"
              >
                <span>← Skip &amp; Return to Food Menu</span>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
