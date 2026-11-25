'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Loader2, AlertTriangle, CheckCircle2, ChefHat, BellRing, Receipt, Phone, RefreshCw, XCircle, PartyPopper, Sparkles, Gift, Star, ArrowRight, Copy, Check, Crown, Package } from 'lucide-react'
import { formatPaise, formatTableDisplay, isParcelLabel } from '@/lib/ordering/rules.mjs'

const STATUS_META: Record<string, { label: string; hint: string }> = {
  RECEIVED: { label: 'Order Received', hint: 'Sent to the kitchen. Please wait for confirmation.' },
  ACCEPTED: { label: 'Confirmed', hint: 'The kitchen has accepted your order.' },
  PREPARING: { label: 'Being Prepared', hint: 'Our chefs are preparing your food.' },
  READY: { label: 'Ready', hint: 'Your food is ready — it will be served shortly.' },
  SERVED: { label: 'Served', hint: 'Enjoy your meal! We would love your feedback.' },
  CANCELLED: { label: 'Cancelled', hint: 'This order was cancelled. Please contact the counter.' },
}

interface TrackedOrderItem {
  quantity: number
  itemName: string
  lineTotalPaise: number
  options?: Array<{ optionName: string }>
}

interface TrackedOrder {
  orderId: string
  orderNumber: string
  tableLabel: string | null
  orderType?: 'DINE_IN' | 'PARCEL'
  customerName: string
  customerPhoneMasked: string
  items: TrackedOrderItem[]
  subtotalPaise: number
  taxPaise: number
  chargePaise: number
  totalPaise: number
  fulfilment: string
  cancellationReason?: string | null
  paymentStatus: string
  paymentInstructions: string
  restaurantPhone: string | null
  createdAt: string
  // Loyalty context
  loyaltyAwarded?: boolean
  loyaltyPointsEarned?: number
  loyaltyDiscountPaise?: number
  loyaltyRewardName?: string | null
}

function readAccessToken(orderId: string): string | null {
  if (typeof window === 'undefined') return null
  const qs = new URLSearchParams(window.location.search)
  const fromUrl = qs.get('accessToken')
  if (fromUrl) {
    try {
      window.localStorage.setItem(`rp_order_${orderId}`, fromUrl)
    } catch {
      // storage unavailable — token still works for this session
    }
    return fromUrl
  }
  try {
    return window.localStorage.getItem(`rp_order_${orderId}`)
  } catch {
    return null
  }
}

