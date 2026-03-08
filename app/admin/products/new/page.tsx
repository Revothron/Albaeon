import AdminProductEditor from "@/components/admin/AdminProductEditor";
import { addProductTemplate } from "@/lib/admin/products";

export default function AddProductPage() {
    return <AdminProductEditor mode="create" product={addProductTemplate} />;
}
