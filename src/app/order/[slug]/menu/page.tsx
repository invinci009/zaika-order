import MenuClient from './MenuClient'
import {
  ensureMenuCachesFresh,
  getOrderMenuCategories,
  getOrderMenuItems,
} from '@/lib/firebase/ordering'
import { normalizeImageUrl } from '@/lib/ordering/validation'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function OrderMenuPage() {
  await ensureMenuCachesFresh().catch(() => {})

  const [categories, items] = await Promise.all([
    getOrderMenuCategories().catch(() => []),
    getOrderMenuItems().catch(() => []),
  ])

  const initialCategories = categories
    .filter((c) => c.active)
    .map((c) => ({ id: c.id, name: c.name }))

  const initialItems = items
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
    }))

  return (
    <MenuClient
      initialItems={initialItems}
      initialCategories={initialCategories}
    />
  )
}
