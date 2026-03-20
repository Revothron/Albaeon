import Link from "next/link";
import { notFound } from "next/navigation";
import { adminCinzel, adminCormorant, adminRaleway } from "@/components/admin/adminFonts";
import { AdminStatusBadge } from "@/components/admin/AdminUi";
import { getAdminCustomerById, type AdminCustomerOrderStatus } from "@/lib/admin/customers";
import { adminOrders } from "@/adminOrders";

function getInitials(name: string) {
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

function getStatusTone(status: AdminCustomerOrderStatus) {
    switch (status) {
        case "Delivered":
            return "success";
        case "Shipped":
            return "info";
        case "Processing":
            return "warning";
        default:
            return "muted";
    }
}

function DetailCard({
    title,
    children,
    className = "",
}: {
    title: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <section className={`border border-gold/10 bg-[#1E1A2E] p-6 ${className}`}>
            <p className={`${adminCinzel.className} text-[10px] font-semibold tracking-[0.3em] text-gold`}>
                {title}
            </p>
            <div className="mt-4">{children}</div>
        </section>
    );
}

function StatRow({
    label,
    value,
    valueClassName = "text-text-primary",
    withBorder = true,
}: {
    label: string;
    value: string;
    valueClassName?: string;
    withBorder?: boolean;
}) {
    return (
        <div className={`flex items-center justify-between gap-4 py-2.5 ${withBorder ? "border-b border-gold/6" : ""}`}>
            <span className={`${adminRaleway.className} text-[13px] font-light text-text-muted`}>
                {label}
            </span>
            <span className={`${adminCinzel.className} text-[14px] ${valueClassName}`}>
                {value}
            </span>
        </div>
    );
}

export default async function CustomerDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const customer = getAdminCustomerById(id);
    const fallbackOrders = adminOrders.filter((order) => order.customerId === id);

    if (!customer && fallbackOrders.length === 0) {
        notFound();
    }

    const orderToCustomerStatus = (label: string): AdminCustomerOrderStatus => {
        if (label === "Delivered" || label === "Fulfilled") {
            return "Delivered";
        }
        if (label === "Shipped") {
            return "Shipped";
        }
        if (label === "Processing") {
            return "Processing";
        }
        return "Pending";
    };

    const fallbackCustomer = fallbackOrders.length > 0
        ? {
            id,
            name: fallbackOrders[0].customer,
            username: id,
            registered: fallbackOrders[0].date,
            email: fallbackOrders[0].email,
            phone: fallbackOrders[0].phone,
            orders: fallbackOrders.length,
            spent: fallbackOrders[0].amount,
            lastOrder: fallbackOrders[0].date,
            aov: fallbackOrders[0].amount,
            countryCode: fallbackOrders[0].shippingAddress.country === "India" ? "IN" : "US",
            country: fallbackOrders[0].shippingAddress.country,
            city: fallbackOrders[0].shippingAddress.city,
            region: fallbackOrders[0].shippingAddress.state,
            postal: fallbackOrders[0].shippingAddress.postal,
            memberSince: fallbackOrders[0].date,
            segment: "New Customer",
            shippingAddress: [
                fallbackOrders[0].customer,
                fallbackOrders[0].shippingAddress.line1,
                `${fallbackOrders[0].shippingAddress.city}, ${fallbackOrders[0].shippingAddress.state} ${fallbackOrders[0].shippingAddress.postal}`,
                `${fallbackOrders[0].shippingAddress.country} / ${fallbackOrders[0].phone}`,
            ],
            billingAddress: [
                fallbackOrders[0].customer,
                fallbackOrders[0].shippingAddress.line1,
                `${fallbackOrders[0].shippingAddress.city}, ${fallbackOrders[0].shippingAddress.state} ${fallbackOrders[0].shippingAddress.postal}`,
                `${fallbackOrders[0].shippingAddress.country} / ${fallbackOrders[0].phone}`,
            ],
            orderHistory: fallbackOrders.map((order) => ({
                id: order.id,
                date: order.date,
                amount: order.amount,
                status: orderToCustomerStatus(order.fulfillment.label),
            })),
        }
        : null;

    const resolvedCustomer = customer ?? fallbackCustomer;

    const customerData = resolvedCustomer;

    if (!customerData) {
        notFound();
    }

    return (
        <div className="space-y-5">
            <div>
                <div className={`flex items-center gap-1.5 ${adminRaleway.className} text-[12px] font-light`}>
                    <span className="text-text-muted">Customers /</span>
                    <span className="text-gold">{customerData.name}</span>
                </div>
                <h1 className={`${adminCormorant.className} mt-2 text-[32px] font-light text-text-primary`}>
                    {customerData.name}
                </h1>
            </div>

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
                <div className="space-y-4">
                    <DetailCard title="CUSTOMER PROFILE">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-gold text-[14px] text-gold">
                                    {getInitials(customerData.name)}
                                </div>
                                <div className="min-w-0 flex-1 space-y-1">
                                    <p className={`${adminRaleway.className} text-[15px] font-medium text-text-primary`}>
                                        {customerData.name}
                                    </p>
                                    <p className={`${adminRaleway.className} text-[13px] font-light text-text-muted`}>
                                        {`${customerData.username} / ${customerData.email} / ${customerData.phone}`}
                                    </p>
                                    <p className={`${adminRaleway.className} text-[12px] font-light text-text-muted`}>
                                        {`Member since ${customerData.memberSince}`}
                                    </p>
                                    <p className={`${adminRaleway.className} text-[12px] font-light text-text-muted`}>
                                        {`${customerData.country} / ${customerData.city}, ${customerData.region} ${customerData.postal}`}
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <p className={`${adminRaleway.className} text-[12px] font-light text-text-muted`}>
                                        Total Orders
                                    </p>
                                    <p className={`${adminCinzel.className} text-[16px] text-text-primary`}>
                                        {customerData.orders}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className={`${adminRaleway.className} text-[12px] font-light text-text-muted`}>
                                        Total Spent
                                    </p>
                                    <p className={`${adminCinzel.className} text-[16px] text-gold`}>
                                        {customerData.spent}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className={`${adminRaleway.className} text-[12px] font-light text-text-muted`}>
                                        AOV
                                    </p>
                                    <p className={`${adminCinzel.className} text-[16px] text-text-primary`}>
                                        {customerData.aov}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className={`${adminRaleway.className} text-[12px] font-light text-text-muted`}>
                                        Last Order
                                    </p>
                                    <p className={`${adminCinzel.className} text-[16px] text-text-primary`}>
                                        {customerData.lastOrder}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </DetailCard>

                    <DetailCard title="ORDER HISTORY">
                        <div className="overflow-x-auto">
                            <div className="min-w-[520px] sm:min-w-[620px] lg:min-w-[700px]">
                                <div className="flex items-center bg-nav px-6 py-3">
                                    {["ORDER ID", "DATE", "AMOUNT", "STATUS", "ACTION"].map((heading, index) => (
                                        <div
                                            key={heading}
                                            className={`${adminCinzel.className} text-[10px] font-semibold tracking-[0.2em] text-text-muted ${
                                                index === 0 ? "w-[140px]" : index === 1 ? "w-[130px]" : index === 2 ? "w-[120px]" : index === 3 ? "w-[140px]" : "w-[80px]"
                                            }`}
                                        >
                                            {heading}
                                        </div>
                                    ))}
                                </div>

                                {customerData.orderHistory.map((order, index) => (
                                    <div
                                        key={order.id}
                                        className={`flex items-center px-6 py-3 ${index < customerData.orderHistory.length - 1 ? "border-b border-gold/6" : ""}`}
                                    >
                                        <div className={`${adminCinzel.className} w-[140px] text-[13px] text-gold`}>
                                            {order.id}
                                        </div>
                                        <div className={`${adminRaleway.className} w-[130px] text-[12px] font-light text-text-muted`}>
                                            {order.date}
                                        </div>
                                        <div className={`${adminCinzel.className} w-[120px] text-[13px] text-text-primary`}>
                                            {order.amount}
                                        </div>
                                        <div className="w-[140px]">
                                            <AdminStatusBadge
                                                label={order.status}
                                                tone={getStatusTone(order.status)}
                                            />
                                        </div>
                                        <div className="w-[80px]">
                                            <Link
                                                href={`/admin/orders/${order.id.toLowerCase()}`}
                                                className={`${adminCinzel.className} text-[9px] font-semibold tracking-[0.12em] text-gold transition-colors duration-200 hover:text-gold-hover`}
                                            >
                                                View -&gt;
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </DetailCard>

                    <DetailCard title="ADDRESSES">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <p className={`${adminCinzel.className} text-[9px] font-semibold tracking-[0.25em] text-text-muted`}>
                                    SHIPPING ADDRESS
                                </p>
                                <div className={`${adminRaleway.className} space-y-1 text-[13px] font-light leading-7 text-text-primary`}>
                                    {customerData.shippingAddress.map((line) => (
                                        <p key={line}>{line}</p>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className={`${adminCinzel.className} text-[9px] font-semibold tracking-[0.25em] text-text-muted`}>
                                    BILLING ADDRESS
                                </p>
                                <div className={`${adminRaleway.className} space-y-1 text-[13px] font-light leading-7 text-text-primary`}>
                                    {customerData.billingAddress.map((line) => (
                                        <p key={line}>{line}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </DetailCard>
                </div>

                <div className="space-y-4">
                    <DetailCard title="CUSTOMER STATS">
                        <div>
                            <StatRow label="Total Orders" value={String(customerData.orders)} />
                            <StatRow label="Total Spent" value={customerData.spent} valueClassName="text-gold" />
                            <StatRow label="AOV" value={customerData.aov} />
                            <StatRow label="Last Order" value={customerData.lastOrder} />
                            <StatRow label="Country" value={customerData.country} />
                            <StatRow label="Segment" value={customerData.segment} withBorder={false} />
                        </div>
                    </DetailCard>

                    <DetailCard title="ACCOUNT ACTIONS">
                        <div className="space-y-3">
                            <button
                                type="button"
                                className={`${adminRaleway.className} flex w-full items-center justify-center border border-[var(--status-error)] px-4 py-3 text-[13px] text-[var(--status-error)] transition-colors duration-200 hover:bg-[var(--status-error)] hover:text-white`}
                            >
                                Ban Account
                            </button>
                            <button
                                type="button"
                                className={`${adminRaleway.className} flex w-full items-center justify-center border border-gold/20 px-4 py-3 text-[13px] text-text-muted transition-colors duration-200 hover:border-gold/40 hover:text-gold`}
                            >
                                Export Customer Data
                            </button>
                        </div>
                    </DetailCard>
                </div>
            </div>
        </div>
    );
}
