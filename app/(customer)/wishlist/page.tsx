"use client";

import { Heart } from "lucide-react";
import { Cinzel } from "next/font/google";
import { useWishlistStore } from "@/store/wishlistStore";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export default function WishlistPage() {
    const items = useWishlistStore((s) => s.items);
    const removeItem = useWishlistStore((s) =>
        s.removeItem);

    if (items.length === 0) {
        return (
            <section className="min-h-screen bg-primary">
                <div className="desktop-frame flex flex-col gap-7 py-6 sm:py-8 lg:gap-7 lg:py-12">
                    <h1 className={`${cinzel.className} text-[32px] font-normal text-gold sm:text-[44px] lg:text-[52px]`}>
                        Wishlist
                    </h1>
                    <div style={{
                        textAlign: 'center',
                        padding: '80px 20px',
                    }}>
                        <p style={{
                            fontFamily: 'inherit',
                            fontSize: '28px',
                            fontWeight: 300,
                            color: 'var(--albaeon-text-muted, #B7AFC3)',
                            marginBottom: '12px',
                        }}>
                            Nothing saved yet.
                        </p>
                        <p style={{
                            fontFamily: 'inherit',
                            fontSize: '13px',
                            fontWeight: 300,
                            color: 'var(--albaeon-text-muted, #B7AFC3)',
                            marginBottom: '28px',
                            lineHeight: 1.7,
                        }}>
                            Save pieces that speak to you.
                        </p>
                        <a href="/shop" className="btn-primary">
                            Browse Products
                        </a>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="min-h-screen bg-primary">
            <div className="desktop-frame flex flex-col gap-7 py-6 sm:py-8 lg:gap-7 lg:py-12">
                <h1 className={`${cinzel.className} text-[32px] font-normal text-gold sm:text-[44px] lg:text-[52px]`}>
                    Wishlist
                </h1>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {items.map((id) => (
                        <div key={id} className="card-surface group cursor-pointer relative">
                            <div className="aspect-[3/4] bg-surface" />
                            <button
                                className="absolute top-3 right-3 text-gold"
                                onClick={() => removeItem(id)}
                                aria-label="Remove from wishlist"
                                type="button"
                            >
                                <Heart className="w-5 h-5 fill-current" />
                            </button>
                            <div className="p-4">
                                <p className="text-text-primary text-sm font-medium">{id}</p>
                                <p className="text-text-muted text-sm mt-1">₹1,299</p>
                                <button className="btn-primary w-full mt-3 text-xs py-2">Add to Cart</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
