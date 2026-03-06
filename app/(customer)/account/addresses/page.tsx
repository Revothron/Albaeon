import { Plus } from "lucide-react";

export default function AddressesPage() {
    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-text-primary text-xl font-semibold">Addresses</h2>
                <button className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" />
                    Add Address
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Billing */}
                <div className="card-surface p-6">
                    <h3 className="text-gold text-sm font-medium tracking-wider uppercase mb-4">
                        Billing Address
                    </h3>
                    <p className="text-text-muted text-sm leading-relaxed">
                        No billing address saved yet.
                    </p>
                </div>

                {/* Shipping */}
                <div className="card-surface p-6">
                    <h3 className="text-gold text-sm font-medium tracking-wider uppercase mb-4">
                        Shipping Address
                    </h3>
                    <p className="text-text-muted text-sm leading-relaxed">
                        No shipping address saved yet.
                    </p>
                </div>
            </div>
        </div>
    );
}
