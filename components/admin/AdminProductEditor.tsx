"use client";

import Image from "next/image";
import { Camera, Plus } from "lucide-react";
import { useState } from "react";
import {
    AdminPageHeading,
    AdminPrimaryButton,
    AdminStatusBadge,
} from "@/components/admin/AdminUi";
import { adminCinzel, adminRaleway } from "@/components/admin/adminFonts";
import type { AdminProductEditorData } from "@/lib/admin/products";

type AdminProductEditorProps = {
    mode: "create" | "edit";
    product: AdminProductEditorData;
};

function Card({
    title,
    children,
    subtitle,
    className = "",
    contentClassName = "space-y-4",
}: {
    title: string;
    children: React.ReactNode;
    subtitle?: string;
    className?: string;
    contentClassName?: string;
}) {
    return (
        <section className={`border border-gold/10 bg-[#1E1A2E] p-6 md:p-7 ${className}`}>
            <p className={`${adminCinzel.className} text-[10px] tracking-[0.3em] text-gold`}>
                {title}
            </p>

            {subtitle ? (
                <p className={`${adminRaleway.className} mt-2 text-[12px] font-light text-text-muted`}>
                    {subtitle}
                </p>
            ) : null}

            <div className={`mt-4 ${contentClassName}`}>{children}</div>
        </section>
    );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
    return (
        <p className={`${adminCinzel.className} text-[9px] tracking-[0.28em] text-text-muted`}>
            {children}
        </p>
    );
}

function TextInput({
    defaultValue,
    helper,
}: {
    defaultValue: string;
    helper?: string;
}) {
    return (
        <div className="space-y-2">
            <input
                type="text"
                defaultValue={defaultValue}
                className={`${adminRaleway.className} h-[42px] w-full border border-gold/12 bg-footer px-4 text-[14px] font-light text-text-primary outline-none`}
            />
            {helper ? (
                <p className={`${adminRaleway.className} text-[11px] font-light text-text-muted`}>
                    {helper}
                </p>
            ) : null}
        </div>
    );
}

function TextArea({
    defaultValue,
    rows = 4,
}: {
    defaultValue: string;
    rows?: number;
}) {
    return (
        <textarea
            rows={rows}
            defaultValue={defaultValue}
            className={`${adminRaleway.className} w-full resize-none border border-gold/12 bg-footer px-4 py-3 text-[14px] font-light leading-[1.7] text-text-primary outline-none`}
        />
    );
}

