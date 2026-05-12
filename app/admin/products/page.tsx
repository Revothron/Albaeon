import { createClient } from '@/lib/supabase/server'
import { requireAdminPage } from '@/lib/auth/require-admin-page'
import { getAdminProducts } from '@/lib/admin/products'
import AdminProductsClient from '@/components/admin/AdminProductsClient'

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string
    search?: string
    category?: string
    status?: string
    sort?: string
  }>
}) {
  await requireAdminPage()
  const supabase = await createClient()

  const sp = await searchParams
  const page = Number(sp.page ?? 1)

  const { products, total } = await getAdminProducts({
    page,
    limit: 20,
    search: sp.search ?? '',
    category: sp.category ?? '',
    status: sp.status ?? '',
    sort: sp.sort ?? 'newest',
  })

  const { count: activeCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')

  const { count: draftCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'draft')

  return (
    <AdminProductsClient
      products={products}
      total={total}
      activeCount={activeCount ?? 0}
      draftCount={draftCount ?? 0}
      currentPage={page}
    />
  )
}