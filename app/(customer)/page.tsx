import Image from "next/image";
import Link from "next/link";
import { Cinzel } from "next/font/google";
import WishlistButton from "@/components/customer/WishlistButton";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const newArrivals = [
    {
        slug: "obsidian-crest-tee",
        name: "Obsidian Crest Tee",
        price: "$96",
        image: "/home/arrival-obsidian-crest-tee.png",
    },
    {
        slug: "vanguard-glyph-hoodie",
        name: "Vanguard Glyph Hoodie",
        price: "$168",
        image: "/home/arrival-vanguard-glyph-hoodie.png",
    },
    {
        slug: "imperial-cut-shirt",
        name: "Imperial Cut Shirt",
        price: "$122",
        image: "/home/arrival-imperial-cut-shirt.png",
    },
    {
        slug: "nocturne-utility-set",
        name: "Nocturne Utility Set",
        price: "$214",
        image: "/home/arrival-nocturne-utility-set.png",
    },
];

const bestSellers = [
    {
        slug: "atlas-prime-hoodie",
        name: "Atlas Prime Hoodie",
        price: "$172",
        image: "/home/best-atlas-prime-hoodie.png",
    },
    {
        slug: "mythcore-long-tee",
        name: "Mythcore Long Tee",
        price: "$104",
        image: "/home/best-mythcore-long-tee.png",
    },
    {
        slug: "aurelian-cargo-jacket",
        name: "Aurelian Cargo Jacket",
        price: "$238",
        image: "/home/best-aurelian-cargo-jacket.png",
    },
    {
        slug: "rune-line-essentials",
        name: "Rune-Line Essentials",
        price: "$128",
        image: "/home/best-rune-line-essentials.png",
    },
];

const categories = [
    {
        title: "T-Shirts",
        href: "/shop/t-shirts",
        image: "/home/category-t-shirts.png",
    },
    {
        title: "Hoodies",
        href: "/shop/hoodies",
        image: "/home/category-hoodies.png",
    },
    {
        title: "Future Categories",
        href: "/shop",
        image: "/home/category-future-categories.png",
    },
];

