import { notFound } from "next/navigation";
import ProductView from "@/components/customer/ProductView";
import { getProductBySlug } from "@/lib/customer/products";

export default async function ProductPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const product = getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    return <ProductView product={product} />;
}
