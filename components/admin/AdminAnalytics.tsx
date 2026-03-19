"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AdminPageHeading, AdminTextInput } from "@/components/admin/AdminUi";
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
        minWidthClassName?: string;
        gridTemplateColumns?: string;
        columns: AnalyticsTableColumn[];
        rows: AnalyticsTableRow[];
        searchPlaceholder?: string;
        searchWidthClassName?: string;
        searchInputClassName?: string;
        reportOptions?: string[];
        topBarPaddingClassName?: string;
        headerPaddingClassName?: string;
        rowPaddingClassName?: string;
    };
};

function formatAnalyticsValue(value: number, format: AnalyticsValueFormat) {
    if (format === "currency") {
        return `\u20B9${new Intl.NumberFormat("en-IN").format(Math.round(value))}`;
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

function AnalyticsMetricChips({
    series,
    onToggle,
}: {
    series: AnalyticsSeries[];
    onToggle: (label: string) => void;
}) {
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
                    <button
                        key={item.label}
                        type="button"
                        onClick={() => onToggle(item.label)}
                        className={`${adminCinzel.className} inline-flex border px-4 py-2 text-[10px] font-semibold tracking-[0.16em] transition-colors duration-200 ${
                            item.active
                                ? ""
                                : "border-gold/12 text-text-muted hover:border-gold/30 hover:text-text-primary"
                        }`}
                        style={chipStyle}
                    >
                        {item.label}
                    </button>
                );
            })}
        </div>
    );
}