function ProductCard({
    name,
    price,
    image,
    href = "/shop",
    slug,
}: {
    name: string;
    price: string;
    image: string;
    href?: string;
    slug?: string;
}) {
    const resolvedHref = slug ? `/shop/product/${slug}` : href;
    const productId = slug ?? name;

    return (
        <Link
            href={resolvedHref}
            className="group flex flex-col gap-3.5 rounded-[15px] border border-gold bg-surface p-3 sm:p-3.5 card-hover"
        >
            <div className="relative h-[170px] overflow-hidden rounded-[10px] bg-primary-deep sm:h-[250px] lg:h-[320px]">
                <div className="absolute right-3 top-3 z-10">
                    <WishlistButton productId={productId} />
                </div>
                <Image
                    src={image}
                    alt={name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 24vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
            </div>

            <div className="space-y-1">
                <h3 className={`${cinzel.className} text-[14px] leading-[1.15] text-text-primary sm:text-[18px] lg:text-[24px]`}>
                    {name}
                </h3>
                <p className="font-sans text-[12px] font-semibold text-gold sm:text-[15px] lg:text-[18px]">
                    {price}
                </p>
            </div>
        </Link>
    );
}

function CategoryCard({
    title,
    href,
    image,
}: {
    title: string;
    href: string;
    image: string;
}) {
    return (
        <Link
            href={href}
            className="group flex h-full flex-col gap-3 rounded-[15px] border border-gold bg-surface p-4 card-hover"
        >
            <div className="relative h-[200px] overflow-hidden rounded-[10px] bg-primary-deep sm:h-[220px]">
                <Image
                    src={image}
                    alt={title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 30vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
            </div>

            <h3 className={`${cinzel.className} text-[22px] text-text-primary sm:text-[24px] lg:text-[28px]`}>
                {title}
            </h3>
        </Link>
    );
}

export default function HomePage() {
    return (
        <main className="bg-primary">
            <section className="bg-[radial-gradient(circle_at_30%_20%,var(--bg-main)_0%,var(--bg-secondary)_100%)]">
                <div className="desktop-frame grid gap-10 py-8 sm:py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,540px)] lg:items-center lg:gap-14 lg:py-[72px]">
                    <div className="space-y-5">
                        <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.16em] text-gold">
                            International Myth-Wear
                        </p>

                        <h1 className={`${cinzel.className} max-w-[620px] w-full text-[38px] leading-[1.02] text-text-primary sm:text-[52px] lg:text-[62px]`}>
                            Architectural Clothing Forged for Modern Legends
                        </h1>

                        <p className="max-w-[560px] w-full font-sans text-[15px] leading-[1.45] text-text-muted lg:text-[18px] lg:leading-[1.4]">
                            Albaeon merges mythic symbolism with brutal tailoring for people who dress with intent across borders, cultures, and seasons.
                        </p>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                            <Link
                                href="/shop"
                                className="btn-primary"
                            >
                                Shop Now
                            </Link>
                            <Link
                                href="/shop"
                                className="btn-secondary"
                            >
                                Explore Collection
                            </Link>
                        </div>
                    </div>

                    <div className="relative aspect-[27/28] overflow-hidden border border-gold">
                        <Image
                            src="/home/hero.png"
                            alt="Albaeon hero visual"
                            fill
                            priority
                            sizes="(max-width: 1024px) 100vw, 540px"
                            className="object-cover"
                        />
                    </div>
                </div>
            </section>

            <section className="bg-primary">
                <div className="desktop-frame flex flex-col gap-6 py-10 sm:py-14 lg:py-14">
                    <h2 className={`${cinzel.className} text-[32px] font-normal text-gold sm:text-[38px] lg:text-[44px]`}>
                        New Arrivals
                    </h2>

                    <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4 lg:gap-5">
                        {newArrivals.map((product) => (
                            <ProductCard
                                key={product.name}
                                name={product.name}
                                price={product.price}
                                image={product.image}
                                slug={product.slug}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-primary-deep">
                <div className="desktop-frame flex flex-col gap-6 py-10 sm:py-14 lg:py-14">
                    <h2 className={`${cinzel.className} text-[32px] font-normal text-gold sm:text-[38px] lg:text-[44px]`}>
                        Best Sellers
                    </h2>

                    <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4 lg:gap-5">
                        {bestSellers.map((product) => (
                            <ProductCard
                                key={product.name}
                                name={product.name}
                                price={product.price}
                                image={product.image}
                                slug={product.slug}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-primary">
                <div className="desktop-frame flex flex-col gap-6 py-10 sm:py-14 lg:py-14">
                    <h2 className={`${cinzel.className} text-[32px] font-normal text-gold sm:text-[38px] lg:text-[44px]`}>
                        Shop by Category
                    </h2>

                    <div className="grid gap-4 lg:grid-cols-3 lg:gap-5">
                        {categories.map((category) => (
                            <CategoryCard
                                key={category.title}
                                title={category.title}
                                href={category.href}
                                image={category.image}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-primary-deep">
                <div className="desktop-frame grid gap-8 py-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:items-center lg:gap-10 lg:py-[72px]">
                    <div className="space-y-5">
                        <h2 className={`${cinzel.className} text-[34px] font-normal text-gold sm:text-[40px] lg:text-[46px]`}>
                            The Albaeon Story
                        </h2>

                        <p className="max-w-[620px] w-full font-sans text-[14px] leading-[1.5] text-text-primary sm:text-[16px] lg:text-[18px]">
                            Born from mythological architecture and contemporary tailoring, Albaeon creates international clothing for people who move with presence. Every collection balances disciplined structure, deep atmosphere, and premium material storytelling.
                        </p>

                        <p className="max-w-[560px] w-full font-sans text-[13px] leading-[1.45] text-text-muted sm:text-[15px] lg:text-[16px]">
                            Our language is brutal elegance: precise forms, symbolic detail, and garments built to endure every city and season.
                        </p>
                    </div>

                    <div className="relative h-[300px] overflow-hidden border border-gold sm:h-[360px] lg:h-[420px]">
                        <Image
                            src="/home/story.png"
                            alt="The Albaeon story"
                            fill
                            sizes="(max-width: 1024px) 100vw, 520px"
                            className="object-cover"
                        />
                    </div>
                </div>
            </section>
        </main>
    );
}

