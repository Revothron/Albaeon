export default function EditProductPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-text-primary text-2xl font-bold">Edit Product</h1>
                <button className="btn-primary text-xs py-2 px-4">Save Changes</button>
            </div>
            <p className="text-text-muted text-sm">
                Edit product form will be loaded with product data.
            </p>
        </div>
    );
}
