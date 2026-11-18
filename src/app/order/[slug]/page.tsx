import { Phone, AlertTriangle } from 'lucide-react'
import { getCampaignBySlug, getCampaigns } from '@/lib/firebase/firestore'
import { resolveTableToken, getOrderingConfig } from '@/lib/firebase/ordering'
import { hashToken } from '@/lib/ordering/tokens'
import { getRestaurantConfig } from '@/config/loader'
import { SplashPortalClient } from '@/components/ordering/SplashPortalClient'

interface PortalPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ token?: string; table?: string }>
}

export default async function OrderPortalPage({ params, searchParams }: PortalPageProps) {
  const { slug } = await params
  const { token, table: tableParam } = await searchParams
  const config = getRestaurantConfig()

  let campaign = await getCampaignBySlug(slug).catch(() => null)
  if (!campaign) {
    campaign = await getCampaignBySlug(config.slug).catch(() => null)
  }
  if (!campaign) {
    const all = await getCampaigns().catch(() => [])
    campaign = all.find((c) => c.active) || all[0] || null
  }
  // Graceful fallback for the restaurant: enable direct menu access even if Firestore campaign isn't seeded
  if (!campaign && (slug === config.slug || slug === 'pm-zaika' || slug === 'zaika')) {
    campaign = {
      id: 'default-pm-zaika',
      slug: config.slug,
      name: config.name,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as any
  }

  const fallbackCard = (title: string, body: string, tone: 'amber' | 'rose' = 'amber') => (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-[#0a0510] text-[#fbf7ee]"
    >
      <div
        className="w-full max-w-sm text-center p-8 rounded-3xl space-y-5 animate-in fade-in zoom-in-95 duration-300 bg-[#160d24]/90 border border-amber-500/30 shadow-2xl backdrop-blur-md"
      >
        <div
          className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center ${
            tone === 'rose'
              ? 'bg-rose-500/15 border border-rose-500/40 text-rose-400'
              : 'bg-amber-500/15 border border-amber-500/40 text-amber-300'
          }`}
        >
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-extrabold text-[#fdf8f0]">{title}</h1>
        <p className="text-sm leading-relaxed text-[#c7bdd6]">{body}</p>
        {config.contact.phone && (
          <a
            href={`tel:${config.contact.phone}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 hover:brightness-110 shadow-lg shadow-amber-500/20"
          >
            <Phone className="w-3.5 h-3.5" /> Call: {config.contact.phone}
          </a>
        )}
      </div>
    </div>
  )

  if (!campaign) {
    return fallbackCard(
      'Ordering Link Not Found',
      `This ordering code is not valid. Please ask the staff at ${config.name} for assistance.`,
      'rose'
    )
  }
  if (!campaign.active) {
    return fallbackCard(
      'Ordering Paused',
      `Ordering is currently paused for this link by ${config.name}. Please check with the staff.`
    )
  }

  let tableLabel: string | null = null
  if (token) {
    const resolved = await resolveTableToken(hashToken(token)).catch(() => null)
    if (!resolved && !tableParam) {
      return fallbackCard(
        'Table Code Expired',
        'This table QR is invalid or has been revoked. Please ask the staff for a fresh code.',
        'rose'
      )
    }
    if (resolved) {
      tableLabel = resolved.table.label
    }
  }

  if (!tableLabel && tableParam) {
    tableLabel = tableParam.replace(/^table\s*[-_]?/i, '').trim() || tableParam.trim()
  }

  if (!token && !tableParam) {
    const ordering = await getOrderingConfig().catch(() => null)
    if (ordering && !ordering.generalOrderingEnabled) {
      return fallbackCard(
        'Scan Your Table QR',
        'Please scan the QR code placed at your table to start ordering.',
        'rose'
      )
    }
  }

  // Build query string for menu page
  const menuQuery = new URLSearchParams()
  if (token) menuQuery.set('token', token)
  if (tableLabel) menuQuery.set('table', tableLabel)
  else if (tableParam) menuQuery.set('table', tableParam)
  const menuHref = `/order/${slug}/menu${menuQuery.toString() ? `?${menuQuery.toString()}` : ''}`

  // Show splash screen, then navigate to menu
  return <SplashPortalClient menuHref={menuHref} restaurantName={config.name} />
}
