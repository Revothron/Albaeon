export type ProductHighlight = {
    label: string;
    value: string;
};

export const productCategories = [
    { slug: "t-shirts", label: "T-Shirts" },
    { slug: "hoodies", label: "Hoodies" },
    { slug: "shirts", label: "Shirts" },
    { slug: "pants", label: "Pants" },
    { slug: "jackets", label: "Jackets" },
    { slug: "sets", label: "Sets" },
] as const;

export type ProductCategorySlug = (typeof productCategories)[number]["slug"];

export type Product = {
    slug: string;
    category: ProductCategorySlug;
    name: string;
    price: string;
    image: string;
    gallery: string[];
    sizes: string[];
    defaultSize: string;
    description: string;
    sizeChart: string;
    washCare: string;
    returnPolicy: string;
    highlights: ProductHighlight[];
};

const products: Product[] = [
    {
        slug: "aurelian-crest-tee",
        category: "t-shirts",
        name: "Aurelian Crest Tee",
        price: "$95",
        image: "/collection/aurelian-crest-tee.png",
        gallery: [
            "/collection/aurelian-crest-tee.png",
            "/collection/aurelian-crest-tee.png",
            "/collection/aurelian-crest-tee.png",
            "/collection/aurelian-crest-tee.png",
        ],
        sizes: ["S", "M", "L", "XL", "2XL"],
        defaultSize: "M",
        description:
            "Heavyweight cotton tee with crest artwork, a clean oversized drape, and a premium finish designed for daily wear.",
        sizeChart: "S (Chest 36) / M (Chest 38) / L (Chest 40) / XL (Chest 42) / 2XL (Chest 44)",
        washCare:
            "Machine wash cold, turn inside out, and hang dry to preserve the print depth and fabric structure.",
        returnPolicy:
            "Returns and exchanges accepted within 14 days on unworn items with original tags. Refunds are processed after inspection.",
        highlights: [
            { label: "Fit", value: "Oversized Fit" },
            { label: "Neck", value: "Round Neck" },
            { label: "Pattern", value: "Printed Crest" },
            { label: "Fabric", value: "240 GSM Cotton" },
            { label: "Sleeve", value: "Regular Sleeve" },
            { label: "Length", value: "Regular" },
        ],
    },
    {
        slug: "sovereign-hoodie",
        category: "hoodies",
        name: "Sovereign Hoodie",
        price: "$176",
        image: "/collection/sovereign-hoodie.png",
        gallery: [
            "/collection/sovereign-hoodie.png",
            "/collection/sovereign-hoodie.png",
            "/collection/sovereign-hoodie.png",
            "/collection/sovereign-hoodie.png",
        ],
        sizes: ["S", "M", "L", "XL", "2XL"],
        defaultSize: "M",
        description:
            "Structured hoodie with a rich tonal body, refined embroidery, and a dense fleece interior built for colder layers.",
        sizeChart: "S (Chest 38) / M (Chest 40) / L (Chest 42) / XL (Chest 44) / 2XL (Chest 46)",
        washCare:
            "Machine wash cold on gentle cycle. Wash with similar colors and dry flat or tumble dry low.",
        returnPolicy:
            "Returns and exchanges accepted within 14 days on unworn items with original tags. Refunds are processed after inspection.",
        highlights: [
            { label: "Fit", value: "Relaxed Fit" },
            { label: "Hood", value: "Drawcord Hood" },
            { label: "Pattern", value: "Minimal Embroidery" },
            { label: "Fabric", value: "420 GSM Fleece" },
            { label: "Sleeve", value: "Drop Shoulder" },
            { label: "Length", value: "Regular" },
        ],
    },
    {
        slug: "monolith-shirt",
        category: "shirts",
        name: "Monolith Shirt",
        price: "$124",
        image: "/collection/monolith-shirt.png",
        gallery: [
            "/collection/monolith-shirt.png",
            "/collection/monolith-shirt.png",
            "/collection/monolith-shirt.png",
            "/collection/monolith-shirt.png",
        ],
        sizes: ["S", "M", "L", "XL", "2XL"],
        defaultSize: "M",
        description:
            "Sharp long-sleeve shirt with a disciplined silhouette, premium blend fabric, and understated Albaeon detailing.",
        sizeChart: "S (Chest 37) / M (Chest 39) / L (Chest 41) / XL (Chest 43) / 2XL (Chest 45)",
        washCare:
            "Machine wash cold with mild detergent. Reshape while damp and iron on low heat if needed.",
        returnPolicy:
            "Returns and exchanges accepted within 14 days on unworn items with original tags. Refunds are processed after inspection.",
        highlights: [
            { label: "Fit", value: "Tailored Fit" },
            { label: "Collar", value: "Spread Collar" },
            { label: "Pattern", value: "Minimal Solid" },
            { label: "Fabric", value: "Cotton Blend" },
            { label: "Sleeve", value: "Full Sleeve" },
            { label: "Length", value: "Curved Hem" },
        ],
    },
    {
        slug: "empire-utility-pant",
        category: "pants",
        name: "Empire Utility Pant",
        price: "$142",
        image: "/collection/empire-utility-pant.png",
        gallery: [
            "/collection/empire-utility-pant.png",
            "/collection/empire-utility-pant.png",
            "/collection/empire-utility-pant.png",
            "/collection/empire-utility-pant.png",
        ],
        sizes: ["S", "M", "L", "XL", "2XL"],
        defaultSize: "M",
        description:
            "Utility trouser with precise panel construction, a clean taper, and sturdy twill for structured everyday wear.",
        sizeChart: "S (Waist 30) / M (Waist 32) / L (Waist 34) / XL (Waist 36) / 2XL (Waist 38)",
        washCare:
            "Machine wash cold, wash inside out, and hang dry to maintain panel definition and color depth.",
        returnPolicy:
            "Returns and exchanges accepted within 14 days on unworn items with original tags. Refunds are processed after inspection.",
        highlights: [
            { label: "Fit", value: "Straight Fit" },
            { label: "Waist", value: "Mid Rise" },
            { label: "Pattern", value: "Utility Paneling" },
            { label: "Fabric", value: "Structured Twill" },
            { label: "Leg", value: "Tapered Leg" },
            { label: "Length", value: "Ankle Length" },
        ],
    },
    {
        slug: "nocturne-layer-jacket",
        category: "jackets",
        name: "Nocturne Layer Jacket",
        price: "$238",
        image: "/collection/nocturne-layer-jacket.png",
        gallery: [
            "/collection/nocturne-layer-jacket.png",
            "/collection/nocturne-layer-jacket.png",
            "/collection/nocturne-layer-jacket.png",
            "/collection/nocturne-layer-jacket.png",
        ],
        sizes: ["S", "M", "L", "XL", "2XL"],
        defaultSize: "M",
        description:
            "Layered jacket with a sculpted front, dense fabric body, and quiet technical detailing for a modern mythic silhouette.",
        sizeChart: "S (Chest 38) / M (Chest 40) / L (Chest 42) / XL (Chest 44) / 2XL (Chest 46)",
        washCare:
            "Dry clean recommended. For spot care, use a cool damp cloth and avoid harsh agitation on layered panels.",
        returnPolicy:
            "Returns and exchanges accepted within 14 days on unworn items with original tags. Refunds are processed after inspection.",
        highlights: [
            { label: "Fit", value: "Relaxed Fit" },
            { label: "Neck", value: "Stand Collar" },
            { label: "Pattern", value: "Layered Panels" },
            { label: "Fabric", value: "Tech Twill Blend" },
            { label: "Sleeve", value: "Full Sleeve" },
            { label: "Length", value: "Regular" },
        ],
    },
    {
        slug: "glyph-knit-set",
        category: "sets",
        name: "Glyph Knit Set",
        price: "$210",
        image: "/collection/glyph-knit-set.png",
        gallery: [
            "/collection/glyph-knit-set.png",
            "/collection/glyph-knit-set.png",
            "/collection/glyph-knit-set.png",
            "/collection/glyph-knit-set.png",
        ],
        sizes: ["S", "M", "L", "XL", "2XL"],
        defaultSize: "M",
        description:
            "Coordinated knit set built for comfort, depth, and a refined tonal finish across both pieces.",
        sizeChart: "S (Chest 38 / Waist 30) / M (Chest 40 / Waist 32) / L (Chest 42 / Waist 34) / XL (Chest 44 / Waist 36)",
        washCare:
            "Hand wash cold or use a delicate wool cycle. Dry flat away from direct heat to keep the knit shape intact.",
        returnPolicy:
            "Returns and exchanges accepted within 14 days on unworn items with original tags. Refunds are processed after inspection.",
        highlights: [
            { label: "Fit", value: "Comfort Fit" },
            { label: "Neck", value: "Crew Neck" },
            { label: "Pattern", value: "Textured Knit" },
            { label: "Fabric", value: "Premium Knit Blend" },
            { label: "Sleeve", value: "Full Sleeve" },
            { label: "Length", value: "Regular" },
        ],
    },
];

