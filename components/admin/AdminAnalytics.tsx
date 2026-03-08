import { ChevronDown } from "lucide-react";
import { AdminPageHeading, AdminPillGroup, AdminTextInput } from "@/components/admin/AdminUi";
import { adminCinzel, adminRaleway } from "@/components/admin/adminFonts";

export type AnalyticsValueFormat = "number" | "currency" | "decimal";

export type AnalyticsSeries = {
    label: string;
    color: string;
    active?: boolean;
    values: number[];
    format: AnalyticsValueFormat;
};

export type AnalyticsTableColumn = {
    key: string;
    label: string;
    align?: "left" | "center" | "right";
    font?: "raleway" | "cinzel";
    tone?: "primary" | "muted";
    weightClassName?: string;
    className?: string;
};

export type AnalyticsTableRow = {
    id: string;
    cells: Record<string, string>;
    isTotal?: boolean;
};

export type AdminAnalyticsScreen = {
    eyebrow: string;
    title: string;
    subtitle: string;
    activeRange: string;
    ranges: string[];
    chartTitle: string;
    chartLabels: string[];
    tooltipLabel?: string;
    series: AnalyticsSeries[];
    table: {
        title: string;
        minWidthClassName: string;
        columns: AnalyticsTableColumn[];
        rows: AnalyticsTableRow[];
        searchPlaceholder?: string;
        searchWidthClassName?: string;
        reportOptions?: string[];
    };
};

function formatAnalyticsValue(value: number, format: AnalyticsValueFormat) {
    if (format === "currency") {
        return `₹${new Intl.NumberFormat("en-IN").format(Math.round(value))}`;
    }

    if (format === "decimal") {
        return value.toFixed(1);
    }

    return new Intl.NumberFormat("en-IN").format(Math.round(value));
}

function getSeriesPoints(values: number[], width: number, height: number, maxValue: number) {
    const step = values.length > 1 ? width / (values.length - 1) : width;

    return values
        .map((value, index) => {
            const x = index * step;
            const y = height - (value / maxValue) * height;
            return `${x},${y}`;
        })
        .join(" ");
}

function getAlignClassName(align: AnalyticsTableColumn["align"]) {
    if (align === "center") {
        return "text-center";
    }

    if (align === "right") {
        return "text-right";
    }

    return "text-left";
}

function getFontClassName(font: AnalyticsTableColumn["font"]) {
    return font === "cinzel" ? adminCinzel.className : adminRaleway.className;
}

function getToneClassName(tone: AnalyticsTableColumn["tone"]) {
    return tone === "primary" ? "text-text-primary" : "text-text-muted";
}

function AnalyticsMetricChips({ series }: { series: AnalyticsSeries[] }) {
    return (
        <div className="flex flex-wrap gap-2">
            {series.map((item) => {
                const chipStyle = item.active
                    ? {
                        borderColor: item.color,
                        backgroundColor: `${item.color}14`,
                        color: item.color,
                    }
                    : undefined;

                return (
                    <span
                        key={item.label}
                        className={`${adminCinzel.className} inline-flex border px-3.5 py-2 text-[10px] font-semibold tracking-[0.16em] ${
                            item.active ? "" : "border-gold/12 text-text-muted"
                        }`}
                        style={chipStyle}
                    >
                        {item.label}
                    </span>
                );
            })}
        </div>
    );
}

