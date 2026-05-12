import { getAdminOrders } from '@/lib/admin/orders'
import AdminOrdersClient from '@/components/admin/AdminOrdersClient'
import { requireAdminPage } from '@/lib/auth/require-admin-page'

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string
    search?: string
    payment?: string
    fulfillment?: string
    provider?: string
  }>
}) {
  await requireAdminPage()

  const sp = await searchParams
  const page = Number(sp.page ?? 1)

  const { orders, total } = await getAdminOrders({
    page,
    limit: 20,
    search: sp.search ?? '',
    paymentStatus: sp.payment ?? '',
    fulfillmentStatus: sp.fulfillment ?? '',
    provider: sp.provider ?? '',
  })

  return (
    <AdminOrdersClient
      orders={orders}
      total={total}
      currentPage={page}
    />
  )
}