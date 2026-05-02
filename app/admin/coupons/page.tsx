import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getAdminCoupons } from '@/lib/admin/coupons'
import AdminCouponsClient from '@/components/admin/AdminCouponsClient'

export default async function AdminCouponsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

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