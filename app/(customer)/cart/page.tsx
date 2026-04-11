import CartPageClient from '@/components/customer/cart/CartPageClient'
import { getProducts } from '@/lib/customer/products'


// Server component — fetches recommended products
export default async function CartPage() {
  const { products: recommended } = await getProducts({
    sort: 'newest',
    limit: 3,
  })

  return <CartPageClient recommended={recommended} />
}