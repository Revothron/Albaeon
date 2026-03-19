import Link from "next/link";
import { Cinzel } from "next/font/google";
import { Check } from "lucide-react";
import CheckoutShell from "@/components/customer/checkout/CheckoutShell";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

function SummaryRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between text-[13px] text-text-muted">
            <span>{label}</span>
            <span className="text-text-primary">{value}</span>
        </div>
    );
}

export default function CheckoutConfirmationPage() {
    return (
        <CheckoutShell
            title="Confirmation"
            subtitle="Your order has been placed successfully. You will receive a confirmation email shortly."
            activeStep="confirmation"
        >
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                <div className="space-y-5">
                    <div className="border border-gold bg-surface p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold bg-primary">
                                <Check className="h-5 w-5 text-gold" />
                            </div>
                            <div className="space-y-2">
                                <p className="font-sans text-[11px] uppercase tracking-[0.32em] text-text-muted">
                                    Order ID
                                </p>
                                <h2 className={`${cinzel.className} text-[26px] text-gold`}>
                                    ALB-00142
                                </h2>
                                <p className="font-sans text-[13px] text-text-muted">
                                    Estimated delivery: 4-6 Mar 2026
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="border border-gold bg-surface p-6">
                        <h3 className={`${cinzel.className} text-[22px] text-gold`}>
                            Delivery Details
                        </h3>
                        <div className="mt-4 space-y-2 text-[13px] text-text-primary">
                            <p>Alex Morgan</p>
                            <p>42, MG Road, Indiranagar</p>
                            <p>Bengaluru, Karnataka 560038</p>
                            <p>India · +91 98765 43210</p>
                        </div>
                        <div className="mt-4 h-px w-full bg-gold/10" />
                        <div className="mt-3 space-y-2 text-[13px] text-text-muted">
                            <SummaryRow label="Delivery Method" value="Standard · 3-5 days" />
                            <SummaryRow label="Payment" value="Card · **** 4421" />
                        </div>
                    </div>

                    <div className="border border-gold bg-surface p-6">
                        <h3 className={`${cinzel.className} text-[22px] text-gold`}>
                            Items
                        </h3>
                        <div className="mt-4 space-y-3">
                            {["Empire Oversized Tee", "Nocturne Tactical Tee"].map((item) => (
                                <div key={item} className="flex items-center justify-between text-[13px] text-text-primary">
                                    <span>{item}</span>
                                    <span className="text-gold">Rs 1,299</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="border border-gold bg-surface p-5">
                        <h3 className={`${cinzel.className} text-[20px] text-gold`}>
                            Order Summary
                        </h3>
                        <div className="mt-4 space-y-2 text-[13px]">
                            <SummaryRow label="Subtotal" value="Rs 2,598" />
                            <SummaryRow label="Shipping" value="Free" />
                            <SummaryRow label="Tax" value="Rs 0" />
                        </div>
                        <div className="my-4 h-px w-full bg-gold/10" />
                        <div className="flex items-center justify-between text-[14px] text-text-primary">
                            <span>Total</span>
                            <span className="text-gold">Rs 2,598</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Link href="/shop" className="btn-primary w-full text-[12px]">
                            Continue Shopping
                        </Link>
                        <Link
                            href="/track-order"
                            className="border border-gold/30 px-4 py-3 text-center text-[12px] uppercase tracking-[0.3em] text-text-muted transition-colors duration-200 hover:border-gold hover:text-gold"
                        >
                            Track Order
                        </Link>
                    </div>
                </div>
            </div>
        </CheckoutShell>
    );
}
