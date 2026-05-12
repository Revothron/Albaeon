import { notFound } from 'next/navigation'
import Script from 'next/script'
import ProductView from '@/components/customer/ProductView'
import { getProductBySlug } from '@/lib/customer/products'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'

export const revalidate = 600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://albaeon.com'

  const { data: product } = await supabase
    .from('products')
    .select(`
      name, slug, description, meta_description, tags,
      product_images (url, alt_text, is_primary)
    `)
    .eq('slug', slug)
    .eq('status', 'active')
    .single()

  if (!product) return {}

  const primaryImage = product.product_images?.find(
    (img: { is_primary: boolean }) => img.is_primary
  )

  return {
    title: product.name,
    description: product.meta_description ?? product.description ?? '',
    keywords: product.tags ?? [],
    alternates: {
      canonical: `${siteUrl}/shop/product/${product.slug}`,
    },
    openGraph: {
      type: 'website',
      title: `${product.name} | Albaeon`,
      description: product.meta_description ?? product.description ?? '',
      url: `${siteUrl}/shop/product/${product.slug}`,
      images: primaryImage
        ? [{ url: primaryImage.url, width: 1200, height: 1200, alt: primaryImage.alt_text ?? product.name }]
        : [{ url: '/og-default.jpg', width: 1200, height: 630, alt: product.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | Albaeon`,
      description: product.meta_description ?? product.description ?? '',
      images: [primaryImage?.url ?? '/og-default.jpg'],
    },
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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://albaeon.com'
  const primaryVariantSku = product.variants[0]?.sku ?? ''
  const inStock = product.variants.some(v => v.stock_status === 'in_stock')

  return (
    <>
      <Script
        id="product-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: product.description ?? '',
            sku: primaryVariantSku,
            brand: {
              '@type': 'Brand',
              name: 'Albaeon',
            },
            image: product.gallery,
            offers: {
              '@type': 'Offer',
              priceCurrency: 'INR',
              price: product.priceINR,
              availability: inStock
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
              url: `${siteUrl}/shop/product/${product.slug}`,
              seller: {
                '@type': 'Organization',
                name: 'Albaeon',
              },
            },
          }),
        }}
      />
      <ProductView product={product} />
    </>
  )
}