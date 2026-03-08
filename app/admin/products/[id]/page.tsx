import { notFound } from "next/navigation";
import AdminProductEditor from "@/components/admin/AdminProductEditor";
import { getAdminProductById } from "@/lib/admin/products";

export default async function EditProductPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const product = getAdminProductById(id);

    if (!product) {
        notFound();
    }

    return <AdminProductEditor mode="edit" product={product} />;
}
