"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import {
    AdminPagination,
    AdminPageHeading,
    AdminStatusBadge,
    AdminTextInput,
} from "@/components/admin/AdminUi";
import { adminCinzel, adminRaleway } from "@/components/admin/adminFonts";

const products = [
    {
        id: "empire-oversized-tee",
        name: "Empire Oversized Tee",
        sku: "ALB-EMT",
        category: "T-Shirts",
        price: "Rs 1,299 / $15.99",
        status: { label: "ACTIVE", tone: "success" as const },
        date: "28 Jan 2026",
        image: "/collection/aurelian-crest-tee.png",
    },
    {
        id: "pantheon-hoodie",
        name: "Pantheon Hoodie",
        sku: "ALB-PHD",
        category: "Hoodies",
        price: "Rs 2,199 / $26.99",
        status: { label: "ACTIVE", tone: "success" as const },
        date: "25 Jan 2026",
        image: "/collection/sovereign-hoodie.png",
    },
    {
        id: "medusa-crop-tee",
        name: "Medusa Crop Tee",
        sku: "ALB-MCT",
        category: "T-Shirts",
        price: "Rs 1,199 / $14.99",
        status: { label: "ACTIVE", tone: "success" as const },
        date: "22 Jan 2026",
        image: "/collection/monolith-shirt.png",
    },
    {
        id: "atlas-drop-shoulder",
        name: "Atlas Drop Shoulder",
        sku: "ALB-ADS",
        category: "T-Shirts",
        price: "Rs 1,499 / $17.99",
        status: { label: "DRAFT", tone: "muted" as const },
        date: "19 Jan 2026",
        image: "/collection/empire-utility-pant.png",
    },
    {
        id: "olympus-oversized",
        name: "Olympus Oversized",
        sku: "ALB-OOS",
        category: "Hoodies",
        price: "Rs 2,499 / $29.99",
        status: { label: "ACTIVE", tone: "success" as const },
        date: "15 Jan 2026",
        image: "/collection/nocturne-layer-jacket.png",
    },
    {
        id: "cerberus-raglan",
        name: "Cerberus Raglan",
        sku: "ALB-CRG",
        category: "T-Shirts",
        price: "Rs 1,399 / $16.99",
        status: { label: "DRAFT", tone: "muted" as const },
        date: "12 Jan 2026",
        image: "/collection/glyph-knit-set.png",
    },
];

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

