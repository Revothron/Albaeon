"use client";

import { Minus, Plus, X, Heart } from "lucide-react";

export default function CartPage() {
    return (
        <div className="bg-primary min-h-screen">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <h1 className="text-gold text-3xl font-bold tracking-wider uppercase mb-10">
                    Cart
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* ── Cart Items ── */}
                    <div className="lg:col-span-2 space-y-6">
                        {[1, 2].map((i) => (
                            <div key={i} className="card-surface p-5 flex gap-5">
                                <div className="w-24 h-32 bg-surface flex-shrink-0" />
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-text-primary text-sm font-medium">Product Name</p>
                                            <p className="text-text-muted text-xs mt-1">Size: M</p>
                                        </div>
                                        <button className="text-text-muted hover:text-red-400 transition-colors">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-gold text-sm font-semibold mt-3">₹1,299</p>
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center gap-0 border border-white/10">
                                            <button className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-gold transition-colors">
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="w-10 h-8 flex items-center justify-center text-text-primary text-xs border-x border-white/10">
                                                1
                                            </span>
                                            <button className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-gold transition-colors">
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <button className="text-text-muted hover:text-gold transition-colors text-xs flex items-center gap-1">
                                            <Heart className="w-3.5 h-3.5" />
                                            Move to Wishlist
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ── Summary ── */}
                    <div className="card-surface p-6 h-fit sticky top-24">
                        <h3 className="text-text-primary text-lg font-semibold mb-6">Order Summary</h3>
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-text-muted">Subtotal</span>
                                <span className="text-text-primary">₹2,598</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-text-muted">Shipping</span>
                                <span className="text-text-primary">Calculated at checkout</span>
                            </div>
                            <div className="border-t border-white/5 pt-3 flex justify-between font-semibold">
                                <span className="text-text-primary">Total</span>
                                <span className="text-gold">₹2,598</span>
                            </div>
                        </div>
                        <button className="btn-primary w-full">Checkout</button>
                    </div>
                </div>

                {/* ── Recommended Products ── */}
                <section className="mt-16">
                    <h2 className="text-gold text-xl font-semibold tracking-wider uppercase mb-8">
                        You May Also Like
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
                </section>
            </div>
        </div>
    );
}
