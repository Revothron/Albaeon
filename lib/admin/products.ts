export type AdminProductStatusTone = "success" | "warning" | "muted";

export type AdminProductColor = {
  name: string;
  hex: string;
};

export type AdminProductVariant = {
  label: string;
  sku: string;
  status: string;
  tone: AdminProductStatusTone;
};

export type AdminProductHighlight = {
  key: string;
  value: string;
};

export type AdminProductEditorData = {
  id: string;
  name: string;
  sku: string;
  slug: string;
  description: string;
  category: string;
  designType: string;
  priceInr: string;
  priceUsd: string;
  colors: AdminProductColor[];
  sizes: string[];
  inactiveSizes?: string[];
  variants: AdminProductVariant[];
  highlights: AdminProductHighlight[];
  washCare: string;
  sizeChart: string;
  tags: string;
  status: "published" | "draft";
  newArrival: boolean;
  bestSeller: boolean;
  primaryImage: string;
  gallery: string[];
  seoTitle: string;
  seoDescription: string;
};

const adminProducts: AdminProductEditorData[] = [
  {
    id: "empire-oversized-tee",
    name: "Empire Oversized Tee",
    sku: "ALB-EMT",
    slug: "empire-oversized-tee",
    description:
      "Heavyweight oversized tee with mythic crest placement, dense jersey structure, and a refined shoulder line designed for everyday luxury.",
    category: "T-Shirts",
    designType: "Oversized Graphic",
    priceInr: "1299",
    priceUsd: "15.99",
    colors: [
      { name: "Black", hex: "#1A1A1A" },
      { name: "White", hex: "#F5F5F5" },
      { name: "Navy", hex: "#1A2744" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    inactiveSizes: ["XXL"],
    variants: [
      { label: "Black / XS", sku: "ALB-EMT-BLK-XS", status: "In Stock", tone: "success" },
      { label: "Black / S", sku: "ALB-EMT-BLK-S", status: "In Stock", tone: "success" },
      { label: "Black / M", sku: "ALB-EMT-BLK-M", status: "Low Stock", tone: "warning" },
      { label: "White / XS", sku: "ALB-EMT-WHT-XS", status: "Draft", tone: "muted" },
    ],
    highlights: [
      { key: "Fit", value: "Oversized" },
      { key: "Fabric", value: "240 GSM Cotton" },
      { key: "Pattern", value: "Front Crest Print" },
      { key: "Sleeve", value: "Dropped Shoulder" },
    ],
    washCare:
      "Machine wash cold, inside out. Do not bleach. Hang dry in shade to preserve structure and print depth.",
    sizeChart:
      "XS: Chest 36, Length 68 | S: Chest 38, Length 70 | M: Chest 40, Length 72 | L: Chest 42, Length 74 | XL: Chest 44, Length 76",
    tags: "mythology, oversized, black, graphic tee",
    status: "published",
    newArrival: false,
    bestSeller: true,
    primaryImage: "/collection/aurelian-crest-tee.png",
    gallery: [
      "/collection/aurelian-crest-tee.png",
      "/collection/monolith-shirt.png",
    ],
    seoTitle: "Empire Oversized Tee | Albaeon",
    seoDescription:
      "Empire Oversized Tee by Albaeon. Heavyweight oversized tee with refined mythic artwork and premium structure for elevated daily wear.",
  },
  {
    id: "pantheon-hoodie",
    name: "Pantheon Hoodie",
    sku: "ALB-PHD",
    slug: "pantheon-hoodie",
    description:
      "Relaxed hoodie with heavyweight fleece, tonal branding, and a clean architectural fit built for cold-weather layering.",
    category: "Hoodies",
    designType: "Heavyweight Fleece",
    priceInr: "2199",
    priceUsd: "26.99",
    colors: [
      { name: "Obsidian", hex: "#17141F" },
      { name: "Ash", hex: "#D8D6D3" },
    ],
    sizes: ["S", "M", "L", "XL"],
    inactiveSizes: ["XXL"],
    variants: [
      { label: "Obsidian / S", sku: "ALB-PHD-OBS-S", status: "In Stock", tone: "success" },
      { label: "Obsidian / M", sku: "ALB-PHD-OBS-M", status: "In Stock", tone: "success" },
      { label: "Ash / M", sku: "ALB-PHD-ASH-M", status: "Low Stock", tone: "warning" },
      { label: "Ash / XL", sku: "ALB-PHD-ASH-XL", status: "Draft", tone: "muted" },
    ],
    highlights: [
      { key: "Fit", value: "Relaxed" },
      { key: "Fabric", value: "420 GSM Fleece" },
      { key: "Hood", value: "Double Layer Hood" },
      { key: "Pocket", value: "Kangaroo Pocket" },
    ],
    washCare:
      "Machine wash cold on gentle cycle. Wash with similar colours. Dry flat or tumble low.",
    sizeChart:
      "S: Chest 38 | M: Chest 40 | L: Chest 42 | XL: Chest 44 | XXL: Chest 46",
    tags: "hoodie, fleece, relaxed, tonal",
    status: "published",
    newArrival: true,
    bestSeller: true,
    primaryImage: "/collection/sovereign-hoodie.png",
    gallery: [
      "/collection/sovereign-hoodie.png",
      "/collection/nocturne-layer-jacket.png",
    ],
    seoTitle: "Pantheon Hoodie | Albaeon",
    seoDescription:
      "Pantheon Hoodie by Albaeon. Heavyweight fleece hoodie with tonal detailing, a relaxed silhouette, and elevated comfort.",
  },
  {
    id: "medusa-crop-tee",
    name: "Medusa Crop Tee",
    sku: "ALB-MCT",
    slug: "medusa-crop-tee",
    description:
      "Cropped tee with structured cotton, compact proportions, and clean graphic placement for a sharper silhouette.",
    category: "T-Shirts",
    designType: "Cropped Graphic",
    priceInr: "1199",
    priceUsd: "14.99",
    colors: [
      { name: "Black", hex: "#101010" },
      { name: "Stone", hex: "#D5CFC4" },
    ],
    sizes: ["XS", "S", "M", "L"],
    variants: [
      { label: "Black / XS", sku: "ALB-MCT-BLK-XS", status: "In Stock", tone: "success" },
      { label: "Black / S", sku: "ALB-MCT-BLK-S", status: "In Stock", tone: "success" },
      { label: "Stone / M", sku: "ALB-MCT-STN-M", status: "In Stock", tone: "success" },
      { label: "Stone / L", sku: "ALB-MCT-STN-L", status: "Draft", tone: "muted" },
    ],
    highlights: [
      { key: "Fit", value: "Cropped" },
      { key: "Fabric", value: "220 GSM Cotton" },
      { key: "Hem", value: "Raw Edge Finish" },
      { key: "Print", value: "Front Graphic" },
    ],
    washCare:
      "Cold machine wash only. Do not tumble. Iron inside out on low heat if required.",
    sizeChart:
      "XS: Length 18 | S: Length 19 | M: Length 20 | L: Length 21",
    tags: "cropped tee, medusa, graphic, cotton",
    status: "published",
    newArrival: true,
    bestSeller: false,
    primaryImage: "/collection/monolith-shirt.png",
    gallery: [
      "/collection/monolith-shirt.png",
      "/collection/aurelian-crest-tee.png",
    ],
    seoTitle: "Medusa Crop Tee | Albaeon",
    seoDescription:
      "Medusa Crop Tee by Albaeon. Structured cropped tee with bold graphic placement and a sharper everyday silhouette.",
  },
  {
    id: "atlas-drop-shoulder",
    name: "Atlas Drop Shoulder",
    sku: "ALB-ADS",
    slug: "atlas-drop-shoulder",
    description:
      "Drop shoulder essential with a looser frame and minimal treatment intended for everyday styling across seasons.",
    category: "T-Shirts",
    designType: "Minimal Essential",
    priceInr: "1499",
    priceUsd: "17.99",
    colors: [
      { name: "Stone", hex: "#D7D1C5" },
      { name: "Black", hex: "#151515" },
    ],
    sizes: ["S", "M", "L", "XL"],
    variants: [
      { label: "Stone / S", sku: "ALB-ADS-STN-S", status: "Draft", tone: "muted" },
      { label: "Stone / M", sku: "ALB-ADS-STN-M", status: "Draft", tone: "muted" },
      { label: "Black / L", sku: "ALB-ADS-BLK-L", status: "Low Stock", tone: "warning" },
    ],
    highlights: [
      { key: "Fit", value: "Drop Shoulder" },
      { key: "Fabric", value: "230 GSM Cotton" },
      { key: "Pattern", value: "Minimal Solid" },
      { key: "Neck", value: "Crew Neck" },
    ],
    washCare:
      "Wash with similar colours. Line dry. Avoid direct heat for longest colour retention.",
    sizeChart:
      "S: Chest 38 | M: Chest 40 | L: Chest 42 | XL: Chest 44",
    tags: "drop shoulder, oversized, essential, tee",
    status: "draft",
    newArrival: false,
    bestSeller: false,
    primaryImage: "/collection/empire-utility-pant.png",
    gallery: ["/collection/empire-utility-pant.png"],
    seoTitle: "Atlas Drop Shoulder | Albaeon",
    seoDescription:
      "Atlas Drop Shoulder by Albaeon. Minimal drop shoulder essential in heavyweight cotton with a relaxed premium drape.",
  },
  {
    id: "olympus-oversized",
    name: "Olympus Oversized Hoodie",
    sku: "ALB-OOS",
    slug: "olympus-oversized-hoodie",
    description:
      "Oversized hoodie with a broader shoulder line, premium fleece body, and a muted mythic surface treatment.",
    category: "Hoodies",
    designType: "Oversized Fleece",
    priceInr: "2499",
    priceUsd: "29.99",
    colors: [
      { name: "Coal", hex: "#1B1B1D" },
      { name: "Bone", hex: "#E7E0D4" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    variants: [
      { label: "Coal / M", sku: "ALB-OOS-COL-M", status: "In Stock", tone: "success" },
      { label: "Coal / L", sku: "ALB-OOS-COL-L", status: "In Stock", tone: "success" },
      { label: "Bone / XL", sku: "ALB-OOS-BON-XL", status: "Low Stock", tone: "warning" },
    ],
    highlights: [
      { key: "Fit", value: "Oversized" },
      { key: "Fabric", value: "430 GSM Fleece" },
      { key: "Neck", value: "Structured Hood" },
      { key: "Pocket", value: "Utility Pocket" },
    ],
    washCare:
      "Wash cold with mild detergent. Dry flat and avoid high heat to preserve the fleece hand.",
    sizeChart:
      "S: Chest 40 | M: Chest 42 | L: Chest 44 | XL: Chest 46 | XXL: Chest 48",
    tags: "oversized hoodie, fleece, premium, albaeon",
    status: "published",
    newArrival: false,
    bestSeller: true,
    primaryImage: "/collection/nocturne-layer-jacket.png",
    gallery: [
      "/collection/nocturne-layer-jacket.png",
      "/collection/sovereign-hoodie.png",
    ],
    seoTitle: "Olympus Oversized Hoodie | Albaeon",
    seoDescription:
      "Olympus Oversized Hoodie by Albaeon. Premium oversized fleece hoodie with a broad silhouette and elevated structure.",
  },
  {
    id: "cerberus-raglan",
    name: "Cerberus Raglan",
    sku: "ALB-CRG",
    slug: "cerberus-raglan",
    description:
      "Raglan tee with contrast panel construction and a sport-inflected silhouette tailored into the Albaeon language.",
    category: "T-Shirts",
    designType: "Raglan Panel",
    priceInr: "1399",
    priceUsd: "16.99",
    colors: [
      { name: "Black", hex: "#161616" },
      { name: "Cream", hex: "#ECE4D6" },
    ],
    sizes: ["S", "M", "L", "XL"],
    variants: [
      { label: "Black / M", sku: "ALB-CRG-BLK-M", status: "Draft", tone: "muted" },
      { label: "Cream / M", sku: "ALB-CRG-CRM-M", status: "Draft", tone: "muted" },
      { label: "Cream / XL", sku: "ALB-CRG-CRM-XL", status: "Low Stock", tone: "warning" },
    ],
    highlights: [
      { key: "Fit", value: "Relaxed Raglan" },
      { key: "Fabric", value: "240 GSM Cotton" },
      { key: "Sleeve", value: "Contrast Panel Sleeve" },
      { key: "Hem", value: "Straight Hem" },
    ],
    washCare:
      "Cold wash only. Hang dry and steam lightly to maintain shoulder shape.",
    sizeChart:
      "S: Chest 38 | M: Chest 40 | L: Chest 42 | XL: Chest 44",
    tags: "raglan, contrast, tee, relaxed",
    status: "draft",
    newArrival: false,
    bestSeller: false,
    primaryImage: "/collection/glyph-knit-set.png",
    gallery: [
      "/collection/glyph-knit-set.png",
      "/collection/aurelian-crest-tee.png",
    ],
    seoTitle: "Cerberus Raglan | Albaeon",
    seoDescription:
      "Cerberus Raglan by Albaeon. Relaxed raglan tee with contrast panel construction and premium cotton weight.",
  },
];

export const addProductTemplate: AdminProductEditorData = {
  ...adminProducts[0],
  id: "new-product-template",
};

export function getAdminProductById(id: string) {
  return adminProducts.find((product) => product.id === id);
}

// ── Supabase queries (add below existing code) ────────
import { createAdminClient } from '@/lib/supabase/admin'

export type AdminProductListItem = {
  id: string
  slug: string
  name: string
  sku: string
  category: string
  price: string
  status: { label: string; tone: 'success' | 'muted' }
  date: string
  image: string
}

export async function getAdminProducts({
  page = 1,
  limit = 24,
  search = '',
  category = '',
  status = '',
  sort = 'newest',
}: {
  page?: number
  limit?: number
  search?: string
  category?: string
  status?: string
  sort?: string
} = {}) {
  const supabase = createAdminClient()
  const offset = (page - 1) * limit

  let query = supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      sku,
      price_inr,
      price_usd,
      status,
      created_at,
      categories (name),
      product_images (url, is_primary)
    `, { count: 'exact' })

  if (search) query = query.ilike('name', `%${search}%`)

  if (status && status !== 'All Status') {
    query = query.eq('status', status.toLowerCase())
  }

  if (category && category !== 'All Categories') {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .ilike('name', category)
      .single()
    if (cat) query = query.eq('category_id', cat.id)
  }

  switch (sort) {
    case 'A-z': query = query.order('name', { ascending: true }); break
    case 'z-A': query = query.order('name', { ascending: false }); break
    case 'price low to high': query = query.order('price_inr', { ascending: true }); break
    case 'price high to low': query = query.order('price_inr', { ascending: false }); break
    default: query = query.order('created_at', { ascending: false })
  }

  const { data, count } = await query.range(offset, offset + limit - 1)

  const products: AdminProductListItem[] = (data ?? []).map((p) => {
    const images = p.product_images as { url: string; is_primary: boolean }[]
    const image = images?.find((i) => i.is_primary)?.url ?? images?.[0]?.url ?? '/placeholder.png'
    const cat = (p.categories as { name: string } | null)?.name ?? '—'

    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      sku: p.sku,
      category: cat,
      price: `₹${p.price_inr.toLocaleString('en-IN')}${p.price_usd ? ` / $${p.price_usd}` : ''}`,
      status: {
        label: p.status === 'active' ? 'ACTIVE' : 'DRAFT',
        tone: p.status === 'active' ? 'success' : 'muted',
      },
      date: new Date(p.created_at).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
      }),
      image,
    }
  })

  return { products, total: count ?? 0 }
}

export async function getAdminProductForEdit(id: string) {
  const supabase = createAdminClient()

  const { data } = await supabase
    .from('products')
    .select(`
    id, name, slug, sku, description,
    price_inr, price_usd, status,
    is_new_arrival, is_best_seller,
    wash_care, size_chart, highlights, tags,
    meta_title, meta_description,
    gelato_template_id,
    categories (id, name),
    product_images (id, url, cloudinary_id, is_primary, sort_order, alt_text),
    product_variants (id, color, color_hex, size, sku, stock_status,
    gelato_product_uid, gelato_print_file_front, gelato_print_file_back, sort_order)
  `)
    .eq('id', id)
    .single()

  if (!data) return null
  return data
}

export async function getAdminCategories() {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('categories')
    .select('id, name')
    .eq('is_active', true)
    .order('name')
  return data ?? []
}

export async function saveAdminProduct({
  mode,
  id,
  fields,
  variants,
  images,
}: {
  mode: 'create' | 'edit'
  id?: string
  fields: {
    name: string
    slug: string
    sku: string
    description: string
    category_id: string
    price_inr: number
    price_usd: number | null
    status: 'active' | 'draft'
    is_new_arrival: boolean
    is_best_seller: boolean
    wash_care: string
    size_chart: string
    highlights: { key: string; value: string }[]
    tags: string[]
    meta_title: string
    meta_description: string
    gelato_template_id?: string | null   // ← add
  }
  variants: {
    id?: string
    color: string
    color_hex: string
    size: string
    sku: string
    stock_status: string
    gelato_template_variant_id?: string | null
    banian_sku?: string | null
    gelato_price_usd?: number | null
  }[]
  images: {
    id?: string
    url: string
    cloudinary_id: string
    is_primary: boolean
    sort_order: number
    alt_text: string
  }[]
}) {
  const supabase = createAdminClient()

  let productId = id

  if (mode === 'create') {
    const { data, error } = await supabase
      .from('products')
      .insert({
        ...fields,
        highlights: fields.highlights ?? [],
      })
      .select('id')
      .single()
    if (error || !data) return { error: error?.message ?? 'Failed to create product' }
    productId = data.id
  } else {
    const { error } = await supabase
      .from('products')
      .update({
        ...fields,
        highlights: fields.highlights ?? [],
        updated_at: new Date().toISOString(),
      })
      .eq('id', productId!)
    if (error) return { error: error.message }
  }

  // Upsert variants
  if (variants.length > 0) {
    await supabase
      .from('product_variants')
      .delete()
      .eq('product_id', productId!)

    await supabase.from('product_variants').insert(
      variants.map((v, i) => ({
        product_id: productId,
        color: v.color,
        color_hex: v.color_hex,
        size: v.size,
        sku: v.sku,
        stock_status: v.stock_status,
        gelato_template_variant_id: v.gelato_template_variant_id ?? null,
        banian_sku: v.banian_sku ?? null,
        gelato_price_usd: v.gelato_price_usd ?? null,
        sort_order: i,
      }))
    )
  }

  // Upsert images
  if (images.length > 0) {
    // Delete old Cloudinary images before replacing
    const { data: oldImages } = await supabase
      .from('product_images')
      .select('cloudinary_id')
      .eq('product_id', productId!)

    if (oldImages && oldImages.length > 0) {
      const { deleteImage } = await import('@/lib/cloudinary')
      await Promise.allSettled(
        oldImages
          .filter((img) => img.cloudinary_id)
          .map((img) => deleteImage(img.cloudinary_id))
      )
    }

    await supabase
      .from('product_images')
      .delete()
      .eq('product_id', productId!)

    await supabase
      .from('product_images')
      .insert(
        images.map((img, i) => ({
          product_id: productId,
          url: img.url,
          cloudinary_id: img.cloudinary_id,
          is_primary: img.is_primary,
          sort_order: i,
          alt_text: img.alt_text,
        }))
      )
  }

  return { error: null, productId }
}

export async function deleteAdminProduct(id: string) {
  const supabase = createAdminClient()

  // Fetch image cloudinary_ids before deleting
  const { data: images } = await supabase
    .from('product_images')
    .select('cloudinary_id')
    .eq('product_id', id)

  // Delete from Cloudinary
  if (images && images.length > 0) {
    const { deleteImage } = await import('@/lib/cloudinary')
    await Promise.allSettled(
      images
        .filter((img) => img.cloudinary_id)
        .map((img) => deleteImage(img.cloudinary_id))
    )
  }

  // Delete product from DB (cascades to product_images, product_variants)
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  return { error: error?.message ?? null }
}