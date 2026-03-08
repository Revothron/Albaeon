import Image from "next/image";
import Link from "next/link";
import { Cinzel } from "next/font/google";
import { ChevronDown, Search } from "lucide-react";
import AccountShell from "@/components/customer/account/AccountShell";
import {
    customerOrders,
    formatOrderAmount,
    getOrderListMeta,
} from "@/lib/customer/orders";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

function MetricCard({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="flex flex-col gap-1.5 border border-gold bg-surface p-4">
            <p className="font-sans text-[12px] text-text-muted">
                {label}
            </p>
            <p className={`${cinzel.className} text-[30px] text-gold xl:text-[36px]`}>
                {value}
            </p>
        </div>
    );
}

function StatusStep({
    label,
    active,
}: {
    label: string;
    active: boolean;
}) {
    return (
        <div className="flex flex-col items-center gap-1">
            <div className={`h-2.5 w-2.5 rounded-full ${active ? "bg-gold" : "bg-text-muted/45"}`} />
            <span className={`font-sans text-[10px] ${active ? "text-gold" : "text-text-muted"}`}>
                {label}
            </span>
        </div>
    );
}

function getStatusClassName(status: string) {
    switch (status) {
        case "Shipped":
            return "text-[#4A90C4]";
        case "Delivered":
            return "text-[#4CAF7D]";
        default:
            return "text-[#E6A817]";
    }
}

function getStatusProgress(status: string) {
    switch (status) {
        case "Processing":
            return 2;
        case "Shipped":
            return 3;
        case "Delivered":
            return 4;
        default:
            return 1;
    }
}

