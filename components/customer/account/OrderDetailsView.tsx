import Image from "next/image";
import Link from "next/link";
import { Cinzel, Cormorant_Garamond } from "next/font/google";
import {
    ArrowLeft,
    ArrowRight,
    Download,
    LifeBuoy,
    MapPinned,
    Truck,
} from "lucide-react";
import IssueReportModal from "@/components/customer/account/IssueReportModal";
import {
    CustomerOrder,
    CustomerOrderStatus,
    CustomerOrderTrackingStep,
    formatOrderAmount,
    getOrderSubtotal,
    getOrderTotalItems,
} from "@/lib/customer/orders";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"] });

function getStatusTone(status: CustomerOrderStatus) {
    switch (status) {
        case "Shipped":
            return {
                badge: "badge-info",
            };
        case "Delivered":
            return {
                badge: "badge-success",
            };
        default:
            return {
                badge: "badge-warning",
            };
    }
}

function DetailCard({
    children,
    className = "",
    id,
}: {
    children: React.ReactNode;
    className?: string;
    id?: string;
}) {
    return (
        <section
            id={id}
            className={`border border-gold bg-surface p-6 sm:p-8 ${className}`.trim()}
        >
            {children}
        </section>
    );
}

function DetailLabel({ children }: { children: React.ReactNode }) {
    return (
        <p className={`${cinzel.className} text-[10px] font-semibold tracking-[0.35em] text-gold`}>
            {children}
        </p>
    );
}

function VariantChip({ children }: { children: React.ReactNode }) {
    return (
        <span className={`${cinzel.className} inline-flex border border-gold/15 bg-primary-deep px-3 py-1.5 text-[10px] font-semibold tracking-[0.2em] text-text-muted`}>
            {children}
        </span>
    );
}

function TimelineStep({
    step,
    isLast,
}: {
    step: CustomerOrderTrackingStep;
    isLast: boolean;
}) {
    const isComplete = step.state === "complete";
    const isCurrent = step.state === "current";

    return (
        <div className="flex gap-5">
            <div className="flex w-6 flex-col items-center">
                {isCurrent ? (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border-[3px] border-gold/30">
                        <span className="h-3.5 w-3.5 rounded-full bg-gold" />
                    </span>
                ) : (
                    <span
                        className={`h-3 w-3 rounded-full border ${
                            isComplete ? "border-gold bg-gold" : "border-text-muted/35 bg-transparent"
                        }`}
                    />
                )}
                {!isLast ? (
                    <span className={`mt-2 w-0.5 flex-1 ${isComplete ? "bg-gold" : "bg-text-muted/30"}`} />
                ) : null}
            </div>

            <div className="min-w-0 flex-1 pb-1">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <p
                        className={`${cinzel.className} text-[12px] font-semibold tracking-[0.2em] ${
                            isCurrent ? "text-gold" : isComplete ? "text-text-primary" : "text-text-muted"
                        }`}
                    >
                        {step.title}
                    </p>
                    <p className={`font-sans text-[12px] ${isCurrent ? "text-gold" : "text-text-muted"}`}>
                        {step.time}
                    </p>
                </div>
                <p
                    className={`mt-1 font-sans text-[13px] leading-6 ${
                        isCurrent ? "text-text-primary" : "text-text-muted"
                    }`}
                >
                    {step.description}
                </p>

                {step.update ? (
                    <div className="mt-3 space-y-1 border-l-2 border-[var(--status-info)] bg-[#4A90C414] px-4 py-3">
                        <div className="flex items-center gap-3">
                            <Truck className="h-4 w-4 text-[var(--status-info)]" />
                            <p className="font-sans text-[12px] text-text-muted">
                                {step.update.label}
                            </p>
                        </div>
                        <p className="font-sans text-[11px] text-text-muted">
                            {step.update.time}
                        </p>
                    </div>
                ) : null}
            </div>
        </div>
    );
}

function HelpLink({
    href,
    icon,
    label,
}: {
    href: string;
    icon: React.ReactNode;
    label: string;
}) {
    return (
        <Link
            href={href}
            className="flex items-center justify-between border-b border-gold/10 px-0 py-2.5 transition-colors duration-200 hover:text-gold"
        >
            <span className="flex items-center gap-3 font-sans text-[13px] text-text-muted">
                {icon}
                {label}
            </span>
            <ArrowRight className="h-3.5 w-3.5 text-text-muted" />
        </Link>
    );
}

