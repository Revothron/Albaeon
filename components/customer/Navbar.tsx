"use client";

import StripedMarker from "@/components/customer/StripedMarker";
import { Cinzel } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
    Heart,
    Menu,
    Search,
    ShoppingCart,
    User,
    X,
} from "lucide-react";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const shopCategories = [
    { name: "T-Shirts", href: "/shop/t-shirts" },
    { name: "Hoodies", href: "/shop/hoodies" },
    { name: "Oversized Tees", href: "/shop/oversized-tees" },
    { name: "Drop Shoulder Fits", href: "/shop/drop-shoulder-fits" },
    { name: "Crop Tees", href: "/shop/crop-tees" },
    { name: "Future Categories", href: "/shop/future-categories" },
];

const shopHighlights = [
    { name: "New Arrivals", href: "/shop?view=new-arrivals" },
    { name: "Best Sellers", href: "/shop?view=best-sellers" },
    { name: "Limited Drops", href: "/shop?view=limited-drops" },
    { name: "Collections", href: "/shop" },
];

const iconLinks = [
    { href: "/search", label: "Search", Icon: Search },
    { href: "/wishlist", label: "Wishlist", Icon: Heart },
    { href: "/cart", label: "Cart", Icon: ShoppingCart },
    { href: "/login", label: "My Account", Icon: User },
];