export default function OrdersPage() {
    const featuredOrder = customerOrders[0];
    const otherOrders = customerOrders.slice(1);
    const totalSpend = customerOrders.reduce((total, order) => total + order.payment.amountCharged, 0);
    const openOrders = customerOrders.filter((order) => order.status !== "Delivered").length;
    const metrics = [
        { label: "Open Orders", value: String(openOrders).padStart(2, "0") },
        { label: "Saved Items", value: "08" },
        { label: "Yearly Spend", value: formatOrderAmount(totalSpend, "Rs") },
    ];
    const featuredItem = featuredOrder.items[0];
    const featuredOrderHref = `/account/orders/${featuredOrder.id}`;
    const featuredTrackOrderHref = `/track-order?orderId=${encodeURIComponent(featuredOrder.id)}&contact=${encodeURIComponent(featuredOrder.contactEmail)}`;
    const featuredProgress = getStatusProgress(featuredOrder.status);

    return (
        <AccountShell
            activeTab="orders"
            title="My Order"
            subtitle="View and track all your Albaeon orders from one place."
        >
            <div className="space-y-4">
                <div className="grid gap-3.5 xl:grid-cols-3">
                    {metrics.map((metric) => (
                        <MetricCard
                            key={metric.label}
                            label={metric.label}
                            value={metric.value}
                        />
                    ))}
                </div>

                <div className="flex flex-col gap-3 md:flex-row">
                    <label className="relative flex-1">
                        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                        <input
                            type="text"
                            placeholder="Search orders by number or product name..."
                            className="h-[42px] w-full border border-gold bg-surface pl-10 pr-4 font-sans text-[13px] text-text-primary outline-none placeholder:text-text-muted"
                        />
                    </label>

                    <div className="relative w-full md:w-[176px]">
                        <select
                            defaultValue="all-orders"
                            aria-label="Filter orders"
                            className="h-[42px] w-full appearance-none border border-gold bg-surface px-4 pr-10 font-sans text-[12px] text-text-primary outline-none"
                        >
                            <option value="all-orders">All Orders</option>
                            <option value="shipped">Shipped</option>
                            <option value="processing">Processing</option>
                            <option value="delivered">Delivered</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="space-y-3.5 border border-gold bg-surface px-4 py-4 sm:px-6 sm:py-5">
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                                <Link
                                    href={featuredOrderHref}
                                    className="font-sans text-[14px] text-gold transition-colors duration-200 hover:text-gold-hover"
                                >
                                    {`#${featuredOrder.id} - ${featuredItem.name}`}
                                </Link>
                                <p className="font-sans text-[12px] text-text-muted">
                                    {getOrderListMeta(featuredOrder)}
                                </p>
                            </div>
                            <p className={`font-sans text-[13px] ${getStatusClassName(featuredOrder.status)}`}>
                                {featuredOrder.status}
                            </p>
                        </div>

                        <div className="h-px w-full bg-gold/10" />

                        <div className="flex flex-col gap-4 lg:flex-row">
                            <div className="relative h-14 w-14 overflow-hidden border border-gold bg-primary-deep">
                                <Image
                                    src={featuredItem.image}
                                    alt={featuredItem.name}
                                    fill
                                    sizes="56px"
                                    className="object-cover"
                                />
                            </div>

                            <div className="min-w-0 flex-1 space-y-2">
                                <Link
                                    href={featuredOrderHref}
                                    className="font-sans text-[14px] text-gold transition-colors duration-200 hover:text-gold-hover"
                                >
                                    {featuredItem.name}
                                </Link>
                                <p className="font-sans text-[12px] text-text-muted">
                                    {`${featuredItem.color} / ${featuredItem.size} / Qty ${featuredItem.quantity}`}
                                </p>
                                <p className={`${cinzel.className} text-[16px] text-gold`}>
                                    {formatOrderAmount(featuredOrder.payment.amountCharged, "Rs")}
                                </p>

                                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                                    <StatusStep active={featuredProgress >= 1} label="Ordered" />
                                    <div className={`h-px w-10 ${featuredProgress >= 2 ? "bg-gold" : "bg-text-muted/45"}`} />
                                    <StatusStep active={featuredProgress >= 2} label="Processing" />
                                    <div className={`h-px w-10 ${featuredProgress >= 3 ? "bg-gold" : "bg-text-muted/45"}`} />
                                    <StatusStep active={featuredProgress >= 3} label="Shipped" />
                                    <div className={`h-px w-10 ${featuredProgress >= 4 ? "bg-gold" : "bg-text-muted/45"}`} />
                                    <StatusStep active={featuredProgress >= 4} label="Delivered" />
                                </div>
                            </div>

                            <div className="flex flex-wrap justify-start gap-2 lg:justify-end">
                                <Link
                                    href={featuredTrackOrderHref}
                                    className="border border-gold px-5 py-2 font-sans text-[12px] text-gold transition-colors duration-200 hover:bg-gold hover:text-nav"
                                >
                                    Track Order
                                </Link>
                                <button
                                    type="button"
                                    className="border border-gold/15 px-5 py-2 font-sans text-[12px] text-text-muted transition-colors duration-200 hover:border-gold/30 hover:text-text-primary"
                                >
                                    Download Invoice
                                </button>
                            </div>
                        </div>
                    </div>

                    {otherOrders.map((order) => (
                        <Link
                            key={order.id}
                            href={`/account/orders/${order.id}`}
                            className="group flex flex-col gap-3 border border-gold bg-surface px-4 py-4 transition-colors duration-200 hover:border-gold-hover sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5"
                        >
                            <div className="space-y-1">
                                <p className="font-sans text-[14px] text-gold">
                                    {`#${order.id} - ${order.items[0].name}`}
                                </p>
                                <p className="font-sans text-[12px] text-text-muted">
                                    {getOrderListMeta(order)}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <p className={`font-sans text-[13px] ${getStatusClassName(order.status)}`}>
                                    {order.status}
                                </p>
                                <span className="font-sans text-[12px] text-text-muted transition-colors duration-200 group-hover:text-gold">
                                    View Details
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="flex flex-col items-center gap-1 py-2 text-center">
                    <button
                        type="button"
                        className="font-sans text-[13px] text-gold transition-colors duration-200 hover:text-gold-hover"
                    >
                        Load more orders
                    </button>
                    <p className="font-sans text-[12px] text-text-muted">
                        {`Showing ${customerOrders.length} of ${customerOrders.length} orders`}
                    </p>
                </div>
            </div>
        </AccountShell>
    );
}
