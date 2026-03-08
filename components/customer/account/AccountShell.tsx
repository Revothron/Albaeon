import Link from "next/link";
import { Cinzel } from "next/font/google";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export type AccountTabKey = "dashboard" | "orders" | "addresses" | "profile";

type AccountAction = {
    href?: string;
    label: string;
    variant: "outline" | "solid";
};

const tabs: Array<{ key: AccountTabKey; label: string; href: string }> = [
    { key: "dashboard", label: "Dashboard", href: "/account" },
    { key: "orders", label: "Orders", href: "/account/orders" },
    { key: "addresses", label: "Addresses", href: "/account/addresses" },
    { key: "profile", label: "Profile", href: "/account/profile" },
];

function HeaderAction({ action }: { action: AccountAction }) {
    const className =
        action.variant === "solid"
            ? "bg-gold text-nav hover:bg-gold-hover"
            : "border border-gold text-gold hover:bg-gold hover:text-nav";

    if (action.href) {
        return (
            <Link
                href={action.href}
                className={`inline-flex items-center justify-center px-[18px] py-3 font-sans text-[14px] font-semibold transition-colors duration-200 ${className}`}
            >
                {action.label}
            </Link>
        );
    }

    return (
        <button
            type="button"
            className={`inline-flex items-center justify-center px-[18px] py-3 font-sans text-[14px] font-semibold transition-colors duration-200 ${className}`}
        >
            {action.label}
        </button>
    );
}

function Sidebar({ activeTab }: { activeTab: AccountTabKey }) {
    return (
        <aside className="hidden w-[340px] border border-gold bg-surface p-6 lg:block">
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
                    {tabs.map((tab) => (
                        <Link
                            key={tab.key}
                            href={tab.href}
                            className={`block px-3.5 py-3 font-sans text-[14px] font-semibold transition-colors duration-200 ${
                                tab.key === activeTab
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
    );
}

export default function AccountShell({
    activeTab,
    title,
    subtitle,
    actions = [],
    children,
}: {
    activeTab: AccountTabKey;
    title: string;
    subtitle: string;
    actions?: AccountAction[];
    children: React.ReactNode;
}) {
    return (
        <section className="min-h-screen bg-primary">
            <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-[18px] py-5 sm:px-10 sm:py-8 lg:gap-6 lg:px-14 lg:py-10">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div className="space-y-2">
                        <h1 className={`${cinzel.className} text-[36px] text-gold sm:text-[44px] lg:text-[54px]`}>
                            {title}
                        </h1>
                        <p className="max-w-[620px] font-sans text-[12px] text-text-muted sm:text-[14px] lg:text-[16px]">
                            {subtitle}
                        </p>
                    </div>

                    {actions.length > 0 ? (
                        <div className="flex flex-wrap items-center gap-3">
                            {actions.map((action) => (
                                <HeaderAction key={action.label} action={action} />
                            ))}
                        </div>
                    ) : null}
                </div>

                <div className="grid grid-cols-2 gap-2 lg:hidden">
                    {tabs.map((tab) => (
                        <Link
                            key={tab.key}
                            href={tab.href}
                            className={`px-3 py-2.5 text-center font-sans text-[13px] font-semibold transition-colors duration-200 ${
                                tab.key === activeTab
                                    ? "bg-gold text-nav"
                                    : "bg-surface text-text-primary"
                            }`}
                        >
                            {tab.label}
                        </Link>
                    ))}
                </div>

                <div className="flex gap-6">
                    <Sidebar activeTab={activeTab} />
                    <div className="min-w-0 flex-1">{children}</div>
                </div>
            </div>
        </section>
    );
}
