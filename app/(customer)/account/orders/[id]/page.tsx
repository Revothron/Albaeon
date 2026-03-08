import { notFound } from "next/navigation";
import OrderDetailsView from "@/components/customer/account/OrderDetailsView";
import { getOrderById } from "@/lib/customer/orders";

export default async function OrderDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const order = getOrderById(decodeURIComponent(id));

    if (!order) {
        notFound();
    }

    return <OrderDetailsView order={order} />;
}
