'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  AlertTriangle,
  Star,
  X,
  BellRing,
  Phone,
  Sparkles,
  Loader2,
  MapPin,
  ChevronDown,
  ChevronRight,
  Crown,
} from 'lucide-react'
import { formatPaise, formatTableDisplay } from '@/lib/ordering/rules.mjs'
import { loadCart, saveCart, cartLineKey, getActiveOrderSession, type CartLine, type CartSelection, type ActiveSession } from '@/lib/ordering/cart'
import { ItemDetailModal, type MenuItem, type OptionGroup } from '@/components/ordering/ItemDetailModal'
import { TableSelectModal } from '@/components/ordering/TableSelectModal'
import { ServiceCallModal } from '@/components/ordering/ServiceCallModal'
import { VipOrdersHubModal, type CustomerPreviousOrder } from '@/components/ordering/VipOrdersHubModal'
import { MandalaBackground } from '@/components/ordering/MandalaBackground'
import { ZaikaCategorySection } from '@/components/ordering/ZaikaCategorySection'
import { ZaikaItemRow } from '@/components/ordering/ZaikaItemRow'
import { ZaikaCartBar } from '@/components/ordering/ZaikaCartBar'
import { ZaikaCategoryJump } from '@/components/ordering/ZaikaCategoryJump'
import { ChefSignaturesShowcase } from '@/components/ordering/ChefSignaturesShowcase'
import type { ChefSignatureItem } from '@/lib/ordering/foodImages'
import { ALL_SPECIAL_ITEMS_MAP } from '@/lib/ordering/specialMenuData'

function formatOrderDate(isoString: string): string {
  try {
    const d = new Date(isoString)
    if (isNaN(d.getTime())) return 'Recent order'
    const now = new Date()
    const isToday =
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    const isYesterday =
      d.getDate() === yesterday.getDate() &&
      d.getMonth() === yesterday.getMonth() &&
      d.getFullYear() === yesterday.getFullYear()

    const timeStr = d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })
    if (isToday) return `Today, ${timeStr}`
    if (isYesterday) return `Yesterday, ${timeStr}`
    return (
      d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) +
      `, ${timeStr}`
    )
  } catch {
    return 'Recent order'
  }
}

