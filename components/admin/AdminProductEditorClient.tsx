'use client'

import Image from 'next/image'
import { Camera, Plus, X, Loader2 } from 'lucide-react'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
    AdminPageHeading,
    AdminPrimaryButton,
    AdminStatusBadge,
} from '@/components/admin/AdminUi'
import { adminCinzel, adminRaleway } from '@/components/admin/adminFonts'
import { saveAdminProduct, deleteAdminProduct } from '@/lib/admin/products'

// ── Types ─────────────────────────────────────────────
type Category = { id: string; name: string }

type ProductVariant = {
    id?: string
    color: string
    color_hex: string
    size: string
    sku: string
    stock_status: string
    gelato_template_variant_id?: string | null
    banian_sku?: string | null
}

type ProductImage = {
    id?: string
    url: string
    cloudinary_id: string
    is_primary: boolean
    sort_order: number
    alt_text: string
}

type ProductData = {
    id: string
    name: string
    slug: string
    sku: string
    description: string | null
    price_inr: number
    price_usd: number | null
    status: string
    is_new_arrival: boolean
    is_best_seller: boolean
    wash_care: string | null
    size_chart: string | null
    tags: string[] | null
    meta_title: string | null
    meta_description: string | null
    categories: { id: string; name: string } | null
    product_images: ProductImage[]
    product_variants: ProductVariant[]
}

// ── Sub-components ────────────────────────────────────
function Card({ title, children, subtitle, className = '', contentClassName = 'space-y-4' }: {
    title: string; children: React.ReactNode; subtitle?: string
    className?: string; contentClassName?: string
}) {
    return (
        <section className={`border border-gold/10 bg-[#1E1A2E] p-6 md:p-7 ${className}`}>
            <p className={`${adminCinzel.className} text-[10px] tracking-[0.3em] text-gold`}>{title}</p>
            {subtitle && <p className={`${adminRaleway.className} mt-2 text-[12px] font-light text-text-muted`}>{subtitle}</p>}
            <div className={`mt-4 ${contentClassName}`}>{children}</div>
        </section>
    )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
    return <p className={`${adminCinzel.className} text-[9px] tracking-[0.28em] text-text-muted`}>{children}</p>
}

function TextInput({ value, onChange, helper, placeholder = '' }: {
    value: string; onChange: (v: string) => void
    helper?: string; placeholder?: string
}) {
    return (
        <div className="space-y-2">
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`${adminRaleway.className} h-[42px] w-full border border-gold/12 bg-footer px-4 text-[14px] font-light text-text-primary outline-none focus:border-gold/30`}
            />
            {helper && <p className={`${adminRaleway.className} text-[11px] font-light text-text-muted`}>{helper}</p>}
        </div>
    )
}

function TextArea({ value, onChange, rows = 4 }: {
    value: string; onChange: (v: string) => void; rows?: number
}) {
    return (
        <textarea
            rows={rows}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`${adminRaleway.className} w-full resize-none border border-gold/12 bg-footer px-4 py-3 text-[14px] font-light leading-[1.7] text-text-primary outline-none focus:border-gold/30`}
        />
    )
}

const ALL_SIZES = ['S', 'M', 'L', 'XL', '2XL']