export default function OrderConfirmationPage() {
  const params = useParams<{ slug: string; orderId: string }>()
  const { slug, orderId } = params

  const [mounted, setMounted] = useState(false)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [order, setOrder] = useState<TrackedOrder | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [claiming, setClaiming] = useState(false)
  const [claimMsg, setClaimMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [loyaltyLoggedIn, setLoyaltyLoggedIn] = useState(false)
  const [copied, setCopied] = useState(false)
  const etagRef = useRef<string | null>(null)
  const sseActiveRef = useRef(false)

  useEffect(() => {
    setMounted(true)
    const token = readAccessToken(orderId)
    setAccessToken(token)
    // Check if customer is currently logged in to loyalty
    fetch('/api/public/loyalty/auth', { cache: 'no-store' })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json().catch(() => null)
          if (data?.customer?.verified) setLoyaltyLoggedIn(true)
        }
      })
      .catch(() => {})
  }, [orderId])
  const fetchOrder = useCallback(async (silent = false, force = false) => {
    if (!accessToken) return
    if (!silent) setRefreshing(true)
    try {
      const headers: Record<string, string> = { 'Cache-Control': 'no-cache' }
      if (silent && !force && etagRef.current) headers['If-None-Match'] = etagRef.current

      const res = await fetch(`/api/public/orders/${orderId}?token=${encodeURIComponent(accessToken)}`, { headers })
      if (res.status === 304) {
        return
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Could not load order')
      }
      const newEtag = res.headers.get('ETag')
      if (newEtag) etagRef.current = newEtag

      const data = await res.json()
      setOrder(data)
      setError(null)
      if (data.fulfilment === 'SERVED' || data.fulfilment === 'CANCELLED') {
        try {
          localStorage.removeItem(`rp_active_order_${slug}`)
        } catch {}
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load order')
    } finally {
      setRefreshing(false)
    }
  }, [accessToken, orderId, slug])

  const handleClaimPoints = async () => {
    if (!order) return
    setClaiming(true)
    setClaimMsg(null)
    try {
      const res = await fetch('/api/public/loyalty/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      })
      const data = await res.json()
      if (res.ok) {
        setClaimMsg({ ok: true, text: data.message || `+${data.awarded} points claimed!` })
        fetchOrder(true, true)
      } else {
        setClaimMsg({ ok: false, text: data.error || 'Could not claim points' })
      }
    } catch {
      setClaimMsg({ ok: false, text: 'Failed to claim points' })
    } finally {
      setClaiming(false)
    }
  }

  // 1. Instant Real-time Server-Sent Events (SSE) Stream
  useEffect(() => {
    if (!accessToken || !orderId) return
    if (order && (order.fulfilment === 'SERVED' || order.fulfilment === 'CANCELLED')) return

    let es: EventSource | null = null
    try {
      es = new EventSource(`/api/public/orders/${orderId}/events?token=${encodeURIComponent(accessToken)}`)
      es.onopen = () => {
        sseActiveRef.current = true
      }
      es.onmessage = (event) => {
        try {
          if (!event.data || event.data.startsWith(':')) return
          const payload = JSON.parse(event.data)
          if (payload?.fulfilment) {
            setOrder((prev) =>
              prev
                ? {
                    ...prev,
                    fulfilment: payload.fulfilment,
                    paymentStatus: payload.paymentStatus || prev.paymentStatus,
                  }
                : prev
            )
            // Silently sync any additional metadata
            fetchOrder(true, true)
          }
        } catch {}
      }
      es.onerror = () => {
        sseActiveRef.current = false
        // Handled gracefully by fallback poller
        if (es) {
          es.close()
          es = null
        }
      }
    } catch {
      sseActiveRef.current = false
    }

    return () => {
      sseActiveRef.current = false
      if (es) es.close()
    }
  }, [accessToken, orderId, order?.fulfilment, fetchOrder])

  // 2. Adaptive Polling: 0-load when SSE is live, safe 8s fallback if SSE drops
  useEffect(() => {
    if (!accessToken) return
    fetchOrder()

    if (order && (order.fulfilment === 'SERVED' || order.fulfilment === 'CANCELLED')) {
      return
    }

    // Fallback interval (8s) only triggers when SSE connection drops
    const fallbackTimer = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        if (!sseActiveRef.current) {
          fetchOrder(true)
        }
      }
    }, 8000)

    // Gentle 30s heartbeat when active to ensure total state consistency
    const heartbeatTimer = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        fetchOrder(true)
      }
    }, 30000)

    const onVisible = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        fetchOrder(true, true)
      }
    }
    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('focus', onVisible)

    return () => {
      clearInterval(fallbackTimer)
      clearInterval(heartbeatTimer)
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('focus', onVisible)
    }
  }, [accessToken, fetchOrder, order?.fulfilment])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center space-y-3 text-stone-500">
          <Loader2 className="w-8 h-8 mx-auto animate-spin text-amber-600" />
          <p className="text-sm font-medium">Loading order…</p>
        </div>
      </div>
    )
  }

  if (!accessToken) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="max-w-sm text-center p-8 rounded-3xl bg-white border border-stone-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-300">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <p className="text-sm text-stone-600 leading-relaxed">This tracking link needs its access code. Please open it from the device used to order.</p>
          <Link href={`/order/${slug}`} className="text-sm text-amber-700 font-bold underline">Back to ordering</Link>
        </div>
      </div>
    )
  }

  if (error && !order) {
    return (
      <div className="min-h-screen bg-[#07030b] flex items-center justify-center p-4">
        <div className="max-w-sm text-center p-8 rounded-3xl bg-[#140b20] border border-[#2b1942] shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-300">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#f59e0b]/10 border border-[#f59e0b]/30 text-[#f59e0b] flex items-center justify-center">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <p className="text-sm text-[#9B92A6]">{error}</p>
          <button type="button" onClick={() => fetchOrder()} className="px-5 py-2.5 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-[#07030b] text-sm font-black cursor-pointer inline-flex items-center gap-1.5 transition-colors">
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#07030b] flex items-center justify-center">
        <div className="text-center space-y-3 text-[#9B92A6]">
          <Loader2 className="w-8 h-8 mx-auto animate-spin text-[#f59e0b]" />
          <p className="text-sm font-bold text-white">Loading order status…</p>
        </div>
      </div>
    )
  }

  const meta = STATUS_META[order.fulfilment] || STATUS_META.RECEIVED
  const steps = ['RECEIVED', 'ACCEPTED', 'PREPARING', 'READY', 'SERVED']
  const stepIdx = order.fulfilment === 'CANCELLED' ? -1 : steps.indexOf(order.fulfilment)
  const isCancelled = order.fulfilment === 'CANCELLED'
  const isServed = order.fulfilment === 'SERVED'

  return (
    <div className="min-h-screen bg-[#07030b] text-[#f5f5f5] pb-10">
      <header className="sticky top-0 z-20 bg-[#0c0615]/95 backdrop-blur border-b border-[#2b1942] px-3 py-2.5 shadow-2xs">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-[#f59e0b]/60 bg-black/80 shrink-0 p-0.5 shadow-xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="PM Zaika Restaurant" className="w-full h-full object-contain rounded-full" />
            </div>
            <div>
              <p className="font-heading font-black text-sm uppercase tracking-wider text-[#f59e0b] leading-none">
                PM ZAIKA RESTAURANT
              </p>
              <p className="font-script text-[11px] text-amber-200/80 leading-none mt-0.5">
                Royal Awadhi Dining
              </p>
            </div>
          </div>
          <Link
            href={`/order/${slug}/menu`}
            className="text-xs font-bold text-[#f59e0b] hover:text-[#fbbf24] px-3 py-1 rounded-xl bg-[#140b20] border border-[#2b1942] transition-colors"
          >
            Menu
          </Link>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-3 py-4 space-y-4">
        {/* Status Card */}
        <div className="p-6 rounded-3xl bg-[#140b20] border border-[#2b1942] shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
          <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center border-2 ${isCancelled ? 'bg-rose-500/10 border-rose-500/40 text-rose-400' : isServed ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 'bg-[#f59e0b]/10 border-[#f59e0b]/40 text-[#f59e0b]'}`}>
            {isCancelled ? <XCircle className="w-10 h-10" /> : isServed ? <PartyPopper className="w-10 h-10" /> : <CheckCircle2 className="w-10 h-10" />}
          </div>
          <h1 className="text-2xl font-black text-white">{isServed ? 'Enjoy Your Meal!' : isCancelled ? 'Order Cancelled' : 'Order Placed!'}</h1>
          <div className="flex items-center justify-center gap-2">
            <p className="text-3xl font-black tracking-wide text-[#f59e0b]">{order.orderNumber}</p>
            <button
              type="button"
              onClick={() => {
                if (typeof navigator !== 'undefined' && navigator.clipboard) {
                  navigator.clipboard.writeText(order.orderNumber).catch(() => {})
                }
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
              }}
              className="p-1.5 rounded-xl bg-[#0c0615] border border-[#2b1942] hover:bg-[#1f1133] text-[#9B92A6] hover:text-white cursor-pointer transition-colors"
              title="Copy Order ID"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          {copied && <p className="text-[11px] font-bold text-emerald-400 animate-in fade-in">Order ID copied to clipboard!</p>}
          {order.orderType === 'PARCEL' || isParcelLabel(order.tableLabel) ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 text-xs font-black mt-1">
              <Package className="w-3.5 h-3.5" />
              <span>Parcel Order (Takeaway)</span>
              {order.tableLabel && !isParcelLabel(order.tableLabel) && (
                <span className="text-emerald-200/80 font-semibold">• {formatTableDisplay(order.tableLabel)}</span>
              )}
            </div>
          ) : (
            order.tableLabel && (
              <p className="text-sm font-bold text-[#FDEBD3]">
                🍽️ {formatTableDisplay(order.tableLabel)}
              </p>
            )
          )}

          <div className={`p-4 rounded-2xl border flex items-center gap-3 text-left ${isCancelled ? 'bg-rose-950/40 border-rose-500/40' : 'bg-[#1b0d2e] border-[#f59e0b]/30'}`}>
            {isCancelled ? <XCircle className="w-5 h-5 text-rose-400 shrink-0" /> : <ChefHat className="w-5 h-5 text-[#f59e0b] shrink-0" />}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-extrabold text-white">{meta.label} {refreshing && <Loader2 className="inline w-3.5 h-3.5 animate-spin text-[#f59e0b]" />}</p>
              <p className="text-xs text-[#9B92A6]">{meta.hint}</p>
            </div>
          </div>

          {/* Loyalty: confirmation of points earned / reward applied / claim prompt */}
          {!isCancelled && (
            <div className={`p-4 rounded-2xl text-left space-y-2 border ${
              order.loyaltyAwarded
                ? 'bg-gradient-to-br from-[#122e1b] via-[#10241b] to-[#140b20] border-emerald-500/40 shadow-xs'
                : 'bg-gradient-to-r from-[#1b0a2b] via-[#2d1148] to-[#1b0a2b] border-[#f59e0b]/40'
            }`}>
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 shadow-xs ${
                  order.loyaltyAwarded ? 'bg-emerald-600 text-white' : 'bg-[#f59e0b] text-[#07030b]'
                }`}>
                  {order.loyaltyAwarded ? <PartyPopper className="w-4 h-4" /> : <Crown className="w-4 h-4 fill-current" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-black text-white flex items-center gap-1.5">
                      PM Zaika Royal Rewards
                    </p>
                    {order.loyaltyAwarded ? (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                        Credited
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/30">
                        Reserved
                      </span>
                    )}
                  </div>

                  {/* Reward discount note */}
                  {(order.loyaltyDiscountPaise ?? 0) > 0 && (
                    <p className="text-xs text-emerald-400 font-bold mt-1 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      {order.loyaltyRewardName ? (
                        <>Reward applied: <b>{order.loyaltyRewardName}</b> (saved {formatPaise(order.loyaltyDiscountPaise!)}).</>
                      ) : (
                        <>Royal Perk saved <b>{formatPaise(order.loyaltyDiscountPaise!)}</b> on this bill.</>
                      )}
                    </p>
                  )}

                  {/* Points earned / claim prompt */}
                  {order.loyaltyAwarded ? (
                    <div className="mt-1 space-y-1.5">
                      <p className="text-xs text-emerald-300 font-extrabold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        +{order.loyaltyPointsEarned} Royal points added to your loyalty balance!
                      </p>
                      <Link
                        href={`/order/${slug}/menu?vip=1${order.tableLabel ? `&table=${encodeURIComponent(order.tableLabel)}` : ''}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-[#07030b] text-xs font-black transition-all shadow-xs"
                      >
                        <Crown className="w-3.5 h-3.5" /> View Royal Pass &amp; Perks <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  ) : isServed ? (
                    <div className="mt-2 space-y-1.5">
                      {claimMsg && (
                        <p className={`text-xs font-bold ${claimMsg.ok ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {claimMsg.text}
                        </p>
                      )}
                      {loyaltyLoggedIn ? (
                        <button
                          type="button"
                          onClick={handleClaimPoints}
                          disabled={claiming}
                          className="px-3 py-1.5 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-[#07030b] text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
                        >
                          {claiming ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Star className="w-3.5 h-3.5" />}
                          Claim your loyalty points
                        </button>
                      ) : (
                        <Link
                          href={`/order/${slug}/menu?vip=1${order.tableLabel ? `&table=${encodeURIComponent(order.tableLabel)}` : ''}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#f59e0b] hover:text-[#fbbf24] underline"
                        >
                          Join or log in to collect your points <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  ) : (
                    <div className="mt-1 space-y-1">
                      <p className="text-xs text-[#9B92A6]">
                        You&apos;ll earn <b className="text-[#f59e0b] font-black">+{order.loyaltyPointsEarned || 20} Royal points</b> automatically once your food is served.{' '}
                        <Link
                          href={`/order/${slug}/menu?vip=1${order.tableLabel ? `&table=${encodeURIComponent(order.tableLabel)}` : ''}`}
                          className="text-[#f59e0b] font-bold hover:underline inline-flex items-center gap-0.5 ml-1"
                        >
                          View rewards club <ArrowRight className="w-3 h-3" />
                        </Link>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {isCancelled && order.cancellationReason && (
            <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-left space-y-1 animate-in fade-in duration-200">
              <p className="text-[11px] font-black uppercase tracking-wider text-rose-300">Reason for Cancellation</p>
              <p className="text-xs text-rose-200 font-semibold">{order.cancellationReason}</p>
            </div>
          )}

          {stepIdx >= 0 && (
            <div className="flex items-center justify-between px-1 pt-1" aria-label="Order progress">
              {steps.map((s, i) => (
                <div key={s} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="relative">
                    {i === stepIdx && !isServed && (
                      <span className="absolute -inset-1 rounded-full bg-[#f59e0b]/35 animate-ping pointer-events-none" />
                    )}
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-extrabold transition-all duration-300 relative ${
                      i < stepIdx
                        ? 'bg-emerald-500 text-[#07030b] shadow-xs'
                        : i === stepIdx
                        ? 'bg-[#f59e0b] text-[#07030b] shadow-md shadow-amber-500/40 ring-4 ring-amber-400/20 scale-110'
                        : 'bg-[#2b1942] text-[#6E6578]'
                    }`}>
                      {i < stepIdx ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                    </div>
                  </div>
                  <span className={`text-[9px] font-bold capitalize ${i === stepIdx ? 'text-[#f59e0b] font-extrabold' : i < stepIdx ? 'text-white' : 'text-[#6E6578]'}`}>{s.toLowerCase()}</span>
                </div>
              ))}
            </div>
          )}

          <button type="button" onClick={() => fetchOrder()} className="text-xs text-[#9B92A6] hover:text-white inline-flex items-center gap-1 cursor-pointer transition-colors">
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#f59e0b]' : ''}`} /> Refresh status
          </button>
        </div>

        {/* Guest Feedback & Rating Card */}
        <a
          href={`/r/${slug}?table=${encodeURIComponent(order.tableLabel || '')}`}
          className="block p-4 rounded-3xl bg-[#140b20] border border-[#2b1942] hover:border-[#f59e0b]/50 text-white transition-all shadow-md group"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#f59e0b]/10 border border-[#f59e0b]/30 text-[#f59e0b] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Star className="w-5 h-5 fill-[#f59e0b] text-[#f59e0b]" />
              </div>
              <div className="text-left">
                <p className="text-xs font-black text-white">How is everything tasting?</p>
                <p className="text-[11px] text-[#9B92A6]">Tap to rate your experience &amp; earn Royal perks</p>
              </div>
            </div>
            <div className="flex items-center gap-0.5 text-[#f59e0b] shrink-0">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#f59e0b]" />
              ))}
            </div>
          </div>
        </a>

        {/* Bill */}
        <div className="p-5 rounded-3xl bg-[#140b20] border border-[#2b1942] shadow-xl space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <h2 className="text-sm font-extrabold flex items-center gap-1.5 text-white"><Receipt className="w-4 h-4 text-[#f59e0b]" /> Bill Details</h2>
          {order.items.map((it, idx: number) => {
            const isFree = it.lineTotalPaise === 0 || it.itemName.toLowerCase().includes('reward')
            return (
              <div key={idx} className="text-sm">
                <div className="flex justify-between gap-2 items-center">
                  <span className={`text-[#e5e5e5] flex items-center gap-1.5 ${isFree ? 'font-semibold text-emerald-300' : ''}`}>
                    {isFree && <Gift className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                    {it.quantity} × {it.itemName}
                  </span>
                  <span className={`shrink-0 ${isFree ? 'font-black text-emerald-400 text-xs px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/40' : 'font-bold text-[#f59e0b]'}`}>
                    {it.lineTotalPaise === 0 ? 'FREE' : formatPaise(it.lineTotalPaise)}
                  </span>
                </div>
                {it.options && it.options.length > 0 && (
                  <p className="text-[11px] text-[#9B92A6] pl-2">{it.options.map((o) => o.optionName).join(', ')}</p>
                )}
              </div>
            )
          })}
          <div className="border-t border-[#2b1942] pt-3 space-y-1.5 text-sm">
            <div className="flex justify-between text-[#9B92A6]"><span>Subtotal</span><span className="text-white">{formatPaise(order.subtotalPaise)}</span></div>
            <div className="flex justify-between text-[#9B92A6]"><span>Tax</span><span className="text-white">{formatPaise(order.taxPaise)}</span></div>
            {order.chargePaise > 0 && <div className="flex justify-between text-[#9B92A6]"><span>Charges</span><span className="text-white">{formatPaise(order.chargePaise)}</span></div>}
            {(order.loyaltyDiscountPaise ?? 0) > 0 && (
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-[#f59e0b]" />
                  {order.loyaltyRewardName ? `Reward: ${order.loyaltyRewardName}` : 'Reward Discount'}
                </span>
                <span>−{formatPaise(order.loyaltyDiscountPaise!)}</span>
              </div>
            )}
            <div className="flex justify-between font-extrabold text-lg pt-1"><span className="text-white">Total</span><span className="text-[#f59e0b] font-black">{formatPaise(order.totalPaise)}</span></div>
            <p className="text-[11px] text-[#9B92A6]">Payment: {order.paymentStatus === 'PAID' ? 'Paid' : 'Pay at counter'} • {order.paymentInstructions}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <Link
            href={
              order.orderType === 'PARCEL' || isParcelLabel(order.tableLabel)
                ? `/order/${slug}/menu?table=Parcel`
                : `/order/${slug}/menu?table=${encodeURIComponent(order.tableLabel || '')}`
            }
            className="w-full h-12 rounded-2xl bg-[#f59e0b] hover:bg-[#d97706] text-[#07030b] text-xs font-black flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            {order.orderType === 'PARCEL' || isParcelLabel(order.tableLabel) ? (
              <><Package className="w-4 h-4 text-[#07030b]" /> Order More Dishes (Parcel)</>
            ) : (
              <><ChefHat className="w-4 h-4 text-[#07030b]" /> Order More Dishes ({order.tableLabel ? formatTableDisplay(order.tableLabel) : 'Dine-in'})</>
            )}
          </Link>
          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/r/${slug}?table=${encodeURIComponent(order.tableLabel || '')}`}
              className="h-11 rounded-2xl bg-[#140b20] border border-[#2b1942] hover:bg-[#1f1033] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <BellRing className="w-4 h-4 text-[#f59e0b]" /> Give Feedback
            </Link>
            {order.restaurantPhone ? (
              <a
                href={`tel:${order.restaurantPhone}`}
                className="h-11 rounded-2xl bg-[#140b20] border border-[#2b1942] hover:bg-[#1f1033] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-4 h-4 text-[#f59e0b]" /> Call Staff
              </a>
            ) : (
              <Link
                href={
                  order.orderType === 'PARCEL' || isParcelLabel(order.tableLabel)
                    ? `/order/${slug}/menu?table=Parcel`
                    : `/order/${slug}/menu?table=${encodeURIComponent(order.tableLabel || '')}`
                }
                className="h-11 rounded-2xl bg-[#140b20] border border-[#2b1942] hover:bg-[#1f1033] text-white text-xs font-bold flex items-center justify-center transition-colors"
              >
                Back to Menu
              </Link>
            )}
          </div>
        </div>
        <p className="text-[11px] text-[#6E6578] text-center">For changes or cancellation, please contact the restaurant counter.</p>
      </main>
    </div>
  )
}
