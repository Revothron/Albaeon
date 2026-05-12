import { requireAdminPage } from '@/lib/auth/require-admin-page'
import { getAdminCustomers } from '@/lib/admin/customers'
import AdminCustomersClient from '@/components/admin/AdminCustomersClient';

export const dynamic = 'force-dynamic';

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string
    search?: string
    country?: string
    since?: string
  }>
}) {
  await requireAdminPage()

  const sp = await searchParams
  const page = Number(sp.page ?? 1)

  const { customers, total } = await getAdminCustomers({
    page,
    limit: 20,
    search: sp.search ?? '',
    country: sp.country ?? '',
    since: sp.since ?? '',
  })

  return (
    <AdminCustomersClient
      customers={customers}
      total={total}
      currentPage={page}
    />
  )
}