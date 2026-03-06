export default function HomePage() {
    return (
        <div className="bg-primary">
            {/* ── Hero Banner ── */}
            <section className="bg-hero-gradient py-32 px-6 flex flex-col items-center text-center">
                <h1 className="text-gold text-5xl md:text-6xl font-bold tracking-[0.15em] uppercase mb-6">
                    Albaeon
                </h1>
                <p className="text-text-muted text-lg max-w-xl leading-relaxed mb-10">
                    Ancient empire meets architectural fashion. Brutalist form. Mythic
                    identity. Controlled power.
                </p>
                <a href="/shop" className="btn-primary">
                    Explore Collection
                </a>
            </section>

            {/* ── New Arrivals ── */}
            <section className="bg-primary-deep py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-gold text-2xl font-semibold tracking-wider uppercase text-center mb-12">
                        New Arrivals
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="card-surface group cursor-pointer">
                                <div className="aspect-[3/4] bg-surface" />
                                <div className="p-4">
                                    <p className="text-text-primary text-sm font-medium">Product Name</p>
                                    <p className="text-text-muted text-sm mt-1">₹1,299</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Shop by Category ── */}
            <section className="bg-primary py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-gold text-2xl font-semibold tracking-wider uppercase text-center mb-12">
                        Shop by Category
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { name: "T-Shirts", href: "/shop/t-shirts" },
                            { name: "Hoodies", href: "/shop/hoodies" },
                        ].map((cat) => (
                            <a
                                key={cat.href}
                                href={cat.href}
                                className="card-surface group relative overflow-hidden"
                            >
                                <div className="aspect-[16/7] bg-surface flex items-center justify-center">
                                    <span className="text-gold text-2xl font-bold tracking-wider uppercase group-hover:scale-105 transition-transform duration-300">
                                        {cat.name}
                                    </span>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Brand Story ── */}
            <section className="bg-primary-deep py-20 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-gold text-2xl font-semibold tracking-wider uppercase mb-8">
                        Our Story
                    </h2>
                    <p className="text-text-primary text-lg leading-relaxed mb-4">
                        Albaeon is born from the intersection of mythology and modern
                        structure. Every piece carries the weight of ancient empires and the
                        precision of architectural design.
                    </p>
                    <p className="text-text-muted text-base leading-relaxed">
                        We don&apos;t follow trends. We build identity. Premium materials, brutalist
                        aesthetics, and mythic inspiration define everything we create.
                    </p>
                </div>
            </section>
        </div>
    );
}
