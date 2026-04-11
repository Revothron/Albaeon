import Image from "next/image";
import Link from "next/link";
import { Cinzel, Cormorant_Garamond } from "next/font/google";
import {
    CircleAlert,
    Truck,
} from "lucide-react";
import {
    findOrderByLookup,
    getCurrentTrackingStep,
    type CustomerOrder,
    type CustomerOrderTrackingStep,
} from "@/lib/customer/orders";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"] });

function StatusBadge({ status }: { status: CustomerOrder["status"] }) {
    const toneClassName = {
        Processing: "border-[#E6A81766] bg-[#E6A8171A] text-[var(--status-warning)]",
        Shipped: "border-[#4A90C459] bg-[#4A90C41F] text-[var(--status-info)]",
        Delivered: "border-[#4CAF7D4D] bg-[#4CAF7D1F] text-[var(--status-success)]",
    }[status];

    return (
        <span className={`${cinzel.className} inline-flex border px-5 py-2.5 text-[11px] font-semibold tracking-[0.18em] ${toneClassName}`}>
            {status.toUpperCase()}
        </span>
    );
}

function NoMatchState() {
    return (
        <div className="flex flex-col items-center gap-4 text-center">
            <CircleAlert className="h-14 w-14 text-[var(--status-warning)]" strokeWidth={1.5} />
            <div className="space-y-2">
                <p className={`${cinzel.className} text-[12px] font-semibold tracking-[0.24em] text-gold`}>
                    NO MATCH FOUND
                </p>
                <p className="max-w-[420px] w-full font-sans text-[14px] font-light leading-7 text-text-muted">
                    We could not find an order with that combination of order ID and registered email or phone number.
                </p>
            </div>
            <div className="h-px w-[300px] max-w-full bg-gold/10" />
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
                <Link href="/contact" className={`${cinzel.className} text-[9px] font-semibold tracking-[0.22em] text-text-muted transition-colors duration-200 hover:text-gold`}>
                    CONTACT SUPPORT
                </Link>
                <Link href="/shipping-policy" className={`${cinzel.className} text-[9px] font-semibold tracking-[0.22em] text-text-muted transition-colors duration-200 hover:text-gold`}>
                    SHIPPING POLICY
                </Link>
                <Link href="/account/orders" className={`${cinzel.className} text-[9px] font-semibold tracking-[0.22em] text-text-muted transition-colors duration-200 hover:text-gold`}>
                    VIEW ORDERS
                </Link>
            </div>
        </div>
    );
}

function getStepDateAndTime(time: string) {
    const [date, rawTime] = time.split(",");

    return {
        date: date?.trim() ?? "",
        time: rawTime?.trim() ?? "",
    };
}

function formatDeliveryHeadline(detail: string) {
    if (detail.toLowerCase().startsWith("expected delivery by")) {
        return `Arriving by ${detail.replace(/^Expected delivery by\s*/i, "")}`;
    }

    return detail;
}

