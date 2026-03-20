"use client";

import Image from "next/image";
import Link from "next/link";
import { Cinzel } from "next/font/google";
import { useCartStore } from "@/store/cartStore";
import { useUiStore } from "@/store/uiStore";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const recommended = [
    {
        name: "Rune Column Hoodie",
        price: "$169",
        image: "/home/arrival-vanguard-glyph-hoodie.png",
    },
    {
        name: "Shadow Crest Tee",
        price: "$92",
        image: "/home/arrival-obsidian-crest-tee.png",
    },
    {
        name: "Aegis Layered Coat",
        price: "$264",
        image: "/home/best-aurelian-cargo-jacket.png",
    },
];

export default function CartPage() {
    const items = useCartStore((s) => s.items);
    const removeItem = useCartStore((s) =>
        s.removeItem);
    const updateQuantity = useCartStore((s) =>
        s.updateQuantity);
    const subtotal = useCartStore((s) =>
        s.subtotal());
    const addToast = useUiStore((s) =>
        s.addToast);

    if (items.length === 0) {
        return (
            <section className="min-h-screen bg-primary">
                <div className="desktop-frame flex flex-col gap-7 py-6 sm:py-8 lg:gap-7 lg:py-12">
                    <h1 className={`${cinzel.className} text-[32px] font-normal text-gold sm:text-[44px] lg:text-[52px]`}>
                        Your Cart
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
                            Your cart is empty.
                        </p>
                        <p style={{
                            fontFamily: 'inherit',
                            fontSize: '13px',
                            fontWeight: 300,
                            color: 'var(--albaeon-text-muted, #B7AFC3)',
                            marginBottom: '28px',
                            lineHeight: 1.7,
                        }}>
                            Add something worthy of the myth.
                        </p>
                        <a href="/shop" className="btn-primary">
                            Shop Collection
                        </a>
                    </div>

                    <div className="space-y-5">
                        <h2 className={`${cinzel.className} text-[28px] text-gold sm:text-[34px] lg:text-[40px]`}>
                            Recommended for You
                        </h2>
                        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                            {recommended.map((item) => (
                                <div
                                    key={item.name}
                                    className="flex flex-col gap-3.5 border border-gold bg-surface p-3.5"
                                >
                                    <div className="relative h-[320px] w-full overflow-hidden bg-primary-deep">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            sizes="(max-width: 1024px) 100vw, 308px"
                                            className="object-cover"
                                        />
                                    </div>
                                    <p className={`${cinzel.className} text-[20px] text-text-primary sm:text-[22px] lg:text-[24px]`}>
                                        {item.name}
                                    </p>
                                    <p className="font-sans text-[16px] font-semibold text-gold sm:text-[18px]">
                                        {item.price}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="min-h-screen bg-primary">
            <div className="desktop-frame flex flex-col gap-7 py-6 sm:py-8 lg:gap-7 lg:py-12">
                <h1 className={`${cinzel.className} text-[32px] font-normal text-gold sm:text-[44px] lg:text-[52px]`}>
                    Your Cart
                </h1>

                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                    <div className="space-y-4">
                        {items.map((item) => (
                                <div
                                    key={item.variantId}
                                    className="flex flex-col gap-4 border border-gold bg-surface p-4 sm:flex-row sm:gap-6 card-hover"
                                >
                                    <div className="relative h-[200px] w-full overflow-hidden border border-gold bg-primary-deep sm:w-[180px]">
                                        {item.image ? (
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                sizes="(max-width: 640px) 100vw, 180px"
                                                className="object-cover"
                                            />
                                        ) : null}
                                    </div>
                                    <div className="flex flex-1 flex-col gap-2.5">
                                        <p className={`${cinzel.className} text-[22px] text-text-primary sm:text-[26px] lg:text-[28px]`}>
                                            {item.name}
                                        </p>
                                        <p className="font-sans text-[13px] text-text-muted sm:text-[14px]">
                                            {`Size: ${item.size || "-"}   Quantity: ${item.quantity}   Price: ${item.price}`}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-4 pt-1">
                                            <button
                                                type="button"
                                                className="font-sans text-[13px] text-gold transition-colors duration-200 hover:text-gold-hover sm:text-[14px]"
                                                onClick={() => {
                                                    removeItem(item.variantId);
                                                    addToast({
                                                        message: 'Item removed from cart',
                                                        type: 'info'
                                                    });
                                                }}
                                            >
                                                Remove
                                            </button>
                                            <button
                                                type="button"
                                                className="font-sans text-[13px] text-text-primary transition-colors duration-200 hover:text-gold sm:text-[14px]"
                                            >
                                                Move to Wishlist
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>

                    <div className="h-fit border border-gold bg-surface p-5 sm:p-6">
                        <h2 className={`${cinzel.className} text-[26px] text-gold sm:text-[30px] lg:text-[32px]`}>
                            Order Summary
                        </h2>
                        <p className="mt-3 whitespace-pre-line font-sans text-[14px] leading-[1.8] text-text-primary sm:text-[16px]">
                            {`Subtotal: ${subtotal.toLocaleString()}\nShipping: $18\nTotal: $448`}
                        </p>
                        <Link
                            href="/checkout/delivery"
                            className="mt-4 flex h-[52px] items-center justify-center bg-gold font-sans text-[15px] font-bold text-nav transition-colors duration-200 hover:bg-gold-hover"
                        >
                            Checkout
                        </Link>
                    </div>
                </div>

                <div className="space-y-5">
                    <h2 className={`${cinzel.className} text-[28px] text-gold sm:text-[34px] lg:text-[40px]`}>
                        Recommended for You
                    </h2>
                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {recommended.map((item) => (
                            <div
                                key={item.name}
                                className="flex flex-col gap-3.5 border border-gold bg-surface p-3.5"
                            >
                                <div className="relative h-[320px] w-full overflow-hidden bg-primary-deep">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        sizes="(max-width: 1024px) 100vw, 308px"
                                        className="object-cover"
                                    />
                                </div>
                                <p className={`${cinzel.className} text-[20px] text-text-primary sm:text-[22px] lg:text-[24px]`}>
                                    {item.name}
                                </p>
                                <p className="font-sans text-[16px] font-semibold text-gold sm:text-[18px]">
                                    {item.price}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

