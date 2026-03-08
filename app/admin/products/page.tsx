import Image from "next/image";
import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import {
    AdminFieldLabel,
    AdminPagination,
    AdminPageHeading,
    AdminSelectBox,
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

export default function AdminProductsPage() {
    return (
        <div className="space-y-5 md:space-y-6">
            <AdminPageHeading
                eyebrow="CATALOGUE"
                title="Products"
                subtitle="32 products · 24 active · 8 draft"
                action={
                    <Link
                        href="/admin/products/new"
                        className={`${adminCinzel.className} inline-flex h-10 items-center justify-center gap-2 bg-gold px-5 text-[10px] font-semibold tracking-[0.18em] text-nav transition-colors duration-200 hover:bg-gold-hover`}
                    >
                        <Plus className="h-3.5 w-3.5" strokeWidth={1.8} />
                        ADD PRODUCT
                    </Link>
                }
            />

            <section className="border border-gold/10 bg-[#1E1A2E] px-5 py-4 md:px-6">
                <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_160px_140px_160px]">
                    <div>
                        <AdminFieldLabel>SEARCH PRODUCTS</AdminFieldLabel>
                        <AdminTextInput placeholder="Search products by name, SKU..." />
                    </div>
                    <div>
                        <AdminFieldLabel>CATEGORY</AdminFieldLabel>
                        <AdminSelectBox value="All Categories" />
                    </div>
                    <div>
                        <AdminFieldLabel>STATUS</AdminFieldLabel>
                        <AdminSelectBox value="All Status" />
                    </div>
                    <div>
                        <AdminFieldLabel>SORT</AdminFieldLabel>
                        <AdminSelectBox value="Newest First" />
                    </div>
                </div>
            </section>

            <section className="overflow-hidden border border-gold/10 bg-[#1E1A2E]">
                <div className="flex flex-wrap items-center gap-4 bg-nav px-5 py-3 md:px-6">
                    <p className={`${adminRaleway.className} text-[13px] text-text-primary`}>
                        2 products selected
                    </p>
                    <span className={`${adminCinzel.className} text-[10px] tracking-[0.18em] text-[#4CAF7D]`}>
                        SET ACTIVE
                    </span>
                    <span className={`${adminCinzel.className} text-[10px] tracking-[0.18em] text-text-muted`}>
                        SET DRAFT
                    </span>
                    <span className={`${adminCinzel.className} text-[10px] tracking-[0.18em] text-[#C0392B]`}>
                        DELETE SELECTED
                    </span>
                    <span className={`${adminRaleway.className} ml-auto text-[13px] text-text-muted`}>
                        × DESELECT
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1120px] border-collapse">
                        <thead className="bg-nav">
                            <tr className={`${adminCinzel.className} text-[10px] tracking-[0.18em] text-text-muted`}>
                                <th className="px-3 py-4 text-center font-semibold md:px-6"><CheckCell /></th>
                                <th className="px-3 py-4 text-left font-semibold md:px-6">IMAGE</th>
                                <th className="px-3 py-4 text-left font-semibold md:px-6">NAME</th>
                                <th className="px-3 py-4 text-center font-semibold md:px-6">CATEGORY</th>
                                <th className="px-3 py-4 text-center font-semibold md:px-6">PRICE</th>
                                <th className="px-3 py-4 text-center font-semibold md:px-6">STATUS</th>
                                <th className="px-3 py-4 text-center font-semibold md:px-6">DATE</th>
                                <th className="px-3 py-4 text-center font-semibold md:px-6">EDIT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id} className="border-t border-gold/6">
                                    <td className="px-3 py-4 text-center md:px-6">
                                        <CheckCell />
                                    </td>
                                    <td className="px-3 py-4 md:px-6">
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
                                    <td className="px-3 py-4 md:px-6">
                                        <div className="space-y-1">
                                            <p className={`${adminRaleway.className} text-[13px] font-medium text-text-primary`}>
                                                {product.name}
                                            </p>
                                            <p className={`${adminRaleway.className} text-[11px] font-light text-text-muted`}>
                                                SKU: {product.sku}
                                            </p>
                                        </div>
                                    </td>
                                    <td className={`${adminRaleway.className} px-3 py-4 text-center text-[13px] font-light text-text-muted md:px-6`}>
                                        {product.category}
                                    </td>
                                    <td className={`${adminCinzel.className} px-3 py-4 text-center text-[13px] text-text-primary md:px-6`}>
                                        {product.price}
                                    </td>
                                    <td className="px-3 py-4 text-center md:px-6">
                                        <AdminStatusBadge label={product.status.label} tone={product.status.tone} />
                                    </td>
                                    <td className={`${adminRaleway.className} px-3 py-4 text-center text-[12px] font-light text-text-muted md:px-6`}>
                                        {product.date}
                                    </td>
                                    <td className="px-3 py-4 text-center md:px-6">
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