export default function AdminProductEditor({
    mode,
    product,
}: AdminProductEditorProps) {
    const isCreateMode = mode === "create";
    const pageTitle = isCreateMode ? "Add Product" : "Edit Product";
    const pageSubtitle = isCreateMode
        ? "Fill in all required fields and save when ready"
        : "Update product details and save changes when ready";
    const breadcrumb = `Products / ${pageTitle}`;
    const metaCount = `${product.seoDescription.length}/160`;
    const [status, setStatus] = useState<"published" | "draft">(product.status);
    const [bestSeller, setBestSeller] = useState(product.bestSeller);

    return (
        <div className="space-y-7">
            <p className={`${adminRaleway.className} text-[12px] font-light text-text-muted`}>
                {breadcrumb}
            </p>

            <AdminPageHeading
                title={pageTitle}
                subtitle={pageSubtitle}
                action={
                    <div className="flex flex-wrap items-center gap-2.5">
                        <button
                            type="button"
                            className={`${adminCinzel.className} inline-flex items-center justify-center border border-gold/20 px-5 py-2.5 text-[10px] font-semibold tracking-[0.18em] text-text-muted transition-colors duration-200 hover:border-gold/40 hover:text-gold`}
                        >
                            SAVE AS DRAFT
                        </button>
                        <AdminPrimaryButton
                            label={isCreateMode ? "SAVE & PUBLISH" : "SAVE CHANGES"}
                            className="px-6"
                        />
                    </div>
                }
            />

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
                <div className="space-y-4">
                    <Card title="BASIC INFORMATION">
                        <div className="space-y-2">
                            <FieldLabel>PRODUCT NAME</FieldLabel>
                            <TextInput defaultValue={product.name} />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <FieldLabel>SKU</FieldLabel>
                                <TextInput defaultValue={product.sku} />
                            </div>
                            <div className="space-y-2">
                                <FieldLabel>SLUG</FieldLabel>
                                <TextInput
                                    defaultValue={product.slug}
                                    helper={`albaeon.com/product/${product.slug}`}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <FieldLabel>DESCRIPTION</FieldLabel>
                            <TextArea defaultValue={product.description} rows={5} />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <FieldLabel>CATEGORY</FieldLabel>
                                <TextInput defaultValue={product.category} />
                            </div>
                            <div className="space-y-2">
                                <FieldLabel>DESIGN TYPE</FieldLabel>
                                <TextInput defaultValue={product.designType} />
                            </div>
                        </div>
                    </Card>

                    <Card title="PRICING">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <FieldLabel>PRICE (INR)</FieldLabel>
                                <TextInput defaultValue={product.priceInr} />
                            </div>
                            <div className="space-y-2">
                                <FieldLabel>PRICE (USD)</FieldLabel>
                                <TextInput defaultValue={product.priceUsd} />
                            </div>
                        </div>

                        <p className={`${adminRaleway.className} text-[11px] font-light text-text-muted`}>
                            INR for Indian orders (Razorpay) | USD for international (Stripe)
                        </p>
                    </Card>

                    <Card
                        title="VARIANTS"
                        subtitle="Define all available colour and size combinations"
                        contentClassName="space-y-3"
                    >
                        <div className="space-y-2">
                            <FieldLabel>COLOURS</FieldLabel>
                            <div className="flex flex-wrap gap-2">
                                {product.colors.map((color) => (
                                    <span
                                        key={color.name}
                                        className="inline-flex items-center gap-2 border border-gold/15 bg-footer px-3 py-2"
                                    >
                                        <span
                                            className="h-3 w-3 border border-gold/15"
                                            style={{ backgroundColor: color.hex }}
                                            aria-hidden="true"
                                        />
                                        <span className={`${adminRaleway.className} text-[13px] text-text-primary`}>
                                            {color.name} x
                                        </span>
                                    </span>
                                ))}
                                <button
                                    type="button"
                                    className={`${adminCinzel.className} inline-flex items-center border border-gold/20 px-4 py-2 text-[10px] font-semibold tracking-[0.18em] text-gold`}
                                >
                                    + ADD COLOUR
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <input
                                type="text"
                                defaultValue="Colour name"
                                className={`${adminRaleway.className} h-[38px] w-[160px] border border-gold/12 bg-footer px-3 text-[13px] font-light text-text-muted outline-none`}
                            />
                            <input
                                type="text"
                                defaultValue={product.colors[0]?.hex ?? "#000000"}
                                className={`${adminRaleway.className} h-[38px] w-[100px] border border-gold/12 bg-footer px-3 text-[13px] font-light text-text-muted outline-none`}
                            />
                            <span
                                className="h-6 w-6 border border-gold/15"
                                style={{ backgroundColor: product.colors[0]?.hex ?? "#000000" }}
                                aria-hidden="true"
                            />
                            <button
                                type="button"
                                className={`${adminCinzel.className} inline-flex h-[38px] items-center bg-gold px-4 text-[10px] font-semibold tracking-[0.18em] text-nav`}
                            >
                                ADD
                            </button>
                        </div>

                        <div className="space-y-2">
                            <FieldLabel>SIZES</FieldLabel>
                            <div className="flex flex-wrap gap-2">
                                {product.sizes.map((size) => (
                                    <span
                                        key={size}
                                        className={`${adminCinzel.className} inline-flex h-11 min-w-11 items-center justify-center border border-gold bg-gold/12 px-3 text-[11px] font-semibold text-gold`}
                                    >
                                        {size}
                                    </span>
                                ))}
                                {product.inactiveSizes?.map((size) => (
                                    <span
                                        key={size}
                                        className={`${adminCinzel.className} inline-flex h-11 min-w-11 items-center justify-center border border-gold/20 bg-footer px-3 text-[11px] font-semibold text-text-muted`}
                                    >
                                        {size}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <FieldLabel>VARIANT MATRIX</FieldLabel>
                            <p className={`${adminRaleway.className} text-[11px] font-light text-text-muted`}>
                                Review all combinations
                            </p>
                            <div className="overflow-hidden border border-gold/10">
                                <div className={`grid grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_130px] bg-nav px-4 py-3 text-[9px] tracking-[0.16em] text-text-muted ${adminCinzel.className}`}>
                                    <span>VARIANT</span>
                                    <span>SKU</span>
                                    <span>STOCK STATUS</span>
                                </div>
                                {product.variants.map((variant) => (
                                    <div
                                        key={variant.sku}
                                        className="grid grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_130px] items-center gap-3 border-t border-gold/6 px-4 py-3"
                                    >
                                        <span className={`${adminRaleway.className} text-[13px] text-text-primary`}>
                                            {variant.label}
                                        </span>
                                        <span className={`${adminRaleway.className} text-[12px] font-light text-text-muted`}>
                                            {variant.sku}
                                        </span>
                                        <AdminStatusBadge label={variant.status} tone={variant.tone} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    <Card
                        title="KEY HIGHLIGHTS"
                        subtitle="Add short product specs shown on product page"
                        contentClassName="space-y-3"
                    >
                        <div className="space-y-3">
                            {product.highlights.map((highlight) => (
                                <div key={highlight.key} className="grid gap-3 md:grid-cols-2">
                                    <input
                                        type="text"
                                        defaultValue={highlight.key}
                                        className={`${adminRaleway.className} h-[42px] w-full border border-gold/12 bg-footer px-4 text-[14px] font-light text-text-primary outline-none`}
                                    />
                                    <input
                                        type="text"
                                        defaultValue={highlight.value}
                                        className={`${adminRaleway.className} h-[42px] w-full border border-gold/12 bg-footer px-4 text-[14px] font-light text-text-primary outline-none`}
                                    />
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            className={`${adminCinzel.className} inline-flex items-center border border-gold/20 px-4 py-2 text-[10px] font-semibold tracking-[0.18em] text-gold`}
                        >
                            + ADD HIGHLIGHT
                        </button>
                    </Card>

                    <Card title="ADDITIONAL INFORMATION">
                        <div className="space-y-2">
                            <FieldLabel>WASH CARE INSTRUCTIONS</FieldLabel>
                            <TextArea defaultValue={product.washCare} rows={4} />
                        </div>

                        <div className="space-y-2">
                            <FieldLabel>SIZE CHART</FieldLabel>
                            <TextArea defaultValue={product.sizeChart} rows={4} />
                        </div>

                        <div className="space-y-2">
                            <FieldLabel>TAGS</FieldLabel>
                            <TextInput defaultValue={product.tags} helper="Comma separated" />
                        </div>
                    </Card>
                </div>

                <div className="space-y-4">
                    <Card title="PRODUCT STATUS" className="p-6 md:p-6" contentClassName="space-y-3">
                        <div className="space-y-3">
                            <button
                                type="button"
                                onClick={() => setStatus("published")}
                                className={`w-full border px-4 py-3 text-left transition-colors duration-200 ${status === "published" ? "border-[#4CAF7D] bg-[#4CAF7D]/8" : "border-gold/12 bg-footer"}`}
                                role="radio"
                                aria-checked={status === "published"}
                            >
                                <div className="flex items-start gap-3">
                                    <span
                                        className={`mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full border ${
                                            status === "published" ? "border-[#4CAF7D]" : "border-text-muted/40"
                                        }`}
                                        aria-hidden="true"
                                    >
                                        <span className={`h-2 w-2 rounded-full ${status === "published" ? "bg-[#4CAF7D]" : ""}`} />
                                    </span>
                                    <div>
                                        <span className={`${adminRaleway.className} text-[13px] text-text-primary`}>
                                            Published (Active)
                                        </span>
                                        <p className={`${adminRaleway.className} mt-1 text-[11px] font-light text-text-muted`}>
                                            Visible on storefront
                                        </p>
                                    </div>
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={() => setStatus("draft")}
                                className={`w-full border px-4 py-3 text-left transition-colors duration-200 ${status === "draft" ? "border-gold/20 bg-footer" : "border-gold/12 bg-footer"}`}
                                role="radio"
                                aria-checked={status === "draft"}
                            >
                                <div className="flex items-start gap-3">
                                    <span
                                        className={`mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full border ${
                                            status === "draft" ? "border-text-muted/60" : "border-text-muted/30"
                                        }`}
                                        aria-hidden="true"
                                    >
                                        <span className={`h-2 w-2 rounded-full ${status === "draft" ? "bg-text-muted" : ""}`} />
                                    </span>
                                    <div>
                                        <span className={`${adminRaleway.className} text-[13px] ${status === "draft" ? "text-text-primary" : "text-text-muted"}`}>
                                            Draft
                                        </span>
                                        <p className={`${adminRaleway.className} mt-1 text-[11px] font-light text-text-muted`}>
                                            Hidden from storefront
                                        </p>
                                    </div>
                                </div>
                            </button>
                        </div>

                        {[
                            {
                                label: "Best Seller",
                                sublabel: "Auto-calculated or manual override",
                                active: bestSeller,
                                onToggle: () => setBestSeller((current) => !current),
                            },
                        ].map((flag) => (
                            <div
                                key={flag.label}
                                className="flex items-center justify-between border-t border-gold/8 py-3 first:border-t-0"
                            >
                                <div>
                                    <p className={`${adminRaleway.className} text-[13px] text-text-primary`}>
                                        {flag.label}
                                    </p>
                                    <p className={`${adminRaleway.className} text-[11px] font-light text-text-muted`}>
                                        {flag.sublabel}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={flag.onToggle}
                                    className={`relative h-5 w-10 rounded-full border transition-colors duration-200 ${
                                        flag.active ? "border-gold bg-gold/30" : "border-gold/25 bg-footer"
                                    }`}
                                    role="switch"
                                    aria-checked={flag.active}
                                >
                                    <span
                                        className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full transition-transform duration-200 ${
                                            flag.active ? "translate-x-5 bg-gold" : "translate-x-0 bg-text-muted"
                                        }`}
                                    />
                                </button>
                            </div>
                        ))}
                    </Card>

                    <Card title="PRODUCT IMAGES" className="p-6 md:p-6" contentClassName="space-y-3">
                        <div className="space-y-2">
                            <FieldLabel>PRIMARY IMAGE</FieldLabel>
                            <button
                                type="button"
                                className="flex h-40 w-full flex-col items-center justify-center gap-2 border border-dashed border-gold/25 bg-gold/[0.03]"
                            >
                                <Camera className="h-7 w-7 text-gold" strokeWidth={1.8} />
                                <span className={`${adminCinzel.className} text-[10px] tracking-[0.18em] text-gold`}>
                                    UPLOAD PRIMARY IMAGE
                                </span>
                                <span className={`${adminRaleway.className} text-[11px] font-light text-text-muted`}>
                                    Drag and drop or click
                                </span>
                            </button>
                        </div>

                        <div className="space-y-2">
                            <div className="relative h-[120px] w-[120px] overflow-hidden border border-gold/15 bg-nav">
                                <Image
                                    src={product.primaryImage}
                                    alt={product.name}
                                    fill
                                    sizes="120px"
                                    className="object-cover"
                                />
                                <span className="absolute right-1 top-1 inline-flex h-4 w-4 items-center justify-center bg-[#C0392B] text-[10px] text-white">
                                    x
                                </span>
                            </div>
                            <p className={`${adminCinzel.className} text-[8px] tracking-[0.18em] text-[#4CAF7D]`}>
                                PRIMARY
                            </p>
                        </div>

                        <div className="space-y-2">
                            <FieldLabel>PRODUCT GALLERY</FieldLabel>
                            <div className="flex flex-wrap gap-2">
                                {product.gallery.map((image) => (
                                    <div
                                        key={image}
                                        className="relative h-[72px] w-[72px] overflow-hidden border border-gold/15 bg-nav"
                                    >
                                        <Image
                                            src={image}
                                            alt={`${product.name} gallery`}
                                            fill
                                            sizes="72px"
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="inline-flex h-[72px] w-[72px] items-center justify-center border border-gold/20 text-text-muted"
                                >
                                    <Plus className="h-6 w-6" strokeWidth={1.8} />
                                </button>
                            </div>
                            <p className={`${adminRaleway.className} text-[11px] font-light text-text-muted`}>
                                Recommended: 800x800px minimum · JPG or PNG
                            </p>
                        </div>
                    </Card>

                    <Card title="SEO" className="p-6 md:p-6" contentClassName="space-y-3">
                        <div className="space-y-2">
                            <FieldLabel>META TITLE</FieldLabel>
                            <TextInput defaultValue={product.seoTitle} />
                        </div>

                        <div className="space-y-2">
                            <FieldLabel>META DESCRIPTION</FieldLabel>
                            <TextArea defaultValue={product.seoDescription} rows={4} />
                            <p className={`${adminRaleway.className} text-[11px] font-light text-text-muted`}>
                                {metaCount}
                            </p>
                        </div>
                    </Card>

                    <div className="space-y-2.5">
                        <button
                            type="button"
                            className={`${adminCinzel.className} flex h-11 w-full items-center justify-center bg-gold text-[10px] font-semibold tracking-[0.18em] text-nav transition-colors duration-200 hover:bg-gold-hover`}
                        >
                            {isCreateMode ? "SAVE & PUBLISH" : "SAVE CHANGES"}
                        </button>
                        <button
                            type="button"
                            className={`${adminCinzel.className} flex h-11 w-full items-center justify-center border border-gold/20 text-[10px] font-semibold tracking-[0.18em] text-text-muted transition-colors duration-200 hover:text-gold`}
                        >
                            SAVE AS DRAFT
                        </button>
                        <button
                            type="button"
                            className={`${adminCinzel.className} flex h-11 w-full items-center justify-center border border-[#C0392B]/35 text-[10px] font-semibold tracking-[0.18em] text-[#C0392B] transition-colors duration-200 hover:bg-[#C0392B]/8`}
                        >
                            DELETE PRODUCT
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
