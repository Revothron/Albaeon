import { Search } from "lucide-react";

export default function SearchPage() {
    return (
        <div className="bg-primary min-h-screen">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <h1 className="text-gold text-3xl font-bold tracking-wider uppercase mb-8">
                    Search
                </h1>
                <div className="relative max-w-xl mb-12">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full bg-surface border border-white/10 text-text-primary pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-gold/40 transition-colors"
                    />
                </div>
                <p className="text-text-muted text-sm">Search results will appear here.</p>
            </div>
        </div>
    );
}
