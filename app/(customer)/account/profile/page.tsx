import { Cinzel, Cormorant_Garamond } from "next/font/google";
import { CircleCheck, Eye, Info, Lock, TriangleAlert } from "lucide-react";
import AccountShell from "@/components/customer/account/AccountShell";
import DeleteAccountModal from "@/components/customer/account/DeleteAccountModal";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

function Field({
    label,
    value,
    helperText,
    icon,
}: {
    label: string;
    value: string;
    helperText?: string;
    icon?: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <label className="font-sans text-[11px] uppercase tracking-[0.08em] text-text-muted">
                {label}
            </label>
            <div className="flex h-[42px] items-center justify-between border border-gold/15 bg-primary px-3.5 font-sans text-[14px] text-text-primary">
                <span>{value}</span>
                {icon}
            </div>
            {helperText ? (
                <p className="font-sans text-[11px] text-text-muted">
                    {helperText}
                </p>
            ) : null}
        </div>
    );
}

function ToggleRow({
    title,
    subtitle,
    enabled,
    isLast = false,
}: {
    title: string;
    subtitle: string;
    enabled: boolean;
    isLast?: boolean;
}) {
    return (
        <div className={`flex items-center justify-between gap-4 py-3.5 ${isLast ? "" : "border-b border-gold/10"}`}>
            <div className="space-y-1">
                <p className="font-sans text-[14px] text-text-primary">
                    {title}
                </p>
                <p className="font-sans text-[12px] text-text-muted">
                    {subtitle}
                </p>
            </div>
            <div className={`flex h-[22px] w-10 items-center rounded-full p-0.5 ${enabled ? "justify-end bg-gold/20" : "justify-start border border-gold/15 bg-primary-deep"}`}>
                <div className={`h-[18px] w-[18px] rounded-full ${enabled ? "bg-gold" : "bg-text-muted"}`} />
            </div>
        </div>
    );
}

