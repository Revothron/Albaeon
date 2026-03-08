import type { ReactNode } from "react";
import { ChevronDown, Search } from "lucide-react";
import { adminCinzel, adminCormorant, adminRaleway } from "@/components/admin/adminFonts";

type AdminPageHeadingProps = {
    eyebrow: string;
    title: string;
    subtitle: string;
    action?: ReactNode;
};

type AdminOutlineButtonProps = {
    label: string;
    icon?: ReactNode;
};

type AdminPrimaryButtonProps = {
    label: string;
    icon?: ReactNode;
};

type AdminPillGroupProps = {
    items: string[];
    activeItem: string;
};

type AdminStatusBadgeProps = {
    label: string;
    tone: "success" | "info" | "warning" | "danger" | "muted";
};

type AdminPaginationProps = {
    summary: string;
    pages: Array<number | string>;
    currentPage: number;
};

export function AdminPageHeading({
    eyebrow,
    title,
    subtitle,
    action,
}: AdminPageHeadingProps) {
    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
                <p className={`${adminCinzel.className} text-[9px] tracking-[0.38em] text-text-muted`}>
                    {eyebrow}
                </p>
                <h1 className={`${adminCormorant.className} mt-1 text-[40px] font-light leading-none text-text-primary md:text-[48px]`}>
                    {title}
                </h1>
                <p className={`${adminRaleway.className} mt-2 text-[13px] font-light text-text-muted`}>
                    {subtitle}
                </p>
            </div>

            {action}
        </div>
    );
}

export function AdminOutlineButton({ label, icon }: AdminOutlineButtonProps) {
    return (
        <button
            type="button"
            className={`${adminCinzel.className} inline-flex h-10 items-center justify-center gap-2 border border-gold/20 px-5 text-[10px] font-semibold tracking-[0.18em] text-text-muted transition-colors duration-200 hover:border-gold/40 hover:text-gold`}
        >
            {icon}
            {label}
        </button>
    );
}

export function AdminPrimaryButton({ label, icon }: AdminPrimaryButtonProps) {
    return (
        <button
            type="button"
            className={`${adminCinzel.className} inline-flex h-10 items-center justify-center gap-2 bg-gold px-5 text-[10px] font-semibold tracking-[0.18em] text-nav transition-colors duration-200 hover:bg-gold-hover`}
        >
            {icon}
            {label}
        </button>
    );
}

export function AdminFieldLabel({ children }: { children: ReactNode }) {
    return (
        <p className={`${adminCinzel.className} mb-1.5 text-[8px] tracking-[0.3em] text-text-muted`}>
            {children}
        </p>
    );
}

export function AdminTextInput({
    placeholder,
    className = "",
}: {
    placeholder: string;
    className?: string;
}) {
    return (
        <div className={`flex h-[38px] items-center gap-2 border border-gold/12 bg-footer px-3 ${className}`}>
            <Search className="h-3.5 w-3.5 text-text-muted" strokeWidth={1.8} />
            <input
                type="text"
                placeholder={placeholder}
                className={`${adminRaleway.className} w-full bg-transparent text-[13px] font-light text-text-primary outline-none placeholder:text-text-muted`}
            />
        </div>
    );
}

export function AdminSelectBox({
    value,
    className = "",
}: {
    value: string;
    className?: string;
}) {
    return (
        <button
            type="button"
            className={`flex h-[38px] items-center justify-between border border-gold/12 bg-footer px-3 text-left ${className}`}
        >
            <span className={`${adminRaleway.className} text-[13px] font-light text-text-primary`}>
                {value}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-text-muted" strokeWidth={1.8} />
        </button>
    );
}

export function AdminDateRangeBox({
    fromLabel,
    toLabel,
}: {
    fromLabel: string;
    toLabel: string;
}) {
    return (
        <div className="flex items-center gap-2">
            <button
                type="button"
                className={`flex h-[38px] flex-1 items-center border border-gold/12 bg-footer px-3 text-left ${adminRaleway.className} text-[13px] font-light text-text-muted`}
            >
                {fromLabel}
            </button>
            <span className={`${adminRaleway.className} text-[13px] text-text-muted`}>→</span>
            <button
                type="button"
                className={`flex h-[38px] flex-1 items-center border border-gold/12 bg-footer px-3 text-left ${adminRaleway.className} text-[13px] font-light text-text-muted`}
            >
                {toLabel}
            </button>
        </div>
    );
}

export function AdminPillGroup({ items, activeItem }: AdminPillGroupProps) {
    return (
        <div className="flex flex-wrap gap-2">
            {items.map((item) => {
                const active = item === activeItem;

                return (
                    <button
                        key={item}
                        type="button"
                        className={`${adminCinzel.className} border px-3.5 py-2 text-[10px] font-semibold tracking-[0.16em] transition-colors duration-200 ${
                            active
                                ? "border-gold bg-gold/12 text-gold"
                                : "border-gold/12 text-text-muted hover:border-gold/30 hover:text-text-primary"
                        }`}
                    >
                        {item}
                    </button>
                );
            })}
        </div>
    );
}

export function AdminStatusBadge({ label, tone }: AdminStatusBadgeProps) {
    const toneClassName = {
        success: "border-[#4CAF7D]/35 bg-[#4CAF7D]/12 text-[#4CAF7D]",
        info: "border-[#4A90C4]/35 bg-[#4A90C4]/12 text-[#4A90C4]",
        warning: "border-[#E6A817]/35 bg-[#E6A817]/12 text-[#E6A817]",
        danger: "border-[#C0392B]/35 bg-[#C0392B]/12 text-[#C0392B]",
        muted: "border-white/15 bg-white/6 text-text-muted",
    }[tone];

    return (
        <span
            className={`${adminRaleway.className} inline-flex items-center border px-2.5 py-1 text-[11px] font-medium ${toneClassName}`}
        >
            {label}
        </span>
    );
}

export function AdminPagination({
    summary,
    pages,
    currentPage,
}: AdminPaginationProps) {
    return (
        <div className="flex flex-col gap-3 border-t border-gold/10 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-6">
            <p className={`${adminRaleway.className} text-[12px] font-light text-text-muted`}>
                {summary}
            </p>

            <div className={`flex flex-wrap items-center gap-2 text-[12px] ${adminRaleway.className}`}>
                <span className="text-[#6F697D]">← Prev</span>
                {pages.map((page) =>
                    typeof page === "number" && page === currentPage ? (
                        <span
                            key={page}
                            className="inline-flex min-w-8 items-center justify-center bg-gold/12 px-2.5 py-1 text-gold"
                        >
                            {page}
                        </span>
                    ) : (
                        <span key={String(page)} className="text-text-muted">
                            {page}
                        </span>
                    )
                )}
                <span className="text-gold">Next →</span>
            </div>
        </div>
    );
}
