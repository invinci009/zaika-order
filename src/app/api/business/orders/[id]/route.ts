import { NextRequest, NextResponse } from 'next/server'
import { getOrder, getOrderEvents, getPaymentEntries, updateOrder } from '@/lib/firebase/ordering'
import { getSessionFromRequest } from '@/lib/firebase/auth'
import { z } from 'zod'

const adminOrderPatchSchema = z.object({
  orderType: z.enum(['DINE_IN', 'PARCEL']).optional(),
  tableId: z.string().max(100).nullable().optional(),
  tableLabel: z.string().max(40).nullable().optional(),
  customerName: z.string().trim().min(1).max(100).optional(),
  customerPhone: z.string().trim().min(10).max(17).optional(),
  notes: z.string().max(280).optional(),
  fulfilment: z.enum(['RECEIVED', 'ACCEPTED', 'PREPARING', 'READY', 'SERVED', 'CANCELLED']).optional(),
})

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionFromRequest(request)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id } = await params
    const order = await getOrder(id)
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

    const [events, payments] = await Promise.all([
      getOrderEvents(id).catch((err) => {
        console.warn('Events fetch warning:', err)
        return []
      }),
      getPaymentEntries(id).catch((err) => {
        console.warn('Payments fetch warning:', err)
        return []
      }),
    ])

    return NextResponse.json({ order, events, payments }, { status: 200 })
  } catch (error) {
    console.error('Business order detail error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionFromRequest(request)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id } = await params
    const body = await request.json().catch(() => ({}))
    const parsed = adminOrderPatchSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid order update payload' }, { status: 400 })
    }
    const updated = await updateOrder(
      id,
      {
        orderType: parsed.data.orderType,
        tableId: parsed.data.tableId,
        tableLabel: parsed.data.tableLabel,
        customerName: parsed.data.customerName,
        customerPhone: parsed.data.customerPhone,
        notes: parsed.data.notes,
        fulfilment: parsed.data.fulfilment,
      },
      { uid: user.uid, email: user.email }
    )
    return NextResponse.json({ success: true, order: updated }, { status: 200 })
  } catch (error) {
    console.error('Order update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
