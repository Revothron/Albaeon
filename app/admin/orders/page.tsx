"use client";

import Link from "next/link";
import { ChevronDown, Download, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import {
    AdminDateRangeBox,
    AdminFieldLabel,
    AdminOutlineButton,
    AdminPagination,
    AdminPageHeading,
    AdminStatusBadge,
    AdminTextInput,
} from "@/components/admin/AdminUi";
import { adminCinzel, adminRaleway } from "@/components/admin/adminFonts";
import { adminOrders } from "@/adminOrders";

const headerColumns = [
    "",
    "ORDER ID",
    "CUSTOMER",
    "DATE",
    "AMOUNT",
    "PAYMENT",
    "FULFILLMENT",
    "PROVIDER",
    "ACTION",
];

const paymentOptions = ["All","Paid", "Pending", "Failed"];
const fulfillmentOptions = ["All","Shipping", "Delivered", "Processing", "Pending", "Cancelled"];
const providerOptions = ["All","Banian City", "Gelato"];

function CheckCell() {
    return (
        <span className="inline-flex h-3 w-3 border border-text-muted/60" aria-hidden="true" />
    );
}

function FilterDropdown({
    id,
    value,
    options,
    openId,
    onToggle,
}: {
    id: string;
    value: string;
    options: string[];
    openId: string | null;
    onToggle: (id: string) => void;
}) {
    const isOpen = openId === id;

    return (
        <div className="group relative w-full" data-filter-dropdown>
            <button
                type="button"
                className={`flex h-[46px] min-h-[46px] w-full items-center justify-between border border-gold/12 bg-footer px-3 text-left ${adminRaleway.className} text-[13px] font-light text-text-primary transition-colors duration-200 hover:border-gold/30`}
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

export default function AdminOrdersPage() {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

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
        <div className="space-y-5 md:space-y-6">
            <AdminPageHeading
                eyebrow="ORDERS"
                title="Orders"
                subtitle="1,284 total orders"
                action={<AdminOutlineButton label="EXPORT CSV" icon={<Download className="h-3.5 w-3.5" strokeWidth={1.8} />} />}
            />

            <section className="border border-gold/10 bg-[#1E1A2E] px-5 py-4 md:px-6">
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-[220px_140px_160px_120px_minmax(200px,1fr)_90px] lg:items-end xl:grid-cols-[240px_150px_170px_130px_minmax(220px,1fr)_100px]">
                    <div>
                        <AdminFieldLabel>DATE RANGE</AdminFieldLabel>
                        <AdminDateRangeBox fromLabel="From date" toLabel="To date" />
                    </div>
                    <div>
                        <AdminFieldLabel>PAYMENT STATUS</AdminFieldLabel>
                        <FilterDropdown id="payment" value="All" options={paymentOptions} openId={openDropdown} onToggle={handleToggle} />
                    </div>
                    <div>
                        <AdminFieldLabel>FULFILLMENT STATUS</AdminFieldLabel>
                        <FilterDropdown id="fulfillment" value="All" options={fulfillmentOptions} openId={openDropdown} onToggle={handleToggle} />
                    </div>
                    <div>
                        <AdminFieldLabel>PROVIDER</AdminFieldLabel>
                        <FilterDropdown id="provider" value="All" options={providerOptions} openId={openDropdown} onToggle={handleToggle} />
                    </div>
                    <div>
                        <AdminFieldLabel>SEARCH ORDER</AdminFieldLabel>
                        <AdminTextInput placeholder="Order ID, customer name..." className="min-w-0" />
                    </div>
                    <div className="self-end justify-self-start lg:justify-self-end">
                        <button
                            type="button"
                            className={`${adminRaleway.className} inline-flex h-[46px] min-h-[46px] items-center border border-gold/20 px-4 text-[12px] text-text-muted transition-colors duration-200 hover:text-text-primary`}
                        >
                            RESET
                        </button>
                    </div>
                </div>
            </section>

            <section className="border border-gold/10 bg-[#1E1A2E]">
                <div className="overflow-x-auto w-full">
                    <table className="w-full min-w-[900px] border-collapse">
                        <thead className="bg-nav">
                            <tr className={`${adminCinzel.className} text-[10px] tracking-[0.18em] text-text-muted`}>
                                {headerColumns.map((column, index) => (
                                    <th key={`${column}-${index}`} className="px-3 py-4 text-center font-semibold md:px-6">
                                        {column || <CheckCell />}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {adminOrders.map((order) => (
                                <tr key={order.id} className="card-hover border-t border-gold/6">
                                <td className="px-3 py-4 text-center md:px-6">
                                    <CheckCell />
                                </td>
                                <td className={`${adminCinzel.className} px-3 py-4 text-center text-[13px] text-gold md:px-6`}>
                                    {order.id}
                                </td>
                                <td className="px-3 py-4 text-center md:px-6">
                                    <div className="space-y-1">
                                        <p className={`${adminRaleway.className} text-[13px] font-medium text-text-primary`}>
                                            {order.customer}
                                        </p>
                                        <p className={`${adminRaleway.className} text-[11px] font-light text-text-muted`}>
                                            {order.email}
                                        </p>
                                    </div>
                                </td>
                                <td className={`${adminRaleway.className} px-3 py-4 text-center text-[13px] font-light text-text-muted md:px-6`}>
                                    {order.date}
                                </td>
                                <td className={`${adminCinzel.className} px-3 py-4 text-center text-[13px] text-text-primary md:px-6`}>
                                    {order.amount}
                                </td>
                                <td className="px-3 py-4 text-center md:px-6">
                                    <AdminStatusBadge label={order.payment.label} tone={order.payment.tone} />
                                </td>
                                <td className="px-3 py-4 text-center md:px-6">
                                    <AdminStatusBadge label={order.fulfillment.label} tone={order.fulfillment.tone} />
                                </td>
                                <td className={`${adminRaleway.className} px-3 py-4 text-center text-[12px] font-light text-text-muted md:px-6`}>
                                    {order.provider}
                                </td>
                                <td className="px-3 py-4 text-center md:px-6">
                                    <Link
                                        href={`/admin/orders/${order.id.toLowerCase()}`}
                                        className="inline-flex text-gold transition-colors duration-200 hover:text-gold-hover"
                                        aria-label={`View ${order.id}`}
                                    >
                                        <Eye className="h-3.5 w-3.5" strokeWidth={1.8} />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    </table>
                </div>

                <AdminPagination
                    summary="Showing 1-7 of 1,284 orders"
                    pages={[1, 2, 3, "...", 184]}
                    currentPage={1}
                />
            </section>
        </div>
    );
}

