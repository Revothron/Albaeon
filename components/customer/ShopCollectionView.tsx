import Image from "next/image";
import Link from "next/link";
import { Cinzel } from "next/font/google";
import StripedMarker from "@/components/customer/StripedMarker";
import type { Product } from "@/lib/customer/products";
import WishlistButton from "@/components/customer/WishlistButton";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const filters = [
    { mobileLabel: "Size", desktopLabel: "Size: All" },
    { mobileLabel: "Color", desktopLabel: "Color: Dark Tones" },
    { mobileLabel: "Price", desktopLabel: "Price: $80 - $300" },
];

const sortOptions = [
    { value: "recently-added", label: "Recently Added" },
    { value: "price-low-to-high", label: "Price Low to High" },
    { value: "price-high-to-low", label: "Price High to Low" },
    { value: "best-seller", label: "Best Seller" },
    { value: "a-z", label: "A-Z" },
];

function FilterChip({
    mobileLabel,
    desktopLabel,
}: {
    mobileLabel: string;
    desktopLabel: string;
}) {
    return (
        <button
            type="button"
            className="flex h-[34px] items-center justify-center border border-gold bg-surface px-3 text-center font-sans text-[12px] leading-none text-text-primary sm:h-12 sm:justify-start sm:px-4 sm:text-[14px]"
        >
            <span className="sm:hidden">{mobileLabel}</span>
            <span className="hidden sm:inline">{desktopLabel}</span>
        </button>
    );
}

function SortDropdown() {
    return (
        <div className="relative w-full sm:w-[220px] lg:w-[248px]">
            <select
                defaultValue="recently-added"
                aria-label="Sort products"
                className="h-[34px] w-full appearance-none border border-gold bg-surface px-3 pr-8 font-sans text-[12px] leading-none text-text-primary outline-none sm:h-12 sm:px-4 sm:pr-10 sm:text-[14px]"
            >
                {sortOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-surface text-text-primary">
                        {option.label}
                    </option>
                ))}
            </select>

            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gold sm:right-4">
                <StripedMarker />
            </div>
        </div>
    );
}

function ProductCard({
    name,
    price,
    slug,
    image,
}: {
    name: string;
    price: string;
    slug: string;
    image: string;
}) {
    return (
        <Link
            href={`/shop/product/${slug}`}
            className="group flex flex-col gap-3 border border-gold bg-surface p-3 transition-colors duration-200 hover:border-gold-hover sm:gap-3.5 sm:p-3.5"
        >
            <div className="relative aspect-[1.16/1] overflow-hidden bg-primary-deep">
                <div className="absolute right-3 top-3 z-10">
                    <WishlistButton productId={slug} />
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
    );
}

type ShopCollectionViewProps = {
    heading: string;
    description: string;
    products: Product[];
    emptyMessage?: string;
};

export default function ShopCollectionView({
    heading,
    description,
    products,
    emptyMessage = "No products found in this category yet.",
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

                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:gap-3">
                        {filters.map((filter) => (
                            <FilterChip
                                key={filter.desktopLabel}
                                mobileLabel={filter.mobileLabel}
                                desktopLabel={filter.desktopLabel}
                            />
                        ))}
                    </div>

                    <SortDropdown />
                </div>

                {products.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
                        {products.map((product) => (
                            <ProductCard
                                key={product.slug}
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
    );
}
