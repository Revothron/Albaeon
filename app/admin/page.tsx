import {
    ShoppingCart,
    DollarSign,
    Clock,
    CalendarDays,
} from "lucide-react";

const stats = [
    { label: "Total Orders", value: "0", icon: ShoppingCart },
    { label: "Total Revenue", value: "₹0", icon: DollarSign },
    { label: "Pending Orders", value: "0", icon: Clock },
    { label: "Today's Orders", value: "0", icon: CalendarDays },
];

export default function AdminDashboard() {
    return (
        <div>
            <h1 className="text-text-primary text-2xl font-bold mb-8">Dashboard</h1>

            {/* ── Stats Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="card-surface p-5">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-text-muted text-sm">{stat.label}</span>
                                <Icon className="w-4.5 h-4.5 text-gold" />
                            </div>
                            <p className="text-text-primary text-2xl font-bold">{stat.value}</p>
                        </div>
                    );
                })}
            </div>

            {/* ── Sales Overview Chart ── */}
            <div className="card-surface p-6 mb-10">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-text-primary text-lg font-semibold">Sales Overview</h2>
                    <div className="flex gap-2">
                        <button className="text-xs px-3 py-1.5 bg-surface-hover text-gold rounded">
                            7 Days
                        </button>
                        <button className="text-xs px-3 py-1.5 text-text-muted hover:text-text-primary transition-colors">
                            30 Days
                        </button>
                    </div>
                </div>
                <div className="h-64 bg-primary rounded flex items-center justify-center">
                    <p className="text-text-muted text-sm">Revenue chart will appear here</p>
                </div>
            </div>

            {/* ── Recent Orders ── */}
            <div className="card-surface p-6">
                <h2 className="text-text-primary text-lg font-semibold mb-6">Recent Orders</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left text-text-muted font-medium py-3 px-4">Order ID</th>
                                <th className="text-left text-text-muted font-medium py-3 px-4">Customer</th>
                                <th className="text-left text-text-muted font-medium py-3 px-4">Amount</th>
                                <th className="text-left text-text-muted font-medium py-3 px-4">Status</th>
                                <th className="text-left text-text-muted font-medium py-3 px-4">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="py-8 px-4 text-center text-text-muted" colSpan={5}>
                                    No orders yet
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
