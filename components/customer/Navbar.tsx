"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Search,
    Heart,
    ShoppingBag,
    User,
    ChevronDown,
    Menu,
    X,
} from "lucide-react";

const shopCategories = [
    { name: "T-Shirts", href: "/shop/t-shirts" },
    { name: "Hoodies", href: "/shop/hoodies" },
];

export default function Navbar() {
    const [shopOpen, setShopOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <nav className="bg-nav sticky top-0 z-50 border-b border-white/5">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* ── Left: Shop + About ── */}
                <div className="hidden md:flex items-center gap-8">
                    {/* Shop Dropdown */}
                    <div
                        className="relative"
                        onMouseEnter={() => setShopOpen(true)}
                        onMouseLeave={() => setShopOpen(false)}
                    >
                        <button className="flex items-center gap-1 text-text-muted text-sm tracking-wider uppercase hover:text-gold transition-colors duration-300">
                            Shop
                            <ChevronDown className="w-3.5 h-3.5" />
                        </button>

                        {shopOpen && (
                            <div className="absolute top-full left-0 mt-2 w-48 bg-surface border border-white/10 py-2 z-50">
                                {shopCategories.map((cat) => (
                                    <Link
                                        key={cat.href}
                                        href={cat.href}
                                        className="block px-5 py-2.5 text-sm text-text-primary hover:bg-surface-hover hover:text-gold transition-colors duration-200"
                                    >
                                        {cat.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    <Link
                        href="/about"
                        className="text-text-muted text-sm tracking-wider uppercase hover:text-gold transition-colors duration-300"
                    >
                        About
                    </Link>
                </div>

                {/* ── Center: Logo ── */}
                <Link
                    href="/"
                    className="text-gold text-xl font-bold tracking-[0.2em] uppercase"
                >
                    Albaeon
                </Link>

                {/* ── Right: Icons ── */}
                <div className="hidden md:flex items-center gap-5">
                    <Link
                        href="/search"
                        className="text-text-muted hover:text-gold transition-colors duration-300"
                        aria-label="Search"
                    >
                        <Search className="w-5 h-5" />
                    </Link>
                    <Link
                        href="/wishlist"
                        className="text-text-muted hover:text-gold transition-colors duration-300"
                        aria-label="Wishlist"
                    >
                        <Heart className="w-5 h-5" />
                    </Link>
                    <Link
                        href="/cart"
                        className="text-text-muted hover:text-gold transition-colors duration-300 relative"
                        aria-label="Cart"
                    >
                        <ShoppingBag className="w-5 h-5" />
                    </Link>
                    <Link
                        href="/account"
                        className="text-text-muted hover:text-gold transition-colors duration-300"
                        aria-label="My Account"
                    >
                        <User className="w-5 h-5" />
                    </Link>
                </div>

                {/* ── Mobile Menu Toggle ── */}
                <button
                    className="md:hidden text-text-muted hover:text-gold transition-colors"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* ── Mobile Menu ── */}
            {mobileOpen && (
                <div className="md:hidden bg-nav border-t border-white/5 px-6 py-6 space-y-4">
                    <Link
                        href="/shop"
                        className="block text-text-muted text-sm tracking-wider uppercase hover:text-gold transition-colors"
                    >
                        Shop
                    </Link>
                    {shopCategories.map((cat) => (
                        <Link
                            key={cat.href}
                            href={cat.href}
                            className="block pl-4 text-text-muted text-sm hover:text-gold transition-colors"
                        >
                            {cat.name}
                        </Link>
                    ))}
                    <Link
                        href="/about"
                        className="block text-text-muted text-sm tracking-wider uppercase hover:text-gold transition-colors"
                    >
                        About
                    </Link>
                    <div className="flex items-center gap-5 pt-4 border-t border-white/5">
                        <Link href="/search" className="text-text-muted hover:text-gold transition-colors" aria-label="Search">
                            <Search className="w-5 h-5" />
                        </Link>
                        <Link href="/wishlist" className="text-text-muted hover:text-gold transition-colors" aria-label="Wishlist">
                            <Heart className="w-5 h-5" />
                        </Link>
                        <Link href="/cart" className="text-text-muted hover:text-gold transition-colors" aria-label="Cart">
                            <ShoppingBag className="w-5 h-5" />
                        </Link>
                        <Link href="/account" className="text-text-muted hover:text-gold transition-colors" aria-label="My Account">
                            <User className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
