import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getAdminCategories } from '@/lib/admin/products'
import AdminProductEditorClient from '@/components/admin/AdminProductEditorClient'

export default async function AddProductPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const categories = await getAdminCategories()

  return (
    <AdminProductEditorClient
      mode="create"
      product={null}
      categories={categories}
    />
  )
}