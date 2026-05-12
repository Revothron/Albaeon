import { requireAdminPage } from '@/lib/auth/require-admin-page'
import { notFound } from 'next/navigation'
import { getAdminProductForEdit, getAdminCategories } from '@/lib/admin/products'
import AdminProductEditorClient from '@/components/admin/AdminProductEditorClient'

export const dynamic = 'force-dynamic';

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdminPage()

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