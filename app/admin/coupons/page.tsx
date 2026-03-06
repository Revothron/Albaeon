import { Search, Plus } from "lucide-react";

export default function AdminCouponsPage() {
    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-text-primary text-2xl font-bold">Coupons</h1>
                <button className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" />
                    Create Coupon
                </button>
            </div>

            <div className="relative w-80 mb-8">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                    type="text"
                    placeholder="Search coupons..."
                    className="w-full bg-surface border border-white/10 text-text-primary pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-gold/40"
                />
            </div>

            <div className="card-surface overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-white/5">
                            <th className="text-left text-text-muted font-medium py-3 px-4">Code</th>
                            <th className="text-left text-text-muted font-medium py-3 px-4">Discount</th>
                            <th className="text-left text-text-muted font-medium py-3 px-4">Type</th>
                            <th className="text-left text-text-muted font-medium py-3 px-4">Validity</th>
                            <th className="text-left text-text-muted font-medium py-3 px-4">Usage Limit</th>
                            <th className="text-left text-text-muted font-medium py-3 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="py-8 px-4 text-center text-text-muted" colSpan={6}>
                                No coupons yet
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
