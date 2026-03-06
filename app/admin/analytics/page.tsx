export default function AnalyticsOverviewPage() {
    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-text-primary text-2xl font-bold">Analytics Overview</h1>
                <select className="bg-surface border border-white/10 text-text-primary text-sm px-4 py-2 focus:outline-none focus:border-gold/40">
                    <option>Today</option>
                    <option>Yesterday</option>
                    <option>Last Week</option>
                    <option>Last Month</option>
                    <option>Last Quarter</option>
                    <option>Last Year</option>
                </select>
            </div>

            {/* ── Performance Cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
                {["Total Sales", "Net Sales", "Orders", "Products Sold", "Variations Sold"].map((label) => (
                    <div key={label} className="card-surface p-4">
                        <p className="text-text-muted text-xs mb-1">{label}</p>
                        <p className="text-text-primary text-xl font-bold">0</p>
                    </div>
                ))}
            </div>

            {/* ── Charts ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                <div className="card-surface p-6">
                    <h3 className="text-text-primary text-sm font-semibold mb-4">Net Sales</h3>
                    <div className="h-48 bg-primary rounded flex items-center justify-center">
                        <p className="text-text-muted text-sm">Chart placeholder</p>
                    </div>
                </div>
                <div className="card-surface p-6">
                    <h3 className="text-text-primary text-sm font-semibold mb-4">Orders</h3>
                    <div className="h-48 bg-primary rounded flex items-center justify-center">
                        <p className="text-text-muted text-sm">Chart placeholder</p>
                    </div>
                </div>
            </div>

            {/* ── Leaderboards ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card-surface p-6">
                    <h3 className="text-gold text-sm font-medium tracking-wider uppercase mb-4">
                        Top Categories — Items Sold
                    </h3>
                    <p className="text-text-muted text-sm">Leaderboard data will appear here.</p>
                </div>
                <div className="card-surface p-6">
                    <h3 className="text-gold text-sm font-medium tracking-wider uppercase mb-4">
                        Top Products — Items Sold
                    </h3>
                    <p className="text-text-muted text-sm">Leaderboard data will appear here.</p>
                </div>
            </div>
        </div>
    );
}