function AnalyticsReportMenu({ options }: { options: string[] }) {
    return (
        <details className="group relative">
            <summary
                className={`${adminCinzel.className} flex h-9 list-none items-center justify-between gap-2 border border-gold/20 px-4 text-[10px] font-semibold tracking-[0.18em] text-text-primary marker:hidden transition-colors duration-200 hover:border-gold/40 [&::-webkit-details-marker]:hidden`}
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

function AnalyticsChartCard({
    screen,
    series,
    onToggleSeries,
}: {
    screen: AdminAnalyticsScreen;
    series: AnalyticsSeries[];
    onToggleSeries: (label: string) => void;
}) {
    const visibleSeries = series.filter((item) => item.active);
    const maxValue = Math.max(...visibleSeries.flatMap((item) => item.values), 1);
    const chartWidth = 920;
    const chartHeight = 160;
    const tooltipIndex = screen.chartLabels.length - 1;

    return (
        <section className="border border-gold/10 bg-[#1E1A2E] p-7">
            <div className="space-y-3">
                <p className={`${adminCinzel.className} text-[10px] tracking-[0.24em] text-gold`}>
                    {screen.chartTitle}
                </p>
                <AnalyticsMetricChips series={series} onToggle={onToggleSeries} />
            </div>

            <div className="mt-4 border border-gold/10 bg-footer px-4 py-3.5">
                <div className="mx-auto w-full max-w-[760px]">
                    <div className="relative h-[220px]">
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
                        className="absolute inset-x-0 top-4 h-[160px] w-full"
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
                        className={`mt-3 grid gap-1 text-center text-[11px] text-text-muted ${adminRaleway.className}`}
                        style={{ gridTemplateColumns: `repeat(${screen.chartLabels.length}, minmax(0, 1fr))` }}
                    >
                        {screen.chartLabels.map((label) => (
                            <span key={`${screen.title}-${label}`}>{label}</span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function AnalyticsTableCard({ screen }: { screen: AdminAnalyticsScreen }) {
    const topBarPaddingClassName = screen.table.topBarPaddingClassName ?? "px-6 py-4";
    const headerPaddingClassName = screen.table.headerPaddingClassName ?? "px-6 py-3";
    const rowPaddingClassName = screen.table.rowPaddingClassName ?? "px-6 py-3";

    return (
        <section className="border border-gold/10 bg-[#1E1A2E]">
            <div className={`flex flex-wrap items-center gap-3 border-b border-gold/10 ${topBarPaddingClassName}`}>
                <p className={`${adminCinzel.className} text-[10px] tracking-[0.24em] text-gold`}>
                    {screen.table.title}
                </p>

                {screen.table.searchPlaceholder || screen.table.reportOptions ? (
                    <div className="ml-auto flex flex-wrap items-center justify-end gap-3">
                        {screen.table.searchPlaceholder ? (
                            <div className={screen.table.searchWidthClassName}>
                                <AdminTextInput
                                    placeholder={screen.table.searchPlaceholder}
                                    className={screen.table.searchInputClassName}
                                />
                            </div>
                        ) : null}

                        {screen.table.reportOptions ? (
                            <AnalyticsReportMenu options={screen.table.reportOptions} />
                        ) : null}
                    </div>
                ) : null}
            </div>

            {screen.table.gridTemplateColumns ? (
                <div>
                    <div
                        className={`grid bg-nav text-[10px] tracking-[0.18em] text-text-muted ${adminCinzel.className} ${headerPaddingClassName}`}
                        style={{ gridTemplateColumns: screen.table.gridTemplateColumns }}
                    >
                        {screen.table.columns.map((column) => (
                            <div
                                key={`${screen.title}-${column.key}`}
                                className={`min-w-0 truncate font-semibold ${getAlignClassName(column.align)} ${column.className ?? ""}`}
                            >
                                {column.label}
                            </div>
                        ))}
                    </div>

                    {screen.table.rows.map((row) => (
                        <div
                            key={row.id}
                            className={`grid ${rowPaddingClassName} ${row.isTotal ? "bg-nav" : "border-t border-gold/6"}`}
                            style={{ gridTemplateColumns: screen.table.gridTemplateColumns }}
                        >
                            {screen.table.columns.map((column) => {
                                const value = row.cells[column.key] ?? "";
                                const totalToneClassName = row.isTotal
                                    ? value === "-" || value === "\u2014" || value === ""
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
                                    <div
                                        key={`${row.id}-${column.key}`}
                                        className={`min-w-0 ${getAlignClassName(column.align)} ${column.className ?? ""}`}
                                    >
                                        <span className={`${fontClassName} block truncate text-[13px] ${weightClassName} ${totalToneClassName}`}>
                                            {value}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className={`w-full border-collapse ${screen.table.minWidthClassName ?? ""}`}>
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
                                            ? value === "-" || value === "\u2014" || value === ""
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
            )}
        </section>
    );
}

export function AdminAnalyticsPage({ screen }: { screen: AdminAnalyticsScreen }) {
    const [activeRange, setActiveRange] = useState(screen.activeRange);
    const [activeSeries, setActiveSeries] = useState(() => {
        const initial = screen.series.filter((item) => item.active).map((item) => item.label);
        return initial.length > 0 ? initial : [screen.series[0]?.label ?? ""];
    });

    const handleToggleSeries = (label: string) => {
        setActiveSeries((current) => {
            if (current.includes(label)) {
                if (current.length === 1) {
                    return current;
                }
                return current.filter((item) => item !== label);
            }
            return [...current, label];
        });
    };

    const seriesWithState = screen.series.map((item) => ({
        ...item,
        active: activeSeries.includes(item.label),
    }));

    return (
        <div className="space-y-6">
            <AdminPageHeading
                eyebrow={screen.eyebrow}
                title={screen.title}
            />

            <div className="flex flex-wrap gap-2">
                {screen.ranges.map((range) => {
                    const active = range === activeRange;

                    return (
                        <button
                            key={range}
                            type="button"
                            onClick={() => setActiveRange(range)}
                            className={`${adminCinzel.className} border px-4 py-2 text-[10px] font-semibold tracking-[0.16em] transition-colors duration-200 ${
                                active
                                    ? "border-gold bg-gold/12 text-gold"
                                    : "border-gold/12 text-text-muted hover:border-gold/30 hover:text-text-primary"
                            }`}
                        >
                            {range}
                        </button>
                    );
                })}
            </div>

            <AnalyticsChartCard screen={screen} series={seriesWithState} onToggleSeries={handleToggleSeries} />
            <AnalyticsTableCard screen={screen} />
        </div>
    );
}
