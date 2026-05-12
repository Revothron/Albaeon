import { requireAdminPage } from '@/lib/auth/require-admin-page'
import { getAdminCoupons } from '@/lib/admin/coupons'
import AdminCouponsClient from '@/components/admin/AdminCouponsClient'

export const dynamic = 'force-dynamic';

export default async function AdminCouponsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>
}) {
  await requireAdminPage()

  const sp = await searchParams
  const page = Number(sp.page ?? 1)

  const { coupons, total } = await getAdminCoupons({
    search: sp.search ?? '',
    page,
    limit: 20,
  })

  return (
    <AdminCouponsClient
      coupons={coupons}
      total={total}
      currentPage={page}
    />
  )
}