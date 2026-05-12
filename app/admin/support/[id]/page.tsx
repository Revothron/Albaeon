export const dynamic = 'force-dynamic';

export default function SupportDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    return (
        <div>
            <h1 className="text-text-primary text-2xl font-bold mb-8">Support Message</h1>

            {/* ── Message ── */}
            <div className="card-surface p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-text-primary text-sm font-medium">Customer Name</p>
                        <p className="text-text-muted text-xs mt-1">customer@example.com</p>
                    </div>
                    <span className="text-xs px-3 py-1 bg-surface-hover text-gold rounded-full">
                        Pending
                    </span>
                </div>
                <div className="border-t border-white/5 pt-4">
                    <p className="text-text-primary text-sm leading-relaxed">
                        The customer message content will appear here.
                    </p>
                </div>
            </div>

            {/* ── Actions ── */}
            <div className="card-surface p-6 mb-6">
                <h3 className="text-gold text-sm font-medium tracking-wider uppercase mb-4">
                    Status
                </h3>
                <div className="flex gap-3">
                    <button className="btn-secondary text-xs py-2 px-4">Mark as Read</button>
                    <button className="btn-secondary text-xs py-2 px-4">Mark as Resolved</button>
                    <button className="btn-secondary text-xs py-2 px-4">Mark as Pending</button>
                </div>
            </div>

            {/* ── Reply ── */}
            <div className="card-surface p-6">
                <h3 className="text-gold text-sm font-medium tracking-wider uppercase mb-4">
                    Reply to Customer
                </h3>
                <textarea
                    rows={5}
                    placeholder="Type your reply..."
                    className="w-full bg-primary border border-white/10 text-text-primary px-4 py-2.5 text-sm focus:outline-none focus:border-gold/40 resize-none mb-4"
                />
                <button className="btn-primary text-xs py-2 px-6">Send Reply</button>
            </div>
        </div>
    );
}
