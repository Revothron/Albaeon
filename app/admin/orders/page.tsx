import { Search, Eye } from "lucide-react";

export default function AdminOrdersPage() {
    return (
        <div>
            <h1 className="text-text-primary text-2xl font-bold mb-8">Orders</h1>

            {/* ── Filters ── */}
            <div className="flex flex-wrap gap-3 mb-8">
                <input
                    type="date"
                    className="bg-surface border border-white/10 text-text-primary text-sm px-4 py-2 focus:outline-none focus:border-gold/40"
                />
                <select className="bg-surface border border-white/10 text-text-primary text-sm px-4 py-2 focus:outline-none focus:border-gold/40">
                    <option>Payment Status</option>
                    <option>Paid</option>
                    <option>Pending</option>
                    <option>Failed</option>
                </select>
                <select className="bg-surface border border-white/10 text-text-primary text-sm px-4 py-2 focus:outline-none focus:border-gold/40">
                    <option>Fulfillment Status</option>
                    <option>Processing</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                </select>
                <select className="bg-surface border border-white/10 text-text-primary text-sm px-4 py-2 focus:outline-none focus:border-gold/40">
                    <option>Provider</option>
                    <option>Banian</option>
                    <option>Gelato</option>
                </select>
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                        type="text"
                        placeholder="Search by Order ID..."
                        className="w-full bg-surface border border-white/10 text-text-primary pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-gold/40"
                    />
                </div>
            </div>

            {/* ── Orders Table ── */}
            <div className="card-surface overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-white/5">
                            <th className="text-left text-text-muted font-medium py-3 px-4">Order ID</th>
                            <th className="text-left text-text-muted font-medium py-3 px-4">Customer</th>
                            <th className="text-left text-text-muted font-medium py-3 px-4">Date</th>
                            <th className="text-left text-text-muted font-medium py-3 px-4">Amount</th>
                            <th className="text-left text-text-muted font-medium py-3 px-4">Payment</th>
                            <th className="text-left text-text-muted font-medium py-3 px-4">Fulfillment</th>
                            <th className="text-left text-text-muted font-medium py-3 px-4">Provider</th>
                            <th className="text-left text-text-muted font-medium py-3 px-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="py-8 px-4 text-center text-text-muted" colSpan={8}>
                                No orders yet
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