function formatDisplayPhone(phone?: string | null): string {
  if (!phone) return ''
  const digits = phone.replace(/\D/g, '').replace(/^91/, '').slice(-10)
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`
  }
  return phone.startsWith('+') ? phone : `+91 ${phone}`
}

export default function OrderMenuPage() {
  const params = useParams<{ slug: string }>()
  const searchParams = useSearchParams()
  const slug = params.slug
  const token = searchParams.get('token') || ''
  const tableParam = searchParams.get('table') || ''

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [items, setItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([])
  const [tableLabel, setTableLabel] = useState<string | null>(tableParam || null)
  const [restaurantName, setRestaurantName] = useState('')
  const [contactPhone, setContactPhone] = useState<string | null>(null)
  const [googleReviewUrl, setGoogleReviewUrl] = useState<string | null>(null)
  const [reviewSlug, setReviewSlug] = useState<string>('')
  const [dietFilter, setDietFilter] = useState<'all' | 'veg' | 'nonveg' | 'bestsellers'>('all')
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState<CartLine[]>(() => loadCart(slug, tableParam || null))
  const [cartOpen, setCartOpen] = useState(false)
  const [customizing, setCustomizing] = useState<MenuItem | null>(null)
  const [pendingSel, setPendingSel] = useState<CartSelection[]>([])
  const [staffMsg, setStaffMsg] = useState<string | null>(null)

  // Table Selection for Main QR
  const [availableTables, setAvailableTables] = useState<Array<{ id: string; label: string; state?: string }>>([])
  const [tableModalOpen, setTableModalOpen] = useState(false)
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null)

  // Service Request Modal
  const [serviceModalOpen, setServiceModalOpen] = useState(false)
  const [serviceType, setServiceType] = useState<string>('water')
  const [serviceNote, setServiceNote] = useState<string>('')
  const [serviceSending, setServiceSending] = useState(false)
  const [loyaltyCustomer, setLoyaltyCustomer] = useState<{ customerId: string; name?: string; phone: string } | null>(null)
  const [loyaltyPoints, setLoyaltyPoints] = useState<number | null>(null)
  const [previousOrders, setPreviousOrders] = useState<CustomerPreviousOrder[]>([])
  const [vipModalTab, setVipModalTab] = useState<'orders' | 'perks' | 'profile'>('orders')
  const [loyaltyRewards, setLoyaltyRewards] = useState<Array<{
    id: string
    name: string
    description?: string | null
    pointsCost: number
    discountPaise: number
    discountPctBps: number
    type: string
  }>>([])
  const [loyaltyModalOpen, setLoyaltyModalOpen] = useState(false)
  const [loginPhone, setLoginPhone] = useState('')
  const [loginName, setLoginName] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  useEffect(() => {
    setActiveSession(getActiveOrderSession(slug))
  }, [slug])

  const refreshLoyaltySummary = useCallback(async (phone?: string) => {
    const targetPhone = phone || loyaltyCustomer?.customerId
    if (!targetPhone) return
    try {
      const q = new URLSearchParams()
      q.set('phone', targetPhone)
      const res = await fetch(`/api/public/loyalty/summary?${q.toString()}`, { cache: 'no-store' })
      if (!res.ok) return
      const data = await res.json().catch(() => null)
      if (data) {
        if (data.snapshot?.availablePoints !== undefined) setLoyaltyPoints(data.snapshot.availablePoints)
        if (Array.isArray(data.orders)) setPreviousOrders(data.orders)
      }
    } catch {}
  }, [loyaltyCustomer?.customerId])

  const handlePhoneLogin = useCallback(async (overridePhone?: string, overrideName?: string) => {
    const raw = (overridePhone || loginPhone).replace(/\D/g, '').replace(/^91/, '').slice(-10)
    if (!/^[6-9]\d{9}$/.test(raw)) {
      setLoginError('Please enter a valid 10-digit Indian mobile number')
      return
    }
    setLoginLoading(true)
    setLoginError(null)
    try {
      const res = await fetch('/api/public/loyalty/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'phone-login', phone: raw, name: (overrideName || loginName).trim() || 'VIP Guest' }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Failed to sign in')
      setLoyaltyCustomer({
        customerId: data.customer.customerId,
        name: data.customer.name,
        phone: data.customer.phone || data.customer.customerId,
      })
      if (data.snapshot) setLoyaltyPoints(data.snapshot.availablePoints)
      if (Array.isArray(data.orders)) {
        setPreviousOrders(data.orders)
        if (data.orders.length > 0) {
          setVipModalTab('orders')
        } else {
          setVipModalTab('perks')
        }
      }
      try {
        localStorage.setItem('rp_customer_phone', data.customer.customerId)
        if (data.customer.name) localStorage.setItem('rp_customer_name', data.customer.name)
      } catch {}
      fetch('/api/public/loyalty/rewards')
        .then((r) => r.json())
        .then((d) => setLoyaltyRewards(d.rewards || []))
        .catch(() => {})
    } catch (e) {
      setLoginError(e instanceof Error ? e.message : 'Sign in failed')
    } finally {
      setLoginLoading(false)
    }
  }, [loginPhone, loginName])

  // Integrated Loyalty & VIP state
  useEffect(() => {
    fetch('/api/public/loyalty/auth', { cache: 'no-store' })
      .then(async (res) => {
        if (!res.ok) {
          if (typeof window !== 'undefined') {
            const savedPhone = localStorage.getItem('rp_customer_phone')
            if (!savedPhone && !sessionStorage.getItem('rp_skip_phone')) {
              setLoyaltyModalOpen(true)
            }
          }
          return
        }
        const data = await res.json().catch(() => null)
        if (data?.customer) {
          setLoyaltyCustomer({
            customerId: data.customer.customerId,
            name: data.customer.name,
            phone: data.customer.phone || data.customer.customerId,
          })
          if (data?.snapshot) setLoyaltyPoints(data.snapshot.availablePoints)
          if (Array.isArray(data.orders)) {
            setPreviousOrders(data.orders)
            if (data.orders.length > 0) {
              setVipModalTab('orders')
            }
          }
        } else if (typeof window !== 'undefined') {
          try {
            const savedPhone = localStorage.getItem('rp_customer_phone')
            const savedName = localStorage.getItem('rp_customer_name')
            if (savedPhone && /^[6-9]\d{9}$/.test(savedPhone)) {
              handlePhoneLogin(savedPhone, savedName || undefined)
            } else if (!sessionStorage.getItem('rp_skip_phone')) {
              setLoyaltyModalOpen(true)
            }
          } catch {
            setLoyaltyModalOpen(true)
          }
        }
      })
      .catch(() => {
        if (typeof window !== 'undefined') {
          const savedPhone = localStorage.getItem('rp_customer_phone')
          if (!savedPhone && !sessionStorage.getItem('rp_skip_phone')) {
            setLoyaltyModalOpen(true)
          }
        }
      })

    fetch('/api/public/loyalty/rewards')
      .then((r) => r.json())
      .then((d) => setLoyaltyRewards(d.rewards || []))
      .catch(() => {})
  }, [slug, handlePhoneLogin])

  useEffect(() => {
    if (searchParams.get('vip') === '1') {
      setLoyaltyModalOpen(true)
    }
  }, [searchParams])

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
        sessionStorage.removeItem('rp_skip_phone')
      } catch {}
    } catch {}
    setLoyaltyCustomer(null)
    setLoyaltyPoints(null)
    setPreviousOrders([])
    setLoginPhone('')
    setLoginName('')
    setLoginError(null)
    setVipModalTab('orders')
    setLoyaltyModalOpen(true)
  }

  useEffect(() => {
    const q = new URLSearchParams()
    q.set('slug', slug)
    if (token) q.set('token', token)
    if (tableParam) q.set('table', tableParam)
    fetch(`/api/public/order-menu?${q.toString()}`)
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Menu unavailable')
        setItems(data.items || [])
        setCategories(data.categories || [])
        setAvailableTables(data.tables || [])
        let resolvedTable = data.table?.label || tableParam || null
        if (!resolvedTable && typeof window !== 'undefined') {
          try {
            resolvedTable = sessionStorage.getItem(`rp_table_${slug}`) || null
          } catch {}
        }
        setTableLabel(resolvedTable)
        if (resolvedTable) {
          const tableSpecificCart = loadCart(slug, resolvedTable)
          setCart(tableSpecificCart)
        }
        setRestaurantName(data.restaurantName || '')
        setContactPhone(data.contactPhone || null)
        if (data.googleReviewUrl) setGoogleReviewUrl(data.googleReviewUrl)
        if (data.reviewSlug) setReviewSlug(data.reviewSlug)
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Menu unavailable'))
      .finally(() => setLoading(false))
  }, [slug, token, tableParam])

  const switchTable = (label: string, state?: string) => {
    const isOwnActive = activeSession?.tableLabel === label
    if (state === 'occupied' && !isOwnActive) return
    if (state === 'cleaning') return

    setTableLabel(label)
    setTableModalOpen(false)
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(`rp_table_${slug}`, label)
      } catch {}
    }
    const tableCart = loadCart(slug, label)
    setCart(tableCart)
  }

  const updateCart = (next: CartLine[]) => {
    setCart(next)
    saveCart(slug, next, tableLabel)
  }

  const addLine = (itemId: string, selections: CartSelection[]) => {
    const key = cartLineKey(itemId, selections)
    const found = cart.find((l) => l.key === key)
    if (found) {
      updateCart(cart.map((l) => (l.key === key ? { ...l, quantity: Math.min(20, l.quantity + 1) } : l)))
    } else {
      updateCart([...cart, { key, itemId, quantity: 1, selections }])
    }
  }

  const changeQty = (key: string, delta: number) => {
    updateCart(
      cart
        .map((l) => (l.key === key ? { ...l, quantity: l.quantity + delta } : l))
        .filter((l) => l.quantity > 0)
    )
  }

  const removeLine = (key: string) => updateCart(cart.filter((l) => l.key !== key))

  const handleReorder = (order: CustomerPreviousOrder) => {
    let addedCount = 0
    let nextCart = [...cart]

    for (const oi of order.items) {
      const matched = items.find(
        (m) =>
          (oi.itemId && m.id === oi.itemId) ||
          m.name.toLowerCase().trim() === oi.itemName.toLowerCase().trim()
      )

      if (matched && matched.available) {
        const selections = oi.selections || []
        const key = cartLineKey(matched.id, selections)
        const found = nextCart.find((l) => l.key === key)
        if (found) {
          nextCart = nextCart.map((l) =>
            l.key === key ? { ...l, quantity: Math.min(20, l.quantity + oi.quantity) } : l
          )
        } else {
          nextCart.push({
            key,
            itemId: matched.id,
            quantity: Math.min(20, oi.quantity),
            selections,
          })
        }
        addedCount += oi.quantity
      }
    }

    if (addedCount > 0) {
      updateCart(nextCart)
      setStaffMsg(`Added ${addedCount} dish${addedCount > 1 ? 'es' : ''} from #${order.orderNumber} to your cart!`)
      setTimeout(() => setStaffMsg(null), 3500)
      setLoyaltyModalOpen(false)
    } else {
      setStaffMsg("These items are currently unavailable on today's menu.")
      setTimeout(() => setStaffMsg(null), 3000)
    }
  }

  const getItemQtyInCart = (itemId: string): number => {
    return cart.filter((l) => l.itemId === itemId).reduce((sum, l) => sum + l.quantity, 0)
  }

  const handleQuickIncrement = (item: MenuItem) => {
    if (item.options && item.options.length > 0) {
      openCustomize(item)
    } else {
      addLine(item.id, [])
    }
  }

  const handleQuickDecrement = (itemId: string) => {
    const line = cart.find((l) => l.itemId === itemId)
    if (line) {
      changeQty(line.key, -1)
    }
  }

  const handleAddSignature = (dish: ChefSignatureItem) => {
    const dishNameNorm = dish.name.toLowerCase().replace(/[^a-z0-9]/g, '')
    const matched = items.find((m) => {
      const mNorm = m.name.toLowerCase().replace(/[^a-z0-9]/g, '')
      return mNorm.includes(dishNameNorm) || dishNameNorm.includes(mNorm)
    })
    if (matched) {
      handleQuickIncrement(matched)
    } else {
      addLine(dish.id, [])
    }
  }

  const handleDecrementSignature = (dishId: string, dishName: string) => {
    const dishNameNorm = dishName.toLowerCase().replace(/[^a-z0-9]/g, '')
    const matched = items.find((m) => {
      const mNorm = m.name.toLowerCase().replace(/[^a-z0-9]/g, '')
      return mNorm.includes(dishNameNorm) || dishNameNorm.includes(mNorm)
    })
    if (matched) {
      handleQuickDecrement(matched.id)
    } else {
      const line = cart.find((l) => l.itemId === dishId)
      if (line) {
        changeQty(line.key, -1)
      }
    }
  }

  const getSignatureQty = (dishId: string, dishName: string): number => {
    const dishNameNorm = dishName.toLowerCase().replace(/[^a-z0-9]/g, '')
    const matched = items.find((m) => {
      const mNorm = m.name.toLowerCase().replace(/[^a-z0-9]/g, '')
      return mNorm.includes(dishNameNorm) || dishNameNorm.includes(mNorm)
    })
    if (matched) {
      return getItemQtyInCart(matched.id)
    }
    const line = cart.find((l) => l.itemId === dishId)
    return line ? line.quantity : 0
  }

  const itemById = useMemo(() => new Map(items.map((i) => [i.id, i])), [items])

  const cartCount = cart.reduce((s, l) => s + l.quantity, 0)
  const cartEstimate = cart.reduce((s, l) => {
    const item = itemById.get(l.itemId)
    if (!item) {
      const special = ALL_SPECIAL_ITEMS_MAP.get(l.itemId)
      return special ? s + special.pricePaise * l.quantity : s
    }
    const opts = l.selections.reduce((sum, sel) => {
      const g = item.options.find((grp) => grp.id === sel.groupId)
      const c = g?.choices.find((ch) => ch.id === sel.optionId)
      return sum + (c?.pricePaise || 0)
    }, 0)
    return s + (item.pricePaise + opts) * l.quantity
  }, 0)

  const openCustomize = (item: MenuItem) => {
    if (!item.available) return
    if (!item.options || item.options.length === 0) {
      addLine(item.id, [])
      return
    }
    setCustomizing(item)
    const defaults: CartSelection[] = []
    for (const g of item.options) {
      if (g.type === 'single' && g.required && g.choices.length > 0) {
        defaults.push({ groupId: g.id, optionId: g.choices[0].id })
      }
    }
    setPendingSel(defaults)
  }

  const togglePending = (group: OptionGroup, optionId: string) => {
    if (group.type === 'single') {
      setPendingSel([...pendingSel.filter((s) => s.groupId !== group.id), { groupId: group.id, optionId }])
    } else {
      const has = pendingSel.some((s) => s.groupId === group.id && s.optionId === optionId)
      if (has) {
        setPendingSel(pendingSel.filter((s) => !(s.groupId === group.id && s.optionId === optionId)))
      } else {
        const count = pendingSel.filter((s) => s.groupId === group.id).length
        if (count >= group.max) return
        setPendingSel([...pendingSel, { groupId: group.id, optionId }])
      }
    }
  }

  const pendingValid = (item: MenuItem) => {
    for (const g of item.options) {
      const count = pendingSel.filter((s) => s.groupId === g.id).length
      if (g.required && count === 0) return false
      if (count < g.min || count > g.max) return false
    }
    return true
  }

  const currentCustomizingTotal = useMemo(() => {
    if (!customizing) return 0
    const optsPrice = pendingSel.reduce((sum, s) => {
      const g = customizing.options.find((grp) => grp.id === s.groupId)
      const c = g?.choices.find((ch) => ch.id === s.optionId)
      return sum + (c?.pricePaise || 0)
    }, 0)
    return customizing.pricePaise + optsPrice
  }, [customizing, pendingSel])

  // Group items by category in a strict top-down structure
  const categorizedSections = useMemo(() => {
    const list: Array<{ id: string; name: string; items: MenuItem[] }> = []

    const filterItem = (i: MenuItem) => {
      if (
        search.trim() &&
        !i.name.toLowerCase().includes(search.toLowerCase()) &&
        !(i.description || '').toLowerCase().includes(search.toLowerCase())
      ) {
        return false
      }
      if (dietFilter === 'veg' && i.veg !== 'veg') return false
      if (dietFilter === 'nonveg' && i.veg !== 'nonveg' && i.veg !== 'egg') return false
      if (dietFilter === 'bestsellers' && !i.featured) return false
      return true
    }

    if (categories && categories.length > 0) {
      for (const cat of categories) {
        const catItems = items.filter((i) => i.categoryId === cat.id && filterItem(i))
        if (catItems.length > 0 || !search.trim()) {
          list.push({ id: cat.id, name: cat.name, items: catItems })
        }
      }
      // Check for items with unknown or missing categoryId
      const uncatItems = items.filter((i) => (!i.categoryId || !categories.some((c) => c.id === i.categoryId)) && filterItem(i))
      if (uncatItems.length > 0) {
        list.push({ id: 'more-dishes', name: 'MORE DISHES', items: uncatItems })
      }
    } else {
      // Fallback: group items dynamically by categoryId or default
      const grouped = new Map<string, MenuItem[]>()
      for (const i of items.filter(filterItem)) {
        const key = i.categoryId || 'menu'
        if (!grouped.has(key)) grouped.set(key, [])
        grouped.get(key)!.push(i)
      }
      for (const [key, val] of grouped.entries()) {
        list.push({ id: key, name: key.replace(/[-_]/g, ' ').toUpperCase(), items: val })
      }
    }

    return list
  }, [categories, items, search, dietFilter])

  const submitServiceRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setServiceSending(true)
    try {
      const res = await fetch('/api/public/service-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          tableToken: token || undefined,
          tableLabel: tableLabel || undefined,
          type: serviceType,
          note: serviceNote.trim() || undefined,
        }),
      })
      if (res.ok) {
        setServiceModalOpen(false)
        setServiceNote('')
        setStaffMsg('Staff notified — someone will be with you shortly.')
      } else {
        const d = await res.json().catch(() => ({}))
        setStaffMsg(d.error || 'Could not reach staff. Please call the counter.')
      }
    } catch {
      setStaffMsg('Connection error. Please call the counter.')
    } finally {
      setServiceSending(false)
      setTimeout(() => setStaffMsg(null), 3500)
    }
  }

  if (loading) {
    return (
      <div
        className="min-h-screen pb-28 relative"
        style={{ background: 'linear-gradient(175deg, #1c1426 0%, #150e1f 45%, #0e0815 100%)' }}
      >
        <MandalaBackground />
        <header className="sticky top-0 z-20 px-3 py-3 backdrop-blur-md border-b border-[rgba(245,166,35,0.2)] bg-[#181022]/90">
          <div className="flex items-center justify-between gap-2 max-w-2xl mx-auto">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full border border-[#d4a234] flex items-center justify-center bg-[#1f2041] p-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.svg" alt="PM Zaika" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-heading font-black text-sm text-[#f0c14b] uppercase tracking-wider block">
                  PM ZAIKA RESTAURANT
                </span>
                <span className="font-script text-[11px] text-[#d4a234] block">
                  Indian ‖ Chinese ‖ Tandoor ‖ Rolls
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#d4a234] font-bold bg-[#d4a234]/10 border border-[#d4a234]/30 px-3 py-1 rounded-full animate-pulse">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Loading Menu...</span>
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-3 py-6 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-[rgba(212,162,52,0.15)] bg-[#1f2041]/60 space-y-3 animate-pulse"
            >
              <div className="h-4 w-32 rounded bg-[#d4a234]/20" />
              <div className="h-3 w-full rounded bg-[#d4a234]/10" />
              <div className="h-3 w-3/4 rounded bg-[#d4a234]/10" />
            </div>
          ))}
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4 relative"
        style={{ background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)' }}
      >
        <MandalaBackground />
        <div
          className="max-w-sm text-center p-8 rounded-3xl space-y-4 relative z-10"
          style={{
            background: 'rgba(31, 32, 65, 0.9)',
            border: '1px solid rgba(212, 162, 52, 0.3)',
            boxShadow: '0 4px 40px rgba(0,0,0,0.5)',
          }}
        >
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#d4a234]/10 border border-[#d4a234]/30 text-[#d4a234] flex items-center justify-center">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-[#f5f5f0]">Menu Unavailable</h2>
          <p className="text-xs text-[#a0a0b8]">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="w-full h-11 rounded-xl text-black font-bold text-xs cursor-pointer transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg, #f0c14b, #d4a234)' }}
          >
            Retry Loading
          </button>
        </div>
      </div>
    )
  }

  const checkoutParams = new URLSearchParams()
  if (token) checkoutParams.set('token', token)
  if (tableLabel) checkoutParams.set('table', tableLabel)
  const checkoutHref = `/order/${slug}/checkout${checkoutParams.toString() ? `?${checkoutParams.toString()}` : ''}`

  return (
    <div
      className="min-h-screen text-[#f5f5f0] pb-28 relative overflow-x-hidden"
      style={{ background: 'linear-gradient(175deg, #1c1426 0%, #150e1f 45%, #0e0815 100%)' }}
    >
      {/* Ornamental Mandala Background Layer */}
      <MandalaBackground />

      {/* Sticky Header with PM Zaika Identity */}
      <header className="sticky top-0 z-30 backdrop-blur-md border-b border-amber-500/25 bg-[#170e24]/95 px-3 py-2.5 space-y-2.5 shadow-xl">
        <div className="flex items-center gap-2.5 max-w-2xl mx-auto">
          {/* PM Zaika Logo Emblem */}
          <div className="w-10 h-10 rounded-full border-2 border-amber-400/60 shadow-md shrink-0 bg-[#1b1028] flex items-center justify-center p-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.svg"
              alt={restaurantName || 'PM Zaika Restaurant'}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.src = '/logo.png'
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="font-heading font-black text-sm sm:text-base truncate flex items-center gap-1.5 leading-tight uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#ffe49e] via-[#f7d77a] to-[#d4af37]">
              <span>{restaurantName || 'PM ZAIKA RESTAURANT'}</span>
            </h1>
            <span className="font-script text-[11px] text-amber-200/90 font-normal leading-none block -mt-0.5">
              Indian ‖ Chinese ‖ Tandoor ‖ Rolls
            </span>
            {token ? (
              <p className="text-[11px] font-semibold text-amber-300 flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                {formatTableDisplay(tableLabel)} • Dine-in
              </p>
            ) : (
              <button
                type="button"
                onClick={() => setTableModalOpen(true)}
                className="mt-0.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-[11px] font-bold text-amber-200 cursor-pointer transition-all shadow-xs active:scale-95"
              >
                <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                <span>{tableLabel ? formatTableDisplay(tableLabel) : 'Choose Table'}</span>
                <ChevronDown className="w-3 h-3 text-amber-400 shrink-0" />
              </button>
            )}
          </div>

          {contactPhone && (
            <a
              href={`tel:${contactPhone}`}
              className="p-2 rounded-xl bg-white/5 text-amber-300 border border-amber-400/30 hover:bg-white/10 transition-colors"
              aria-label="Call restaurant"
            >
              <Phone className="w-4 h-4" />
            </a>
          )}

          <button
            type="button"
            onClick={() => setLoyaltyModalOpen(true)}
            className="px-2.5 py-1.5 rounded-xl bg-amber-400/10 text-amber-300 border border-amber-400/30 hover:bg-amber-400/20 transition-all flex items-center gap-1.5 shadow-xs shrink-0 cursor-pointer"
            aria-label="Loyalty and rewards"
            title="VIP Club"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30 shrink-0" />
            {loyaltyPoints === null ? (
              <span className="text-[11px] font-black tracking-tight">VIP</span>
            ) : (
              <span className="text-[11px] font-black flex items-center gap-0.5">
                <span>{loyaltyPoints}</span>
                <span className="text-[9px] uppercase">pts</span>
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setServiceModalOpen(true)}
            className="p-2 rounded-xl bg-amber-400/10 text-amber-300 border border-amber-400/30 hover:bg-amber-400/20 transition-colors flex items-center gap-1 cursor-pointer"
            aria-label="Call staff"
            title="Call staff"
          >
            <BellRing className="w-4 h-4" />
            <span className="text-[11px] font-bold hidden sm:inline">Call Staff</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-300/60" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search soup, paneer, chicken, biryani, tandoori…"
            className="w-full h-10 pl-9 pr-9 rounded-xl bg-[#140b1e]/90 border border-amber-500/30 text-xs focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all text-[#f7f2ea] placeholder:text-amber-200/40 shadow-inner"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-amber-300/70 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dietary Quick-Filter Pills (All, Veg, NonVeg, Specials) */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-2xl mx-auto no-scrollbar scrollbar-hide py-0.5">
          <button
            type="button"
            onClick={() => setDietFilter('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-all active:scale-95 flex items-center gap-1 shadow-xs ${
              dietFilter === 'all'
                ? 'bg-gradient-to-r from-[#d4af37] to-[#f6d77a] text-[#120816] font-black shadow-md shadow-amber-500/20'
                : 'bg-[#180e24]/80 text-amber-200/70 hover:text-amber-100 border border-amber-500/25'
            }`}
          >
            <span>All Dishes</span>
          </button>
          <button
            type="button"
            onClick={() => setDietFilter('veg')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-all active:scale-95 flex items-center gap-1.5 shadow-xs ${
              dietFilter === 'veg'
                ? 'bg-emerald-600 text-white font-black shadow-md shadow-emerald-600/30'
                : 'bg-[#180e24]/80 text-emerald-400 border border-emerald-500/35 hover:bg-emerald-950/40'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Pure Veg</span>
          </button>
          <button
            type="button"
            onClick={() => setDietFilter('nonveg')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-all active:scale-95 flex items-center gap-1.5 shadow-xs ${
              dietFilter === 'nonveg'
                ? 'bg-rose-700 text-white font-black shadow-md shadow-rose-700/30'
                : 'bg-[#180e24]/80 text-rose-400 border border-rose-500/35 hover:bg-rose-950/40'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            <span>Non-Veg</span>
          </button>
          <button
            type="button"
            onClick={() => setDietFilter('bestsellers')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-all active:scale-95 flex items-center gap-1 shadow-xs ${
              dietFilter === 'bestsellers'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-[#120816] font-black shadow-md shadow-amber-400/25'
                : 'bg-[#180e24]/80 text-amber-300 border border-amber-400/35 hover:bg-amber-950/40'
            }`}
          >
            <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
            <span>Specials</span>
          </button>
        </div>
      </header>

      {/* Staff Toast Message */}
      {staffMsg && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-40 px-5 py-2.5 rounded-full bg-[#180e24] text-amber-300 text-xs font-bold shadow-2xl border border-amber-500/50 animate-in fade-in slide-in-from-top-3 duration-200 flex items-center gap-2">
          <BellRing className="w-4 h-4 text-amber-400" />
          <span>{staffMsg}</span>
        </div>
      )}

      {/* Main Content: TOP-DOWN SCROLL OF ALL CATEGORIES */}
      <main className="max-w-2xl mx-auto px-3 py-4 space-y-2 relative z-10">
        {/* Active Dining Session Banner if customer already placed an order */}
        {activeSession && (
          <div className="p-3.5 rounded-2xl bg-[#180e24]/90 border border-amber-500/40 text-left space-y-1.5 shadow-md mb-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <span>Active Dine-in Order at {formatTableDisplay(activeSession.tableLabel)}</span>
              </span>
              <span className="text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                Cooking
              </span>
            </div>
            <p className="text-[11px] text-amber-200/70">
              Your order has been sent to the kitchen. You can track live status or add more dishes below.
            </p>
            <div className="pt-0.5">
              <Link
                href={`/order/${slug}/confirmation/${activeSession.orderId}?accessToken=${encodeURIComponent(
                  activeSession.accessToken || ''
                )}`}
                className="inline-flex items-center gap-1 text-xs font-bold text-amber-300 hover:underline"
              >
                <span>Track Live Order &amp; Kitchen Status →</span>
              </Link>
            </div>
          </div>
        )}

        {/* Curated Chef's Royal Signatures Showcase (Appetizing photo cards) */}
        {!search && dietFilter === 'all' && (
          <ChefSignaturesShowcase
            getItemQty={getSignatureQty}
            onAdd={handleAddSignature}
            onDecrement={handleDecrementSignature}
          />
        )}

        {/* Empty state when search yields no matches */}
        {categorizedSections.length === 0 && (
          <div className="p-10 text-center text-sm text-amber-200/70 bg-[#170e24]/90 rounded-2xl border border-amber-500/25 space-y-2 my-6">
            <Search className="w-8 h-8 mx-auto text-amber-400/50" />
            <p className="font-semibold text-[#f5f0e8]">No dishes match your search.</p>
            <button
              type="button"
              onClick={() => {
                setSearch('')
                setDietFilter('all')
              }}
              className="text-xs text-amber-300 font-bold hover:underline"
            >
              Clear search &amp; show full menu
            </button>
          </div>
        )}

        {/* THE WHOLE MENU IN TOP-DOWN APPROACH (NO BUTTON WAY) */}
        {categorizedSections.map((section, sIdx) => {
          if (section.items.length === 0) return null
          return (
            <ZaikaCategorySection
              key={section.id}
              id={section.id}
              name={section.name}
              animationDelay={sIdx * 40}
            >
              {section.items.map((item, itemIdx) => (
                <ZaikaItemRow
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  description={item.description}
                  pricePaise={item.pricePaise}
                  veg={item.veg}
                  available={item.available}
                  imageUrl={item.imageUrl}
                  quantity={getItemQtyInCart(item.id)}
                  hasOptions={Boolean(item.options && item.options.length > 0)}
                  isLast={itemIdx === section.items.length - 1}
                  categoryId={section.id}
                  onAdd={() => handleQuickIncrement(item)}
                  onDecrement={() => handleQuickDecrement(item.id)}
                  onOpenDetail={() => openCustomize(item)}
                />
              ))}
            </ZaikaCategorySection>
          )
        })}

        {/* Subtle Guest Feedback / Google Review Card */}
        <div className="pt-4 pb-6">
          <Link
            href={reviewSlug ? `/r/${reviewSlug}` : `/r/${slug}`}
            className="block p-3.5 rounded-2xl bg-[#170e24]/90 border border-amber-500/30 hover:border-amber-400 text-[#f5f0e8] transition-all shadow-md"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-400/15 border border-amber-400/30 text-amber-300 flex items-center justify-center shrink-0">
                  <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-black text-amber-100">Enjoying your dining at PM Zaika?</p>
                  <p className="text-[11px] text-amber-200/60">Rate your experience &amp; share feedback</p>
                </div>
              </div>
              <div className="flex items-center gap-0.5 text-amber-300 shrink-0">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-300" />
                ))}
              </div>
            </div>
          </Link>
        </div>
      </main>

      {/* Floating Quick Category Jump FAB */}
      {categories.length > 0 && <ZaikaCategoryJump categories={categories} />}

      {/* Bottom Sticky Cart Summary Bar */}
      <ZaikaCartBar
        itemCount={cartCount}
        totalPaise={cartEstimate}
        checkoutHref={checkoutHref}
        onViewCart={() => setCartOpen(true)}
      />

      {/* Cart Drawer / Bottom Sheet */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={() => setCartOpen(false)}
          />

          <div
            className="relative z-10 w-full max-w-lg max-h-[85vh] rounded-t-3xl sm:rounded-3xl p-5 overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-200"
            style={{
              background: 'linear-gradient(180deg, #1b0f2a 0%, #12081a 100%)',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              color: '#f5f0e8',
            }}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
              <div>
                <h3 className="text-base font-black flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-[#ffe49e] via-[#f7d77a] to-[#d4af37] uppercase tracking-wide">
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                  <span>Your Order Tray</span>
                </h3>
                <p className="text-[11px] text-amber-200/60">
                  {tableLabel ? `${formatTableDisplay(tableLabel)} • Dine-in` : 'Dine-in Order'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/15 transition-colors text-amber-200 cursor-pointer"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Empty Tray State */}
            {cart.length === 0 && (
              <div className="text-center py-12 space-y-2">
                <ShoppingBag className="w-10 h-10 mx-auto text-amber-400/40" />
                <p className="text-sm font-semibold text-amber-200/60">Your tray is empty.</p>
              </div>
            )}

            {/* Cart Lines */}
            <div className="space-y-2.5 divide-y divide-amber-500/10 overflow-y-auto flex-1 my-3 pr-1">
              {cart.map((line) => {
                const item = itemById.get(line.itemId)
                if (!item) return null
                const optTotal = line.selections.reduce((sum, sel) => {
                  const g = item.options.find((grp) => grp.id === sel.groupId)
                  const c = g?.choices.find((ch) => ch.id === sel.optionId)
                  return sum + (c?.pricePaise || 0)
                }, 0)
                const lineTotal = (item.pricePaise + optTotal) * line.quantity

                return (
                  <div key={line.key} className="pt-2.5 first:pt-0 flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#f5f0e8] truncate">{item.name}</p>
                      {line.selections.length > 0 && (
                        <p className="text-[11px] text-amber-200/50 truncate">
                          {line.selections
                            .map((s) =>
                              item.options.find((g) => g.id === s.groupId)?.choices.find((c) => c.id === s.optionId)?.name
                            )
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                      )}
                      <p className="text-xs font-black text-amber-300 mt-0.5">{formatPaise(lineTotal)}</p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 bg-[#241335] p-1 rounded-xl border border-amber-500/25">
                      <button
                        type="button"
                        onClick={() => changeQty(line.key, -1)}
                        className="w-7 h-7 rounded-lg bg-[#180e24] flex items-center justify-center cursor-pointer hover:bg-[#2e1844] active:scale-95 transition-all text-amber-300"
                        aria-label="Decrease"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-black w-6 text-center text-amber-300">{line.quantity}</span>
                      <button
                        type="button"
                        onClick={() => changeQty(line.key, 1)}
                        className="w-7 h-7 rounded-lg bg-[#180e24] flex items-center justify-center cursor-pointer hover:bg-[#2e1844] active:scale-95 transition-all text-amber-300"
                        aria-label="Increase"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeLine(line.key)}
                        className="w-7 h-7 rounded-lg text-rose-400 hover:bg-rose-500/20 flex items-center justify-center cursor-pointer active:scale-95 transition-all ml-1"
                        aria-label="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="pt-3 space-y-2.5 border-t border-amber-500/20">
                <div className="flex justify-between items-center text-xs text-amber-200/70">
                  <span>Estimated Subtotal</span>
                  <span className="font-extrabold text-sm text-amber-300 font-serif">{formatPaise(cartEstimate)}</span>
                </div>

                <Link
                  href={checkoutHref}
                  className="w-full h-12 rounded-xl text-[#140b00] font-black text-center leading-[3rem] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg"
                  style={{
                    background: 'linear-gradient(90deg, #bf8d2c 0%, #f6d47b 35%, #eed48f 65%, #a6741b 100%)',
                    boxShadow: '0 4px 20px rgba(212, 175, 55, 0.4)',
                  }}
                  onClick={() => setCartOpen(false)}
                >
                  <span>Proceed to Table Checkout</span>
                  <span>•</span>
                  <span>{formatPaise(cartEstimate)}</span>
                </Link>
                <p className="text-[10px] text-amber-200/50 text-center">
                  Taxes (GST 5%) applied at checkout. Pay at counter upon ordering.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Customization Modal */}
      <ItemDetailModal
        item={customizing}
        onClose={() => setCustomizing(null)}
        pendingSelections={pendingSel}
        onTogglePending={togglePending}
        isValid={customizing ? pendingValid(customizing) : false}
        currentTotalPaise={currentCustomizingTotal}
        onAddToCart={addLine}
      />

      {/* Table Selection Modal */}
      <TableSelectModal
        isOpen={tableModalOpen}
        onClose={() => setTableModalOpen(false)}
        tableLabel={tableLabel}
        availableTables={availableTables}
        activeSession={activeSession}
        onSelectTable={(label, state) => switchTable(label, state)}
      />

      {/* Call Staff / Service Request Modal */}
      <ServiceCallModal
        isOpen={serviceModalOpen}
        onClose={() => setServiceModalOpen(false)}
        tableLabel={tableLabel}
        serviceType={serviceType}
        setServiceType={setServiceType}
        serviceNote={serviceNote}
        setServiceNote={setServiceNote}
        serviceSending={serviceSending}
        onSubmit={submitServiceRequest}
      />

      {/* VIP Club & Orders Hub Modal */}
      <VipOrdersHubModal
        isOpen={loyaltyModalOpen}
        onClose={() => setLoyaltyModalOpen(false)}
        loyaltyCustomer={loyaltyCustomer}
        loyaltyPoints={loyaltyPoints}
        previousOrders={previousOrders}
        vipModalTab={vipModalTab}
        setVipModalTab={setVipModalTab}
        loyaltyRewards={loyaltyRewards}
        loginPhone={loginPhone}
        setLoginPhone={setLoginPhone}
        loginName={loginName}
        setLoginName={setLoginName}
        loginLoading={loginLoading}
        loginError={loginError}
        handlePhoneLogin={handlePhoneLogin}
        handleLogout={handleLogout}
        handleReorder={handleReorder}
        formatDisplayPhone={formatDisplayPhone}
        formatOrderDate={formatOrderDate}
      />
    </div>
  )
}