export default function Navbar() {
    const [shopOpen, setShopOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const shopMenuRef = useRef<HTMLElement>(null);

    const closeMobileMenu = () => setMobileOpen(false);

    useEffect(() => {
        function handlePointerDown(event: MouseEvent) {
            if (!shopMenuRef.current?.contains(event.target as Node)) {
                setShopOpen(false);
            }
        }

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setShopOpen(false);
            }
        }

        document.addEventListener("mousedown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("mousedown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <nav ref={shopMenuRef} className="sticky top-0 z-50 bg-nav/95 text-text-primary backdrop-blur-sm">
            <div className="mx-auto hidden h-[50px] w-full max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center px-14 md:grid">
                <div className="flex items-center gap-7">
                    <div className="relative">
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 font-sans text-[16px] font-medium text-text-primary transition-colors duration-200 hover:text-gold"
                            aria-expanded={shopOpen}
                            aria-haspopup="menu"
                            onClick={() => setShopOpen((open) => !open)}
                        >
                            Shop
                            <StripedMarker />
                        </button>

                        <div
                            className={`absolute left-0 top-full pt-4 transition-all duration-200 ${
                                shopOpen
                                    ? "pointer-events-auto translate-y-0 opacity-100"
                                    : "pointer-events-none -translate-y-2 opacity-0"
                            }`}
                        >
                            <div className="min-w-[220px] border border-gold/15 bg-nav p-2 shadow-[0_18px_40px_rgba(0,0,0,0.35)]">
                                {shopCategories.map((category) => (
                                    <Link
                                        key={category.href}
                                        href={category.href}
                                        className="block px-4 py-3 text-sm text-text-muted transition-colors duration-200 hover:bg-white/5 hover:text-gold"
                                        onClick={() => setShopOpen(false)}
                                    >
                                        {category.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    <Link
                        href="/about"
                        className="text-[16px] font-medium text-text-primary transition-colors duration-200 hover:text-gold"
                        onClick={() => setShopOpen(false)}
                    >
                        About
                    </Link>
                </div>

                <Link href="/" aria-label="Albaeon home" className="justify-self-center">
                    <Image
                        src="/g3.png"
                        alt="Albaeon"
                        width={100}
                        height={30}
                        priority
                        className="h-auto w-[100px]"
                    />
                </Link>

                <div className="flex items-center justify-end gap-6">
                    {iconLinks.map(({ href, label, Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            aria-label={label}
                            className="text-text-primary transition-colors duration-200 hover:text-gold"
                        >
                            <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
                        </Link>
                    ))}
                </div>
            </div>

            <div
                className={`absolute inset-x-0 top-full hidden transition-all duration-200 md:block ${
                    shopOpen
                        ? "pointer-events-auto translate-y-0 opacity-100"
                        : "pointer-events-none -translate-y-2 opacity-0"
                }`}
            >
                <div className="border-y border-[#E6C97914] bg-[#130F18] shadow-[0_24px_48px_rgba(0,0,0,0.35)]">
                    <div className="mx-auto grid max-w-[1440px] grid-cols-[260px_260px_minmax(320px,1fr)] gap-14 px-14 py-6">
                        <div className="space-y-2.5">
                            <p className={`${cinzel.className} text-[10px] font-bold tracking-[0.3em] text-gold`}>
                                CATEGORIES
                            </p>
                            {shopCategories.map((category) => (
                                <Link
                                    key={category.href}
                                    href={category.href}
                                    className="block font-sans text-[14px] font-medium text-text-primary transition-colors duration-200 hover:text-gold"
                                    onClick={() => setShopOpen(false)}
                                >
                                    {category.name}
                                </Link>
                            ))}
                        </div>

                        <div className="space-y-2.5">
                            <p className={`${cinzel.className} text-[10px] font-bold tracking-[0.3em] text-gold`}>
                                SHOP
                            </p>
                            {shopHighlights.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="block font-sans text-[14px] font-medium text-text-primary transition-colors duration-200 hover:text-gold"
                                    onClick={() => setShopOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>

                        <div className="border border-[#E6C9791F] bg-[#1A1426] px-5 py-[18px]">
                            <p className={`${cinzel.className} text-[9px] font-bold tracking-[0.3em] text-gold`}>
                                FEATURED
                            </p>
                            <p className={`${cinzel.className} mt-2 text-[24px] font-semibold text-text-primary`}>
                                Mythcore Essentials
                            </p>
                            <p className="mt-3 max-w-[420px] font-sans text-[13px] leading-[1.5] text-text-muted">
                                Explore signature Albaeon silhouettes in T-Shirts and Hoodies designed for all-season layering.
                            </p>
                            <Link
                                href="/shop"
                                className={`${cinzel.className} mt-4 inline-flex h-10 items-center justify-center border border-gold px-[18px] text-[10px] font-semibold tracking-[0.2em] text-gold transition-colors duration-200 hover:bg-gold hover:text-nav`}
                                onClick={() => setShopOpen(false)}
                            >
                                SHOP NOW
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto flex h-[72px] w-full max-w-[1440px] items-center justify-between px-4 sm:px-6 md:hidden">
                <div className="w-10" aria-hidden="true" />

                <Link href="/" aria-label="Albaeon home" onClick={closeMobileMenu}>
                    <Image
                        src="/g3.png"
                        alt="Albaeon"
                        width={153}
                        height={35}
                        priority
                        className="h-auto w-[128px]"
                    />
                </Link>

                <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center text-text-primary transition-colors duration-200 hover:text-gold"
                    onClick={() => setMobileOpen((open) => !open)}
                    aria-expanded={mobileOpen}
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <X className="h-5 w-5" strokeWidth={1.8} /> : <Menu className="h-5 w-5" strokeWidth={1.8} />}
                </button>
            </div>

            {mobileOpen && (
                <div className="border-t border-white/5 bg-nav md:hidden">
                    <div className="space-y-5 px-4 pb-6 pt-5 sm:px-6">
                        <div className="space-y-3">
                            <Link
                                href="/shop"
                                className="block text-[16px] font-medium text-text-primary transition-colors duration-200 hover:text-gold"
                                onClick={closeMobileMenu}
                            >
                                Shop
                            </Link>

                            <div className="space-y-3 border-l border-white/10 pl-4">
                                {shopCategories.map((category) => (
                                    <Link
                                        key={category.href}
                                        href={category.href}
                                        className="block text-sm text-text-muted transition-colors duration-200 hover:text-gold"
                                        onClick={closeMobileMenu}
                                    >
                                        {category.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <Link
                            href="/about"
                            className="block text-[16px] font-medium text-text-primary transition-colors duration-200 hover:text-gold"
                            onClick={closeMobileMenu}
                        >
                            About
                        </Link>

                        <div className="flex items-center gap-5 border-t border-white/5 pt-5">
                            {iconLinks.map(({ href, label, Icon }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    aria-label={label}
                                    className="text-text-primary transition-colors duration-200 hover:text-gold"
                                    onClick={closeMobileMenu}
                                >
                                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
