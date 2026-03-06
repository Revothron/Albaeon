"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Package, MapPin, LogOut } from "lucide-react";

const accountNav = [
    { name: "My Profile", href: "/account", icon: User },
    { name: "Orders", href: "/account/orders", icon: Package },
    { name: "Addresses", href: "/account/addresses", icon: MapPin },
];

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="bg-primary min-h-screen">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <h1 className="text-gold text-3xl font-bold tracking-wider uppercase mb-10">
                    My Account
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    {/* ── Sidebar ── */}
                    <div className="space-y-1">
                        {accountNav.map((item) => {
                            const Icon = item.icon;
                            const active =
                                item.href === "/account"
                                    ? pathname === "/account"
                                    : pathname.startsWith(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 text-sm rounded transition-colors ${active
                                            ? "bg-surface text-gold"
                                            : "text-text-muted hover:bg-surface/50 hover:text-text-primary"
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {item.name}
                                </Link>
                            );
                        })}
                        <button className="w-full flex items-center gap-3 px-4 py-3 text-sm rounded text-text-muted hover:bg-surface/50 hover:text-red-400 transition-colors">
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>

                    {/* ── Content ── */}
                    <div className="md:col-span-3">{children}</div>
                </div>
            </div>
        </div>
    );
}
