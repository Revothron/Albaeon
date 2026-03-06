export default function ShopPage() {
    return (
        <div className="bg-primary min-h-screen">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <h1 className="text-gold text-3xl font-bold tracking-wider uppercase mb-8">
                    Shop
                </h1>

                {/* ── Filters & Sort ── */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
                    <div className="flex gap-3">
                        <select className="bg-surface border border-white/10 text-text-primary text-sm px-4 py-2 focus:outline-none focus:border-gold/40">
                            <option>Size</option>
                            <option>S</option>
                            <option>M</option>
                            <option>L</option>
                            <option>XL</option>
                        </select>
                        <select className="bg-surface border border-white/10 text-text-primary text-sm px-4 py-2 focus:outline-none focus:border-gold/40">
                            <option>Color</option>
                        </select>
                        <select className="bg-surface border border-white/10 text-text-primary text-sm px-4 py-2 focus:outline-none focus:border-gold/40">
                            <option>Price Range</option>
                        </select>
                    </div>
                    <select className="bg-surface border border-white/10 text-text-primary text-sm px-4 py-2 focus:outline-none focus:border-gold/40">
                        <option>Sort By</option>
                        <option>Price: Low to High</option>
                        <option>Price: High to Low</option>
                        <option>Recently Added</option>
                        <option>Best Seller</option>
                        <option>A–Z</option>
                    </select>
                </div>

                {/* ── Product Grid ── */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <a key={i} href={`/shop/product/product-${i + 1}`} className="card-surface group cursor-pointer">
                            <div className="aspect-[3/4] bg-surface" />
                            <div className="p-4">
                                <p className="text-text-primary text-sm font-medium">Product Name</p>
                                <p className="text-text-muted text-sm mt-1">₹1,299</p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
