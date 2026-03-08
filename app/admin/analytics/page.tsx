import {
    AdminPageHeading,
    AdminPillGroup,
} from "@/components/admin/AdminUi";
import { adminCinzel, adminCormorant, adminRaleway } from "@/components/admin/adminFonts";

const ranges = [
    "TODAY",
    "YESTERDAY",
    "LAST WEEK",
    "LAST MONTH",
    "LAST QUARTER",
    "LAST YEAR",
    "CUSTOM RANGE",
    "COMPARE",
];

const metricCards = [
    { label: "TOTAL SALES", value: "Rs 18,42,300", trend: "↑ 8.4%", trendClassName: "text-[#4CAF7D]" },
    { label: "NET SALES", value: "Rs 16,94,820", trend: "↑ 7.1%", trendClassName: "text-[#4CAF7D]" },
    { label: "ORDERS", value: "1,284", trend: "↑ 12%", trendClassName: "text-[#4CAF7D]" },
    { label: "PRODUCTS SOLD", value: "2,108 items", trend: "↑ 14.3%", trendClassName: "text-[#4CAF7D]" },
    { label: "VARIATIONS SOLD", value: "2,108", trend: "↓ 2.1%", trendClassName: "text-[#C0392B]" },
];

const chartDates = ["28 Feb", "1 Mar", "2 Mar", "3 Mar", "4 Mar", "5 Mar"];
const netSalesValues = [74200, 76800, 78100, 84200, 85900, 87300];
const orderValues = [14, 15, 16, 18, 18, 19];
const chartWidth = 920;
const chartHeight = 130;
const maxSales = Math.max(...netSalesValues);
const maxOrders = Math.max(...orderValues);
const chartStep = chartWidth / (chartDates.length - 1);
const salesPoints = netSalesValues
    .map((value, index) => {
        const x = index * chartStep;
        const y = chartHeight - (value / maxSales) * chartHeight;
        return `${x},${y}`;
    })
    .join(" ");
const ordersPoints = orderValues
    .map((value, index) => {
        const x = index * chartStep;
        const y = chartHeight - (value / maxOrders) * chartHeight;
        return `${x},${y}`;
    })
    .join(" ");

const topCategories = [
    { rank: "01", name: "T-Shirts", items: "1,204 items", share: 57 },
    { rank: "02", name: "Hoodies", items: "904 items", share: 43 },
    { rank: "03", name: "Accessories", items: "0 items", share: 0 },
    { rank: "04", name: "—", items: "0 items", share: 0 },
    { rank: "05", name: "—", items: "0 items", share: 0 },
];

const topProducts = [
    { rank: "01", name: "Empire Oversized Tee", items: "312 items", share: 14.8 },
    { rank: "02", name: "Pantheon Hoodie", items: "248 items", share: 11.7 },
    { rank: "03", name: "Medusa Crop Tee", items: "186 items", share: 8.8 },
    { rank: "04", name: "Atlas Drop Shoulder", items: "142 items", share: 6.7 },
    { rank: "05", name: "Olympus Oversized Hoodie", items: "108 items", share: 5.1 },
];

function MetricCard({
    label,
    value,
    trend,
    trendClassName,
}: (typeof metricCards)[number]) {
    return (
        <article className="border border-gold/10 bg-[#1E1A2E] p-5">
            <p className={`${adminCinzel.className} text-[9px] tracking-[0.24em] text-text-muted`}>
                {label}
            </p>
            <p className={`${adminCormorant.className} mt-3 text-[34px] font-light leading-none text-text-primary`}>
                {value}
            </p>
            <p className={`${adminRaleway.className} mt-3 text-[12px] font-light ${trendClassName}`}>
                {trend}
            </p>
        </article>
    );
}

