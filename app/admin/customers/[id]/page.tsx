import { notFound } from "next/navigation";
import { adminCinzel, adminCormorant, adminRaleway } from "@/components/admin/adminFonts";
import { AdminStatusBadge } from "@/components/admin/AdminUi";
import { getAdminCustomerById, type AdminCustomerOrderStatus } from "@/lib/admin/customers";

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
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section className="border border-gold/10 bg-[#1E1A2E] p-6">
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

    if (!customer) {
        notFound();
    }

    return (
        <div className="space-y-5 md:space-y-6">
            <div>
                <div className={`flex items-center gap-1.5 ${adminRaleway.className} text-[12px] font-light`}>
                    <span className="text-text-muted">Customers /</span>
                    <span className="text-gold">{customer.name}</span>
                </div>
                <h1 className={`${adminCormorant.className} mt-2 text-[32px] font-light text-text-primary md:text-[36px]`}>
                    {customer.name}
                </h1>
            </div>

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
                <div className="space-y-5">
                    <DetailCard title="CUSTOMER PROFILE">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-gold text-[14px] text-gold">
                                    {getInitials(customer.name)}
                                </div>
                                <div className="min-w-0 flex-1 space-y-1">
                                    <p className={`${adminRaleway.className} text-[15px] font-medium text-text-primary`}>
                                        {customer.name}
                                    </p>
                                    <p className={`${adminRaleway.className} text-[13px] font-light text-text-muted`}>
                                        {`${customer.username} / ${customer.email} / ${customer.phone}`}
                                    </p>
                                    <p className={`${adminRaleway.className} text-[12px] font-light text-text-muted`}>
                                        {`Member since ${customer.memberSince}`}
                                    </p>
                                    <p className={`${adminRaleway.className} text-[12px] font-light text-text-muted`}>
                                        {`${customer.country} / ${customer.city}, ${customer.region} ${customer.postal}`}
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <p className={`${adminRaleway.className} text-[12px] font-light text-text-muted`}>
                                        Total Orders
                                    </p>
                                    <p className={`${adminCinzel.className} text-[16px] text-text-primary`}>
                                        {customer.orders}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className={`${adminRaleway.className} text-[12px] font-light text-text-muted`}>
                                        Total Spent
                                    </p>
                                    <p className={`${adminCinzel.className} text-[16px] text-gold`}>
                                        {customer.spent}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className={`${adminRaleway.className} text-[12px] font-light text-text-muted`}>
                                        AOV
                                    </p>
                                    <p className={`${adminCinzel.className} text-[16px] text-text-primary`}>
                                        {customer.aov}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className={`${adminRaleway.className} text-[12px] font-light text-text-muted`}>
                                        Last Order
                                    </p>
                                    <p className={`${adminCinzel.className} text-[16px] text-text-primary`}>
                                        {customer.lastOrder}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </DetailCard>

                    <DetailCard title="ORDER HISTORY">
                        <div className="overflow-x-auto">
                            <div className="min-w-[700px]">
                                <div className="flex items-center bg-nav px-3 py-3">
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

                                {customer.orderHistory.map((order, index) => (
                                    <div
                                        key={order.id}
                                        className={`flex items-center px-3 py-3 ${index < customer.orderHistory.length - 1 ? "border-b border-gold/6" : ""}`}
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
                                        <div className={`${adminCinzel.className} w-[80px] text-[9px] font-semibold tracking-[0.12em] text-gold`}>
                                            View -&gt;
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
                                    {customer.shippingAddress.map((line) => (
                                        <p key={line}>{line}</p>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className={`${adminCinzel.className} text-[9px] font-semibold tracking-[0.25em] text-text-muted`}>
                                    BILLING ADDRESS
                                </p>
                                <div className={`${adminRaleway.className} space-y-1 text-[13px] font-light leading-7 text-text-primary`}>
                                    {customer.billingAddress.map((line) => (
                                        <p key={line}>{line}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </DetailCard>
                </div>

                <div className="space-y-5">
                    <DetailCard title="CUSTOMER STATS">
                        <div>
                            <StatRow label="Total Orders" value={String(customer.orders)} />
                            <StatRow label="Total Spent" value={customer.spent} valueClassName="text-gold" />
                            <StatRow label="AOV" value={customer.aov} />
                            <StatRow label="Last Order" value={customer.lastOrder} />
                            <StatRow label="Country" value={customer.country} />
                            <StatRow label="Segment" value={customer.segment} withBorder={false} />
                        </div>
                    </DetailCard>

                    <DetailCard title="ACCOUNT ACTIONS">
                        <div className="space-y-3">
                            <button
                                type="button"
                                className={`${adminRaleway.className} flex w-full items-center justify-center border border-[#C0392B] px-4 py-3 text-[13px] text-[#C0392B] transition-colors duration-200 hover:bg-[#C0392B] hover:text-white`}
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
