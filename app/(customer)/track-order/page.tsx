export default function TrackOrderPage() {
    return (
        <div className="bg-primary min-h-screen">
            <div className="max-w-xl mx-auto px-6 py-20 text-center">
                <h1 className="text-gold text-3xl font-bold tracking-wider uppercase mb-4">
                    Track Your Order
                </h1>
                <p className="text-text-muted text-sm mb-10">
                    Enter your order details below to check the current status.
                </p>

                <div className="card-surface p-8 text-left space-y-5">
                    <div>
                        <label className="block text-text-muted text-sm mb-2">Order ID</label>
                        <input
                            type="text"
                            placeholder="e.g. ALB-001"
                            className="w-full bg-primary border border-white/10 text-text-primary px-4 py-2.5 text-sm focus:outline-none focus:border-gold/40 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-text-muted text-sm mb-2">
                            Email Address or Phone Number
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your email or phone"
                            className="w-full bg-primary border border-white/10 text-text-primary px-4 py-2.5 text-sm focus:outline-none focus:border-gold/40 transition-colors"
                        />
                    </div>
                    <button className="btn-primary w-full">Track Order</button>
                </div>
            </div>
        </div>
    );
}
