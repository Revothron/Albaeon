import Link from "next/link";
import { Cinzel } from "next/font/google";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const railTabs = [
    { label: "Dashboard", href: "/account", active: true },
    { label: "Orders", href: "/account/orders" },
    { label: "Addresses", href: "/account/addresses" },
    { label: "Profile", href: "/account/profile" },
];

const metrics = [
    { label: "Open Orders", value: "03" },
    { label: "Saved Items", value: "08" },
    { label: "Yearly Spend", value: "$1,840" },
];

const recentOrders = [
    { item: "#ALB-10298 - Aegis Layered Coat", status: "Shipped", statusClassName: "text-gold" },
    { item: "#ALB-10271 - Obsidian Hoodie", status: "Processing", statusClassName: "text-text-primary" },
];

function DesktopStatCard({
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

function MobileInfoCard({
    title,
    body,
}: {
    title: string;
    body: string;
}) {
    return (
        <div className="flex flex-col gap-1.5 border border-gold bg-surface p-3.5">
            <h2 className={`${cinzel.className} text-[24px] text-gold`}>
                {title}
            </h2>
            <p className="whitespace-pre-line font-sans text-[12px] leading-[1.5] text-text-primary">
                {body}
            </p>
        </div>
    );
}

export default function ProfilePage() {
    return (
        <section className="min-h-screen bg-primary">
            <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-[18px] py-5 sm:px-10 sm:py-8 lg:gap-[26px] lg:px-14 lg:py-11">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div className="space-y-2">
                        <h1 className={`${cinzel.className} text-[36px] text-gold sm:text-[44px] lg:text-[54px]`}>
                            My Account
                        </h1>
                        <p className="max-w-[560px] font-sans text-[12px] text-text-muted sm:text-[14px] lg:text-[16px]">
                            Control orders, addresses, profile details, and saved products from one place.
                        </p>
                    </div>

                    <div className="hidden items-center gap-3 lg:flex">
                        <Link
                            href="/account/profile"
                            className="inline-flex items-center justify-center border border-gold px-[18px] py-3 font-sans text-[14px] font-semibold text-gold transition-colors duration-200 hover:bg-gold hover:text-nav"
                        >
                            Edit Profile
                        </Link>
                        <Link
                            href="/account/orders"
                            className="inline-flex items-center justify-center bg-gold px-[18px] py-3 font-sans text-[14px] font-bold text-nav transition-colors duration-200 hover:bg-gold-hover"
                        >
                            View Orders
                        </Link>
                    </div>
                </div>

                <div className="hidden gap-6 lg:flex">
                    <aside className="w-[340px] border border-gold bg-surface p-6">
                        <div className="space-y-[18px]">
                            <div className="flex flex-col items-center justify-center gap-3 bg-primary-deep p-[18px] text-center">
                                <div className="h-[74px] w-[74px] rounded-full border border-gold bg-primary" />
                                <p className={`${cinzel.className} text-[29px] text-gold`}>
                                    Alex Morgan
                                </p>
                                <p className="font-sans text-[14px] text-text-muted">
                                    alex@albaeon.com
                                </p>
                            </div>

                            <div className="space-y-2.5">
                                {railTabs.map((tab) => (
                                    <Link
                                        key={tab.label}
                                        href={tab.href}
                                        className={`block px-3.5 py-3 font-sans text-[14px] font-semibold transition-colors duration-200 ${
                                            tab.active
                                                ? "bg-gold text-nav"
                                                : "bg-primary-deep text-text-primary hover:text-gold"
                                        }`}
                                    >
                                        {tab.label}
                                    </Link>
                                ))}
                            </div>

                            <button
                                type="button"
                                className="flex w-full items-center justify-center border border-red-500 px-3.5 py-3 font-sans text-[14px] font-semibold text-red-500 transition-colors duration-200 hover:bg-red-500/10"
                            >
                                Logout
                            </button>
                        </div>
                    </aside>

                    <div className="flex-1 space-y-[18px]">
                        <div className="grid gap-[14px] xl:grid-cols-3">
                            {metrics.map((metric) => (
                                <DesktopStatCard
                                    key={metric.label}
                                    label={metric.label}
                                    value={metric.value}
                                />
                            ))}
                        </div>

                        <div className="space-y-3 border border-gold bg-surface p-[22px]">
                            <div className="flex items-center justify-between gap-4">
                                <h2 className={`${cinzel.className} text-[26px] text-gold xl:text-[30px]`}>
                                    Recent Orders
                                </h2>
                                <Link
                                    href="/account/orders"
                                    className="font-sans text-[14px] font-semibold text-gold transition-colors duration-200 hover:text-gold-hover"
                                >
                                    View All
                                </Link>
                            </div>

                            <div className="space-y-3">
                                {recentOrders.map((order) => (
                                    <div
                                        key={order.item}
                                        className="flex items-center justify-between gap-4 bg-primary-deep px-3.5 py-3"
                                    >
                                        <p className="font-sans text-[14px] font-semibold text-text-primary">
                                            {order.item}
                                        </p>
                                        <p className={`font-sans text-[14px] font-semibold ${order.statusClassName}`}>
                                            {order.status}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid gap-[14px] xl:grid-cols-2">
                            <div className="space-y-2.5 border border-gold bg-surface p-[18px]">
                                <h2 className={`${cinzel.className} text-[24px] text-gold xl:text-[28px]`}>
                                    Addresses
                                </h2>
                                <p className="font-sans text-[14px] leading-[1.7] text-text-primary">
                                    Primary: London, UK
                                    <br />
                                    Secondary: New York, USA
                                    <br />
                                    Billing: same as shipping
                                </p>
                            </div>

                            <div className="space-y-2.5 border border-gold bg-surface p-[18px]">
                                <h2 className={`${cinzel.className} text-[24px] text-gold xl:text-[28px]`}>
                                    Wishlist Snapshot
                                </h2>
                                <p className="font-sans text-[14px] leading-[1.7] text-text-primary">
                                    Aegis Layered Coat
                                    <br />
                                    Nocturne Tactical Tee
                                    <br />
                                    Empire Cut Overshirt
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2 border border-gold bg-primary-deep p-[18px]">
                            <h2 className={`${cinzel.className} text-[22px] text-gold xl:text-[26px]`}>
                                Security & Notifications
                            </h2>
                            <p className="font-sans text-[14px] leading-[1.7] text-text-primary">
                                Two-factor authentication is active. Email updates for shipment and restock alerts are enabled.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-2.5 lg:hidden">
                    <MobileInfoCard
                        title="Orders"
                        body="#ALB-10298 / Shipped / $448"
                    />
                    <MobileInfoCard
                        title="Addresses"
                        body="London, UK / New York, USA"
                    />
                    <MobileInfoCard
                        title="Profile Details"
                        body={"Alex Morgan\nalex@albaeon.com\nGlobal Express Shipping"}
                    />
                    <MobileInfoCard
                        title="Wishlist"
                        body="Saved Items: 8 / Alerts Enabled"
                    />
                </div>
            </div>
        </section>
    );
}
