import { notFound } from "next/navigation";
import ShopCollectionView from "@/components/customer/ShopCollectionView";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/customer/products";

export default async function CategoryPage({
    params,
}: {
    params: Promise<{ category: string }>;
}) {
    const { category } = await params;
    const currentCategory = getCategoryBySlug(category);

    if (!currentCategory) {
        notFound();
    }

    return (
        <ShopCollectionView
            heading={currentCategory.label}
            description={`Curated mythic essentials in ${currentCategory.label.toLowerCase()} for an international wardrobe.`}
            products={getProductsByCategory(currentCategory.slug)}
            emptyMessage={`No ${currentCategory.label.toLowerCase()} are available right now.`}
        />
    );
}