export default function AdminProductsPage() {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const categoryOptions = ["All Categories", "T-shirt", "Hoodie"];
    const statusOptions = ["All Status", "Active", "Draft"];
    const sortOptions = ["Newest First", "A-z", "z-A", "price low to high", "price high to low"];

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
                eyebrow="CATALOGUE"
                title="Products"
                subtitle="32 products · 24 active · 8 draft"
                action={
                    <Link
                        href="/admin/products/new"
                        className={`${adminCinzel.className} inline-flex items-center justify-center bg-gold px-5 py-2.5 text-[10px] font-semibold tracking-[0.18em] text-nav transition-colors duration-200 hover:bg-gold-hover`}
                    >
                        + ADD PRODUCT
                    </Link>
                }
            />

            <section className="border border-gold/10 bg-[#1E1A2E] px-6 py-[18px]">
                <div className="flex flex-col gap-3 lg:flex-row lg:flex-nowrap lg:items-center">
                    <div className="flex-1">
                        <AdminTextInput placeholder="Search products by name, SKU..." className="w-full" />
                    </div>
                    <FilterDropdown
                        id="categories"
                        value="All Categories"
                        options={categoryOptions}
                        openId={openDropdown}
                        onToggle={handleToggle}
                        className="w-full sm:w-[160px]"
                    />
                    <FilterDropdown
                        id="status"
                        value="All Status"
                        options={statusOptions}
                        openId={openDropdown}
                        onToggle={handleToggle}
                        className="w-full sm:w-[140px]"
                    />
                    <FilterDropdown
                        id="sort"
                        value="Newest First"
                        options={sortOptions}
                        openId={openDropdown}
                        onToggle={handleToggle}
                        className="w-full sm:w-[160px]"
                    />
                </div>
            </section>

            <section className="overflow-hidden border border-gold/10 bg-[#1E1A2E]">
                <div className="flex flex-wrap items-center gap-4 border-b border-gold/15 bg-nav px-6 py-3">
                    <p className={`${adminRaleway.className} text-[13px] text-text-primary`}>
                        2 products selected
                    </p>
                    <span className={`${adminCinzel.className} text-[10px] tracking-[0.18em] text-[var(--status-success)]`}>
                        SET ACTIVE
                    </span>
                    <span className={`${adminCinzel.className} text-[10px] tracking-[0.18em] text-text-muted`}>
                        SET DRAFT
                    </span>
                    <span className={`${adminCinzel.className} text-[10px] tracking-[0.18em] text-[var(--status-error)]`}>
                        DELETE SELECTED
                    </span>
                    <span className={`${adminRaleway.className} ml-auto text-[13px] text-text-muted`}>
                        × DESELECT
                    </span>
                </div>

                <div className="overflow-x-auto w-full">
                    <table className="w-full min-w-[900px] table-fixed border-collapse">
                        <thead className="bg-nav">
                            <tr className={`${adminCinzel.className} text-[10px] tracking-[0.18em] text-text-muted`}>
                                <th className="w-[40px] px-6 py-3.5 text-center font-semibold"><CheckCell /></th>
                                <th className="w-[76px] px-6 py-3.5 text-left font-semibold">IMAGE</th>
                                <th className="w-[342px] px-6 py-3.5 text-left font-semibold">NAME</th>
                                <th className="w-[137px] px-6 py-3.5 text-center font-semibold">CATEGORY</th>
                                <th className="w-[107px] px-6 py-3.5 text-center font-semibold">PRICE</th>
                                <th className="w-[139px] px-6 py-3.5 text-center font-semibold">STATUS</th>
                                <th className="w-[129px] px-6 py-3.5 text-center font-semibold">DATE</th>
                                <th className="w-[124px] px-6 py-3.5 text-center font-semibold">EDIT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id} className="border-t border-gold/6">
                                    <td className="px-6 py-3.5 text-center">
                                        <CheckCell />
                                    </td>
                                    <td className="px-6 py-3.5">
                                        <div className="relative h-12 w-12 overflow-hidden border border-gold/10 bg-nav">
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                fill
                                                sizes="48px"
                                                className="object-cover"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-3.5">
                                        <div className="space-y-1">
                                            <p className={`${adminRaleway.className} text-[13px] font-medium text-text-primary`}>
                                                {product.name}
                                            </p>
                                            <p className={`${adminRaleway.className} text-[11px] font-light text-text-muted`}>
                                                SKU: {product.sku}
                                            </p>
                                        </div>
                                    </td>
                                    <td className={`${adminRaleway.className} px-6 py-3.5 text-center text-[13px] font-light text-text-muted`}>
                                        {product.category}
                                    </td>
                                    <td className={`${adminCinzel.className} px-6 py-3.5 text-center text-[13px] text-text-primary`}>
                                        {product.price}
                                    </td>
                                    <td className="px-6 py-3.5 text-center">
                                        <AdminStatusBadge label={product.status.label} tone={product.status.tone} />
                                    </td>
                                    <td className={`${adminRaleway.className} px-6 py-3.5 text-center text-[12px] font-light text-text-muted`}>
                                        {product.date}
                                    </td>
                                    <td className="px-6 py-3.5 text-center">
                                        <Link
                                            href={`/admin/products/${product.id}`}
                                            className="inline-flex text-gold transition-colors duration-200 hover:text-gold-hover"
                                            aria-label={`Edit ${product.name}`}
                                        >
                                            <Pencil className="h-3.5 w-3.5" strokeWidth={1.8} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <AdminPagination
                    summary="Showing 1-6 of 32 products"
                    pages={[1, 2, 3, "...", 6]}
                    currentPage={1}
                />
            </section>
        </div>
    );
}
