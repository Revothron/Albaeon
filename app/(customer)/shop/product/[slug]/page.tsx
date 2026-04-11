import { notFound } from 'next/navigation'
import ProductView from '@/components/customer/ProductView'
import { getProductBySlug } from '@/lib/customer/products'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return {}
  return {
    title: `${product.name} | Albaeon`,
    description: product.description ?? '',
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()
  return <ProductView product={product} />
}