import { NextRequest, NextResponse } from 'next/server'
import { getCampaigns, getRestaurantSettings } from '@/lib/firebase/firestore'
import {
  getOrderMenuCategories,
  getOrderMenuItems,
  getOrderingConfig,
  resolveTableToken,
  getTables,
  normalizeTableLabel,
  ensureMenuCachesFresh,
  type OrderMenuItem,
  type OrderMenuCategory,
  type OrderingConfig,
  type DiningTable,
} from '@/lib/firebase/ordering'
import { hashToken } from '@/lib/ordering/tokens'
import { getRestaurantConfig } from '@/config/loader'
import { normalizeImageUrl } from '@/lib/ordering/validation'

function computeMenuCatalogEtag(
  items: OrderMenuItem[],
  categories: OrderMenuCategory[],
  ordering: OrderingConfig,
  updatedAt: string | undefined,
  tables: DiningTable[],
  tableId: string | null
): string {
  let sig = `${categories.length}:${items.length}:${ordering.updatedAt}:${updatedAt || '0'}:${tableId || ''}`
  for (let i = 0; i < items.length; i++) {
    const it = items[i]
    sig += `|${it.id}:${it.pricePaise}:${it.available ? 1 : 0}:${it.visible ? 1 : 0}:${it.imageUrl || ''}:${it.updatedAt || ''}`
  }
  for (let i = 0; i < tables.length; i++) {
    const t = tables[i]
    sig += `|t:${t.id}:${t.active ? 1 : 0}:${t.state || ''}`
  }
  let hash = 5381
  for (let i = 0; i < sig.length; i++) {
    hash = (hash * 33) ^ sig.charCodeAt(i)
  }
  return `W/"menu-${(hash >>> 0).toString(36)}-${items.length}"`
}

// GET /api/public/order-menu?slug=...&token=...
// Public menu: only visible items (availability flagged for sold-out labels).
// Prices here are authoritative; checkout revalidates server-side.
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = (searchParams.get('slug') || '').trim().toLowerCase()
    const token = searchParams.get('token')

    const config = getRestaurantConfig()
    const allCampaigns = await getCampaigns().catch(() => [])
    const defaultSlug = config.slug.toLowerCase()
    let campaign =
      allCampaigns.find((c) => c.slug.toLowerCase() === slug && c.active) ||
      allCampaigns.find((c) => c.slug.toLowerCase() === defaultSlug && c.active) ||
      allCampaigns.find((c) => c.active) ||
      null

    if (!campaign && (slug === defaultSlug || slug === 'pm-zaika' || slug === 'zaika' || slug === 'order')) {
      campaign = {
        id: 'default-pm-zaika',
        slug: config.slug,
        name: config.name,
        active: true,
        createdAt: '',
        updatedAt: '',
      } as typeof allCampaigns[number]
    }
    if (!campaign || !campaign.active) {
      return NextResponse.json({ error: 'Ordering is not available for this link' }, { status: 404 })
    }

    await ensureMenuCachesFresh().catch(() => {})
    const [categories, items, ordering, settings, diningTables] = await Promise.all([
      getOrderMenuCategories().catch(() => []),
      getOrderMenuItems().catch(() => []),
      getOrderingConfig().catch(() => ({
        taxRateBps: 500,
        serviceChargePaise: 0,
        currency: 'INR' as const,
        generalOrderingEnabled: true,
        updatedAt: '',
      })),
      getRestaurantSettings().catch(() => null),
      getTables(true).catch(() => []),
    ])

    const tableParam = searchParams.get('table')
    let table: { id: string; label: string; state?: string } | null = null
    if (token) {
      const resolved = await resolveTableToken(hashToken(token))
      if (!resolved && !tableParam) return NextResponse.json({ error: 'Table code expired or revoked' }, { status: 410 })
      if (resolved) {
        table = { id: resolved.table.id, label: resolved.table.label, state: resolved.table.state || 'available' }
      }
    }
    if (!table && tableParam) {
      const matched = diningTables.find((t) => normalizeTableLabel(t.label) === normalizeTableLabel(tableParam))
      if (matched) {
        if (!matched.active) {
          return NextResponse.json({ error: `Table "${matched.label}" is currently inactive.` }, { status: 403 })
        }
        table = { id: matched.id, label: matched.label, state: matched.state || 'available' }
      } else {
        table = { id: tableParam, label: tableParam, state: 'available' }
      }
    }
    if (!table && !token) {
      if (ordering && !ordering.generalOrderingEnabled) {
        return NextResponse.json({ error: 'Please scan your table QR to order' }, { status: 403 })
      }
    }

    const etag = computeMenuCatalogEtag(items, categories, ordering, settings?.updatedAt, diningTables, table?.id || null)
    const cacheHeaders = {
      ETag: etag,
      'Cache-Control': 'public, max-age=0, must-revalidate',
    }
    if (request.headers.get('if-none-match') === etag) {
      return new NextResponse(null, {
        status: 304,
        headers: cacheHeaders,
      })
    }

    return NextResponse.json(
      {
        restaurantName: settings?.name || config.name,
        logoUrl: settings?.branding?.logoUrl || config.branding.logoUrl || null,
        contactPhone: settings?.contact?.phone || config.contact.phone || null,
        googleReviewUrl:
          campaign.googleReviewUrlOverride || settings?.google?.reviewUrl || config.google?.reviewUrl || null,
        reviewSlug: campaign.slug,
        table,
        tables: diningTables.filter((t) => t.active).map((t) => ({
          id: t.id,
          label: t.label,
          state: t.state || 'available',
        })),
        taxRateBps: ordering.taxRateBps,
        serviceChargePaise: ordering.serviceChargePaise,
        currency: 'INR',
        categories: categories.filter((c) => c.active).map((c) => ({ id: c.id, name: c.name, position: c.position })),
        items: items
          .filter((i) => i.visible)
          .map((i) => ({
            id: i.id,
            categoryId: i.categoryId,
            name: i.name,
            description: i.description || null,
            imageUrl: normalizeImageUrl(i.imageUrl),
            pricePaise: i.pricePaise,
            available: i.available,
            veg: i.veg,
            featured: i.featured,
            position: i.position,
            options: i.options || [],
          })),
      },
      {
        status: 200,
        headers: cacheHeaders,
      }
    )
  } catch (error) {
    console.error('Public order-menu error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
