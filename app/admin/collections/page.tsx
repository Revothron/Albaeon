import { requireAdminPage } from '@/lib/auth/require-admin-page'
import {
  getAllCollections,
  getAllProductsForPicker,
  getAllCollectionProductIds,
} from '@/lib/admin/collections'
import AdminCollectionsClient from '@/components/admin/AdminCollectionsClient'

export const dynamic = 'force-dynamic'

export default async function AdminCollectionsPage() {
  await requireAdminPage()

  const [collections, { products: allProducts }, productMap] =
    await Promise.all([
      getAllCollections(),
      getAllProductsForPicker(),
      getAllCollectionProductIds(),
    ])

  return (
    <AdminCollectionsClient
      collections={collections}
      allProducts={allProducts}
      collectionProductIds={productMap}
    />
  )
}
