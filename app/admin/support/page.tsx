import { Search } from "lucide-react";

export default function AdminSupportPage() {
    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-text-primary text-2xl font-bold">Support</h1>
                <select className="bg-surface border border-white/10 text-text-primary text-sm px-4 py-2 focus:outline-none focus:border-gold/40">
                    <option>Today</option>
                    <option>Yesterday</option>
                    <option>Last Week</option>
                    <option>Last Month</option>
                    <option>Last Quarter</option>
                    <option>Last Year</option>
                </select>
            </div>

            <div className="relative w-80 mb-8">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                    type="text"
                    placeholder="Search messages..."
                    className="w-full bg-surface border border-white/10 text-text-primary pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-gold/40"
                />
            </div>

            {/* ── Messages List ── */}
            <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                    <a key={i} href={`/admin/support/${i}`} className="card-surface p-5 flex items-center justify-between group cursor-pointer block">
                        <div>
                            <p className="text-text-primary text-sm font-medium">Customer Name</p>
                            <p className="text-text-muted text-xs mt-1">Subject of the message...</p>
                            <p className="text-text-muted text-xs mt-2">March {i}, 2026</p>
                        </div>
                        <span className="text-xs px-3 py-1 bg-surface-hover text-gold rounded-full">
                            Pending
                        </span>
                    </a>
                ))}
            </div>
        </div>
    );
}