const homeProducts: Product[] = [
    {
        slug: "obsidian-crest-tee",
        category: "t-shirts",
        name: "Obsidian Crest Tee",
        price: "$96",
        image: "/home/arrival-obsidian-crest-tee.png",
        gallery: [
            "/home/arrival-obsidian-crest-tee.png",
            "/home/arrival-obsidian-crest-tee.png",
            "/home/arrival-obsidian-crest-tee.png",
            "/home/arrival-obsidian-crest-tee.png",
        ],
        sizes: ["S", "M", "L", "XL", "2XL"],
        defaultSize: "M",
        description:
            "Signature crest tee with deep tonal artwork, built on a structured cotton base for a bold daily uniform.",
        sizeChart: "S (Chest 36) / M (Chest 38) / L (Chest 40) / XL (Chest 42) / 2XL (Chest 44)",
        washCare:
            "Machine wash cold, turn inside out, and hang dry to preserve the print depth and fabric structure.",
        returnPolicy:
            "Returns and exchanges accepted within 14 days on unworn items with original tags. Refunds are processed after inspection.",
        highlights: [
            { label: "Fit", value: "Oversized Fit" },
            { label: "Neck", value: "Round Neck" },
            { label: "Pattern", value: "Crest Print" },
            { label: "Fabric", value: "240 GSM Cotton" },
            { label: "Sleeve", value: "Regular Sleeve" },
            { label: "Length", value: "Regular" },
        ],
    },
    {
        slug: "vanguard-glyph-hoodie",
        category: "hoodies",
        name: "Vanguard Glyph Hoodie",
        price: "$168",
        image: "/home/arrival-vanguard-glyph-hoodie.png",
        gallery: [
            "/home/arrival-vanguard-glyph-hoodie.png",
            "/home/arrival-vanguard-glyph-hoodie.png",
            "/home/arrival-vanguard-glyph-hoodie.png",
            "/home/arrival-vanguard-glyph-hoodie.png",
        ],
        sizes: ["S", "M", "L", "XL", "2XL"],
        defaultSize: "M",
        description:
            "Glyph-stitched hoodie with a dense fleece core, designed for colder nights and heavy layering.",
        sizeChart: "S (Chest 38) / M (Chest 40) / L (Chest 42) / XL (Chest 44) / 2XL (Chest 46)",
        washCare:
            "Machine wash cold on gentle cycle. Wash with similar colors and dry flat or tumble dry low.",
        returnPolicy:
            "Returns and exchanges accepted within 14 days on unworn items with original tags. Refunds are processed after inspection.",
        highlights: [
            { label: "Fit", value: "Relaxed Fit" },
            { label: "Hood", value: "Drawcord Hood" },
            { label: "Pattern", value: "Glyph Embroidery" },
            { label: "Fabric", value: "420 GSM Fleece" },
            { label: "Sleeve", value: "Drop Shoulder" },
            { label: "Length", value: "Regular" },
        ],
    },
    {
        slug: "imperial-cut-shirt",
        category: "shirts",
        name: "Imperial Cut Shirt",
        price: "$122",
        image: "/home/arrival-imperial-cut-shirt.png",
        gallery: [
            "/home/arrival-imperial-cut-shirt.png",
            "/home/arrival-imperial-cut-shirt.png",
            "/home/arrival-imperial-cut-shirt.png",
            "/home/arrival-imperial-cut-shirt.png",
        ],
        sizes: ["S", "M", "L", "XL", "2XL"],
        defaultSize: "M",
        description:
            "Tailored cut shirt with clean architectural lines and a soft structured hand for daily uniform dressing.",
        sizeChart: "S (Chest 37) / M (Chest 39) / L (Chest 41) / XL (Chest 43) / 2XL (Chest 45)",
        washCare:
            "Machine wash cold with mild detergent. Reshape while damp and iron on low heat if needed.",
        returnPolicy:
            "Returns and exchanges accepted within 14 days on unworn items with original tags. Refunds are processed after inspection.",
        highlights: [
            { label: "Fit", value: "Tailored Fit" },
            { label: "Collar", value: "Spread Collar" },
            { label: "Pattern", value: "Clean Solid" },
            { label: "Fabric", value: "Cotton Blend" },
            { label: "Sleeve", value: "Full Sleeve" },
            { label: "Length", value: "Curved Hem" },
        ],
    },
    {
        slug: "nocturne-utility-set",
        category: "sets",
        name: "Nocturne Utility Set",
        price: "$214",
        image: "/home/arrival-nocturne-utility-set.png",
        gallery: [
            "/home/arrival-nocturne-utility-set.png",
            "/home/arrival-nocturne-utility-set.png",
            "/home/arrival-nocturne-utility-set.png",
            "/home/arrival-nocturne-utility-set.png",
        ],
        sizes: ["S", "M", "L", "XL", "2XL"],
        defaultSize: "M",
        description:
            "Coordinated utility set with layered paneling, built for movement and grounded in structured fabric weight.",
        sizeChart: "S (Chest 38 / Waist 30) / M (Chest 40 / Waist 32) / L (Chest 42 / Waist 34) / XL (Chest 44 / Waist 36)",
        washCare:
            "Machine wash cold, wash inside out, and hang dry to maintain panel definition and color depth.",
        returnPolicy:
            "Returns and exchanges accepted within 14 days on unworn items with original tags. Refunds are processed after inspection.",
        highlights: [
            { label: "Fit", value: "Comfort Fit" },
            { label: "Neck", value: "Crew Neck" },
            { label: "Pattern", value: "Utility Panels" },
            { label: "Fabric", value: "Structured Twill" },
            { label: "Sleeve", value: "Full Sleeve" },
            { label: "Length", value: "Regular" },
        ],
    },
    {
        slug: "atlas-prime-hoodie",
        category: "hoodies",
        name: "Atlas Prime Hoodie",
        price: "$172",
        image: "/home/best-atlas-prime-hoodie.png",
        gallery: [
            "/home/best-atlas-prime-hoodie.png",
            "/home/best-atlas-prime-hoodie.png",
            "/home/best-atlas-prime-hoodie.png",
            "/home/best-atlas-prime-hoodie.png",
        ],
        sizes: ["S", "M", "L", "XL", "2XL"],
        defaultSize: "M",
        description:
            "Heavy fleece hoodie with a sculpted hood and clean branding details, designed for everyday armor.",
        sizeChart: "S (Chest 38) / M (Chest 40) / L (Chest 42) / XL (Chest 44) / 2XL (Chest 46)",
        washCare:
            "Machine wash cold on gentle cycle. Wash with similar colors and dry flat or tumble dry low.",
        returnPolicy:
            "Returns and exchanges accepted within 14 days on unworn items with original tags. Refunds are processed after inspection.",
        highlights: [
            { label: "Fit", value: "Relaxed Fit" },
            { label: "Hood", value: "Structured Hood" },
            { label: "Pattern", value: "Minimal Embroidery" },
            { label: "Fabric", value: "420 GSM Fleece" },
            { label: "Sleeve", value: "Drop Shoulder" },
            { label: "Length", value: "Regular" },
        ],
    },
    {
        slug: "mythcore-long-tee",
        category: "t-shirts",
        name: "Mythcore Long Tee",
        price: "$104",
        image: "/home/best-mythcore-long-tee.png",
        gallery: [
            "/home/best-mythcore-long-tee.png",
            "/home/best-mythcore-long-tee.png",
            "/home/best-mythcore-long-tee.png",
            "/home/best-mythcore-long-tee.png",
        ],
        sizes: ["S", "M", "L", "XL", "2XL"],
        defaultSize: "M",
        description:
            "Extended-length tee with mythcore insignia and a balanced weight for layered styling.",
        sizeChart: "S (Chest 36) / M (Chest 38) / L (Chest 40) / XL (Chest 42) / 2XL (Chest 44)",
        washCare:
            "Machine wash cold, turn inside out, and hang dry to preserve the print depth and fabric structure.",
        returnPolicy:
            "Returns and exchanges accepted within 14 days on unworn items with original tags. Refunds are processed after inspection.",
        highlights: [
            { label: "Fit", value: "Longline Fit" },
            { label: "Neck", value: "Round Neck" },
            { label: "Pattern", value: "Mythcore Print" },
            { label: "Fabric", value: "220 GSM Cotton" },
            { label: "Sleeve", value: "Regular Sleeve" },
            { label: "Length", value: "Longline" },
        ],
    },
    {
        slug: "aurelian-cargo-jacket",
        category: "jackets",
        name: "Aurelian Cargo Jacket",
        price: "$238",
        image: "/home/best-aurelian-cargo-jacket.png",
        gallery: [
            "/home/best-aurelian-cargo-jacket.png",
            "/home/best-aurelian-cargo-jacket.png",
            "/home/best-aurelian-cargo-jacket.png",
            "/home/best-aurelian-cargo-jacket.png",
        ],
        sizes: ["S", "M", "L", "XL", "2XL"],
        defaultSize: "M",
        description:
            "Cargo jacket with engineered storage and a rigid silhouette, cut for layered city wear.",
        sizeChart: "S (Chest 38) / M (Chest 40) / L (Chest 42) / XL (Chest 44) / 2XL (Chest 46)",
        washCare:
            "Dry clean recommended. For spot care, use a cool damp cloth and avoid harsh agitation on layered panels.",
        returnPolicy:
            "Returns and exchanges accepted within 14 days on unworn items with original tags. Refunds are processed after inspection.",
        highlights: [
            { label: "Fit", value: "Relaxed Fit" },
            { label: "Neck", value: "Stand Collar" },
            { label: "Pattern", value: "Utility Panels" },
            { label: "Fabric", value: "Tech Twill Blend" },
            { label: "Sleeve", value: "Full Sleeve" },
            { label: "Length", value: "Regular" },
        ],
    },
    {
        slug: "rune-line-essentials",
        category: "sets",
        name: "Rune-Line Essentials",
        price: "$128",
        image: "/home/best-rune-line-essentials.png",
        gallery: [
            "/home/best-rune-line-essentials.png",
            "/home/best-rune-line-essentials.png",
            "/home/best-rune-line-essentials.png",
            "/home/best-rune-line-essentials.png",
        ],
        sizes: ["S", "M", "L", "XL", "2XL"],
        defaultSize: "M",
        description:
            "Essential set with rune detailing and a soft structured feel, designed for comfortable daily rotation.",
        sizeChart: "S (Chest 38 / Waist 30) / M (Chest 40 / Waist 32) / L (Chest 42 / Waist 34) / XL (Chest 44 / Waist 36)",
        washCare:
            "Hand wash cold or use a delicate wool cycle. Dry flat away from direct heat to keep the knit shape intact.",
        returnPolicy:
            "Returns and exchanges accepted within 14 days on unworn items with original tags. Refunds are processed after inspection.",
        highlights: [
            { label: "Fit", value: "Comfort Fit" },
            { label: "Neck", value: "Crew Neck" },
            { label: "Pattern", value: "Rune Detailing" },
            { label: "Fabric", value: "Premium Knit Blend" },
            { label: "Sleeve", value: "Full Sleeve" },
            { label: "Length", value: "Regular" },
        ],
    },
];

export const collectionProducts = products;
const allProducts = [...products, ...homeProducts];

export function getCategoryBySlug(slug: string) {
    return productCategories.find((category) => category.slug === slug);
}

export function getProductsByCategory(category: ProductCategorySlug) {
    return products.filter((product) => product.category === category);
}

export function getProductBySlug(slug: string) {
    return allProducts.find((product) => product.slug === slug);
}
