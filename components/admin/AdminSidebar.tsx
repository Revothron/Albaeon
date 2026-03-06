"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    Users,
    BarChart3,
    Headphones,
    LogOut,
    ChevronDown,
    Ticket,
} from "lucide-react";

const analyticsSubMenu = [
    { name: "Overview", href: "/admin/analytics" },
    { name: "Products", href: "/admin/analytics/products" },
    { name: "Revenue", href: "/admin/analytics/revenue" },
    { name: "Orders", href: "/admin/analytics/orders" },
    { name: "Categories", href: "/admin/analytics/categories" },
];

const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Coupons", href: "/admin/coupons", icon: Ticket },
    { name: "Customers", href: "/admin/customers", icon: Users },
    {
        name: "Analytics",
        href: "/admin/analytics",
        icon: BarChart3,
        subMenu: analyticsSubMenu,
    },
    { name: "Support", href: "/admin/support", icon: Headphones },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const [analyticsOpen, setAnalyticsOpen] = useState(
        pathname.startsWith("/admin/analytics")
    );

    const isActive = (href: string) => {
        if (href === "/admin") return pathname === "/admin";
        return pathname.startsWith(href);
    };

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-64 bg-nav border-r border-white/5 flex flex-col z-40">
            {/* ── Logo ── */}
            <div className="h-16 flex items-center px-6 border-b border-white/5">
                <Link
                    href="/admin"
                    className="text-gold text-lg font-bold tracking-[0.2em] uppercase"
                >
                    Albaeon
                </Link>
            </div>

            {/* ── Menu ── */}
            <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    if (item.subMenu) {
                        return (
                            <div key={item.name}>
                                <button
                                    onClick={() => setAnalyticsOpen(!analyticsOpen)}
                                    className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded text-sm transition-colors duration-200 ${active
                                            ? "bg-surface text-gold"
                                            : "text-text-muted hover:bg-surface hover:text-text-primary"
                                        }`}
                                >
                                    <span className="flex items-center gap-3">
                                        <Icon className="w-4.5 h-4.5" />
                                        {item.name}
                                    </span>
                                    <ChevronDown
                                        className={`w-3.5 h-3.5 transition-transform duration-200 ${analyticsOpen ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>

                                {analyticsOpen && (
                                    <div className="ml-7 mt-1 space-y-0.5">
                                        {item.subMenu.map((sub) => (
                                            <Link
                                                key={sub.href}
                                                href={sub.href}
                                                className={`block px-3 py-2 rounded text-sm transition-colors duration-200 ${pathname === sub.href
                                                        ? "text-gold bg-surface"
                                                        : "text-text-muted hover:text-text-primary hover:bg-surface/50"
                                                    }`}
                                            >
                                                {sub.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    }

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors duration-200 ${active
                                    ? "bg-surface text-gold"
                                    : "text-text-muted hover:bg-surface hover:text-text-primary"
                                }`}
                        >
                            <Icon className="w-4.5 h-4.5" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* ── Logout ── */}
            <div className="px-3 py-4 border-t border-white/5">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm text-text-muted hover:bg-surface hover:text-red-400 transition-colors duration-200">
                    <LogOut className="w-4.5 h-4.5" />
                    Logout
                </button>
            </div>
        </aside>
    );
}
