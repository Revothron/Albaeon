import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import { Cinzel } from 'next/font/google'
import type { Product } from '@/lib/customer/products'
import WishlistButton from '@/components/customer/WishlistButton'
import ShopFilters from '@/components/customer/ShopFilters'

const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })

function ProductCard({
  id,
  name,
  price,
  slug,
  image,
}: {
  id: string
  name: string
  price: string
  slug: string
  image: string
}) {
  return (
    <Link
      href={`/shop/product/${slug}`}
      className="group flex flex-col gap-3 border border-gold bg-surface p-3 transition-colors duration-200 hover:border-gold-hover sm:gap-3.5 sm:p-3.5"
    >
      <div className="relative aspect-[1.16/1] overflow-hidden bg-primary-deep">
        <div className="absolute right-3 top-3 z-10">
          <WishlistButton productId={id} />
        </div>
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 30vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>
      <div className="space-y-1">
        <h2 className={`${cinzel.className} text-[14px] leading-[1.15] text-text-primary sm:text-[18px] lg:text-[24px]`}>
          {name}
        </h2>
        <p className="font-sans text-[12px] font-semibold text-gold sm:text-[15px] lg:text-[18px]">
          {price}
        </p>
      </div>
    </Link>
  )
}

type ShopCollectionViewProps = {
  heading: string
  description: string
  products: Product[]
  total?: number
  currentSort?: string
  currentColors?: string[]
  currentMinPrice?: number
  currentMaxPrice?: number
  emptyMessage?: string
}

export default function ShopCollectionView({
  heading,
  description,
  products,
  total = 0,
  currentSort = 'newest',
  currentColors = [],
  currentMinPrice,
  currentMaxPrice,
  emptyMessage = 'No products found in this category yet.',
}: ShopCollectionViewProps) {
  return (
    <section className="min-h-screen bg-primary">
      <div className="desktop-frame flex flex-col gap-3 py-5 sm:py-8 lg:gap-7 lg:py-12">
        <div className="space-y-2 lg:space-y-3">
          <h1 className={`${cinzel.className} text-[38px] font-normal text-gold sm:text-[44px] lg:text-[52px]`}>
            {heading}
          </h1>
          <p className="font-sans text-[13px] text-text-muted sm:text-[15px] lg:text-[16px]">
            {description}
          </p>
        </div>

        <ShopFilters
          currentSort={currentSort}
          currentColors={currentColors}
          currentMinPrice={currentMinPrice}
          currentMaxPrice={currentMaxPrice}
          total={total}
        />

        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
            {products.map((product) => (
              <ProductCard
                key={product.slug}
                id={product.id}
                name={product.name}
                price={product.price}
                slug={product.slug}
                image={product.image}
              />
            ))}
          </div>
        ) : (
          <div className="border border-gold bg-surface px-5 py-12 text-center font-sans text-[14px] text-text-muted sm:px-8 sm:text-[16px]">
            {emptyMessage}
          </div>
        )}
      </div>
    </section>
  )
}