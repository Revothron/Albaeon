import { Search } from "lucide-react";

export default function AdminCustomersPage() {
    return (
        <div>
            <h1 className="text-text-primary text-2xl font-bold mb-8">Customers</h1>

            <div className="relative w-80 mb-8">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                    type="text"
                    placeholder="Search customers..."
                    className="w-full bg-surface border border-white/10 text-text-primary pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-gold/40"
                />
            </div>

            <div className="card-surface overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-white/5">
                            <th className="text-left text-text-muted font-medium py-3 px-4">Name</th>
                            <th className="text-left text-text-muted font-medium py-3 px-4">Username</th>
                            <th className="text-left text-text-muted font-medium py-3 px-4">Registered</th>
                            <th className="text-left text-text-muted font-medium py-3 px-4">Email</th>
                            <th className="text-left text-text-muted font-medium py-3 px-4">Orders</th>
                            <th className="text-left text-text-muted font-medium py-3 px-4">Total Spent</th>
                            <th className="text-left text-text-muted font-medium py-3 px-4">AOV</th>
                            <th className="text-left text-text-muted font-medium py-3 px-4">Location</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="py-8 px-4 text-center text-text-muted" colSpan={8}>
                                No customers yet
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
