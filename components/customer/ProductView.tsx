"use client";

import Image from "next/image";
import Link from "next/link";
import { Cinzel } from "next/font/google";
import { Minus, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import type { Product } from "@/lib/customer/products";
import WishlistButton from "@/components/customer/WishlistButton";
import PriceDisplay from "@/components/customer/PriceDisplay";
import { useCartStore } from "@/store/cartStore";
import { useUiStore } from "@/store/uiStore";
import { useTrackingStore } from "@/store/trackingStore";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

function InfoCard({
  title,
  body,
  titleSize = "text-[22px] sm:text-[24px] lg:text-[28px]",
}: {
  title: string;
  body: string;
  titleSize?: string;
}) {
  return (
    <div className="flex flex-col gap-2.5 border border-gold bg-surface p-4 sm:p-5">
      <h2 className={`${cinzel.className} ${titleSize} font-normal text-gold`}>
        {title}
      </h2>
      <p className="font-sans text-[12px] leading-[1.45] text-text-primary sm:text-[14px] lg:text-[15px] lg:leading-[1.5]">
        {body}
      </p>
    </div>
  );
}

function QuantitySelector({
  quantity,
  onDecrease,
  onIncrease,
}: {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  return (
    <div className="flex h-11 w-[132px] items-center justify-between rounded-full border border-gold bg-surface px-3">
      <button
        type="button"
        onClick={onDecrease}
        aria-label="Decrease quantity"
        className="text-text-primary transition-colors duration-200 hover:text-gold"
      >
        <Minus className="h-4 w-4" strokeWidth={2} />
      </button>

      <span className="font-sans text-[15px] font-semibold text-text-primary">
        {quantity}
      </span>

      <button
        type="button"
        onClick={onIncrease}
        aria-label="Increase quantity"
        className="text-text-primary transition-colors duration-200 hover:text-gold"
      >
        <Plus className="h-4 w-4" strokeWidth={2} />
      </button>
    </div>
  );
}

export default function ProductView({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState(product.defaultSize);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const addItem = useCartStore((s) => s.addItem);
  const addToast = useUiStore((s) => s.addToast);
  const trackView = useTrackingStore((s) => s.trackView);

  // ── Track product view ────────────────────────────────
  useEffect(() => {
    trackView({
      id: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0] ?? product.image,
      price_inr: product.priceINR,
      viewedAt: Date.now(),
    })
  }, [product.id])

  const activeImage = product.gallery[activeImageIndex] ?? product.image;
  const leftHighlights = product.highlights.slice(0, 3);
  const rightHighlights = product.highlights.slice(3, 6);

  const handleAddToCart = () => {
    const variant = product.variants?.find((v) => v.size === selectedSize);

    addItem({
      id: Date.now().toString(),
      variantId: variant?.id ?? `${product.slug}-${selectedSize}`,
      productId: product.id,
      name: product.name,
      sku: variant?.sku ?? `${product.slug}-${selectedSize}`,
      color: variant?.color ?? "",
      size: selectedSize ?? "",
      price: product.priceINR,
      currency: "INR",
      image: product.images[0] ?? product.image,
      quantity: quantity,
    });

    addToast({
      message: `${product.name} added to cart`,
      type: "success",
    });
  };

  const handleBuyNow = () => {
    const variant = product.variants?.find((v) => v.size === selectedSize)

    addItem({
      id: Date.now().toString(),
      variantId: variant?.id ?? `${product.slug}-${selectedSize}`,
      productId: product.id,
      name: product.name,
      sku: variant?.sku ?? `${product.slug}-${selectedSize}`,
      color: variant?.color ?? '',
      size: selectedSize ?? '',
      price: product.priceINR,
      currency: 'INR',
      image: product.images[0] ?? product.image,
      quantity,
    })

    window.location.href = '/checkout/delivery'
  }

  return (
    <section className="min-h-screen bg-primary">
      <div className="desktop-frame flex flex-col gap-8 py-5 sm:py-8 lg:gap-8 lg:py-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
          <div className="w-full lg:max-w-[700px]">
            <h1
              className={`${cinzel.className} mb-3 text-[30px] leading-[1.05] text-gold sm:text-[38px] lg:hidden`}
            >
              {product.name}
            </h1>

            <div className="relative aspect-[5/4] overflow-hidden border border-gold bg-surface">
              <div className="absolute right-3 top-3 z-10">
                <WishlistButton productId={product.id} />
              </div>
              <Image
                src={activeImage}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 700px"
                className="object-cover"
                priority
              />
            </div>

            <div className="mt-1.5 grid grid-cols-4 gap-1.5 sm:mt-3.5 sm:gap-3.5">
              {product.gallery.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setActiveImageIndex(index)}
                  aria-label={`View image ${index + 1}`}
                  className={`relative aspect-[1/1] overflow-hidden border bg-surface transition-colors duration-200 ${activeImageIndex === index
                    ? "border-gold"
                    : "border-gold/60 hover:border-gold"
                    }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    fill
                    sizes="(max-width: 1024px) 25vw, 160px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex w-full flex-col gap-5 lg:gap-5">
            <div className="hidden lg:block">
              <h1
                className={`${cinzel.className} text-[52px] leading-[1.08] text-gold`}
              >
                {product.name}
              </h1>
            </div>

            <p className="font-sans text-[24px] font-bold text-text-primary lg:text-[30px]">
              <PriceDisplay priceINR={product.priceINR} priceUSD={product.priceUSD} />
            </p>

            <div className="space-y-3">
              <p className="font-sans text-[13px] text-text-muted sm:text-[15px]">
                Select Size
              </p>

              <div className="flex flex-wrap gap-2.5">
                {product.sizes.map((size) => {
                  const isSelected = size === selectedSize;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`h-11 min-w-[64px] rounded-full border px-4 font-sans text-[13px] transition-colors duration-200 sm:min-w-[70px] sm:text-[14px] ${isSelected
                        ? "border-gold bg-gold font-semibold text-nav"
                        : "border-gold bg-surface text-text-primary hover:text-gold"
                        }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Desktop quantity + add to cart */}
            <div className="hidden lg:flex lg:items-center lg:gap-3.5">
              <p className="font-sans text-[15px] text-text-muted">Quantity</p>
              <QuantitySelector
                quantity={quantity}
                onDecrease={() =>
                  setQuantity((current) => Math.max(1, current - 1))
                }
                onIncrease={() => setQuantity((current) => current + 1)}
              />
              <button
                type="button"
                className="h-11 rounded-full border border-gold px-6 font-sans text-[14px] font-semibold text-gold transition-colors duration-200 hover:bg-gold hover:text-nav"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            </div>

            {/* Mobile quantity + add to cart */}
            <div className="space-y-3 lg:hidden">
              <p className="font-sans text-[13px] text-text-muted">Quantity</p>
              <QuantitySelector
                quantity={quantity}
                onDecrease={() =>
                  setQuantity((current) => Math.max(1, current - 1))
                }
                onIncrease={() => setQuantity((current) => current + 1)}
              />
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className="h-[46px] border border-gold bg-transparent font-sans text-[13px] font-semibold text-gold transition-colors duration-200 hover:bg-gold hover:text-nav"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="flex h-[46px] items-center justify-center border border-gold bg-surface font-sans text-[13px] font-semibold text-text-primary transition-colors duration-200 hover:bg-gold hover:text-nav"
                >
                  Buy Now
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleBuyNow}
              className="hidden h-[52px] w-full rounded-full border border-gold bg-surface font-sans text-[14px] font-semibold text-text-primary transition-colors duration-200 hover:bg-gold hover:text-nav lg:flex lg:items-center lg:justify-center"
            >
              Buy Now
            </button>

            {/* Key Highlights */}
            <div className="border border-gold bg-surface p-4 sm:p-5 lg:p-6">
              <h2
                className={`${cinzel.className} text-[18px] font-bold text-gold`}
              >
                Key Highlights
              </h2>

              <div className="mt-5 grid gap-6 sm:grid-cols-2 sm:gap-x-12 lg:gap-x-[72px]">
                {[leftHighlights, rightHighlights].map((column, columnIndex) => (
                  <div key={columnIndex} className="space-y-6">
                    {column.map((highlight) => (
                      <div key={highlight.label} className="space-y-2">
                        <p className="font-sans text-[12px] font-semibold text-text-primary">
                          {highlight.label}
                        </p>
                        <p className="font-sans text-[14px] text-gold sm:text-[15px]">
                          {highlight.value}
                        </p>
                        <div className="h-px w-full bg-text-primary/85" />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Info cards */}
        <div className="space-y-4">
          <InfoCard title="Description" body={product.description} />
          <InfoCard title="Size Chart" body={product.sizeChart} />
          <InfoCard title="Wash Care" body={product.washCare} />
          <InfoCard
            title="Return / Exchange / Refund Policy"
            body={product.returnPolicy}
            titleSize="text-[20px] sm:text-[22px] lg:text-[26px]"
          />
        </div>
      </div>
    </section>
  );
}