import Link from "next/link";
import { Plus, Search } from "lucide-react";

export default function AdminProductsPage() {
    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-text-primary text-2xl font-bold">Products</h1>
                <Link href="/admin/products/new" className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" />
                    Add Product
                </Link>
            </div>

            {/* ── Search ── */}
            <div className="relative w-80 mb-8">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full bg-surface border border-white/10 text-text-primary pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-gold/40"
                />
            </div>

            {/* ── Product Table ── */}
            <div className="card-surface overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-white/5">
                            <th className="text-left text-text-muted font-medium py-3 px-4">Image</th>
                            <th className="text-left text-text-muted font-medium py-3 px-4">Name</th>
                            <th className="text-left text-text-muted font-medium py-3 px-4">Category</th>
                            <th className="text-left text-text-muted font-medium py-3 px-4">Price</th>
                            <th className="text-left text-text-muted font-medium py-3 px-4">Status</th>
                            <th className="text-left text-text-muted font-medium py-3 px-4">Date</th>
                            <th className="text-left text-text-muted font-medium py-3 px-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="py-8 px-4 text-center text-text-muted" colSpan={7}>
                                No products yet
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