function TrackingProgressStep({
    step,
    isLast,
}: {
    step: CustomerOrderTrackingStep;
    isLast: boolean;
}) {
    const isComplete = step.state !== "upcoming";
    const isCurrent = step.state === "current";

    return (
        <div className="flex min-w-0 flex-1 flex-col gap-3">
            <div className="flex items-center">
                <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center border ${
                        isCurrent
                            ? "border-gold bg-gold"
                            : isComplete
                                ? "border-gold bg-gold"
                                : "border-text-muted/30 bg-transparent"
                    }`}
                >
                    {isCurrent ? <span className="h-3 w-3 bg-nav" /> : null}
                </span>
                {!isLast ? (
                    <span className={`h-px flex-1 ${isComplete ? "bg-gold" : "bg-text-muted/25"}`} />
                ) : null}
            </div>

            <div className="space-y-1">
                <p className={`${cinzel.className} text-[9px] font-semibold tracking-[0.18em] ${isCurrent || isComplete ? "text-gold" : "text-text-muted"}`}>
                    {step.title}
                </p>
                <p className="font-sans text-[11px] text-text-muted">
                    {step.time}
                </p>
            </div>
        </div>
    );
}

function ShipmentActivityRow({
    step,
    isLast,
}: {
    step: CustomerOrderTrackingStep;
    isLast: boolean;
}) {
    const { date, time } = getStepDateAndTime(step.time);
    const supportingCopy = step.update?.label ?? step.description;

    return (
        <div className={`grid gap-4 px-0 py-4 md:grid-cols-[160px_100px_24px_minmax(0,1fr)] ${isLast ? "" : "border-b border-gold/6"}`}>
            <div className="px-5 md:px-0">
                <p className={`${cinzel.className} text-[11px] font-semibold tracking-[0.08em] text-text-primary`}>
                    {date || step.time}
                </p>
            </div>
            <div className="px-5 md:px-0">
                <p className="font-sans text-[13px] font-light text-text-muted">
                    {time}
                </p>
            </div>
            <div className="flex items-start justify-center px-5 md:px-0">
                <div className="mt-1 h-2 w-2 bg-gold" />
            </div>
            <div className="space-y-1 px-5 md:px-0">
                <p className="font-sans text-[13px] text-text-primary">
                    {step.title}
                </p>
                <p className="font-sans text-[12px] font-light text-text-muted">
                    {supportingCopy}
                </p>
            </div>
        </div>
    );
}

function TrackingResultSection({ order }: { order: CustomerOrder }) {
    const currentStep = getCurrentTrackingStep(order);
    const completedSteps = [...order.tracking.steps].filter((step) => step.state !== "upcoming").reverse();

    return (
        <div className="px-6 pb-20 pt-12 sm:px-10 lg:px-14">
            <section className="mx-auto max-w-[900px] w-full px-5 space-y-4">
                <div className="flex flex-col gap-4 border border-[#E6C97926] border-l-[3px] border-l-gold bg-[var(--surface-card)] px-8 py-7 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1.5">
                        <p className={`${cinzel.className} text-[13px] font-bold tracking-[0.18em] text-gold`}>
                            {`ORDER ${order.id}`}
                        </p>
                        <p className="font-sans text-[13px] font-light text-text-muted">
                            {`Placed ${order.placedOn}`}
                        </p>
                    </div>
                    <StatusBadge status={order.status} />
                </div>

                <div className="border border-gold/10 bg-[var(--surface-card)] px-8 py-6">
                    <p className={`${cinzel.className} text-[10px] font-bold tracking-[0.35em] text-gold`}>
                        IN THIS SHIPMENT
                    </p>

                    <div className="mt-5 space-y-4">
                        {order.items.map((item, index) => (
                            <div
                                key={`${item.sku}-${index}`}
                                className={`flex items-center gap-5 ${index < order.items.length - 1 ? "border-b border-gold/10 pb-4" : ""}`}
                            >
                                <div className="relative h-[72px] w-[72px] overflow-hidden border border-gold/10 bg-primary-deep">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        sizes="72px"
                                        className="object-cover"
                                    />
                                </div>
                                <div className="min-w-0 flex-1 space-y-1">
                                    <p className={`${cinzel.className} text-[13px] font-semibold tracking-[0.08em] text-text-primary`}>
                                        {item.name}
                                    </p>
                                    <p className="font-sans text-[12px] font-light text-text-muted">
                                        {`${item.color} · ${item.size} · Qty ${item.quantity}`}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border border-gold/10 bg-[var(--surface-card)] px-8 py-9">
                    <div className="space-y-8">
                        <div className="flex items-start gap-4 border-l-[3px] border-l-[var(--status-success)] bg-[#4CAF7D10] px-5 py-4">
                            <Truck className="mt-1 h-6 w-6 shrink-0 text-[var(--status-success)]" strokeWidth={1.8} />
                            <div className="space-y-1">
                                <p className={`${cormorant.className} text-[28px] font-light leading-none text-text-primary`}>
                                    {formatDeliveryHeadline(order.delivery.detail)}
                                </p>
                                <p className="font-sans text-[13px] font-light text-text-muted">
                                    {`${order.delivery.method} · ${order.tracking.carrier}`}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="flex gap-4 overflow-x-auto pb-1">
                                {order.tracking.steps.map((step, index) => (
                                    <TrackingProgressStep
                                        key={`${step.title}-${step.time}`}
                                        step={step}
                                        isLast={index === order.tracking.steps.length - 1}
                                    />
                                ))}
                            </div>

                            <div className="border border-[#E6C97926] border-l-[3px] border-l-gold bg-primary-deep px-6 py-5">
                                <div className="flex items-start gap-4">
                                    <Truck className="mt-1 h-7 w-7 shrink-0 text-gold" strokeWidth={1.8} />
                                    <div className="min-w-0 flex-1 space-y-1.5">
                                        <p className={`${cinzel.className} text-[10px] font-bold tracking-[0.35em] text-gold`}>
                                            {currentStep.title}
                                        </p>
                                        <p className="font-sans text-[14px] text-text-primary">
                                            {currentStep.description}
                                        </p>
                                        <p className="font-sans text-[12px] font-light text-text-muted">
                                            {currentStep.update?.label ?? `Last update: ${currentStep.time}`}
                                        </p>
                                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gold/10 pt-4">
                                            <p className="font-sans text-[12px] font-light text-text-muted">
                                                {`Tracking No. ${order.tracking.trackingNumber}`}
                                            </p>
                                            <p className={`${cinzel.className} text-[9px] font-semibold tracking-[0.2em] text-gold`}>
                                                {order.tracking.trackLabel}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-3">
                                <p className={`${cinzel.className} text-[10px] font-bold tracking-[0.35em] text-gold`}>
                                    SHIPMENT ACTIVITY
                                </p>
                                <div className="h-px w-full bg-gold/10" />
                            </div>

                            <div>
                                {completedSteps.map((step, index) => (
                                    <ShipmentActivityRow
                                        key={`${step.title}-${step.time}`}
                                        step={step}
                                        isLast={index === completedSteps.length - 1}
                                    />
                                ))}
                            </div>

                            <button
                                type="button"
                                className={`${cinzel.className} text-[9px] font-semibold tracking-[0.2em] text-gold transition-colors duration-200 hover:text-gold-hover`}
                            >
                                SHOW ALL ACTIVITY
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default async function TrackOrderPage({
    searchParams,
}: {
    searchParams: Promise<{
        orderId?: string;
        contact?: string;
    }>;
}) {
    const params = await searchParams;
    const orderId = typeof params.orderId === "string" ? params.orderId.trim() : "";
    const contact = typeof params.contact === "string" ? params.contact.trim() : "";
    const hasLookupAttempt = orderId.length > 0 || contact.length > 0;
    const matchedOrder = orderId && contact ? await findOrderByLookup(orderId, contact) : null;

    return (
        <section className="min-h-screen bg-primary animate-fadeInUp">
            <div className="border-b border-gold/10 bg-primary-deep">
                <div className="desktop-frame flex flex-col items-center py-14 text-center">
                    <p className={`${cinzel.className} text-[9px] font-bold tracking-[0.48em] text-gold`}>
                        ORDER TRACKING
                    </p>
                    <div className="mt-3 h-px w-12 bg-gold" />
                    <h1 className={`${cormorant.className} mt-5 text-[42px] font-light text-text-primary sm:text-[52px]`}>
                        Track Your Order
                    </h1>
                    <p className="mt-3 max-w-[520px] w-full font-sans text-[15px] font-light leading-8 text-text-muted">
                        Enter your Order ID and registered email or phone number to track your shipment.
                    </p>
                </div>
            </div>

            <div className="px-6 pt-12 sm:px-10 lg:px-14">
                <form
                    action="/track-order"
                    method="get"
                    className="mx-auto max-w-[640px] w-full border border-[#E6C97926] bg-[var(--surface-card)] p-8 sm:px-10 sm:py-9"
                >
                    <p className={`${cinzel.className} text-[10px] font-semibold tracking-[0.35em] text-gold`}>
                        FIND YOUR ORDER
                    </p>

                    <div className="mt-3 h-px w-full bg-gold/10" />

                    <div className="mt-5 space-y-5">
                        <div className="space-y-2">
                            <label
                                htmlFor="orderId"
                                className={`${cinzel.className} block text-[9px] font-semibold tracking-[0.3em] text-text-muted`}
                            >
                                ORDER ID
                            </label>
                            <input
                                id="orderId"
                                name="orderId"
                                type="text"
                                required
                                defaultValue={orderId}
                                placeholder="ALB-00142"
                                className="h-[46px] w-full border border-gold/15 bg-primary-deep px-4 font-sans text-[14px] font-light text-text-primary outline-none placeholder:text-text-muted"
                            />
                            <p className="font-sans text-[11px] font-light text-text-muted">
                                Your order ID is in your confirmation email - format: ALB-XXXXX
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="contact"
                                className={`${cinzel.className} block text-[9px] font-semibold tracking-[0.3em] text-text-muted`}
                            >
                                EMAIL ADDRESS OR PHONE NUMBER
                            </label>
                            <input
                                id="contact"
                                name="contact"
                                type="text"
                                required
                                defaultValue={contact}
                                placeholder="arjun@gmail.com"
                                className="h-[46px] w-full border border-gold/15 bg-primary-deep px-4 font-sans text-[14px] font-light text-text-primary outline-none placeholder:text-text-muted"
                            />
                        </div>

                        <button
                            type="submit"
                            className={`${cinzel.className} flex h-[52px] w-full items-center justify-center bg-gold text-[10px] font-semibold tracking-[0.3em] text-nav transition-colors duration-200 hover:bg-gold-hover`}
                        >
                            TRACK MY ORDER
                        </button>
                    </div>
                </form>
            </div>

            {hasLookupAttempt && !matchedOrder ? (
                <div className="px-6 pb-8 pt-8 sm:px-10 lg:px-14">
                    <div className="mx-auto max-w-[640px] w-full border border-[#E6C97926] bg-[var(--surface-card)] px-8 py-10">
                        <NoMatchState />
                    </div>
                </div>
            ) : null}

            {matchedOrder ? <TrackingResultSection order={matchedOrder} /> : null}
        </section>
    );
}
