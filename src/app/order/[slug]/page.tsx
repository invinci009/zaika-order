import { Phone, AlertTriangle } from 'lucide-react'
import { getCampaignBySlug } from '@/lib/firebase/firestore'
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

  const campaign = await getCampaignBySlug(slug).catch(() => null)

  const fallbackCard = (title: string, body: string, tone: 'amber' | 'rose' = 'amber') => (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)' }}
    >
      <div
        className="w-full max-w-sm text-center p-8 rounded-3xl space-y-5 animate-in fade-in zoom-in-95 duration-300"
        style={{
          background: 'rgba(31, 32, 65, 0.9)',
          border: '1px solid rgba(212, 162, 52, 0.3)',
          boxShadow: '0 4px 40px rgba(0,0,0,0.5)',
        }}
      >
        <div
          className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center`}
          style={{
            background: tone === 'rose' ? 'rgba(229, 57, 53, 0.1)' : 'rgba(212, 162, 52, 0.1)',
            border: `1px solid ${tone === 'rose' ? 'rgba(229,57,53,0.3)' : 'rgba(212,162,52,0.3)'}`,
            color: tone === 'rose' ? '#e53935' : '#d4a234',
          }}
        >
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-extrabold" style={{ color: '#f5f5f0' }}>{title}</h1>
        <p className="text-sm leading-relaxed" style={{ color: '#a0a0b8' }}>{body}</p>
        {config.contact.phone && (
          <a
            href={`tel:${config.contact.phone}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-colors"
            style={{
              background: 'rgba(212, 162, 52, 0.1)',
              border: '1px solid rgba(212, 162, 52, 0.3)',
              color: '#d4a234',
            }}
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
