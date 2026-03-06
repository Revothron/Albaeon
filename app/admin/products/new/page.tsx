"use client";

export default function AddProductPage() {
    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-text-primary text-2xl font-bold">Add Product</h1>
                <button className="btn-primary text-xs py-2 px-4">Save Product</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ── Main Info ── */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="card-surface p-6 space-y-5">
                        <div>
                            <label className="block text-text-muted text-sm mb-2">Product Name</label>
                            <input type="text" className="w-full bg-primary border border-white/10 text-text-primary px-4 py-2.5 text-sm focus:outline-none focus:border-gold/40" />
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <label className="block text-text-muted text-sm mb-2">SKU</label>
                                <input type="text" className="w-full bg-primary border border-white/10 text-text-primary px-4 py-2.5 text-sm focus:outline-none focus:border-gold/40" />
                            </div>
                            <div>
                                <label className="block text-text-muted text-sm mb-2">Slug</label>
                                <input type="text" className="w-full bg-primary border border-white/10 text-text-primary px-4 py-2.5 text-sm focus:outline-none focus:border-gold/40" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-text-muted text-sm mb-2">Description</label>
                            <textarea rows={5} className="w-full bg-primary border border-white/10 text-text-primary px-4 py-2.5 text-sm focus:outline-none focus:border-gold/40 resize-none" />
                        </div>
                    </div>

                    {/* ── Pricing ── */}
                    <div className="card-surface p-6">
                        <h3 className="text-text-primary text-lg font-semibold mb-5">Pricing</h3>
                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <label className="block text-text-muted text-sm mb-2">Regular Price (₹)</label>
                                <input type="number" className="w-full bg-primary border border-white/10 text-text-primary px-4 py-2.5 text-sm focus:outline-none focus:border-gold/40" />
                            </div>
                            <div>
                                <label className="block text-text-muted text-sm mb-2">Sale Price (₹)</label>
                                <input type="number" className="w-full bg-primary border border-white/10 text-text-primary px-4 py-2.5 text-sm focus:outline-none focus:border-gold/40" />
                            </div>
                        </div>
                    </div>

                    {/* ── Variants ── */}
                    <div className="card-surface p-6">
                        <h3 className="text-text-primary text-lg font-semibold mb-5">Variants & Attributes</h3>
                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <label className="block text-text-muted text-sm mb-2">Colors</label>
                                <input type="text" placeholder="e.g. Black, White" className="w-full bg-primary border border-white/10 text-text-primary px-4 py-2.5 text-sm focus:outline-none focus:border-gold/40" />
                            </div>
                            <div>
                                <label className="block text-text-muted text-sm mb-2">Sizes</label>
                                <input type="text" placeholder="e.g. S, M, L, XL" className="w-full bg-primary border border-white/10 text-text-primary px-4 py-2.5 text-sm focus:outline-none focus:border-gold/40" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Sidebar ── */}
                <div className="space-y-6">
                    <div className="card-surface p-6">
                        <h3 className="text-text-primary text-lg font-semibold mb-5">Category</h3>
                        <select className="w-full bg-primary border border-white/10 text-text-primary text-sm px-4 py-2.5 focus:outline-none focus:border-gold/40">
                            <option>Select Category</option>
                            <option>T-Shirts</option>
                            <option>Hoodies</option>
                        </select>
                    </div>

                    <div className="card-surface p-6">
                        <h3 className="text-text-primary text-lg font-semibold mb-5">Status</h3>
                        <select className="w-full bg-primary border border-white/10 text-text-primary text-sm px-4 py-2.5 focus:outline-none focus:border-gold/40">
                            <option>Draft</option>
                            <option>Active</option>
                        </select>
                    </div>

                    <div className="card-surface p-6">
                        <h3 className="text-text-primary text-lg font-semibold mb-5">Images</h3>
                        <div className="border-2 border-dashed border-white/10 p-8 text-center text-text-muted text-sm hover:border-gold/30 transition-colors cursor-pointer">
                            Click to upload images
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
