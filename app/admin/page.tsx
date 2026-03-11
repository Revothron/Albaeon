import Link from "next/link";
import {
    CalendarDays,
    ChevronRight,
    ClipboardList,
    Hourglass,
    Wallet,
} from "lucide-react";
import { adminCinzel, adminCormorant, adminRaleway } from "@/components/admin/adminFonts";

const statCards = [
    {
        label: "TOTAL ORDERS",
        value: "1,284",
        trend: "+12%",
        trendSubtext: "vs last month",
        Icon: ClipboardList,
        accentClassName: "text-text-primary",
        progressClassName: "bg-[#4CAF7D]",
        progressTrackClassName: "bg-[#4CAF7D]/25",
        progressWidth: "68%",
    },
    {
        label: "TOTAL REVENUE",
        value: "Rs 18,42,300",
        trend: "+8.4%",
        trendSubtext: "vs last month",
        Icon: Wallet,
        accentClassName: "text-gold",
        progressClassName: "bg-[#4CAF7D]",
        progressTrackClassName: "bg-[#4CAF7D]/25",
        progressWidth: "62%",
    },
    {
        label: "PENDING ORDERS",
        value: "47",
        trend: "+3",
        trendSubtext: "since yesterday",
        Icon: Hourglass,
        accentClassName: "text-[#E6A817]",
        progressClassName: "bg-[#E6A817]",
        progressTrackClassName: "bg-[#E6A817]/25",
        progressWidth: "28%",
    },
    {
        label: "TODAY'S ORDERS",
        value: "23",
        trend: "+6",
        trendSubtext: "vs yesterday",
        Icon: CalendarDays,
        accentClassName: "text-text-primary",
        progressClassName: "bg-[#4CAF7D]",
        progressTrackClassName: "bg-[#4CAF7D]/25",
        progressWidth: "42%",
    },
];

const chartDates = ["27 Feb", "28 Feb", "1 Mar", "2 Mar", "3 Mar", "4 Mar", "5 Mar"];
const revenueValues = [22000, 34000, 46000, 38000, 84200, 62000, 70000];
const orderValues = [8, 10, 12, 9, 18, 13, 14];
const chartWidth = 760;
const chartHeight = 180;
const highlightedIndex = 4;

const recentOrders = [
    { id: "ALB-00142", customer: "Arjun Sharma", amount: "Rs 1,299", status: "Accepted", date: "28 Feb 2026" },
    { id: "ALB-00141", customer: "Priya Nair", amount: "Rs 2,199", status: "Fulfilled", date: "27 Feb 2026" },
    { id: "ALB-00140", customer: "Rahul Verma", amount: "Rs 1,799", status: "Processing", date: "26 Feb 2026" },
    { id: "ALB-00139", customer: "Sneha Patel", amount: "Rs 3,598", status: "Draft", date: "25 Feb 2026" },
    { id: "ALB-00138", customer: "Kiran Mehta", amount: "Rs 1,299", status: "Fulfilled", date: "24 Feb 2026" },
];

const quickStats = [
    { label: "Banian Orders", value: "842", valueClassName: "text-text-primary" },
    { label: "Gelato Orders", value: "442", valueClassName: "text-text-primary" },
    { label: "Active Coupons", value: "6", valueClassName: "text-text-primary" },
    { label: "Open Support Tickets", value: "3", valueClassName: "text-[#C0392B]" },
    { label: "Products Active", value: "24", valueClassName: "text-text-primary" },
    { label: "Products Draft", value: "8", valueClassName: "text-text-muted" },
];

const statusClassNames: Record<string, string> = {
    Accepted: "border-[#4A90C4]/35 bg-[#4A90C4]/12 text-[#4A90C4]",
    Fulfilled: "border-[#4CAF7D]/35 bg-[#4CAF7D]/12 text-[#4CAF7D]",
    Processing: "border-[#E6A817]/35 bg-[#E6A817]/12 text-[#E6A817]",
    Draft: "border-white/15 bg-white/6 text-text-muted",
};

const maxRevenue = Math.max(...revenueValues);
const maxOrders = 24;
const chartStep = chartWidth / (chartDates.length - 1);
const revenuePoints = revenueValues
    .map((value, index) => {
        const x = index * chartStep;
        const y = chartHeight - (value / maxRevenue) * chartHeight;
        return `${x},${y}`;
    })
    .join(" ");
const orderPoints = orderValues
    .map((value, index) => {
        const x = index * chartStep;
        const y = chartHeight - (value / maxOrders) * chartHeight;
        return `${x},${y}`;
    })
    .join(" ");
const highlightedX = highlightedIndex * chartStep;

