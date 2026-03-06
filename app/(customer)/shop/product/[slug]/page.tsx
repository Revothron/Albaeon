"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

const tabs = ["Description", "Size Chart", "Wash Care", "Return & Exchange Policy"];

export default function ProductPage() {
    const [selectedSize, setSelectedSize] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState("Description");

    return (
        <div className="bg-primary min-h-screen">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* ── Left: Image Gallery ── */}
                    <div>
                        <div className="aspect-[3/4] bg-surface mb-4" />
                        <div className="grid grid-cols-4 gap-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="aspect-square bg-surface cursor-pointer border border-white/10 hover:border-gold/40 transition-colors" />
                            ))}
                        </div>
                    </div>

                    {/* ── Right: Details ── */}
                    <div>
                        <h1 className="text-text-primary text-2xl font-bold mb-2">
                            Product Name
                        </h1>
                        <p className="text-gold text-xl font-semibold mb-6">₹1,299</p>

                        {/* Size */}
                        <div className="mb-6">
                            <p className="text-text-primary text-sm font-medium mb-3">Size</p>
                            <div className="flex gap-3">
                                {["S", "M", "L", "XL", "XXL"].map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`w-12 h-12 border text-sm font-medium transition-colors ${selectedSize === size
                                                ? "border-gold bg-gold text-nav"
                                                : "border-white/10 text-text-primary hover:border-gold/40"
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity */}
                        <div className="mb-8">
                            <p className="text-text-primary text-sm font-medium mb-3">Quantity</p>
                            <div className="flex items-center gap-0 border border-white/10 w-fit">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-10 h-10 flex items-center justify-center text-text-muted hover:text-gold transition-colors"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-12 h-10 flex items-center justify-center text-text-primary text-sm border-x border-white/10">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-10 h-10 flex items-center justify-center text-text-muted hover:text-gold transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 mb-10">
                            <button className="btn-primary flex-1">Add to Cart</button>
                            <button className="btn-secondary flex-1">Buy Now</button>
                        </div>
                    </div>
                </div>

                {/* ── Tabs Section ── */}
                <div className="mt-16 border-t border-white/5 pt-10">
                    <div className="flex gap-8 border-b border-white/5 mb-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-3 text-sm tracking-wider uppercase transition-colors ${activeTab === tab
                                        ? "text-gold border-b-2 border-gold"
                                        : "text-text-muted hover:text-text-primary"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="text-text-muted text-sm leading-relaxed max-w-3xl">
                        <p>
                            Detailed product information will appear here based on the selected tab.
                            This section covers Description, Size Chart, Wash Care, and Return &amp; Exchange Policy.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
