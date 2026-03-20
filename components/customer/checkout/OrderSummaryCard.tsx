import { Cinzel, Raleway } from "next/font/google";
import { Lock, RefreshCw, ShieldCheck, Truck } from "lucide-react";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "600", "700"] });
const raleway = Raleway({ subsets: ["latin"], weight: ["300", "400", "500", "600"] });

const orderItems = [
    { name: "EMPIRE OVERSIZED TEE", meta: "Black · XL", price: "₹1,299" },
    { name: "PANTHEON HOODIE", meta: "White · L", price: "₹2,199" },
];

type OrderSummaryVariant = "delivery" | "payment";

export default function OrderSummaryCard({ variant }: { variant: OrderSummaryVariant }) {
    return (
        <div className="flex flex-col gap-4 border border-gold/20 bg-[#1E1A2E] p-7 text-[13px] text-text-muted">
            <div className="flex items-center justify-between">
                <span className={`${cinzel.className} text-[10px] font-bold tracking-[0.4em] text-gold`}>
                    ORDER SUMMARY
                </span>
                <span className={`${cinzel.className} text-[9px] font-semibold tracking-[0.2em] text-text-muted`}>
                    HIDE DETAILS ∧
                </span>
            </div>

            <div className="h-px w-full bg-gold/10" />

            <div className="space-y-3">
                {orderItems.map((item, index) => (
                    <div key={item.name} className="flex items-start gap-3">
                        <div className="flex h-16 w-16 items-center justify-center border border-gold/10 bg-primary-deep">
                            <div className="flex h-[18px] w-[18px] items-center justify-center bg-gold text-[10px] font-bold text-nav">
                                1
                            </div>
                        </div>
                        <div className="flex flex-1 flex-col gap-1">
                            <span className={`${cinzel.className} text-[11px] font-semibold tracking-[0.08em] text-text-primary`}>
                                {item.name}
                            </span>
                            <span className={`${raleway.className} text-[11px] text-text-muted`}>
                                {item.meta}
                            </span>
                            <span className={`${cinzel.className} text-[14px] text-gold`}>
                                {item.price}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="h-px w-full bg-gold/10" />

            <div className="flex items-center gap-3">
                <div className="flex h-11 flex-1 items-center border border-gold/15 bg-nav px-3 text-[13px] text-text-muted">
                    Coupon code
                </div>
                <div className="flex h-11 w-20 items-center justify-center border border-gold/30">
                    <span className={`${cinzel.className} text-[10px] font-semibold tracking-[0.2em] text-text-muted`}>
                        APPLY
                    </span>
                </div>
            </div>

            <div className="flex items-center justify-between border-l-2 border-[var(--status-success)] bg-[#4CAF7D1A] px-3 py-2">
                <span className={`${raleway.className} text-[12px] text-[var(--status-success)]`}>
                    MYTH10 — ₹130 off
                </span>
                <span className={`${cinzel.className} text-[9px] font-semibold tracking-[0.1em] text-[var(--status-error)]`}>
                    REMOVE ×
                </span>
            </div>

            <div className="h-px w-full bg-gold/10" />

            <div className="flex items-center justify-between">
                <span className={`${raleway.className} text-[13px] text-text-muted`}>Subtotal (2 items)</span>
                <span className={`${raleway.className} text-[13px] text-text-primary`}>₹3,498</span>
            </div>
            <div className="flex items-center justify-between">
                <span className={`${raleway.className} text-[13px] text-text-muted`}>Shipping</span>
                <span className={`${raleway.className} text-[13px] text-[var(--status-success)]`}>Free</span>
            </div>
            <div className="flex items-center justify-between">
                <span className={`${raleway.className} text-[13px] text-text-muted`}>Discount (MYTH10)</span>
                <span className={`${raleway.className} text-[13px] text-[var(--status-success)]`}>−₹130</span>
            </div>

            <div className="h-px w-full bg-gold/20" />

            <div className="flex items-center justify-between">
                <span className={`${cinzel.className} text-[12px] font-bold tracking-[0.2em] text-gold`}>
                    TOTAL
                </span>
                <span className={`${cinzel.className} text-[26px] text-gold`}>₹3,368</span>
            </div>
            <div className="flex justify-end">
                <span className={`${raleway.className} text-[10px] text-text-muted`}>
                    Inclusive of all taxes
                </span>
            </div>

            <div className="h-px w-full bg-gold/10" />

            {variant === "payment" ? (
                <div className="flex items-center justify-center gap-2">
                    <span className={`${raleway.className} text-[11px] text-text-muted`}>Secured by</span>
                    <div className="flex h-[18px] w-[70px] items-center justify-center border border-gold/20 text-[10px] text-text-muted">
                        Razorpay
                    </div>
                    <Lock className="h-[11px] w-[11px] text-text-muted" />
                </div>
            ) : null}

            <div className="flex items-center gap-2 border-b border-gold/10 py-2">
                <ShieldCheck className="h-[12px] w-[12px] text-[var(--status-success)]" />
                <span className={`${raleway.className} text-[12px] text-text-muted`}>
                    SSL Encrypted — 256-bit security
                </span>
            </div>
            <div className="flex items-center gap-2 border-b border-gold/10 py-2">
                <RefreshCw className="h-[12px] w-[12px] text-text-muted" />
                <span className={`${raleway.className} text-[12px] text-text-muted`}>
                    No returns — report damaged items
                </span>
            </div>
            <div className="flex items-center gap-2 border-b border-gold/10 py-2">
                <Truck className="h-[12px] w-[12px] text-text-muted" />
                <span className={`${raleway.className} text-[12px] text-text-muted`}>
                    Free shipping on all orders
                </span>
            </div>

            <div className="h-px w-full bg-gold/10" />

            <span className={`${cinzel.className} text-[9px] font-bold tracking-[0.3em] text-text-muted`}>
                NEED HELP?
            </span>
            <span className={`${cinzel.className} text-[9px] font-semibold tracking-[0.2em] text-gold`}>
                CONTACT SUPPORT →
            </span>
            <span className={`${cinzel.className} text-[9px] font-semibold tracking-[0.2em] text-text-muted`}>
                SHIPPING POLICY →
            </span>
        </div>
    );
}