function AnalyticsReportMenu({ options }: { options: string[] }) {
    return (
        <details className="group relative">
            <summary
                className={`${adminCinzel.className} flex h-10 list-none items-center justify-between gap-2 border border-gold/20 px-4 text-[10px] font-semibold tracking-[0.18em] text-text-primary marker:hidden transition-colors duration-200 hover:border-gold/40 [&::-webkit-details-marker]:hidden`}
            >
                <span>DOWNLOAD REPORT</span>
                <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-open:rotate-180" strokeWidth={1.8} />
            </summary>

            <div className="absolute right-0 top-full z-20 mt-2 w-[220px] border border-gold/12 bg-nav p-2 shadow-[0_14px_40px_rgba(0,0,0,0.35)]">
                {options.map((option) => (
                    <button
                        key={option}
                        type="button"
                        className={`${adminRaleway.className} flex w-full items-center px-3 py-2 text-left text-[12px] font-light text-text-primary transition-colors duration-200 hover:bg-gold/8 hover:text-gold`}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </details>
    );
}

function AnalyticsChartCard({ screen }: { screen: AdminAnalyticsScreen }) {
    const visibleSeries = screen.series.filter((item) => item.active);
    const maxValue = Math.max(...visibleSeries.flatMap((item) => item.values), 1);
    const chartWidth = 920;
    const chartHeight = 170;
    const tooltipIndex = screen.chartLabels.length - 1;

    return (
        <section className="border border-gold/10 bg-[#1E1A2E] p-5 md:p-6">
            <div className="space-y-3">
                <p className={`${adminCinzel.className} text-[10px] tracking-[0.24em] text-gold`}>
                    {screen.chartTitle}
                </p>
                <AnalyticsMetricChips series={screen.series} />
            </div>

            <div className="mt-5 border border-gold/10 bg-footer p-4 md:p-5">
                <div className="relative h-[210px]">
                    <div className="pointer-events-none absolute inset-0">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div
                                key={`grid-line-${index}`}
                                className="absolute left-0 right-0 border-t border-gold/6"
                                style={{ top: `${index * 25}%` }}
                            />
                        ))}
                    </div>

                    <svg
                        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                        className="absolute inset-x-0 top-3 h-[170px] w-full"
                        preserveAspectRatio="none"
                        aria-label={`${screen.title} analytics chart`}
                    >
                        {visibleSeries.map((item) => (
                            <polyline
                                key={`${screen.title}-${item.label}-line`}
                                fill="none"
                                stroke={item.color}
                                strokeWidth={item.color === "#4A90C4" ? "1.8" : "2.4"}
                                points={getSeriesPoints(item.values, chartWidth, chartHeight, maxValue)}
                            />
                        ))}

                        {visibleSeries.map((item) =>
                            item.values.map((value, index) => {
                                const step = item.values.length > 1 ? chartWidth / (item.values.length - 1) : chartWidth;
                                const x = index * step;
                                const y = chartHeight - (value / maxValue) * chartHeight;

                                return (
                                    <circle
                                        key={`${screen.title}-${item.label}-${screen.chartLabels[index]}`}
                                        cx={x}
                                        cy={y}
                                        r={item.color === "#4A90C4" ? "2.6" : "3"}
                                        fill={item.color}
                                    />
                                );
                            })
                        )}
                    </svg>

                    <div className="absolute right-3 top-3 w-[190px] border border-gold/20 bg-nav px-3 py-2">
                        <p className={`${adminRaleway.className} text-[10px] font-light text-text-muted`}>
                            {screen.tooltipLabel ?? screen.chartLabels[tooltipIndex]}
                        </p>
                        {visibleSeries.map((item) => (
                            <p
                                key={`${screen.title}-${item.label}-tooltip`}
                                className={`${adminCinzel.className} mt-1 text-[12px]`}
                                style={{ color: item.color }}
                            >
                                {item.label}: {formatAnalyticsValue(item.values[tooltipIndex], item.format)}
                            </p>
                        ))}
                    </div>
                </div>

                <div
                    className={`mt-3 grid gap-2 text-center text-[11px] text-text-muted ${adminRaleway.className}`}
                    style={{ gridTemplateColumns: `repeat(${screen.chartLabels.length}, minmax(0, 1fr))` }}
                >
                    {screen.chartLabels.map((label) => (
                        <span key={`${screen.title}-${label}`}>{label}</span>
                    ))}
                </div>
            </div>
        </section>
    );
}

function AnalyticsTableCard({ screen }: { screen: AdminAnalyticsScreen }) {
    return (
        <section className="border border-gold/10 bg-[#1E1A2E]">
            <div className="flex flex-col gap-3 border-b border-gold/10 px-5 py-4 md:px-6 xl:flex-row xl:items-center xl:justify-between">
                <p className={`${adminCinzel.className} text-[10px] tracking-[0.24em] text-gold`}>
                    {screen.table.title}
                </p>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    {screen.table.searchPlaceholder ? (
                        <div className={screen.table.searchWidthClassName}>
                            <AdminTextInput placeholder={screen.table.searchPlaceholder} />
                        </div>
                    ) : null}

                    {screen.table.reportOptions ? (
                        <AnalyticsReportMenu options={screen.table.reportOptions} />
                    ) : null}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className={`w-full border-collapse ${screen.table.minWidthClassName}`}>
                    <thead className="bg-nav">
                        <tr className={`${adminCinzel.className} text-[10px] tracking-[0.18em] text-text-muted`}>
                            {screen.table.columns.map((column) => (
                                <th
                                    key={`${screen.title}-${column.key}`}
                                    className={`px-4 py-4 font-semibold md:px-6 ${getAlignClassName(column.align)} ${column.className ?? ""}`}
                                >
                                    {column.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {screen.table.rows.map((row) => (
                            <tr
                                key={row.id}
                                className={row.isTotal ? "bg-nav" : "border-t border-gold/6"}
                            >
                                {screen.table.columns.map((column) => {
                                    const value = row.cells[column.key] ?? "";
                                    const totalToneClassName = row.isTotal
                                        ? value === "—" || value === ""
                                            ? "text-text-muted"
                                            : "text-gold"
                                        : getToneClassName(column.tone);
                                    const fontClassName = row.isTotal
                                        ? adminCinzel.className
                                        : getFontClassName(column.font);
                                    const weightClassName = row.isTotal
                                        ? ""
                                        : column.weightClassName ?? (column.font === "raleway" ? "font-light" : "");

                                    return (
                                        <td
                                            key={`${row.id}-${column.key}`}
                                            className={`px-4 py-3.5 md:px-6 ${getAlignClassName(column.align)} ${column.className ?? ""}`}
                                        >
                                            <span className={`${fontClassName} text-[13px] ${weightClassName} ${totalToneClassName}`}>
                                                {value}
                                            </span>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export function AdminAnalyticsPage({ screen }: { screen: AdminAnalyticsScreen }) {
    return (
        <div className="space-y-5 md:space-y-6">
            <AdminPageHeading
                eyebrow={screen.eyebrow}
                title={screen.title}
                subtitle={screen.subtitle}
            />

            <AdminPillGroup items={screen.ranges} activeItem={screen.activeRange} />

            <AnalyticsChartCard screen={screen} />
            <AnalyticsTableCard screen={screen} />
        </div>
    );
}
