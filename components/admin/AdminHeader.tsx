"use client";

import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { usePathname } from "next/navigation";
import { adminCinzel, adminCormorant, adminRaleway } from "@/components/admin/adminFonts";

const segmentLabels: Record<string, string> = {
    analytics: "Analytics",
    categories: "Categories",
    coupons: "Coupons",
    customers: "Customers",
    orders: "Orders",
    products: "Products",
    revenue: "Revenue",
    support: "Support",
};

function formatSegment(segment: string, index: number, segments: string[]) {
    if (segmentLabels[segment]) {
        return segmentLabels[segment];
    }

    if (index === segments.length - 1 && segments.length > 1) {
        return "Details";
    }

    return segment
        .split("-")
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}

const notifications = [
    {
        title: "New Order Received",
        detail: "ALB-00143 · Priya Nair · 2m ago",
    },
    {
        title: "Customer Report Submitted",
        detail: "Damaged item report · ALB-00142",
    },
    {
        title: "New Contact Message",
        detail: "Contact page inquiry · Rhea Sen",
    },
];

export default function AdminHeader() {
    const pathname = usePathname();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const segments = pathname.split("/").filter(Boolean).slice(1);
    const labels = segments.length === 0
        ? ["Dashboard"]
        : segments.map((segment, index) => formatSegment(segment, index, segments));
    const pageTitle = labels[labels.length - 1];
    const breadcrumb = `Admin / ${labels.join(" / ")}`;

    useEffect(() => {
        function handlePointerDown(event: MouseEvent) {
            if (!dropdownRef.current?.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        }

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("mousedown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-[#E6C97914] bg-[var(--bg-secondary)]/95 px-4 backdrop-blur md:px-8">
            <div className="min-w-0">
                <p className={`${adminCormorant.className} truncate text-[18px] font-light text-text-primary md:text-[22px]`}>
                    {pageTitle}
                </p>
                <p className={`${adminRaleway.className} truncate text-[10px] font-light tracking-[0.14em] text-text-muted md:text-[11px]`}>
                    {breadcrumb}
                </p>
            </div>

            <div ref={dropdownRef} className="relative flex items-center">
                <button
                    type="button"
                    className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#E6C9791A] bg-[var(--nav-bg)] text-text-muted transition-colors duration-200 hover:border-[#E6C97940] hover:text-gold"
                    aria-label="Notifications"
                    aria-expanded={dropdownOpen}
                    aria-haspopup="dialog"
                    onClick={() => setDropdownOpen((open) => !open)}
                >
                    <Bell className="h-[18px] w-[18px]" strokeWidth={1.8} />
                    <span className="absolute -right-2 -top-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--status-error)] px-1 text-[8px] font-semibold leading-none text-white">
                        3
                    </span>
                </button>

                {dropdownOpen ? (
                    <div className="absolute right-0 top-[calc(100%+12px)] z-30 w-80 border border-[#E6C97926] bg-[#1E1A2E] shadow-[0_24px_48px_rgba(0,0,0,0.4)]">
                        <div className="flex items-center justify-between border-b border-[#E6C97914] px-4 pb-3 pt-4">
                            <p className={`${adminCinzel.className} text-[9px] font-bold tracking-[0.32em] text-gold`}>
                                NOTIFICATIONS
                            </p>
                            <span className={`${adminCinzel.className} inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--status-error)] text-[9px] font-bold text-white`}>
                                3
                            </span>
                        </div>

                        <div>
                            {notifications.map((notification, index) => (
                                <div
                                    key={notification.title}
                                    className={`px-4 py-3 ${
                                        index < notifications.length - 1 ? "border-b border-[#E6C97910]" : ""
                                    }`}
                                >
                                    <p className={`${adminRaleway.className} text-[12px] font-light leading-[1.6] text-text-primary`}>
                                        {notification.title}
                                    </p>
                                    <p className={`${adminRaleway.className} text-[12px] font-light leading-[1.6] text-text-muted`}>
                                        {notification.detail}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : null}
            </div>
        </header>
    );
}
