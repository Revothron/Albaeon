export default function AdminOrderDetailPage() {
    return (
        <div>
            <h1 className="text-text-primary text-2xl font-bold mb-8">Order Detail</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
                {/* ── Customer & Shipping ── */}
                <div className="card-surface p-6">
                    <h3 className="text-gold text-sm font-medium tracking-wider uppercase mb-4">
                        Customer Info
                    </h3>
                    <p className="text-text-muted text-sm">Customer details will appear here.</p>
                </div>

                <div className="card-surface p-6">
                    <h3 className="text-gold text-sm font-medium tracking-wider uppercase mb-4">
                        Shipping Address
                    </h3>
                    <p className="text-text-muted text-sm">Shipping details will appear here.</p>
                </div>

                <div className="card-surface p-6">
                    <h3 className="text-gold text-sm font-medium tracking-wider uppercase mb-4">
                        Payment Details
                    </h3>
                    <p className="text-text-muted text-sm">Payment details will appear here.</p>
                </div>
            </div>

            {/* ── Order Items ── */}
            <div className="card-surface p-6 mt-6">
                <h3 className="text-gold text-sm font-medium tracking-wider uppercase mb-4">
                    Order Items
                </h3>
                <p className="text-text-muted text-sm">Order items will appear here.</p>
            </div>

            {/* ── Actions ── */}
            <div className="card-surface p-6 mt-6">
                <h3 className="text-gold text-sm font-medium tracking-wider uppercase mb-4">
                    Actions
                </h3>
                <div className="flex flex-wrap gap-3">
                    <button className="btn-secondary text-xs py-2 px-4">Mark as Processing</button>
                    <button className="btn-secondary text-xs py-2 px-4">Mark as Shipped</button>
                    <button className="btn-primary text-xs py-2 px-4">Add Tracking Number</button>
                </div>
            </div>
        </div>
    );
}
