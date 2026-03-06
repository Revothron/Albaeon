import { Search, Download } from "lucide-react";

export default function AnalyticsCategoriesPage() {
    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-text-primary text-2xl font-bold">Category Analytics</h1>
                <select className="bg-surface border border-white/10 text-text-primary text-sm px-4 py-2 focus:outline-none focus:border-gold/40">
                    <option>Today</option>
                    <option>Yesterday</option>
                    <option>Last Week</option>
                    <option>Last Month</option>
                    <option>Last Quarter</option>
                    <option>Last Year</option>
                </select>
            </div>

            {/* ── Charts ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                {["Items Sold", "Net Sales", "Orders"].map((label) => (
                    <div key={label} className="card-surface p-6 cursor-pointer hover:border-gold/20 transition-colors">
                        <h3 className="text-text-primary text-sm font-semibold mb-4">{label}</h3>
                        <div className="h-40 bg-primary rounded flex items-center justify-center">
                            <p className="text-text-muted text-sm">Chart</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Category Table ── */}
            <div className="card-surface p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-text-primary text-lg font-semibold">Categories</h3>
                    <div className="flex gap-3">
                        <div className="relative w-48">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input type="text" placeholder="Search..." className="w-full bg-primary border border-white/10 text-text-primary pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-gold/40" />
                        </div>
                        <button className="btn-secondary text-xs py-2 px-4 flex items-center gap-1.5">
                            <Download className="w-3.5 h-3.5" />
                            Download
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left text-text-muted font-medium py-3 px-4">Category</th>
                                <th className="text-left text-text-muted font-medium py-3 px-4">Items Sold</th>
                                <th className="text-left text-text-muted font-medium py-3 px-4">Net Sales</th>
                                <th className="text-left text-text-muted font-medium py-3 px-4">Products</th>
                                <th className="text-left text-text-muted font-medium py-3 px-4">Orders</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="py-8 px-4 text-center text-text-muted" colSpan={5}>No data yet</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
