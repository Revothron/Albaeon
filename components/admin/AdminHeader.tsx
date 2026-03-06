"use client";

import { Search, Bell, User } from "lucide-react";

export default function AdminHeader() {
    return (
        <header className="h-16 bg-nav border-b border-white/5 flex items-center justify-between px-6">
            {/* ── Search ── */}
            <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full bg-surface border border-white/10 rounded pl-10 pr-4 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-gold/40 transition-colors"
                />
            </div>

            {/* ── Right ── */}
            <div className="flex items-center gap-4">
                <button
                    className="relative text-text-muted hover:text-gold transition-colors"
                    aria-label="Notifications"
                >
                    <Bell className="w-5 h-5" />
                </button>
                <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center">
                    <User className="w-4 h-4 text-text-muted" />
                </div>
            </div>
        </header>
    );
}
