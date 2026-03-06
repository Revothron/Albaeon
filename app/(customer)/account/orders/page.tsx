import { Search, Download } from "lucide-react";

export default function OrdersPage() {
    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-text-primary text-xl font-semibold">Orders</h2>
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                        type="text"
                        placeholder="Search orders..."
                        className="w-full bg-surface border border-white/10 text-text-primary pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-gold/40 transition-colors"
                    />
                </div>
            </div>

            {/* ── Orders List ── */}
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="card-surface p-5">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <p className="text-text-primary text-sm font-medium">Order #ALB-00{i}</p>
                                <p className="text-text-muted text-xs mt-1">March {i}, 2026</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs px-3 py-1 bg-surface-hover text-gold rounded-full">
                                    Processing
                                </span>
                                <span className="text-text-primary text-sm font-medium">₹1,299</span>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-4">
                            <a href={`/track-order`} className="text-gold text-xs hover:text-gold-hover transition-colors">
                                Track Order
                            </a>
                            <button className="text-text-muted text-xs hover:text-gold transition-colors flex items-center gap-1">
                                <Download className="w-3 h-3" />
                                Invoice
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