export default function ProfileSettingsPage() {
    return (
        <AccountShell
            activeTab="profile"
            title="My Profile"
            subtitle="Update your personal information and account settings."
        >
            <div className="space-y-4">
                <div className="space-y-5 border border-gold bg-surface p-5 sm:p-7">
                    <div className="flex items-center justify-between gap-4">
                        <h2 className={`${cormorant.className} text-[20px] text-text-primary`}>
                            Profile Information
                        </h2>
                        <p className="font-sans text-[12px] text-text-muted">
                            Last updated 1 Mar 2026
                        </p>
                    </div>

                    <div className="h-px w-full bg-gold/10" />

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="h-[72px] w-[72px] rounded-full border border-gold bg-primary" />
                        <div className="space-y-1">
                            <p className={`${cinzel.className} text-[20px] text-text-primary`}>
                                Alex Morgan
                            </p>
                            <p className="font-sans text-[12px] text-text-muted">
                                Member since January 2024 · Sovereign Circle tier
                            </p>
                            <button type="button" className="font-sans text-[12px] text-gold">
                                Change photo
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid gap-4 lg:grid-cols-2">
                            <Field label="First Name" value="Alex" />
                            <Field label="Last Name" value="Morgan" />
                        </div>
                        <Field
                            label="Display Name"
                            value="alex.morgan"
                            helperText="Visible to others on the Albaeon platform"
                        />
                        <Field
                            label="Email Address"
                            value="alex@albaeon.com"
                            helperText="Sign-in email cannot be changed here"
                            icon={<Lock className="h-4 w-4 text-text-muted" />}
                        />
                        <Field
                            label="Phone Number"
                            value="+91 98765 43210"
                            helperText="Used for order status lookups"
                        />
                        <div className="flex justify-end">
                            <button
                                type="button"
                                className="bg-gold px-8 py-2.5 font-sans text-[13px] font-medium text-nav transition-colors duration-200 hover:bg-gold-hover"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-5 border border-gold bg-surface p-5 sm:p-7">
                    <div className="space-y-5">
                        <h2 className={`${cormorant.className} text-[20px] text-text-primary`}>
                            Change Password
                        </h2>
                        <div className="h-px w-full bg-gold/10" />
                    </div>

                    <div className="space-y-2 border-l-2 border-[#4A90C4] bg-[#4A90C410] px-[18px] py-[14px]">
                        <div className="flex items-start gap-3">
                            <Info className="mt-0.5 h-4 w-4 text-[#4A90C4]" />
                            <p className="font-sans text-[13px] leading-[1.6] text-text-muted">
                                Your account uses Google Sign-In. Manage your password through your Google account settings.
                            </p>
                        </div>
                        <button type="button" className="font-sans text-[13px] text-[#4A90C4]">
                            Go to Google Security →
                        </button>
                    </div>

                    <div className="space-y-4 opacity-40">
                        <Field
                            label="Current Password"
                            value="Enter current password"
                            icon={<Eye className="h-4 w-4 text-text-muted" />}
                        />
                        <div className="space-y-1.5">
                            <Field label="New Password" value="Enter new password" />
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                    <div className="h-[3px] w-8 bg-[#E6A817]" />
                                    <div className="h-[3px] w-8 bg-[#E6A817]" />
                                    <div className="h-[3px] w-8 bg-text-muted/30" />
                                    <div className="h-[3px] w-8 bg-text-muted/30" />
                                </div>
                                <span className="font-sans text-[11px] text-[#E6A817]">
                                    Fair
                                </span>
                            </div>
                        </div>
                        <Field label="Confirm Password" value="Confirm password" />
                        <div className="flex justify-end">
                            <button
                                type="button"
                                className="border border-gold/20 px-6 py-2.5 font-sans text-[13px] text-text-muted"
                            >
                                Update Password
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-5 border border-gold bg-surface p-5 sm:p-7">
                    <h2 className={`${cormorant.className} text-[20px] text-text-primary`}>
                        Security & Notifications
                    </h2>
                    <div className="h-px w-full bg-gold/10" />
                    <div>
                        <ToggleRow
                            title="Order updates"
                            subtitle="Confirmations, shipping, delivery"
                            enabled
                        />
                        <ToggleRow
                            title="Promotions & offers"
                            subtitle="New arrivals, drops, discounts"
                            enabled={false}
                        />
                        <ToggleRow
                            title="Restock alerts"
                            subtitle="Sold-out items you viewed"
                            enabled
                            isLast
                        />
                    </div>
                </div>

                <div className="space-y-5 border border-red-500/20 bg-[#C0392B0A] p-5 sm:p-7">
                    <div className="flex items-center gap-2">
                        <TriangleAlert className="h-4 w-4 text-[#C0392B]" />
                        <h2 className={`${cormorant.className} text-[20px] text-[#C0392B]`}>
                            Danger Zone
                        </h2>
                    </div>
                    <div className="h-px w-full bg-red-500/15" />
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="space-y-1.5">
                            <p className="font-sans text-[14px] font-medium text-text-primary">
                                Delete Account
                            </p>
                            <p className="max-w-[560px] font-sans text-[13px] leading-[1.7] text-text-muted">
                                Permanently delete your account, order history, and all personal data. This cannot be undone.
                            </p>
                        </div>
                        <DeleteAccountModal email="alex@albaeon.com" />
                    </div>
                </div>

                <div className="flex justify-end">
                    <div className="flex w-full max-w-[300px] items-start gap-3 border-l-[3px] border-[#4CAF7D] bg-surface px-[18px] py-[14px]">
                        <CircleCheck className="mt-0.5 h-4 w-4 text-[#4CAF7D]" />
                        <div className="min-w-0 flex-1 space-y-0.5">
                            <p className="font-sans text-[13px] text-text-primary">
                                Profile updated
                            </p>
                            <p className="font-sans text-[12px] text-text-muted">
                                Your changes were saved successfully.
                            </p>
                        </div>
                        <span className="font-sans text-[13px] text-text-muted">x</span>
                    </div>
                </div>
            </div>
        </AccountShell>
    );
}
