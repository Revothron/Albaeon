import { Cinzel } from "next/font/google";
import AccountShell from "@/components/customer/account/AccountShell";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

function AddressCard({
    title,
    badge,
    badgeMuted = false,
    body,
    actions,
}: {
    title: string;
    badge: string;
    badgeMuted?: boolean;
    body: string;
    actions: Array<{ label: string; className: string }>;
}) {
    return (
        <div className="space-y-4 border border-gold bg-surface p-5 sm:p-6 card-hover">
            <div className="flex items-center justify-between gap-3">
                <h2 className={`${cinzel.className} text-[20px] text-gold`}>
                    {title}
                </h2>
                <span className={`badge ${badgeMuted ? "badge-neutral" : "badge-success"}`}>
                    {badge}
                </span>
            </div>

            <p className="whitespace-pre-line font-sans text-[14px] leading-[2.1] text-text-primary">
                {body}
            </p>

            <div className="h-px w-full bg-gold/10" />

            <div className="flex flex-wrap items-center gap-4">
                {actions.map((action) => (
                    <button
                        key={action.label}
                        type="button"
                        className={`font-sans text-[13px] ${action.className}`}
                    >
                        {action.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default function AddressesPage() {
    return (
        <AccountShell
            activeTab="addresses"
            title="My Address"
            subtitle="Manage your shipping and billing addresses."
            actions={[
                { label: "Manage Preferences", variant: "outline" },
                { label: "Add New Address", variant: "solid" },
            ]}
        >
            <div className="space-y-4">
                <div className="grid gap-4 2xl:grid-cols-2">
                    <AddressCard
                        title="Shipping Address"
                        badge="PRIMARY"
                        body={"Alex Morgan\n42, MG Road, Indiranagar\nBengaluru, Karnataka 560038\nIndia · +91 98765 43210"}
                        actions={[
                            { label: "Edit", className: "text-gold" },
                            { label: "Delete", className: "text-[var(--status-error)]" },
                            { label: "Set as billing", className: "text-text-muted" },
                        ]}
                    />
                    <AddressCard
                        title="Billing Address"
                        badge="SECONDARY"
                        badgeMuted
                        body={"Alex Morgan\n12, Brigade Road, Apt 4B\nBengaluru, Karnataka 560025\nIndia · +91 98765 43210"}
                        actions={[
                            { label: "Edit", className: "text-gold" },
                            { label: "Delete", className: "text-[var(--status-error)]" },
                            { label: "Set as primary", className: "text-text-muted" },
                        ]}
                    />
                </div>

                <div className="space-y-2 border border-gold/15 bg-surface p-5 sm:p-6">
                    <h2 className={`${cinzel.className} text-[20px] text-text-primary`}>
                        Address Tips
                    </h2>
                    <p className="font-sans text-[13px] leading-[1.8] text-text-muted">
                        Keep your shipping address up to date to avoid delivery delays. Your primary address is used automatically at checkout.
                    </p>
                </div>
            </div>
        </AccountShell>
    );
}


