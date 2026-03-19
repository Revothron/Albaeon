"use client";

import Link from "next/link";
import { ChevronDown, Download, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import {
    AdminOutlineButton,
    AdminPagination,
    AdminPageHeading,
    AdminTextInput,
} from "@/components/admin/AdminUi";
import { adminCinzel, adminRaleway } from "@/components/admin/adminFonts";
import { adminCustomers } from "@/lib/admin/customers";

function FilterDropdown({
    id,
    value,
    options,
    openId,
    onToggle,
    className = "",
}: {
    id: string;
    value: string;
    options: string[];
    openId: string | null;
    onToggle: (id: string) => void;
    className?: string;
}) {
    const isOpen = openId === id;

    return (
        <div className={`group relative w-full ${className}`} data-filter-dropdown>
            <button
                type="button"
                className={`flex h-[38px] w-full items-center justify-between border border-gold/12 bg-footer px-3 text-left ${adminRaleway.className} text-[13px] font-light text-text-primary transition-colors duration-200 hover:border-gold/30`}
                aria-expanded={isOpen}
                onClick={() => onToggle(id)}
            >
                <span>{value}</span>
                <ChevronDown
                    className={`h-3.5 w-3.5 text-text-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    strokeWidth={1.8}
                />
            </button>
            {isOpen ? (
                <div className="absolute left-0 top-[calc(100%+6px)] z-20 w-full min-w-[160px] border border-gold/12 bg-nav p-2 shadow-[0_16px_36px_rgba(0,0,0,0.45)]">
                    {options.map((option) => (
                        <button
                            key={option}
                            type="button"
                            className={`${adminRaleway.className} flex w-full items-center px-3 py-2 text-left text-[12px] font-light text-text-primary transition-colors duration-200 hover:bg-gold/8 hover:text-gold`}
                            onClick={() => onToggle(id)}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            ) : null}
        </div>
    );
}

export default function AdminCustomersPage() {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const countryOptions = ["All Countries", "India", "USA", "UK"];
    const recentOptions = ["Recent Registered", "one week", "Two Week", "one Month", "Two Month", "Three Month"];

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (!(event.target instanceof Element)) {
                return;
            }
            if (!event.target.closest("[data-filter-dropdown]")) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener("mousedown", handleClick);
        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    }, []);

    const handleToggle = (id: string) => {
        setOpenDropdown((current) => (current === id ? null : id));
    };

    return (
        <div className="space-y-5">
            <AdminPageHeading
                eyebrow="CUSTOMERS"
                title="Customers"
                subtitle="3,284 registered customers"
                action={<AdminOutlineButton label="EXPORT CSV" icon={<Download className="h-3.5 w-3.5" strokeWidth={1.8} />} />}
            />

            <section className="border border-gold/10 bg-[#1E1A2E] px-6 py-[18px]">
                <div className="flex flex-col gap-3 lg:flex-row lg:flex-nowrap lg:items-center">
                    <div className="flex-1">
                        <AdminTextInput placeholder="Search by name, email, username..." className="w-full" />
                    </div>
                    <FilterDropdown
                        id="countries"
                        value="All Countries"
                        options={countryOptions}
                        openId={openDropdown}
                        onToggle={handleToggle}
                        className="w-full sm:w-[160px]"
                    />
                    <FilterDropdown
                        id="recent"
                        value="Recent Registered"
                        options={recentOptions}
                        openId={openDropdown}
                        onToggle={handleToggle}
                        className="w-full sm:w-[180px]"
                    />
                </div>
            </section>

            <section className="overflow-hidden border border-gold/10 bg-[#1E1A2E]">
                <div
                    className={`grid min-w-0 grid-cols-[repeat(11,minmax(0,1fr))_79px_42px] bg-nav px-6 py-3 text-center ${adminCinzel.className} text-[10px] tracking-[0.18em] text-text-muted`}
                >
                    {["NAME", "USERNAME", "REGISTERED", "EMAIL", "ORDERS", "SPENT", "LAST ORDER", "AOV", "COUNTRY", "CITY", "REGION", "POSTAL", "VIEW"].map((column) => (
                        <div key={column} className="min-w-0 truncate font-semibold">
                            {column}
                        </div>
                    ))}
                </div>

                {adminCustomers.map((customer, index) => (
                    <div
                        key={customer.id}
                        className={`grid min-w-0 grid-cols-[repeat(11,minmax(0,1fr))_79px_42px] px-6 py-3 text-center ${
                            index < adminCustomers.length - 1 ? "border-b border-gold/6" : ""
                        }`}
                    >
                        <div className={`${adminRaleway.className} min-w-0 truncate text-[13px] font-medium text-text-primary`}>
                            {customer.name}
                        </div>
                        <div className={`${adminRaleway.className} min-w-0 truncate text-[12px] font-light text-text-muted`}>
                            {customer.username}
                        </div>
                        <div className={`${adminRaleway.className} min-w-0 truncate text-[12px] font-light text-text-muted`}>
                            {customer.registered}
                        </div>
                        <div className={`${adminRaleway.className} min-w-0 truncate text-[12px] font-light text-text-muted`}>
                            {customer.email}
                        </div>
                        <div className={`${adminCinzel.className} min-w-0 truncate text-[13px] text-text-primary`}>
                            {customer.orders}
                        </div>
                        <div className={`${adminCinzel.className} min-w-0 truncate text-[13px] text-gold`}>
                            {customer.spent}
                        </div>
                        <div className={`${adminRaleway.className} min-w-0 truncate text-[12px] font-light text-text-muted`}>
                            {customer.lastOrder}
                        </div>
                        <div className={`${adminCinzel.className} min-w-0 truncate text-[13px] text-text-primary`}>
                            {customer.aov}
                        </div>
                        <div className={`${adminRaleway.className} min-w-0 truncate text-[12px] font-light text-text-muted`}>
                            {customer.countryCode}
                        </div>
                        <div className={`${adminRaleway.className} min-w-0 truncate text-[12px] font-light text-text-muted`}>
                            {customer.city}
                        </div>
                        <div className={`${adminRaleway.className} min-w-0 truncate text-[12px] font-light text-text-muted`}>
                            {customer.region}
                        </div>
                        <div className={`${adminRaleway.className} min-w-0 truncate text-[12px] font-light text-text-muted`}>
                            {customer.postal}
                        </div>
                        <div className="flex items-center justify-center">
                            <Link
                                href={`/admin/customers/${customer.id}`}
                                className="inline-flex text-gold transition-colors duration-200 hover:text-gold-hover"
                                aria-label={`View ${customer.name}`}
                            >
                                <Eye className="h-3.5 w-3.5" strokeWidth={1.8} />
                            </Link>
                        </div>
                    </div>
                ))}

                <AdminPagination
                    summary={`Showing 1-${adminCustomers.length} of 3,284 customers`}
                    pages={[1, 2, 3, "...", 548]}
                    currentPage={1}
                />
            </section>
        </div>
    );
}