// ── Main Component ────────────────────────────────────
export default function AdminProductEditorClient({
    mode,
    product,
    categories,
}: {
    mode: 'create' | 'edit'
    product: ProductData | null
    categories: Category[]
}) {
    const router = useRouter()
    const isCreate = mode === 'create'

    // ── Form state ────────────────────────────────────
    const [name, setName] = useState(product?.name ?? '')
    const [slug, setSlug] = useState(product?.slug ?? '')
    const [sku, setSku] = useState(product?.sku ?? '')
    const [description, setDescription] = useState(product?.description ?? '')
    const [categoryId, setCategoryId] = useState(
        Array.isArray(product?.categories)
            ? (product.categories[0] as Category)?.id ?? ''
            : (product?.categories as Category | null)?.id ?? ''
    )
    const [priceInr, setPriceInr] = useState(String(product?.price_inr ?? ''))
    const [priceUsd, setPriceUsd] = useState(String(product?.price_usd ?? ''))
    const [status, setStatus] = useState<'active' | 'draft'>(
        (product?.status as 'active' | 'draft') ?? 'draft'
    )
    const [isNewArrival, setIsNewArrival] = useState(product?.is_new_arrival ?? false)
    const [isBestSeller, setIsBestSeller] = useState(product?.is_best_seller ?? false)
    const [washCare, setWashCare] = useState(product?.wash_care ?? '')
    const [sizeChart, setSizeChart] = useState(product?.size_chart ?? '')
    const [tags, setTags] = useState((product?.tags ?? []).join(', '))
    const [metaTitle, setMetaTitle] = useState(product?.meta_title ?? '')
    const [metaDescription, setMetaDescription] = useState(product?.meta_description ?? '')

    // ── Variants ──────────────────────────────────────
    const [variants, setVariants] = useState<ProductVariant[]>(
        product?.product_variants ?? []
    )
    const [newColor, setNewColor] = useState('')
    const [newColorHex, setNewColorHex] = useState('#000000')
    const [selectedSizes, setSelectedSizes] = useState<string[]>(
        [...new Set(product?.product_variants?.map((v) => v.size) ?? [])]
    )

    // ── Images ────────────────────────────────────────
    const [images, setImages] = useState<ProductImage[]>(
        product?.product_images?.sort((a, b) => a.sort_order - b.sort_order) ?? []
    )
    const [uploadingPrimary, setUploadingPrimary] = useState(false)
    const [uploadingGallery, setUploadingGallery] = useState(false)
    const primaryInputRef = useRef<HTMLInputElement>(null)
    const galleryInputRef = useRef<HTMLInputElement>(null)

    // ── Saving ────────────────────────────────────────
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [error, setError] = useState('')

    // ── Highlights ────────────────────────────────────────
    const [highlights, setHighlights] = useState<{ key: string; value: string }[]>(() => {
        const raw = (product as { highlights?: { key: string; value: string }[] } | null)?.highlights
        if (Array.isArray(raw)) return raw
        return []
    })

    // ── Auto-generate slug from name ──────────────────
    function handleNameChange(v: string) {
        setName(v)
        if (isCreate) {
            setSlug(v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
        }
    }

    // ── Upload image to Cloudinary ────────────────────
    async function uploadImage(file: File): Promise<{ url: string; cloudinary_id: string } | null> {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', 'albaeon/products')

        const res = await fetch('/api/images/upload', { method: 'POST', body: formData })
        const data = await res.json()

        if (data.error || !data.data) return null
        return { url: data.data.url, cloudinary_id: data.data.public_id }
    }

    async function handlePrimaryUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return
        setUploadingPrimary(true)
        const result = await uploadImage(file)
        if (result) {
            setImages((prev) => [
                { url: result.url, cloudinary_id: result.cloudinary_id, is_primary: true, sort_order: 0, alt_text: name },
                ...prev.filter((img) => !img.is_primary),
            ])
        }
        setUploadingPrimary(false)
        if (primaryInputRef.current) primaryInputRef.current.value = ''
    }

    async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files ?? [])
        if (!files.length) return
        setUploadingGallery(true)

        for (const file of files) {
            const result = await uploadImage(file)
            if (result) {
                setImages((prev) => [
                    ...prev,
                    {
                        url: result.url,
                        cloudinary_id: result.cloudinary_id,
                        is_primary: false,
                        sort_order: prev.length,
                        alt_text: name,
                    },
                ])
            }
        }

        setUploadingGallery(false)
        if (galleryInputRef.current) galleryInputRef.current.value = ''
    }

    function removeImage(index: number) {
        setImages((prev) => {
            const next = prev.filter((_, i) => i !== index)
            // If removed was primary and there are remaining images, make first one primary
            if (prev[index].is_primary && next.length > 0) {
                next[0] = { ...next[0], is_primary: true }
            }
            return next
        })
    }

    function setPrimaryImage(index: number) {
        setImages((prev) =>
            prev.map((img, i) => ({ ...img, is_primary: i === index }))
        )
    }

    // ── Variants ──────────────────────────────────────
    function addColorVariants() {
        if (!newColor.trim() || selectedSizes.length === 0) return
        const newVariants = selectedSizes.map((size) => ({
            color: newColor.trim(),
            color_hex: newColorHex,
            size,
            sku: `${sku}-${newColor.toUpperCase().replace(/\s+/g, '')}-${size}`,
            stock_status: 'in_stock',
        }))
        setVariants((prev) => [...prev, ...newVariants])
        setNewColor('')
        setNewColorHex('#000000')
    }

    function toggleSize(size: string) {
        setSelectedSizes((prev) =>
            prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
        )
    }

    function removeVariant(index: number) {
        setVariants((prev) => prev.filter((_, i) => i !== index))
    }

    // ── Get unique colors from variants ───────────────
    const uniqueColors = [...new Map(variants.map((v) => [v.color, v])).values()]

    // ── Save ──────────────────────────────────────────
    async function handleSave(saveStatus: 'active' | 'draft') {
        setError('')
        setSaving(true)

        if (!name.trim()) { setError('Product name is required.'); setSaving(false); return }
        if (!sku.trim()) { setError('SKU is required.'); setSaving(false); return }
        if (!priceInr || isNaN(Number(priceInr))) { setError('Valid INR price is required.'); setSaving(false); return }

        const res = await fetch('/api/admin/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                mode,
                id: product?.id,
                fields: {
                    name: name.trim(),
                    slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                    sku: sku.trim(),
                    description: description.trim(),
                    category_id: categoryId,
                    price_inr: Number(priceInr),
                    price_usd: priceUsd ? Number(priceUsd) : null,
                    status: saveStatus,
                    is_new_arrival: mode === 'create' ? true : isNewArrival,
                    is_best_seller: isBestSeller,
                    wash_care: washCare.trim(),
                    size_chart: sizeChart.trim(),
                    highlights: highlights.filter((h) => h.key.trim()), // ← must be here
                    tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
                    meta_title: metaTitle.trim(),
                    meta_description: metaDescription.trim(),
                    gelato_template_id: gelatoTemplateId.trim() || null,
                },
                variants,
                images,
            }),

        })

        const data = await res.json()

        if (data.error) {
            setError(data.error)
            setSaving(false)
            return
        }

        router.push('/admin/products')
        router.refresh()
    }

    async function handleDelete() {
        if (!product?.id) return
        const confirmed = window.confirm('Delete this product? This cannot be undone.')
        if (!confirmed) return

        setDeleting(true)

        const res = await fetch('/api/admin/products', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: product.id }),
        })

        const data = await res.json()

        if (data.error) {
            setError(data.error)
            setDeleting(false)
            return
        }

        router.push('/admin/products')
        router.refresh()
    }

    async function handleFetchGelatoVariants() {
        if (!gelatoTemplateId.trim()) {
            setTemplateFetchError('Enter a Gelato template ID first.')
            return
        }
        setFetchingTemplate(true)
        setTemplateFetchError('')

        try {
            const res = await fetch(
                `/api/admin/gelato/template?templateId=${encodeURIComponent(gelatoTemplateId.trim())}`
            )
            const data = await res.json()

            if (data.error || !data.variants?.length) {
                setTemplateFetchError(data.error ?? 'No variants found for this template ID.')
                setFetchingTemplate(false)
                return
            }

            const updated = variants.map((v) => {
                const match = data.variants.find((gv: {
                    title: string; id: string; priceUsd: number | null
                }) => {
                    const parts = gv.title.split(' - ')
                    const gelatoColor = parts[0]?.trim().toLowerCase() ?? ''
                    const gelatoSize = parts[1]?.trim().toLowerCase() ?? ''

                    const colorMatch = gelatoColor === v.color.toLowerCase()

                    const sizeMap: Record<string, string> = {
                        's': 's', 'm': 'm', 'l': 'l', 'xl': 'xl',
                        'xxl': '2xl', '2xl': '2xl',
                    }
                    const mappedSize = sizeMap[v.size.toLowerCase()] ?? v.size.toLowerCase()
                    const sizeMatch = gelatoSize === mappedSize

                    return colorMatch && sizeMatch
                })

                return {
                    ...v,
                    gelato_template_variant_id: match?.id ?? v.gelato_template_variant_id ?? null,
                    gelato_price_usd: match?.priceUsd ?? v.gelato_price_usd ?? null,
                }
            })

            setVariants(updated)

            const matched = updated.filter((v) => v.gelato_template_variant_id).length
            const total = variants.length

            if (matched === total) {
                setTemplateFetchError('')
            } else {
                setTemplateFetchError(
                    `Matched ${matched}/${total} variants. Unmatched ones need manual entry.`
                )
            }
        } catch {
            setTemplateFetchError('Failed to fetch. Check template ID and try again.')
        } finally {
            setFetchingTemplate(false)
        }
    }

    const primaryImage = images.find((img) => img.is_primary)
    const galleryImages = images.filter((img) => !img.is_primary)

    const [gelatoTemplateId, setGelatoTemplateId] = useState(
        (product as { gelato_template_id?: string | null } | null)?.gelato_template_id ?? ''
    )
    const [fetchingTemplate, setFetchingTemplate] = useState(false)
    const [templateFetchError, setTemplateFetchError] = useState('')

    return (
        <div className="space-y-7">
            <p className={`${adminRaleway.className} text-[12px] font-light text-text-muted`}>
                Products / {isCreate ? 'Add Product' : 'Edit Product'}
            </p>

            <AdminPageHeading
                title={isCreate ? 'Add Product' : 'Edit Product'}
                subtitle={isCreate ? 'Fill in all required fields and save when ready' : 'Update product details and save changes'}
                action={
                    <div className="flex flex-wrap items-center gap-2.5">
                        <button
                            type="button"
                            disabled={saving}
                            onClick={() => handleSave('draft')}
                            className={`${adminCinzel.className} inline-flex items-center justify-center border border-gold/20 px-5 py-2.5 text-[10px] font-semibold tracking-[0.18em] text-text-muted transition-colors duration-200 hover:border-gold/40 hover:text-gold disabled:opacity-50`}
                        >
                            SAVE AS DRAFT
                        </button>
                        <AdminPrimaryButton
                            label={saving ? 'SAVING...' : isCreate ? 'SAVE & PUBLISH' : 'SAVE CHANGES'}
                            onClick={() => handleSave('active')}
                            disabled={saving}
                        />
                    </div>
                }
            />

            {error && (
                <div className="border border-[var(--status-error)]/40 bg-[var(--status-error)]/10 px-4 py-3">
                    <p className={`${adminRaleway.className} text-[13px] text-[var(--status-error)]`}>{error}</p>
                </div>
            )}

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
                <div className="space-y-4">

                    {/* Basic Info */}
                    <Card title="BASIC INFORMATION">
                        <div className="space-y-2">
                            <FieldLabel>PRODUCT NAME *</FieldLabel>
                            <TextInput value={name} onChange={handleNameChange} placeholder="e.g. Empire Oversized Tee" />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <FieldLabel>SKU *</FieldLabel>
                                <TextInput value={sku} onChange={setSku} placeholder="e.g. ALB-EMT" />
                            </div>
                            <div className="space-y-2">
                                <FieldLabel>SLUG</FieldLabel>
                                <TextInput
                                    value={slug}
                                    onChange={setSlug}
                                    helper={slug ? `albaeon.com/product/${slug}` : ''}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <FieldLabel>DESCRIPTION</FieldLabel>
                            <TextArea value={description} onChange={setDescription} rows={5} />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <FieldLabel>CATEGORY</FieldLabel>
                                <select
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    className={`${adminRaleway.className} h-[42px] w-full border border-gold/12 bg-footer px-4 text-[14px] font-light text-text-primary outline-none`}
                                >
                                    <option value="">Select category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <FieldLabel>TAGS</FieldLabel>
                                <TextInput value={tags} onChange={setTags} helper="Comma separated" placeholder="mythology, oversized, black" />
                            </div>
                        </div>
                    </Card>

                    {/* Pricing */}
                    <Card title="PRICING">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <FieldLabel>PRICE (INR) *</FieldLabel>
                                <TextInput value={priceInr} onChange={setPriceInr} placeholder="1299" />
                            </div>
                            <div className="space-y-2">
                                <FieldLabel>PRICE (USD)</FieldLabel>
                                <TextInput value={priceUsd} onChange={setPriceUsd} placeholder="15.99" />
                            </div>
                        </div>
                        <p className={`${adminRaleway.className} text-[11px] font-light text-text-muted`}>
                            INR for Indian orders (Razorpay) · USD for international (Stripe)
                        </p>
                    </Card>

                    {/* Variants */}
                    <Card title="VARIANTS" subtitle="Define colour and size combinations" contentClassName="space-y-4">

                        {/* Size selection */}
                        <div className="space-y-2">
                            <FieldLabel>ACTIVE SIZES</FieldLabel>
                            <div className="flex flex-wrap gap-2">
                                {ALL_SIZES.map((size) => (
                                    <button
                                        key={size}
                                        type="button"
                                        onClick={() => toggleSize(size)}
                                        className={`${adminCinzel.className} inline-flex h-11 min-w-11 items-center justify-center border px-3 text-[11px] font-semibold transition-colors ${selectedSizes.includes(size)
                                            ? 'border-gold bg-gold/12 text-gold'
                                            : 'border-gold/20 bg-footer text-text-muted hover:border-gold/40'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Add color */}
                        <div className="space-y-2">
                            <FieldLabel>ADD COLOUR</FieldLabel>
                            <div className="flex flex-wrap items-center gap-2">
                                <input
                                    type="text"
                                    value={newColor}
                                    onChange={(e) => setNewColor(e.target.value)}
                                    placeholder="Colour name e.g. Black"
                                    className={`${adminRaleway.className} h-[38px] w-[180px] border border-gold/12 bg-footer px-3 text-[13px] font-light text-text-primary outline-none`}
                                />
                                <input
                                    type="color"
                                    value={newColorHex}
                                    onChange={(e) => setNewColorHex(e.target.value)}
                                    className="h-[38px] w-[50px] cursor-pointer border border-gold/12 bg-footer p-1"
                                />
                                <button
                                    type="button"
                                    onClick={addColorVariants}
                                    disabled={!newColor.trim() || selectedSizes.length === 0}
                                    className={`${adminCinzel.className} inline-flex h-[38px] items-center bg-gold px-4 text-[10px] font-semibold tracking-[0.18em] text-nav disabled:opacity-40`}
                                >
                                    ADD VARIANTS
                                </button>
                                <p className={`${adminRaleway.className} text-[11px] text-text-muted`}>
                                    Will create variants for all selected sizes
                                </p>
                            </div>
                        </div>

                        {/* Existing colors summary */}
                        {uniqueColors.length > 0 && (
                            <div className="space-y-2">
                                <FieldLabel>COLOURS</FieldLabel>
                                <div className="flex flex-wrap gap-2">
                                    {uniqueColors.map((v) => (
                                        <span
                                            key={v.color}
                                            className="inline-flex items-center gap-2 border border-gold/15 bg-footer px-3 py-2"
                                        >
                                            <span
                                                className="h-3 w-3 border border-gold/15"
                                                style={{ backgroundColor: v.color_hex }}
                                            />
                                            <span className={`${adminRaleway.className} text-[13px] text-text-primary`}>
                                                {v.color}
                                            </span>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Variant matrix header */}
                        <div
                            className={`grid items-center bg-nav px-4 py-3 text-[9px] tracking-[0.16em] text-text-muted ${adminCinzel.className}`}
                            style={{ gridTemplateColumns: '120px 1fr 1fr 1fr 100px 36px' }}
                        >
                            <span>VARIANT</span>
                            <span>SKU</span>
                            <span>GELATO VARIANT ID</span>
                            <span>BANIAN SKU</span>
                            <span>STOCK</span>
                            <span></span>
                        </div>

                        {variants.map((variant, index) => (
                            <div
                                key={`${variant.color}-${variant.size}-${index}`}
                                className="grid items-center gap-2 border-t border-gold/6 px-4 py-2.5"
                                style={{ gridTemplateColumns: '120px 1fr 1fr 1fr 100px 36px' }}
                            >
                                {/* Variant label */}
                                <span className={`${adminRaleway.className} text-[12px] text-text-primary truncate`}>
                                    {variant.color} / {variant.size}
                                </span>

                                {/* SKU */}
                                <input
                                    type="text"
                                    value={variant.sku}
                                    onChange={(e) => {
                                        const updated = [...variants]
                                        updated[index] = { ...updated[index], sku: e.target.value }
                                        setVariants(updated)
                                    }}
                                    className={`${adminRaleway.className} h-[32px] w-full border border-gold/12 bg-footer px-2 text-[11px] font-light text-text-muted outline-none`}
                                />

                                {/* Gelato variant ID */}
                                <div className="flex items-center gap-1 min-w-0">
                                    <input
                                        type="text"
                                        value={variant.gelato_template_variant_id ?? ''}
                                        onChange={(e) => {
                                            const updated = [...variants]
                                            updated[index] = { ...updated[index], gelato_template_variant_id: e.target.value || null }
                                            setVariants(updated)
                                        }}
                                        placeholder="Auto-filled"
                                        className={`${adminRaleway.className} h-[32px] w-full min-w-0 border ${variant.gelato_template_variant_id ? 'border-[var(--status-success)]/40' : 'border-gold/12'
                                            } bg-footer px-2 text-[11px] font-light text-text-muted outline-none`}
                                    />
                                    {variant.gelato_template_variant_id && (
                                        <span className="text-[var(--status-success)] text-[10px] flex-shrink-0">✓</span>
                                    )}
                                </div>

                                {/* Banian SKU */}
                                <input
                                    type="text"
                                    value={variant.banian_sku ?? ''}
                                    onChange={(e) => {
                                        const updated = [...variants]
                                        updated[index] = { ...updated[index], banian_sku: e.target.value || null }
                                        setVariants(updated)
                                    }}
                                    placeholder="e.g. ALB-BLK-S"
                                    className={`${adminRaleway.className} h-[32px] w-full border border-gold/12 bg-footer px-2 text-[11px] font-light text-text-muted outline-none`}
                                />

                                {/* Stock */}
                                <select
                                    value={variant.stock_status}
                                    onChange={(e) => {
                                        const updated = [...variants]
                                        updated[index] = { ...updated[index], stock_status: e.target.value }
                                        setVariants(updated)
                                    }}
                                    className={`${adminRaleway.className} h-[32px] w-full border border-gold/12 bg-footer px-2 text-[11px] font-light text-text-primary outline-none`}
                                >
                                    <option value="in_stock">In Stock</option>
                                    <option value="out_of_stock">Out of Stock</option>
                                    <option value="discontinued">Discontinued</option>
                                </select>

                                {/* Delete */}
                                <button
                                    type="button"
                                    onClick={() => removeVariant(index)}
                                    className="flex h-[32px] w-[32px] items-center justify-center text-text-muted hover:text-[var(--status-error)] transition-colors flex-shrink-0"
                                >
                                    <X className="h-3.5 w-3.5" strokeWidth={1.8} />
                                </button>
                            </div>
                        ))}
                    </Card>

                    {/* Key Highlights */}
                    <Card title="KEY HIGHLIGHTS" subtitle="Short product specs shown on product page" contentClassName="space-y-3">
                        {highlights.map((highlight, index) => (
                            <div key={index} className="grid gap-3 md:grid-cols-2">
                                <input
                                    type="text"
                                    value={highlight.key}
                                    onChange={(e) => {
                                        const updated = [...highlights]
                                        updated[index] = { ...updated[index], key: e.target.value }
                                        setHighlights(updated)
                                    }}
                                    placeholder="e.g. Fit"
                                    className={`${adminRaleway.className} h-[42px] w-full border border-gold/12 bg-footer px-4 text-[14px] font-light text-text-primary outline-none focus:border-gold/30`}
                                />
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={highlight.value}
                                        onChange={(e) => {
                                            const updated = [...highlights]
                                            updated[index] = { ...updated[index], value: e.target.value }
                                            setHighlights(updated)
                                        }}
                                        placeholder="e.g. Oversized"
                                        className={`${adminRaleway.className} h-[42px] w-full border border-gold/12 bg-footer px-4 text-[14px] font-light text-text-primary outline-none focus:border-gold/30`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setHighlights((prev) => prev.filter((_, i) => i !== index))}
                                        className="flex h-[42px] w-[42px] flex-shrink-0 items-center justify-center border border-[var(--status-error)]/30 text-[var(--status-error)] hover:bg-[var(--status-error)]/10 transition-colors"
                                    >
                                        <X className="h-3.5 w-3.5" strokeWidth={1.8} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={() => setHighlights((prev) => [...prev, { key: '', value: '' }])}
                            className={`${adminCinzel.className} inline-flex items-center gap-2 border border-gold/20 px-4 py-2 text-[10px] font-semibold tracking-[0.18em] text-gold hover:border-gold/40 transition-colors`}
                        >
                            <Plus className="h-3.5 w-3.5" strokeWidth={1.8} />
                            ADD HIGHLIGHT
                        </button>
                    </Card>

                    {/* Additional Info */}
                    <Card title="ADDITIONAL INFORMATION">
                        <div className="space-y-2">
                            <FieldLabel>WASH CARE INSTRUCTIONS</FieldLabel>
                            <TextArea value={washCare} onChange={setWashCare} rows={4} />
                        </div>
                        <div className="space-y-2">
                            <FieldLabel>SIZE CHART</FieldLabel>
                            <TextArea value={sizeChart} onChange={setSizeChart} rows={4} />
                        </div>
                    </Card>
                </div>

                <div className="space-y-4">

                    {/* Status */}
                    <Card title="PRODUCT STATUS" className="p-6 md:p-6" contentClassName="space-y-3">
                        <div className="space-y-3">
                            {(['active', 'draft'] as const).map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setStatus(s)}
                                    className={`w-full border px-4 py-3 text-left transition-colors duration-200 ${status === s
                                        ? s === 'active'
                                            ? 'border-[var(--status-success)] bg-[var(--status-success)]/8'
                                            : 'border-gold/20 bg-footer'
                                        : 'border-gold/12 bg-footer'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <span className={`mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full border ${status === s
                                            ? s === 'active' ? 'border-[var(--status-success)]' : 'border-text-muted/60'
                                            : 'border-text-muted/30'
                                            }`}>
                                            <span className={`h-2 w-2 rounded-full ${status === s ? s === 'active' ? 'bg-[var(--status-success)]' : 'bg-text-muted' : ''
                                                }`} />
                                        </span>
                                        <div>
                                            <span className={`${adminRaleway.className} text-[13px] ${status === s ? 'text-text-primary' : 'text-text-muted'}`}>
                                                {s === 'active' ? 'Published (Active)' : 'Draft'}
                                            </span>
                                            <p className={`${adminRaleway.className} mt-1 text-[11px] font-light text-text-muted`}>
                                                {s === 'active' ? 'Visible on storefront' : 'Hidden from storefront'}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Toggles */}
                        {[
                            { label: 'Best Seller', sub: 'Shows in best sellers section', active: isBestSeller, toggle: () => setIsBestSeller((v) => !v) },
                        ].map((flag) => (
                            <div key={flag.label} className="flex items-center justify-between border-t border-gold/8 py-3">
                                <div>
                                    <p className={`${adminRaleway.className} text-[13px] text-text-primary`}>{flag.label}</p>
                                    <p className={`${adminRaleway.className} text-[11px] font-light text-text-muted`}>{flag.sub}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={flag.toggle}
                                    className={`relative h-5 w-10 rounded-full border transition-colors duration-200 ${flag.active ? 'border-gold bg-gold/30' : 'border-gold/25 bg-footer'
                                        }`}
                                    role="switch"
                                    aria-checked={flag.active}
                                >
                                    <span className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full transition-transform duration-200 ${flag.active ? 'translate-x-5 bg-gold' : 'translate-x-0 bg-text-muted'
                                        }`} />
                                </button>
                            </div>
                        ))}
                    </Card>

                    {/* Images */}
                    <Card title="PRODUCT IMAGES" className="p-6 md:p-6" contentClassName="space-y-4">

                        {/* Primary image */}
                        <div className="space-y-2">
                            <FieldLabel>PRIMARY IMAGE</FieldLabel>
                            <input
                                ref={primaryInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handlePrimaryUpload}
                                className="hidden"
                            />
                            {primaryImage ? (
                                <div className="relative h-[160px] w-full overflow-hidden border border-gold/15 bg-nav">
                                    <Image src={primaryImage.url} alt={name} fill sizes="300px" className="object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(images.findIndex((img) => img.is_primary))}
                                        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center bg-[var(--status-error)] text-white"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => primaryInputRef.current?.click()}
                                    disabled={uploadingPrimary}
                                    className="flex h-40 w-full flex-col items-center justify-center gap-2 border border-dashed border-gold/25 bg-gold/[0.03] disabled:opacity-50"
                                >
                                    {uploadingPrimary
                                        ? <Loader2 className="h-7 w-7 animate-spin text-gold" strokeWidth={1.8} />
                                        : <Camera className="h-7 w-7 text-gold" strokeWidth={1.8} />
                                    }
                                    <span className={`${adminCinzel.className} text-[10px] tracking-[0.18em] text-gold`}>
                                        {uploadingPrimary ? 'UPLOADING...' : 'UPLOAD PRIMARY IMAGE'}
                                    </span>
                                    <span className={`${adminRaleway.className} text-[11px] font-light text-text-muted`}>
                                        Click to select · JPG, PNG or WebP
                                    </span>
                                </button>
                            )}
                            {primaryImage && (
                                <button
                                    type="button"
                                    onClick={() => primaryInputRef.current?.click()}
                                    disabled={uploadingPrimary}
                                    className={`${adminCinzel.className} text-[9px] tracking-[0.2em] text-gold hover:text-gold-hover disabled:opacity-50`}
                                >
                                    {uploadingPrimary ? 'UPLOADING...' : 'REPLACE IMAGE'}
                                </button>
                            )}
                        </div>

                        {/* Gallery */}
                        <div className="space-y-2">
                            <FieldLabel>PRODUCT GALLERY</FieldLabel>
                            <input
                                ref={galleryInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                multiple
                                onChange={handleGalleryUpload}
                                className="hidden"
                            />
                            <div className="flex flex-wrap gap-2">
                                {galleryImages.map((image, idx) => {
                                    const realIndex = images.findIndex((img) => img.url === image.url && !img.is_primary)
                                    return (
                                        <div key={image.url} className="relative h-[72px] w-[72px]">
                                            <div className="relative h-full w-full overflow-hidden border border-gold/15 bg-nav">
                                                <Image src={image.url} alt={`Gallery ${idx + 1}`} fill sizes="72px" className="object-cover" />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeImage(realIndex)}
                                                className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center bg-[var(--status-error)] text-white"
                                            >
                                                <X className="h-2.5 w-2.5" />
                                            </button>
                                        </div>
                                    )
                                })}
                                <button
                                    type="button"
                                    onClick={() => galleryInputRef.current?.click()}
                                    disabled={uploadingGallery}
                                    className="inline-flex h-[72px] w-[72px] flex-col items-center justify-center border border-gold/20 text-text-muted disabled:opacity-50"
                                >
                                    {uploadingGallery
                                        ? <Loader2 className="h-5 w-5 animate-spin" strokeWidth={1.8} />
                                        : <Plus className="h-6 w-6" strokeWidth={1.8} />
                                    }
                                </button>
                            </div>
                            <p className={`${adminRaleway.className} text-[11px] font-light text-text-muted`}>
                                Recommended: 800×800px minimum · JPG or PNG
                            </p>
                        </div>
                    </Card>

                    {/* SEO */}
                    <Card title="SEO" className="p-6 md:p-6" contentClassName="space-y-3">
                        <div className="space-y-2">
                            <FieldLabel>META TITLE</FieldLabel>
                            <TextInput value={metaTitle} onChange={setMetaTitle} placeholder={`${name} | Albaeon`} />
                        </div>
                        <div className="space-y-2">
                            <FieldLabel>META DESCRIPTION</FieldLabel>
                            <TextArea value={metaDescription} onChange={setMetaDescription} rows={4} />
                            <p className={`${adminRaleway.className} text-[11px] font-light text-text-muted`}>
                                {metaDescription.length}/160
                            </p>
                        </div>
                    </Card>

                    {/* Gelato + Banian */}
                    <Card title="FULFILLMENT" className="p-6 md:p-6" contentClassName="space-y-4">
                        <div className="space-y-2">
                            <FieldLabel>GELATO TEMPLATE ID</FieldLabel>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={gelatoTemplateId}
                                    onChange={(e) => setGelatoTemplateId(e.target.value)}
                                    placeholder="c12a363e-0d4e-..."
                                    className={`${adminRaleway.className} h-[38px] flex-1 border border-gold/12 bg-footer px-3 text-[12px] font-light text-text-primary outline-none focus:border-gold/30`}
                                />
                                <button
                                    type="button"
                                    onClick={handleFetchGelatoVariants}
                                    disabled={fetchingTemplate || !gelatoTemplateId.trim()}
                                    className={`${adminCinzel.className} h-[38px] border border-gold/20 px-3 text-[9px] font-semibold tracking-[0.18em] text-gold hover:border-gold/40 disabled:opacity-40 transition-colors whitespace-nowrap`}
                                >
                                    {fetchingTemplate ? 'FETCHING...' : 'AUTO-FILL'}
                                </button>
                            </div>
                            {templateFetchError && (
                                <p className={`${adminRaleway.className} text-[11px] ${templateFetchError.startsWith('Matched')
                                    ? 'text-[var(--status-warning)]'
                                    : 'text-[var(--status-error)]'
                                    }`}>
                                    {templateFetchError}
                                </p>
                            )}
                            <p className={`${adminRaleway.className} text-[11px] font-light text-text-muted`}>
                                Copy from Gelato Dashboard → Templates. Click AUTO-FILL to match variants automatically.
                            </p>
                        </div>
                    </Card>

                    {/* Actions */}
                    <div className="space-y-2.5">
                        <button
                            type="button"
                            disabled={saving}
                            onClick={() => handleSave('active')}
                            className={`${adminCinzel.className} flex h-11 w-full items-center justify-center bg-gold text-[10px] font-semibold tracking-[0.18em] text-nav transition-colors duration-200 hover:bg-gold-hover disabled:opacity-50`}
                        >
                            {saving ? 'SAVING...' : isCreate ? 'SAVE & PUBLISH' : 'SAVE CHANGES'}
                        </button>

                        <button
                            type="button"
                            disabled={saving}
                            onClick={() => handleSave('draft')}
                            className={`${adminCinzel.className} flex h-11 w-full items-center justify-center border border-gold/20 text-[10px] font-semibold tracking-[0.18em] text-text-muted transition-colors duration-200 hover:text-gold disabled:opacity-50`}
                        >
                            SAVE AS DRAFT
                        </button>
                        {!isCreate && (
                            <button
                                type="button"
                                disabled={deleting}
                                onClick={handleDelete}
                                className={`${adminCinzel.className} flex h-11 w-full items-center justify-center border border-[var(--status-error)]/35 text-[10px] font-semibold tracking-[0.18em] text-[var(--status-error)] transition-colors duration-200 hover:bg-[var(--status-error)]/8 disabled:opacity-50`}
                            >
                                {deleting ? 'DELETING...' : 'DELETE PRODUCT'}
                            </button>
                        )}

                        {/* Notify customers button — only for published products in edit mode */}
                        {!isCreate && status === 'active' && images.length > 0 && (
                            <button
                                type="button"
                                onClick={async () => {
                                    const confirmed = window.confirm(`Notify all customers about "${name}"?`)
                                    if (!confirmed) return
                                    const res = await fetch('/api/admin/notify-product', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            productName: name,
                                            productDescription: description.slice(0, 120),
                                            productPrice: `₹${Number(priceInr).toLocaleString('en-IN')}`,
                                            productImage: images.find((img) => img.is_primary)?.url ?? images[0]?.url ?? '',
                                            productSlug: slug,
                                        }),
                                    })
                                    const data = await res.json()
                                    if (data.ok) alert(`Notified ${data.sent} customers successfully.`)
                                    else alert('Failed to send notifications.')
                                }}
                                className={`${adminCinzel.className} flex h-11 w-full items-center justify-center border border-[var(--status-info)]/40 text-[10px] font-semibold tracking-[0.18em] text-[var(--status-info)] transition-colors duration-200 hover:bg-[var(--status-info)]/8`}
                            >
                                NOTIFY ALL CUSTOMERS
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}