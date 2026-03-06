export default function ProfilePage() {
    return (
        <div className="card-surface p-8">
            <h2 className="text-text-primary text-xl font-semibold mb-8">My Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                <div>
                    <label className="block text-text-muted text-sm mb-2">First Name</label>
                    <input
                        type="text"
                        className="w-full bg-primary border border-white/10 text-text-primary px-4 py-2.5 text-sm focus:outline-none focus:border-gold/40 transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-text-muted text-sm mb-2">Last Name</label>
                    <input
                        type="text"
                        className="w-full bg-primary border border-white/10 text-text-primary px-4 py-2.5 text-sm focus:outline-none focus:border-gold/40 transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-text-muted text-sm mb-2">Display Name</label>
                    <input
                        type="text"
                        className="w-full bg-primary border border-white/10 text-text-primary px-4 py-2.5 text-sm focus:outline-none focus:border-gold/40 transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-text-muted text-sm mb-2">Email Address</label>
                    <input
                        type="email"
                        className="w-full bg-primary border border-white/10 text-text-primary px-4 py-2.5 text-sm focus:outline-none focus:border-gold/40 transition-colors"
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-text-muted text-sm mb-2">Password Change</label>
                    <input
                        type="password"
                        placeholder="New password"
                        className="w-full bg-primary border border-white/10 text-text-primary px-4 py-2.5 text-sm focus:outline-none focus:border-gold/40 transition-colors"
                    />
                </div>
            </div>
            <div className="flex gap-4 mt-8">
                <button className="btn-primary">Save Changes</button>
                <button className="text-red-400 text-sm hover:text-red-300 transition-colors">
                    Delete Account
                </button>
            </div>
        </div>
    );
}
