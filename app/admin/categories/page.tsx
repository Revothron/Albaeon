import { requireAdminPage } from '@/lib/auth/require-admin-page'
import { getAllCategories } from '@/lib/admin/categories'
import AdminCategoriesClient from '@/components/admin/AdminCategoriesClient'

export const dynamic = 'force-dynamic'

export default async function AdminCategoriesPage() {
  await requireAdminPage()

  const categories = await getAllCategories()

  return <AdminCategoriesClient categories={categories} />
}
