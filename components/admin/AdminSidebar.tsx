"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Activity,
    ChevronDown,
    ClipboardList,
    Headset,
    LayoutDashboard,
    LogOut,
    Package,
    Users,
} from "lucide-react";
import { adminRaleway } from "@/components/admin/adminFonts";

const analyticsSubMenu = [
    { name: "Overview", href: "/admin/analytics" },
    { name: "Revenue", href: "/admin/analytics/revenue" },
    { name: "Orders", href: "/admin/analytics/orders" },
    { name: "Products", href: "/admin/analytics/products" },
    { name: "Category", href: "/admin/analytics/categories" },
];

const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Orders", href: "/admin/orders", icon: ClipboardList },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Customers", href: "/admin/customers", icon: Users },
    {
        name: "Analytics",
        href: "/admin/analytics",
        icon: Activity,
        subMenu: analyticsSubMenu,
    },
    { name: "Support", href: "/admin/support", icon: Headset, badge: "3" },
];

function itemIsActive(pathname: string, href: string) {
    if (href === "/admin") {
        return pathname === "/admin";
    }

    return pathname.startsWith(href);
}

export default function AdminSidebar() {
    const pathname = usePathname();
    const [analyticsOpen, setAnalyticsOpen] = useState(true);
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const analyticsVisible = analyticsOpen || pathname.startsWith("/admin/analytics");

    return (
        <>
            <div className="border-b border-[#E6C97914] bg-[#130F18] px-4 py-3 md:hidden">
                <Link href="/admin" className="block">
                    <Image
                        src="/g3.png"
                        alt="Albaeon"
                        width={74}
                        height={17}
                        priority
                        unoptimized
                        className="h-[17px] w-[74px]"
                    />
                    <p className={`${adminRaleway.className} mt-1 text-[9px] font-light tracking-[0.22em] text-text-muted`}>
                        ADMIN PANEL
                    </p>
                </Link>

                <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                    {menuItems.map((item) => {
                        const active = itemIsActive(pathname, item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.subMenu ? item.subMenu[0].href : item.href}
                                className={`shrink-0 border px-3 py-2 text-[11px] tracking-[0.16em] uppercase transition-colors duration-200 ${
                                    active
                                        ? "border-gold bg-gold/10 text-gold"
                                        : "border-[#E6C9791F] text-text-muted"
                                }`}
                                onClick={() => {
                                    if (item.subMenu) {
                                        setAnalyticsOpen(true);
                                    }
                                }}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </div>

                {analyticsOpen && (
                    <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                        {analyticsSubMenu.map((subItem) => (
                            <Link
                                key={subItem.href}
                                href={subItem.href}
                                className={`shrink-0 border px-3 py-2 text-[10px] tracking-[0.16em] uppercase transition-colors duration-200 ${
                                    pathname === subItem.href
                                        ? "border-gold bg-gold/10 text-gold"
                                        : "border-[#E6C9791A] text-text-muted"
                                }`}
                            >
                                {subItem.name}
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <aside className="hidden h-screen w-[220px] shrink-0 flex-col justify-between border-r border-[#E6C97914] bg-[#130F18] md:sticky md:top-0 md:flex">
                <div>
                    <div className="flex h-16 flex-col justify-center border-b border-[#E6C97914] px-6">
                        <Link href="/admin" className="block">
                            <Image
                                src="/g3.png"
                                alt="Albaeon"
                                width={74}
                                height={17}
                                priority
                                unoptimized
                                className="h-[17px] w-[74px]"
                            />
                            <p className={`${adminRaleway.className} mt-1 text-[10px] font-light tracking-[0.2em] text-text-muted`}>
                                ADMIN PANEL
                            </p>
                        </Link>
                    </div>

                    <nav className="px-0 py-4">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const active = itemIsActive(pathname, item.href);

                            if (item.subMenu) {
                                return (
                                    <div key={item.name}>
                                        <button
                                            type="button"
                                            onClick={() => setAnalyticsOpen((open) => !open)}
                                            className={`flex w-full items-center justify-between px-5 py-2.5 transition-colors duration-200 ${
                                                active
                                                    ? "text-gold"
                                                    : "text-text-muted hover:bg-gold/5 hover:text-text-primary"
                                            }`}
                                        >
                                            <span className={`flex items-center gap-2.5 ${adminRaleway.className} text-[13px]`}>
                                                <Icon className="h-4 w-4" strokeWidth={1.8} />
                                                {item.name}
                                            </span>
                                            <ChevronDown
                                                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                                                    analyticsVisible ? "rotate-180" : ""
                                                }`}
                                                strokeWidth={1.8}
                                            />
                                        </button>

                                        {analyticsVisible && (
                                            <div className="space-y-1 px-0 pb-2 pt-1">
                                                {item.subMenu.map((subItem) => {
                                                    const subActive = pathname === subItem.href;

                                                    return (
                                                        <Link
                                                            key={subItem.href}
                                                            href={subItem.href}
                                                            className={`block px-11 py-2 text-[12px] transition-colors duration-200 ${
                                                                subActive
                                                                    ? "border-l-2 border-gold bg-[#E6C97914] pl-[42px] text-gold"
                                                                    : "text-text-muted hover:bg-gold/5 hover:text-text-primary"
                                                            } ${adminRaleway.className}`}
                                                        >
                                                            {subItem.name}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            }

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center justify-between px-5 py-2.5 transition-colors duration-200 ${
                                        active
                                            ? "border-l-2 border-gold bg-[#E6C97914] pl-[18px] text-gold"
                                            : "text-text-muted hover:bg-gold/5 hover:text-text-primary"
                                    }`}
                                >
                                    <span className={`flex items-center gap-2.5 ${adminRaleway.className} text-[13px]`}>
                                        <Icon className="h-4 w-4" strokeWidth={1.8} />
                                        {item.name}
                                    </span>

                                    {item.badge ? (
                                        <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#C0392B] px-1 text-[9px] font-semibold text-white">
                                            {item.badge}
                                        </span>
                                    ) : null}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="space-y-3 border-t border-[#E6C97914] px-5 py-4">
                    <button
                        type="button"
                        onClick={() => setMaintenanceMode((current) => !current)}
                        className={`flex h-11 w-full items-center justify-between rounded-full border border-[#E6C9791F] bg-[#1A1426] px-3 text-[13px] text-text-primary transition-colors duration-200 hover:border-[#E6C97940] ${adminRaleway.className}`}
                        aria-pressed={maintenanceMode}
                    >
                        <span>Maintenance Mode</span>
                        <span
                            className={`relative flex h-[17px] w-9 items-center rounded-full border border-[#E6C97926] bg-[#0F0C14] px-[1px] transition-colors duration-200 ${
                                maintenanceMode ? "justify-end" : "justify-start"
                            }`}
                            aria-hidden="true"
                        >
                            <span className="h-[13px] w-[13px] rounded-full bg-[#B7AFC3]" />
                        </span>
                    </button>

                    <button
                        type="button"
                        className={`flex h-10 w-full items-center justify-center gap-2 rounded-full border border-[#FF0000] text-[13px] text-[#FF0000] transition-colors duration-200 hover:bg-[#FF0000]/10 ${adminRaleway.className}`}
                    >
                        <LogOut className="h-4 w-4" strokeWidth={1.8} />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
}