function LeaderboardCard({
    title,
    rows,
    nameLabel,
}: {
    title: string;
    rows: Array<{ rank: string; name: string; items: string; share: number }>;
    nameLabel: string;
}) {
    return (
        <article className="border border-gold/10 bg-[#1E1A2E] p-5 md:p-6">
            <p className={`${adminCinzel.className} text-[10px] tracking-[0.24em] text-gold`}>
                {title}
            </p>

            <div className="mt-4 overflow-hidden border border-gold/10">
                <div className={`grid grid-cols-[70px_minmax(0,1fr)_120px_140px] bg-nav px-4 py-3 text-[9px] tracking-[0.16em] text-text-muted ${adminCinzel.className}`}>
                    <span>RANK</span>
                    <span>{nameLabel}</span>
                    <span>ITEMS SOLD</span>
                    <span>SHARE</span>
                </div>

                {rows.map((row) => (
                    <div
                        key={`${title}-${row.rank}`}
                        className="grid grid-cols-[70px_minmax(0,1fr)_120px_140px] items-center gap-3 border-t border-gold/6 px-4 py-3"
                    >
                        <span className={`${adminCinzel.className} text-[18px] text-gold`}>
                            {row.rank}
                        </span>
                        <span className={`${adminRaleway.className} text-[13px] text-text-primary`}>
                            {row.name}
                        </span>
                        <span className={`${adminRaleway.className} text-[13px] font-light text-text-primary`}>
                            {row.items}
                        </span>
                        <div className="space-y-1.5">
                            <div className="h-1.5 bg-gold/10">
                                <div className="h-full bg-gold" style={{ width: `${Math.min(row.share, 100)}%` }} />
                            </div>
                            <p className={`${adminRaleway.className} text-[11px] font-light text-text-muted`}>
                                {row.share > 0 ? `${row.share}%` : "—"}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </article>
    );
}

export default function AnalyticsOverviewPage() {
    return (
        <div className="space-y-5 md:space-y-6">
            <AdminPageHeading
                eyebrow="OVERVIEW"
                title="Overview"
                subtitle="Performance snapshot across sales, orders, and product movement."
            />

            <AdminPillGroup items={ranges} activeItem="TODAY" />

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                {metricCards.map((card) => (
                    <MetricCard key={card.label} {...card} />
                ))}
            </div>

            <section className="border border-gold/10 bg-[#1E1A2E] p-5 md:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <p className={`${adminCinzel.className} text-[10px] tracking-[0.24em] text-gold`}>
                        NET SALES & ORDERS
                    </p>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            className={`${adminCinzel.className} border border-gold bg-gold/12 px-4 py-1.5 text-[10px] font-semibold tracking-[0.14em] text-gold`}
                        >
                            Line
                        </button>
                        <button
                            type="button"
                            className={`${adminCinzel.className} border border-gold/12 px-4 py-1.5 text-[10px] font-semibold tracking-[0.14em] text-text-muted`}
                        >
                            Bar
                        </button>
                    </div>
                </div>

                <div className={`mt-4 flex flex-wrap items-center gap-5 text-[12px] text-text-muted ${adminRaleway.className}`}>
                    <span className="inline-flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-gold" aria-hidden="true" />
                        Net Sales
                    </span>
                    <span className="inline-flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[#4A90C4]" aria-hidden="true" />
                        Orders
                    </span>
                </div>

                <div className="mt-4 border border-gold/10 bg-footer p-4 md:p-5">
                    <div className="relative h-[180px]">
                        <div className="pointer-events-none absolute inset-0">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="absolute left-0 right-0 border-t border-gold/6"
                                    style={{ top: `${index * 25}%` }}
                                />
                            ))}
                        </div>

                        <svg
                            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                            className="absolute inset-x-0 top-6 h-[130px] w-full"
                            preserveAspectRatio="none"
                            aria-label="Analytics overview chart"
                        >
                            <polyline fill="none" stroke="#E6C979" strokeWidth="2" points={salesPoints} />
                            <polyline fill="none" stroke="#4A90C4" strokeWidth="1.5" points={ordersPoints} />

                            {netSalesValues.map((value, index) => {
                                const x = index * chartStep;
                                const y = chartHeight - (value / maxSales) * chartHeight;

                                return <circle key={`sales-${chartDates[index]}`} cx={x} cy={y} r="3" fill="#E6C979" />;
                            })}

                            {orderValues.map((value, index) => {
                                const x = index * chartStep;
                                const y = chartHeight - (value / maxOrders) * chartHeight;

                                return <circle key={`orders-${chartDates[index]}`} cx={x} cy={y} r="2.5" fill="#4A90C4" />;
                            })}
                        </svg>

                        <div className="absolute right-4 top-12 w-[190px] border border-gold/20 bg-nav px-3 py-2">
                            <p className={`${adminRaleway.className} text-[10px] font-light text-text-muted`}>
                                3 Mar 2026
                            </p>
                            <p className={`${adminCinzel.className} mt-1 text-[12px] text-gold`}>
                                Net Sales: Rs 84,200
                            </p>
                            <p className={`${adminCinzel.className} mt-1 text-[12px] text-[#4A90C4]`}>
                                Orders: 18
                            </p>
                        </div>
                    </div>

                    <div className={`mt-3 grid grid-cols-6 text-center text-[11px] text-text-muted ${adminRaleway.className}`}>
                        {chartDates.map((date) => (
                            <span key={date}>{date}</span>
                        ))}
                    </div>
                </div>
            </section>

            <div className="grid gap-5 xl:grid-cols-2">
                <LeaderboardCard title="TOP CATEGORIES — ITEMS SOLD" rows={topCategories} nameLabel="CATEGORY" />
                <LeaderboardCard title="TOP PRODUCTS — ITEMS SOLD" rows={topProducts} nameLabel="PRODUCT" />
            </div>
        </div>
    );
}
