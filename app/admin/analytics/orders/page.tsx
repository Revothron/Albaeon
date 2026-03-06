import { Download } from "lucide-react";

export default function AnalyticsOrdersPage() {
    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-text-primary text-2xl font-bold">Order Analytics</h1>
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {["Orders", "Net Sales", "Avg Order Value", "Avg Items/Order"].map((label) => (
                    <div key={label} className="card-surface p-4 cursor-pointer hover:border-gold/20 transition-colors">
                        <p className="text-text-muted text-xs mb-1">{label}</p>
                        <div className="h-24 bg-primary rounded mt-2 flex items-center justify-center">
                            <p className="text-text-muted text-xs">Chart</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Order Table ── */}
            <div className="card-surface p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-text-primary text-lg font-semibold">Orders</h3>
                    <button className="btn-secondary text-xs py-2 px-4 flex items-center gap-1.5">
                        <Download className="w-3.5 h-3.5" />
                        Download Report
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left text-text-muted font-medium py-3 px-4">Date</th>
                                <th className="text-left text-text-muted font-medium py-3 px-4">Orders</th>
                                <th className="text-left text-text-muted font-medium py-3 px-4">Customer</th>
                                <th className="text-left text-text-muted font-medium py-3 px-4">Product(s)</th>
                                <th className="text-left text-text-muted font-medium py-3 px-4">Items Sold</th>
                                <th className="text-left text-text-muted font-medium py-3 px-4">Coupon(s)</th>
                                <th className="text-left text-text-muted font-medium py-3 px-4">Net Sales</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="py-8 px-4 text-center text-text-muted" colSpan={7}>No data yet</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