export default function OrderDetailsView({
    order,
}: {
    order: CustomerOrder;
}) {
    const statusTone = getStatusTone(order.status);
    const itemCount = getOrderTotalItems(order);
    const subtotal = getOrderSubtotal(order);
    const couponAmount = order.coupon?.amount ?? 0;

    return (
        <section className="min-h-screen bg-primary">
            <div className="border-b border-gold/10 bg-primary-deep">
                <div className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-2 px-5 py-4 sm:px-10 lg:px-14">
                    <Link
                        href="/account"
                        className={`${cinzel.className} text-[10px] font-semibold tracking-[0.3em] text-text-muted transition-colors duration-200 hover:text-gold`}
                    >
                        MY ACCOUNT
                    </Link>
                    <span className="font-sans text-[12px] text-text-muted/50">/</span>
                    <Link
                        href="/account/orders"
                        className={`${cinzel.className} text-[10px] font-semibold tracking-[0.3em] text-text-muted transition-colors duration-200 hover:text-gold`}
                    >
                        ORDERS
                    </Link>
                    <span className="font-sans text-[12px] text-text-muted/50">/</span>
                    <span className={`${cinzel.className} text-[10px] font-semibold tracking-[0.3em] text-gold`}>
                        {order.id}
                    </span>
                </div>
            </div>

            <div className="mx-auto max-w-[1280px] px-5 pb-16 pt-10 sm:px-10 lg:px-14">
                <div className="border-b border-gold/10 pb-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="space-y-2">
                            <p className={`${cinzel.className} text-[10px] font-bold tracking-[0.5em] text-text-muted`}>
                                ORDER DETAILS
                            </p>
                            <h1 className={`${cormorant.className} text-[40px] font-light text-gold sm:text-[48px]`}>
                                {order.id}
                            </h1>
                            <p className="font-sans text-[13px] text-text-muted">
                                Placed on {order.placedAt}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            <span
                                className={`badge ${statusTone.badge}`}`
                            >
                                {order.status}
                            </span>
                            <Link
                                href="/account/orders"
                                className={`${cinzel.className} inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.3em] text-text-muted transition-colors duration-200 hover:text-gold`}
                            >
                                <ArrowLeft className="h-3 w-3" />
                                BACK TO ORDERS
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
                    <div className="space-y-6">
                        <DetailCard>
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <p className={`${cinzel.className} text-[15px] font-bold tracking-[0.3em] text-gold`}>
                                    ITEMS ORDERED
                                </p>
                                <p className="font-sans text-[12px] text-text-muted">
                                    {itemCount} {itemCount === 1 ? "item" : "items"}
                                </p>
                            </div>

                            <div className="mt-6 space-y-6">
                                {order.items.map((item, index) => (
                                    <div key={`${item.sku}-${index}`} className="space-y-6">
                                        <div className="flex flex-col gap-5 sm:flex-row">
                                            <div className="relative h-24 w-24 overflow-hidden border border-gold bg-primary-deep">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    sizes="96px"
                                                    className="object-cover"
                                                />
                                            </div>

                                            <div className="min-w-0 flex-1 space-y-2.5">
                                                <p className={`${cinzel.className} text-[20px] font-semibold text-text-primary`}>
                                                    {item.name}
                                                </p>
                                                <p className={`${cinzel.className} text-[11px] font-semibold tracking-[0.28em] text-text-muted`}>
                                                    {item.collectionLabel}
                                                </p>

                                                <div className="flex flex-wrap gap-3">
                                                    <VariantChip>{item.color.toUpperCase()}</VariantChip>
                                                    <VariantChip>{item.size.toUpperCase()}</VariantChip>
                                                    <VariantChip>{`QTY: ${item.quantity}`}</VariantChip>
                                                </div>

                                                <p className="font-sans text-[12px] text-text-muted">
                                                    SKU: {item.sku}
                                                </p>
                                                <p className={`${cinzel.className} text-[18px] font-semibold text-gold`}>
                                                    {formatOrderAmount(item.price * item.quantity)}
                                                </p>
                                            </div>
                                        </div>

                                        {index < order.items.length - 1 ? (
                                            <div className="h-px w-full bg-gold/10" />
                                        ) : null}
                                    </div>
                                ))}
                            </div>
                        </DetailCard>

                        <DetailCard id="shipment-tracking">
                            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                                <p className={`${cinzel.className} text-[15px] font-bold tracking-[0.3em] text-gold`}>
                                    SHIPMENT TRACKING
                                </p>
                                <div className="flex flex-wrap items-center gap-3">
                                    <p className="font-sans text-[12px] text-text-muted">
                                        {order.tracking.carrier} / #{order.tracking.trackingNumber}
                                    </p>
                                    <span className={`${cinzel.className} text-[10px] font-semibold tracking-[0.2em] text-gold`}>
                                        {order.tracking.trackLabel}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-8 space-y-6">
                                {order.tracking.steps.map((step, index) => (
                                    <TimelineStep
                                        key={`${step.title}-${step.time}`}
                                        step={step}
                                        isLast={index === order.tracking.steps.length - 1}
                                    />
                                ))}
                            </div>
                        </DetailCard>

                        <DetailCard>
                            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,280px)]">
                                <div className="space-y-4">
                                    <DetailLabel>SHIPPING ADDRESS</DetailLabel>
                                    <div className="space-y-1.5">
                                        <p className="font-sans text-[14px] text-text-primary">
                                            {order.shippingAddress.name}
                                        </p>
                                        <p className="font-sans text-[14px] text-text-muted">
                                            {order.shippingAddress.line1}
                                        </p>
                                        <p className="font-sans text-[14px] text-text-muted">
                                            {order.shippingAddress.line2}
                                        </p>
                                        <p className="font-sans text-[14px] text-text-muted">
                                            {order.shippingAddress.line3}
                                        </p>
                                        <p className="font-sans text-[14px] text-text-muted">
                                            {order.shippingAddress.phone}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <DetailLabel>DELIVERY METHOD</DetailLabel>
                                    <div className="space-y-1.5">
                                        <p className="font-sans text-[14px] text-text-primary">
                                            {order.delivery.method}
                                        </p>
                                        <p className="font-sans text-[13px] text-text-muted">
                                            {order.delivery.detail}
                                        </p>
                                        <p className={`${cinzel.className} text-[14px] text-[var(--status-success)]`}>
                                            {order.delivery.cost === 0 ? "Free" : formatOrderAmount(order.delivery.cost)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </DetailCard>

                        <DetailCard>
                            <DetailLabel>PAYMENT INFORMATION</DetailLabel>
                            <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,280px)]">
                                <div className="space-y-5">
                                    <div className="space-y-2">
                                        <p className={`${cinzel.className} text-[9px] font-bold tracking-[0.3em] text-text-muted`}>
                                            PAYMENT METHOD
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <div className="h-4 w-4 border border-gold/15 bg-primary" />
                                            <p className="font-sans text-[14px] text-text-primary">
                                                {order.payment.provider}
                                            </p>
                                        </div>
                                        <p className="font-sans text-[12px] text-text-muted">
                                            {order.payment.method}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <p className={`${cinzel.className} text-[9px] font-bold tracking-[0.3em] text-text-muted`}>
                                            PAYMENT STATUS
                                        </p>
                                        <span className="badge badge-success">
                                            {order.payment.statusLabel.toUpperCase()}
                                        </span>
                                    </div>

                                    <div className="space-y-2">
                                        <p className={`${cinzel.className} text-[9px] font-bold tracking-[0.3em] text-text-muted`}>
                                            TRANSACTION ID
                                        </p>
                                        <p className="font-sans text-[12px] text-text-muted">
                                            {order.payment.transactionId}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <div className="space-y-2">
                                        <p className={`${cinzel.className} text-[9px] font-bold tracking-[0.3em] text-text-muted`}>
                                            PAYMENT DATE
                                        </p>
                                        <p className="font-sans text-[13px] text-text-primary">
                                            {order.payment.paymentDate}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <p className={`${cinzel.className} text-[9px] font-bold tracking-[0.3em] text-text-muted`}>
                                            AMOUNT CHARGED
                                        </p>
                                        <p className={`${cinzel.className} text-[18px] font-semibold text-gold`}>
                                            {formatOrderAmount(order.payment.amountCharged)}
                                        </p>
                                        <p className="font-sans text-[11px] text-text-muted">
                                            {order.payment.currencyLabel}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </DetailCard>

                        <IssueReportModal order={order} />
                    </div>

                    <div className="space-y-4">
                        <DetailCard className="space-y-4 px-6 py-6 sm:px-7">
                            <p className={`${cinzel.className} text-[10px] font-bold tracking-[0.35em] text-gold`}>
                                ORDER SUMMARY
                            </p>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between gap-4 font-sans text-[13px] text-text-muted">
                                    <span>{`Subtotal (${itemCount} ${itemCount === 1 ? "item" : "items"})`}</span>
                                    <span className="text-text-primary">{formatOrderAmount(subtotal)}</span>
                                </div>
                                <div className="flex items-center justify-between gap-4 font-sans text-[13px] text-text-muted">
                                    <span>Shipping</span>
                                    <span className="text-[var(--status-success)]">
                                        {order.delivery.cost === 0 ? "Free" : formatOrderAmount(order.delivery.cost)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between gap-4 font-sans text-[13px] text-text-muted">
                                    <span>Discount</span>
                                    <span>{formatOrderAmount(order.discount)}</span>
                                </div>
                                <div className="flex items-center justify-between gap-4 font-sans text-[13px] text-text-muted">
                                    <div className="flex items-center gap-2">
                                        <span>Coupon</span>
                                        {order.coupon ? (
                                            <span className={`${cinzel.className} bg-gold/10 px-2 py-0.5 text-[9px] font-semibold tracking-[0.2em] text-gold`}>
                                                {order.coupon.code}
                                            </span>
                                        ) : null}
                                    </div>
                                    <span>{couponAmount > 0 ? `- ${formatOrderAmount(couponAmount)}` : formatOrderAmount(0)}</span>
                                </div>
                            </div>

                            <div className="h-px w-full bg-gold" />

                            <div className="flex items-center justify-between gap-4">
                                <p className={`${cinzel.className} text-[13px] font-semibold tracking-[0.1em] text-text-primary`}>
                                    TOTAL
                                </p>
                                <p className={`${cinzel.className} text-[20px] font-semibold text-gold`}>
                                    {formatOrderAmount(order.payment.amountCharged)}
                                </p>
                            </div>

                            <p className="text-right font-sans text-[11px] text-text-muted">
                                Inclusive of all taxes
                            </p>

                            <div className="h-px w-full bg-gold" />

                            <p className={`${cinzel.className} text-[9px] font-bold tracking-[0.3em] text-text-muted`}>
                                PAID VIA
                            </p>
                            <div className="flex items-center gap-2 font-sans text-[12px] text-text-muted">
                                <div className="h-4 w-4 border border-gold/15 bg-primary" />
                                <span>{order.payment.paidVia}</span>
                            </div>

                            <div className="h-px w-full bg-gold" />

                            <button
                                type="button"
                                className={`${cinzel.className} inline-flex w-full items-center justify-center gap-2 border border-gold bg-primary-deep px-4 py-3 text-[10px] font-semibold tracking-[0.3em] text-text-muted transition-colors duration-200 hover:text-gold`}
                            >
                                <Download className="h-3.5 w-3.5" />
                                DOWNLOAD INVOICE
                            </button>
                        </DetailCard>

                        <section className="border border-gold bg-primary-deep px-6 py-6 sm:px-7">
                            <p className={`${cinzel.className} text-[10px] font-bold tracking-[0.35em] text-gold`}>
                                NEED HELP?
                            </p>

                            <div className="mt-3">
                                <HelpLink
                                    href="#shipment-tracking"
                                    icon={<MapPinned className="h-3.5 w-3.5 text-text-muted" />}
                                    label="Track your shipment"
                                />
                                <HelpLink
                                    href="/contact"
                                    icon={<LifeBuoy className="h-3.5 w-3.5 text-text-muted" />}
                                    label="Contact support"
                                />
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </section>
    );
}


