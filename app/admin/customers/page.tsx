import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getAdminCustomers } from '@/lib/admin/customers'
import AdminCustomersClient from '@/components/admin/AdminCustomersClient';

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
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

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