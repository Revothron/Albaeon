import { requireAdminPage } from '@/lib/auth/require-admin-page'
import { getAdminCategories } from '@/lib/admin/products'
import AdminProductEditorClient from '@/components/admin/AdminProductEditorClient'

export const dynamic = 'force-dynamic';

export default async function AddProductPage() {
  await requireAdminPage()

  const categories = await getAdminCategories()

  return (
    <AdminProductEditorClient
      mode="create"
      product={null}
      categories={categories}
    />
  )
}