function StatCard({
    label,
    value,
    trend,
    trendSubtext,
    Icon,
    accentClassName,
    progressClassName,
    progressTrackClassName,
    progressWidth,
}: (typeof statCards)[number]) {
    return (
        <div className="border border-gold/10 bg-[#1E1A2E] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
                <p className={`${adminCinzel.className} text-[9px] tracking-[0.28em] text-text-muted`}>
                    {label}
                </p>
                <Icon className="h-4 w-4 text-text-muted" strokeWidth={1.8} />
            </div>

            <p className={`${adminCormorant.className} mt-4 text-[36px] font-light leading-none sm:text-[40px] ${accentClassName}`}>
                {value}
            </p>

            <div className={`mt-3 flex items-center gap-2 ${adminRaleway.className} text-[12px]`}>
                <span className={trend.startsWith("+") ? "text-[#4CAF7D]" : "text-text-muted"}>
                    {trend}
                </span>
                <span className="text-text-muted">{trendSubtext}</span>
            </div>

            <div className={`mt-4 h-[2px] w-full ${progressTrackClassName}`}>
                <div className={`h-full ${progressClassName}`} style={{ width: progressWidth }} />
            </div>
        </div>
    );
}

export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <p className={`${adminCinzel.className} text-[9px] tracking-[0.38em] text-text-muted`}>
                        OVERVIEW
                    </p>
                    <h1 className={`${adminCormorant.className} mt-1 text-[30px] font-light leading-none text-text-primary sm:text-[32px]`}>
                        Dashboard
                    </h1>
                    <p className={`${adminRaleway.className} mt-2 text-[13px] font-light text-text-muted`}>
                        Wednesday, 4 March 2026
                    </p>
                </div>

                <button
                    type="button"
                    className={`${adminCinzel.className} inline-flex items-center justify-center bg-gold px-5 py-2.5 text-[10px] font-semibold tracking-[0.18em] text-nav transition-colors duration-200 hover:bg-gold-hover`}
                >
                    + New Order
                </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((card) => (
                    <StatCard key={card.label} {...card} />
                ))}
            </div>

            <section className="border border-gold/10 bg-[#1E1A2E] p-6 md:p-7">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                        <p className={`${adminCinzel.className} text-[10px] tracking-[0.3em] text-gold`}>
                            SALES OVERVIEW
                        </p>
                        <p className={`${adminRaleway.className} mt-1 text-[12px] font-light text-text-muted`}>
                            Revenue performance over time
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className={`${adminCinzel.className} border border-gold bg-gold/12 px-4 py-1.5 text-[10px] font-semibold tracking-[0.18em] text-gold`}
                        >
                            7 Days
                        </button>
                        <button
                            type="button"
                            className={`${adminCinzel.className} border border-gold/10 px-4 py-1.5 text-[10px] font-semibold tracking-[0.18em] text-text-muted`}
                        >
                            30 Days
                        </button>
                    </div>
                </div>

                <div className="mt-6 border border-gold/10 px-4 pb-2.5 pt-4">
                    <div className="grid grid-cols-[44px_minmax(0,1fr)_36px] gap-2 md:grid-cols-[56px_minmax(0,1fr)_56px] md:gap-3">
                        <div className={`flex h-[210px] flex-col justify-between text-[10px] text-text-muted md:text-[11px] ${adminRaleway.className}`}>
                            {["Rs 100k", "Rs 80k", "Rs 60k", "Rs 40k", "Rs 20k"].map((label) => (
                                <span key={label}>{label}</span>
                            ))}
                        </div>

                        <div className="relative h-[210px]">
                            <div className="pointer-events-none absolute inset-0">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="absolute left-0 right-0 border-t border-gold/8"
                                        style={{ top: `${index * 25}%` }}
                                    />
                                ))}
                            </div>

                            <svg
                                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                                className="absolute inset-x-0 top-4 h-[180px] w-full overflow-visible"
                                preserveAspectRatio="none"
                                aria-label="Sales overview chart"
                            >
                                <line
                                    x1={highlightedX}
                                    y1={0}
                                    x2={highlightedX}
                                    y2={chartHeight}
                                    stroke="rgba(230, 201, 121, 0.25)"
                                    strokeWidth="1"
                                />
                                <polyline fill="none" stroke="#E6C979" strokeWidth="2" points={revenuePoints} />
                                <polyline fill="none" stroke="#4A90C4" strokeWidth="1.5" points={orderPoints} />

                                {revenueValues.map((value, index) => {
                                    const x = index * chartStep;
                                    const y = chartHeight - (value / maxRevenue) * chartHeight;

                                    return (
                                        <circle
                                            key={`revenue-${chartDates[index]}`}
                                            cx={x}
                                            cy={y}
                                            r="3.5"
                                            fill="#E6C979"
                                        />
                                    );
                                })}

                                {orderValues.map((value, index) => {
                                    const x = index * chartStep;
                                    const y = chartHeight - (value / maxOrders) * chartHeight;

                                    return (
                                        <circle
                                            key={`orders-${chartDates[index]}`}
                                            cx={x}
                                            cy={y}
                                            r="2.5"
                                            fill="#4A90C4"
                                        />
                                    );
                                })}
                            </svg>

                            <div
                                className="absolute top-4 w-[138px] border border-gold/20 bg-nav px-3 py-2"
                                style={{
                                    left: `min(calc(${(highlightedX / chartWidth) * 100}% - 36px), calc(100% - 138px))`,
                                }}
                            >
                                <p className={`${adminRaleway.className} text-[10px] text-text-muted`}>
                                    3 Mar 2026
                                </p>
                                <p className={`${adminCinzel.className} mt-1 text-[12px] text-gold`}>
                                    Revenue: Rs 84,200
                                </p>
                                <p className={`${adminCinzel.className} mt-1 text-[12px] text-[#4A90C4]`}>
                                    Orders: 18
                                </p>
                            </div>
                        </div>

                        <div className={`flex h-[210px] flex-col items-end justify-between text-[10px] text-[#4A90C4] md:text-[11px] ${adminRaleway.className}`}>
                            {["24", "18", "12", "6", "0"].map((label) => (
                                <span key={label}>{label}</span>
                            ))}
                        </div>
                    </div>

                    <div className={`mt-3 grid grid-cols-7 text-center text-[10px] text-text-muted md:text-[11px] ${adminRaleway.className}`}>
                        {chartDates.map((label) => (
                            <span key={label}>{label}</span>
                        ))}
                    </div>
                </div>

                <div className={`mt-5 flex flex-wrap items-center gap-6 text-[12px] text-text-muted ${adminRaleway.className}`}>
                    <span className="inline-flex items-center gap-2">
                        <span className="h-2 w-2 bg-gold" aria-hidden="true" />
                        Revenue
                    </span>
                    <span className="inline-flex items-center gap-2">
                        <span className="h-2 w-2 bg-[#4A90C4]" aria-hidden="true" />
                        Orders
                    </span>
                </div>
            </section>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
                <section className="border border-gold/10 bg-[#1E1A2E] p-5 md:p-7">
                    <div className="flex items-center justify-between gap-4">
                        <p className={`${adminCinzel.className} text-[10px] tracking-[0.3em] text-gold`}>
                            RECENT ORDERS
                        </p>
                        <Link
                            href="/admin/orders"
                            className={`${adminCinzel.className} inline-flex items-center gap-1 text-[10px] tracking-[0.18em] text-text-muted transition-colors duration-200 hover:text-gold`}
                        >
                            View All
                            <ChevronRight className="h-3 w-3" strokeWidth={1.8} />
                        </Link>
                    </div>

                    <div className="mt-5 overflow-x-auto border border-gold/10">
                        <table className="w-full min-w-[640px] border-collapse lg:min-w-[760px]">
                            <thead className="bg-nav">
                                <tr className={`${adminCinzel.className} text-[10px] tracking-[0.18em] text-text-muted`}>
                                    <th className="px-4 py-3 text-center font-semibold">ORDER ID</th>
                                    <th className="px-4 py-3 text-center font-semibold">CUSTOMER</th>
                                    <th className="px-4 py-3 text-center font-semibold">AMOUNT</th>
                                    <th className="px-4 py-3 text-center font-semibold">STATUS</th>
                                    <th className="px-4 py-3 text-center font-semibold">DATE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="border-t border-gold/6">
                                        <td className={`${adminCinzel.className} px-4 py-3 text-center text-[13px] text-gold`}>
                                            {order.id}
                                        </td>
                                        <td className={`${adminRaleway.className} px-4 py-3 text-center text-[13px] font-light text-text-primary`}>
                                            {order.customer}
                                        </td>
                                        <td className={`${adminCinzel.className} px-4 py-3 text-center text-[13px] text-text-primary`}>
                                            {order.amount}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span
                                                className={`${adminRaleway.className} inline-flex items-center border px-3 py-1 text-[11px] font-medium ${statusClassNames[order.status]}`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className={`${adminRaleway.className} px-4 py-3 text-center text-[13px] font-light text-text-muted`}>
                                            {order.date}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <aside className="border border-gold/10 bg-[#1E1A2E] p-5 md:p-6">
                    <p className={`${adminCinzel.className} text-[10px] tracking-[0.3em] text-gold`}>
                        QUICK STATS
                    </p>

                    <div className="mt-4 divide-y divide-gold/6">
                        {quickStats.map((stat) => (
                            <div key={stat.label} className="flex items-center justify-between gap-4 py-3">
                                <span className={`${adminRaleway.className} text-[13px] font-light text-text-muted`}>
                                    {stat.label}
                                </span>
                                <span className={`${adminCinzel.className} text-[14px] ${stat.valueClassName}`}>
                                    {stat.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </aside>
            </div>
        </div>
    );
}
