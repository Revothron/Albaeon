"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Activity,
    ChevronDown,
    ClipboardList,
    Headset,
    LayoutDashboard,
    LogOut,
    PanelRightClose,
    PanelRightOpen,
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
    const router = useRouter();
    const [analyticsOpen, setAnalyticsOpen] = useState(false);
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [maintenanceLoading, setMaintenanceLoading] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const analyticsVisible = !collapsed && analyticsOpen;

    useEffect(() => {
        let mounted = true;

        fetch("/api/admin/maintenance")
            .then((response) => response.json())
            .then((data) => {
                if (mounted && typeof data?.enabled === "boolean") {
                    setMaintenanceMode(data.enabled);
                }
            })
            .catch(() => null);

        return () => {
            mounted = false;
        };
    }, []);

    const handleMaintenanceToggle = async () => {
        if (maintenanceLoading) {
            return;
        }

        const nextValue = !maintenanceMode;
        const previousValue = maintenanceMode;

        setMaintenanceMode(nextValue);
        setMaintenanceLoading(true);

        try {
            const response = await fetch("/api/admin/maintenance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ enabled: nextValue }),
            });
            const data = await response.json().catch(() => null);

            if (typeof data?.enabled === "boolean") {
                setMaintenanceMode(data.enabled);
            }
        } catch {
            setMaintenanceMode(previousValue);
        } finally {
            setMaintenanceLoading(false);
        }
    };

    return (
        <>
            <div className="border-b border-[#E6C97914] bg-[var(--nav-bg)] px-4 py-3 md:hidden">
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
                                className={`shrink-0 border px-3 py-2 text-[11px] tracking-[0.16em] uppercase transition-all duration-300 ${
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
                                className={`shrink-0 border px-3 py-2 text-[10px] tracking-[0.16em] uppercase transition-all duration-300 ${
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

            <aside
                className={`hidden h-screen shrink-0 flex-col justify-between border-r border-[#E6C97914] bg-[var(--nav-bg)] transition-[width] duration-200 md:sticky md:top-0 md:flex ${
                    collapsed ? "w-[72px]" : "w-[220px]"
                }`}
            >
                <div>
                    <div className={`relative flex h-16 items-center border-b border-[#E6C97914] ${collapsed ? "justify-center px-2" : "px-6"}`}>
                        {!collapsed ? (
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
                        ) : null}
                        <button
                            type="button"
                            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                            onClick={() => setCollapsed((current) => !current)}
                            className={`absolute right-3 flex h-8 w-8 items-center justify-center rounded-full border border-[#E6C9791F] text-text-muted transition-colors duration-200 hover:border-[#E6C97940] hover:text-gold ${
                                collapsed ? "right-2" : ""
                            }`}
                        >
                            {collapsed ? (
                                <PanelRightClose className="h-4 w-4" strokeWidth={1.8} />
                            ) : (
                                <PanelRightOpen className="h-4 w-4" strokeWidth={1.8} />
                            )}
                        </button>
                    </div>

                    <nav className="px-0 py-4">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const active = itemIsActive(pathname, item.href);

                            if (item.subMenu) {
                                if (collapsed) {
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`flex w-full items-center justify-center px-2.5 py-3 transition-all duration-300 ${
                                                active
                                                    ? "border-l-2 border-gold bg-[#E6C97914] text-gold"
                                                    : "text-text-muted hover:bg-gold/5 hover:text-text-primary"
                                            }`}
                                            title={item.name}
                                            onClick={() => setAnalyticsOpen(true)}
                                        >
                                            <Icon className="h-4 w-4" strokeWidth={1.8} />
                                        </Link>
                                    );
                                }

                                return (
                                    <div key={item.name}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (!analyticsOpen) {
                                                    router.push("/admin/analytics");
                                                }
                                                setAnalyticsOpen((open) => !open);
                                            }}
                                            className={`flex w-full items-center justify-between px-5 py-2.5 transition-all duration-300 ${
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
                                                            className={`block px-11 py-2 text-[12px] transition-all duration-300 ${
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
                                    className={`flex items-center transition-all duration-300 ${
                                        collapsed
                                            ? "justify-center px-2.5 py-3"
                                            : "justify-between px-5 py-2.5"
                                    } ${
                                        active
                                            ? "border-l-2 border-gold bg-[#E6C97914] text-gold"
                                            : "text-text-muted hover:bg-gold/5 hover:text-text-primary"
                                    } ${collapsed ? "" : "pl-[18px]"}`}
                                    title={collapsed ? item.name : undefined}
                                >
                                    {collapsed ? (
                                        <span className="relative flex h-8 w-8 items-center justify-center">
                                            <Icon className="h-4 w-4" strokeWidth={1.8} />
                                            {item.badge ? (
                                                <span className="absolute -right-1 -top-1 inline-flex h-3 w-3 rounded-full bg-[var(--status-error)]" />
                                            ) : null}
                                        </span>
                                    ) : (
                                        <span className={`flex items-center gap-2.5 ${adminRaleway.className} text-[13px]`}>
                                            <Icon className="h-4 w-4" strokeWidth={1.8} />
                                            {item.name}
                                        </span>
                                    )}

                                    {!collapsed && item.badge ? (
                                        <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--status-error)] px-1 text-[9px] font-semibold text-white">
                                            {item.badge}
                                        </span>
                                    ) : null}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className={`space-y-3 border-t border-[#E6C97914] ${collapsed ? "px-2 py-4" : "px-5 py-4"}`}>
                    {!collapsed ? (
                        <button
                            type="button"
                            onClick={handleMaintenanceToggle}
                            className={`flex h-11 w-full items-center justify-between gap-1 rounded-full border border-[#E6C9791F] bg-[var(--bg-secondary)] px-4 text-[13px] text-text-primary transition-colors duration-200 hover:border-[#E6C97940] ${adminRaleway.className} ${maintenanceLoading ? "opacity-80" : ""}`}
                            role="switch"
                            aria-checked={maintenanceMode}
                            aria-busy={maintenanceLoading}
                        >
                            <span className="whitespace-nowrap">Maintenance Mode</span>
                            <span
                                className="relative h-[18px] w-9 shrink-0 overflow-hidden rounded-full border transition-colors duration-300"
                                style={{
                                    background: maintenanceMode
                                        ? "rgba(230,201,121,0.40)"
                                        : "var(--footer-bg, var(--albaeon-footer, #0F0C14))",
                                    borderColor: maintenanceMode
                                        ? "rgba(230,201,121,0.40)"
                                        : "rgba(230,201,121,0.15)",
                                }}
                                aria-hidden="true"
                            >
                                <span
                                    className={`absolute left-0.5 top-0.5 h-[14px] w-[14px] rounded-full shadow-[0_0_8px_rgba(0,0,0,0.35)] transition-transform duration-300 ${
                                        maintenanceMode ? "translate-x-[14px]" : "translate-x-0"
                                    }`}
                                    style={{
                                        background: "var(--text-muted, var(--albaeon-text-muted, #B7AFC3))",
                                    }}
                                />
                            </span>
                        </button>
                    ) : null}

                    <button
                        type="button"
                        className={`flex h-10 w-full items-center justify-center gap-2 rounded-full border border-[#FF0000] text-[13px] text-[#FF0000] transition-colors duration-200 hover:bg-[#FF0000]/10 ${adminRaleway.className}`}
                        aria-label="Logout"
                    >
                        <LogOut className="h-4 w-4" strokeWidth={1.8} />
                        {!collapsed ? "Logout" : null}
                    </button>
                </div>
            </aside>
        </>
    );
}
