import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { getAdminProductForEdit, getAdminCategories } from '@/lib/admin/products'
import AdminProductEditorClient from '@/components/admin/AdminProductEditorClient'

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { id } = await params
  const [product, categories] = await Promise.all([
    getAdminProductForEdit(id),
    getAdminCategories(),
  ])

  if (!product) notFound()

  return (
    <AdminProductEditorClient
      mode="edit"
      product={product}
      categories={categories}
    />
  )
}