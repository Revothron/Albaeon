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
