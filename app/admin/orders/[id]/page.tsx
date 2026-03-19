import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { adminCinzel, adminCormorant, adminRaleway } from "@/components/admin/adminFonts";
import { adminOrders } from "@/adminOrders";

type Tone = "success" | "info" | "warning" | "danger" | "muted";

const tonePalette: Record<Tone, { text: string; border: string; bg: string }> = {
    success: { text: "#4CAF7D", border: "#4CAF7D40", bg: "#4CAF7D1F" },
    info: { text: "#4A90C4", border: "#4A90C44D", bg: "#4A90C41F" },
    warning: { text: "#E6A817", border: "#E6A8174D", bg: "#E6A8171F" },
    danger: { text: "#C0392B", border: "#C0392B4D", bg: "#C0392B1F" },
    muted: { text: "#B7AFC3", border: "#E6C9791F", bg: "#E6C9790F" },
};

function getInitials(name: string) {
    return name
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

function HeaderStatusBadge({ label, tone }: { label: string; tone: Tone }) {
    const palette = tonePalette[tone];
    return (
        <span
            className={`${adminCinzel.className} inline-flex items-center border px-4 py-[7px] text-[11px] font-semibold tracking-[0.2em]`}
            style={{ color: palette.text, borderColor: palette.border, backgroundColor: palette.bg }}
        >
            {label.toUpperCase()}
        </span>
    );
}

function PaymentStatusBadge({ label, tone }: { label: string; tone: Tone }) {
    const palette = tonePalette[tone];
    return (
        <span
            className={`${adminCinzel.className} inline-flex items-center border px-3 py-1 text-[9px] font-semibold tracking-[0.1em]`}
            style={{ color: palette.text, borderColor: palette.border, backgroundColor: palette.bg }}
        >
            {label.toUpperCase()}
        </span>
    );
}

function DetailLabel({ children }: { children: string }) {
    return (
        <p className={`${adminCinzel.className} text-[8px] font-semibold tracking-[0.32em] text-text-muted`}>
            {children}
        </p>
    );
}

function DetailValue({ children }: { children: string }) {
    return (
        <p className={`${adminRaleway.className} text-[13px] font-light text-text-primary`}>
            {children}
        </p>
    );
}

function SectionHeading({ children }: { children: string }) {
    return (
        <p className={`${adminCinzel.className} text-[10px] font-bold tracking-[0.3em] text-gold`}>
            {children}
        </p>
    );
}

export default async function AdminOrderDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const orderId = id.toLowerCase();
    const order = adminOrders.find((item) => item.id.toLowerCase() === orderId);

    if (!order) {
        return (
            <div className="space-y-4">
                <div>
                    <p className={`${adminCinzel.className} text-[9px] tracking-[0.38em] text-gold`}>ORDERS</p>
                    <h1 className={`${adminCormorant.className} mt-1 text-[32px] font-light text-text-primary`}>
                        Order Details
                    </h1>
                    <p className={`${adminRaleway.className} mt-2 text-[12px] font-light text-text-muted`}>
                        Order not found
                    </p>
                </div>
                <div className="border border-gold/10 bg-[#1E1A2E] p-6">
                    <p className={`${adminRaleway.className} text-[13px] font-light text-text-muted`}>
                        We could not find an order with this ID.
                    </p>
                </div>
            </div>
        );
    }

    const metaLine = `Placed ${order.date} \u00b7 Razorpay \u00b7 ${order.provider}`;
    const paymentDate = `${order.date}, 4:33 PM`;
    const fulfillmentStatusTone = order.fulfillment.tone;
    const paymentStatusTone = order.payment.tone;
    const shippingLabel = order.totals.shipping === "Rs 0" ? "Free" : order.totals.shipping;
    const shippingTone = order.totals.shipping === "Rs 0" ? "text-[#4CAF7D]" : "text-text-primary";
    const firstItem = order.items[0];
    const itemVariant = firstItem?.variant ?? "Black / XL";
    const itemSku = firstItem?.sku ?? "ALB-EMT";
    const itemQty = firstItem ? `Qty: ${firstItem.qty} \u00d7 ${firstItem.price}` : "Qty: 1";

    return (
        <div className="space-y-7">
            <p className={`${adminRaleway.className} text-[12px] font-light text-text-muted`}>
                Orders / {order.id}
            </p>

            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-1">
                    <h1 className={`${adminCormorant.className} text-[32px] font-light text-text-primary`}>
                        Order {order.id}
                    </h1>
                    <p className={`${adminRaleway.className} text-[13px] font-light text-text-muted`}>
                        {metaLine}
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <HeaderStatusBadge label={order.fulfillment.label} tone={fulfillmentStatusTone} />
                    <Link
                        href="/admin/orders"
                        className={`flex items-center gap-2 ${adminCinzel.className} text-[10px] font-semibold tracking-[0.2em] text-text-muted transition-colors duration-200 hover:text-gold`}
                    >
                        <ArrowLeft className="h-3 w-3" strokeWidth={2} />
                        BACK TO ORDERS
                    </Link>
                </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
                <div className="space-y-4">
                    <section className="border border-gold/10 bg-[#1E1A2E] p-6">
                        <SectionHeading>CUSTOMER INFORMATION</SectionHeading>
                        <div className="mt-4 flex items-center gap-5">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold text-[14px] text-gold">
                                {getInitials(order.customer)}
                            </div>
                            <div className="space-y-1">
                                <p className={`${adminRaleway.className} text-[15px] font-medium text-text-primary`}>
                                    {order.customer}
                                </p>
                                <p className={`${adminRaleway.className} text-[13px] font-light text-text-muted`}>
                                    {order.email}
                                </p>
                                <p className={`${adminRaleway.className} text-[13px] font-light text-text-muted`}>
                                    {order.phone}
                                </p>
                                <p className={`${adminRaleway.className} text-[12px] font-light text-text-muted`}>
                                    Member since Jan 2026 \u00b7 3 orders
                                </p>
                            </div>
                        </div>
                        <Link
                            href={`/admin/customers/${order.customerId}`}
                            className={`${adminCinzel.className} mt-4 inline-flex text-[10px] font-semibold tracking-[0.2em] text-gold`}
                        >
                            VIEW CUSTOMER {"\u2192"}
                        </Link>
                    </section>

                    <section className="border border-gold/10 bg-[#1E1A2E] p-6">
                        <SectionHeading>SHIPPING ADDRESS</SectionHeading>
                        <div className="mt-4 space-y-2">
                            <p className={`${adminRaleway.className} text-[14px] font-light text-text-primary`}>
                                {order.customer}
                            </p>
                            <p className={`${adminRaleway.className} text-[14px] font-light text-text-primary`}>
                                {order.shippingAddress.line1}
                                {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ""}
                            </p>
                            <p className={`${adminRaleway.className} text-[14px] font-light text-text-primary`}>
                                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postal}
                            </p>
                            <p className={`${adminRaleway.className} text-[14px] font-light text-text-primary`}>
                                {order.shippingAddress.country} \u00b7 {order.phone}
                            </p>
                        </div>
                    </section>

                    <section className="border border-gold/10 bg-[#1E1A2E] p-6">
                        <SectionHeading>ORDER ITEMS</SectionHeading>
                        <div className="mt-4 space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 border border-gold/10 bg-[#130F18]" />
                                <div className="space-y-1">
                                    <p className={`${adminRaleway.className} text-[14px] font-medium text-text-primary`}>
                                        {firstItem?.name ?? "Empire Oversized Tee"}
                                    </p>
                                    <p className={`${adminRaleway.className} text-[12px] font-light text-text-muted`}>
                                        {itemVariant}
                                    </p>
                                    <p className={`${adminRaleway.className} text-[11px] font-light text-text-muted`}>
                                        SKU: {itemSku}
                                    </p>
                                    <p className={`${adminRaleway.className} text-[13px] font-light text-text-muted`}>
                                        {itemQty}
                                    </p>
                                </div>
                                <div className="ml-auto text-right">
                                    <p className={`${adminCinzel.className} text-[15px] text-gold`}>
                                        {firstItem?.total ?? order.amount}
                                    </p>
                                </div>
                            </div>

                            <div className="h-px w-full bg-gold/10" />

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className={`${adminRaleway.className} text-[13px] font-light text-text-muted`}>
                                        Subtotal
                                    </span>
                                    <span className={`${adminRaleway.className} text-[13px] font-light text-text-primary`}>
                                        {order.totals.subtotal}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className={`${adminRaleway.className} text-[13px] font-light text-text-muted`}>
                                        Shipping
                                    </span>
                                    <span className={`${adminRaleway.className} text-[13px] font-light ${shippingTone}`}>
                                        {shippingLabel}
                                    </span>
                                </div>
                                {/* Discount/Coupon rows removed per design */}
                            </div>

                            <div className="h-px w-full bg-gold/10" />

                            <div className="flex items-center justify-between">
                                <span className={`${adminCinzel.className} text-[12px] font-semibold tracking-[0.1em] text-text-primary`}>
                                    TOTAL
                                </span>
                                <span className={`${adminCinzel.className} text-[16px] font-semibold text-gold`}>
                                    {order.totals.total}
                                </span>
                            </div>
                        </div>
                    </section>

                    <section className="border border-gold/10 bg-[#1E1A2E] p-6">
                        <SectionHeading>PAYMENT DETAILS</SectionHeading>
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <div className="space-y-3">
                                <DetailLabel>GATEWAY</DetailLabel>
                                <DetailValue>Razorpay</DetailValue>
                                <DetailLabel>TRANSACTION ID</DetailLabel>
                                <DetailValue>{order.transactionId}</DetailValue>
                                <DetailLabel>PAYMENT METHOD</DetailLabel>
                                <DetailValue>{order.paymentMethod}</DetailValue>
                            </div>
                            <div className="space-y-3">
                                <DetailLabel>PAYMENT STATUS</DetailLabel>
                                <PaymentStatusBadge label={order.payment.label} tone={paymentStatusTone} />
                                <DetailLabel>AMOUNT CHARGED</DetailLabel>
                                <p className={`${adminCinzel.className} text-[18px] font-light text-gold`}>
                                    {order.amount}
                                </p>
                                <DetailLabel>DATE</DetailLabel>
                                <DetailValue>{paymentDate}</DetailValue>
                            </div>
                        </div>
                    </section>

                    <section className="border border-gold/10 bg-[#1E1A2E] p-6">
                        <SectionHeading>FULFILLMENT DETAILS</SectionHeading>
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <div className="space-y-3">
                                <DetailLabel>PROVIDER</DetailLabel>
                                <DetailValue>{order.provider}</DetailValue>
                                <DetailLabel>FORM SUBMITTED</DetailLabel>
                                <DetailValue>Yes \u00b7 {order.date}, 4:35 PM</DetailValue>
                                <DetailLabel>FORM RESPONSE</DetailLabel>
                                <DetailValue>200 OK</DetailValue>
                            </div>
                            <div className="space-y-3">
                                <DetailLabel>TRACKING NUMBER</DetailLabel>
                                <p className={`${adminCinzel.className} text-[14px] text-text-primary`}>
                                    DEL928374612
                                </p>
                                <DetailLabel>COURIER</DetailLabel>
                                <DetailValue>Delhivery</DetailValue>
                                <DetailLabel>TRACKING LINK</DetailLabel>
                                <DetailValue>delhivery.com/track {"\u2192"}</DetailValue>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="space-y-4 lg:w-[280px]">
                    <section className="border border-gold/10 bg-[#1E1A2E] p-6">
                        <SectionHeading>ORDER ACTIONS</SectionHeading>
                        <div className="mt-4 space-y-3">
                            <button
                                type="button"
                                className={`${adminCinzel.className} w-full border border-[#E6A817] px-4 py-2 text-[10px] font-semibold tracking-[0.2em] text-[#E6A817] transition-colors duration-200 hover:bg-[#E6A817] hover:text-[#130F18]`}
                            >
                                MARK AS PROCESSING
                            </button>
                            <button
                                type="button"
                                className={`${adminCinzel.className} w-full border border-[#4A90C4] px-4 py-2 text-[10px] font-semibold tracking-[0.2em] text-[#4A90C4] transition-colors duration-200 hover:bg-[#4A90C4] hover:text-[#130F18]`}
                            >
                                MARK AS SHIPPED
                            </button>
                            <button
                                type="button"
                                className={`${adminCinzel.className} w-full bg-gold px-4 py-2 text-[10px] font-semibold tracking-[0.2em] text-nav transition-colors duration-200 hover:bg-gold-hover`}
                            >
                                MARK AS DELIVERED
                            </button>
                            <button
                                type="button"
                                className={`${adminCinzel.className} w-full border border-[#C0392B] px-4 py-2 text-[10px] font-semibold tracking-[0.2em] text-[#C0392B] transition-colors duration-200 hover:bg-[#C0392B] hover:text-white`}
                            >
                                CANCEL ORDER
                            </button>
                        </div>

                        <div className="my-4 h-px w-full bg-gold/10" />

                        <p className={`${adminCinzel.className} text-[9px] font-semibold tracking-[0.3em] text-text-muted`}>
                            ADD TRACKING NUMBER
                        </p>
                        <div className="mt-3 space-y-3">
                            {[
                                { placeholder: "Tracking number", type: "text" },
                                { placeholder: "Courier name (Delhivery, FedEx...)", type: "text" },
                                { placeholder: "https://...", type: "url" },
                            ].map((field) => (
                                <input
                                    key={field.placeholder}
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    className={`${adminRaleway.className} h-[38px] w-full border border-gold/15 bg-[#0F0C14] px-3 text-[13px] font-light text-text-primary outline-none placeholder:text-text-muted`}
                                />
                            ))}
                            <button
                                type="button"
                                className={`${adminCinzel.className} w-full bg-gold px-4 py-2 text-[10px] font-semibold tracking-[0.2em] text-nav`}
                            >
                                SAVE TRACKING
                            </button>
                        </div>
                    </section>

                    <section className="border border-gold/10 bg-[#1E1A2E] p-6">
                        <SectionHeading>INTERNAL NOTES</SectionHeading>
                        <textarea
                            rows={3}
                            placeholder="Add internal notes..."
                            className={`${adminRaleway.className} mt-3 w-full resize-none border border-gold/15 bg-[#0F0C14] px-3 py-2 text-[13px] font-light text-text-primary outline-none placeholder:text-text-muted`}
                        />
                        <button
                            type="button"
                            className={`${adminCinzel.className} mt-3 w-full border border-gold/100 px-4 py-2 text-[10px] font-semibold tracking-[0.2em] text-text-muted transition-colors duration-200 hover:border-[#130F18] hover:bg-gold-hover hover:text-[#130F18]`}
                        >
                            SAVE NOTE
                        </button>
                    </section>

                    <section className="border border-gold/10 bg-[#1E1A2E] p-6">
                        <SectionHeading>ORDER TIMELINE</SectionHeading>
                        <div className="mt-4 space-y-3">
                            {[
                                { title: "Order placed", time: `${order.date}, 4:30 PM` },
                                { title: "Payment confirmed", time: `${order.date}, 4:33 PM` },
                                { title: "Shipment created", time: `${order.date}, 4:40 PM` },
                            ].map((event, index, all) => (
                                <div key={event.title} className="flex gap-3">
                                    <div className="flex flex-col items-center">
                                        <div className="h-2 w-2 rounded-full bg-gold" />
                                        {index < all.length - 1 ? <div className="mt-1 h-6 w-px bg-gold/60" /> : null}
                                    </div>
                                    <div>
                                        <p className={`${adminRaleway.className} text-[13px] font-medium text-text-primary`}>
                                            {event.title}
                                        </p>
                                        <p className={`${adminRaleway.className} text-[12px] font-light text-text-muted`}>
                                            {event.time}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
