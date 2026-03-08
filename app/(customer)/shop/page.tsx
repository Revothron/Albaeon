import ShopCollectionView from "@/components/customer/ShopCollectionView";
import { collectionProducts } from "@/lib/customer/products";

export default function ShopPage() {
    return (
        <ShopCollectionView
            heading="Collection"
            description="Curated mythic essentials for an international wardrobe."
            products={collectionProducts}
        />
    );
}
