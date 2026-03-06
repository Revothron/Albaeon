export default function CustomerDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    return (
        <div>
            <h1 className="text-text-primary text-2xl font-bold mb-8">Customer Detail</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="card-surface p-6">
                    <h3 className="text-gold text-sm font-medium tracking-wider uppercase mb-4">Profile</h3>
                    <p className="text-text-muted text-sm">Customer profile details.</p>
                </div>
                <div className="card-surface p-6">
                    <h3 className="text-gold text-sm font-medium tracking-wider uppercase mb-4">Address</h3>
                    <p className="text-text-muted text-sm">Customer addresses.</p>
                </div>
                <div className="card-surface p-6">
                    <h3 className="text-gold text-sm font-medium tracking-wider uppercase mb-4">Stats</h3>
                    <p className="text-text-muted text-sm">Order history stats.</p>
                </div>
            </div>

            <div className="card-surface p-6">
                <h3 className="text-gold text-sm font-medium tracking-wider uppercase mb-4">Order History</h3>
                <p className="text-text-muted text-sm">Customer order history table.</p>
            </div>
        </div>
    );
}
