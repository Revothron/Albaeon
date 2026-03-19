import Link from "next/link";
import { Cinzel } from "next/font/google";
import CheckoutShell from "@/components/customer/checkout/CheckoutShell";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

function PaymentOption({
    title,
    subtitle,
    active,
}: {
    title: string;
    subtitle: string;
    active?: boolean;
}) {
    return (
        <div className={`flex items-start gap-3 border px-4 py-3 ${active ? "border-gold bg-primary-deep" : "border-gold/15 bg-primary"}`}>
            <div className={`mt-1 h-3.5 w-3.5 rounded-full border ${active ? "border-gold bg-gold" : "border-gold/40"}`} />
            <div className="space-y-1">
                <p className="font-sans text-[13px] font-semibold text-text-primary">
                    {title}
                </p>
                <p className="font-sans text-[12px] text-text-muted">
                    {subtitle}
                </p>
            </div>
        </div>
    );
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
    return (
        <label className="flex flex-col gap-2">
            <span className="font-sans text-[11px] uppercase tracking-[0.32em] text-text-muted">
                {label}
            </span>
            <input
                type="text"
                placeholder={placeholder}
                className="h-[44px] border border-gold/20 bg-primary px-4 font-sans text-[13px] text-text-primary outline-none placeholder:text-text-muted"
            />
        </label>
    );
}

export default function CheckoutPaymentPage() {
    return (
        <CheckoutShell
            title="Payment"
            subtitle="Choose your payment method and confirm the billing details."
            activeStep="payment"
        >
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                <div className="space-y-5">
                    <div className="border border-gold bg-surface p-5 sm:p-6">
                        <h2 className={`${cinzel.className} text-[22px] text-gold sm:text-[26px]`}>
                            Payment Method
                        </h2>
                        <div className="mt-4 space-y-3">
                            <PaymentOption
                                title="Card Payment"
                                subtitle="Visa, MasterCard, Amex"
                                active
                            />
                            <PaymentOption
                                title="UPI / Wallets"
                                subtitle="PhonePe, PayTM, Google Pay"
                            />
                            <PaymentOption
                                title="Net Banking"
                                subtitle="All major banks supported"
                            />
                        </div>
                    </div>

                    <div className="border border-gold bg-surface p-5 sm:p-6">
                        <h2 className={`${cinzel.className} text-[22px] text-gold sm:text-[26px]`}>
                            Card Details
                        </h2>
                        <div className="mt-4 grid gap-4 lg:grid-cols-2">
                            <Field label="Card Holder Name" placeholder="Alex Morgan" />
                            <Field label="Card Number" placeholder="1234 5678 9012 3456" />
                            <Field label="Expiry Date" placeholder="MM / YY" />
                            <Field label="CVV" placeholder="***" />
                            <div className="lg:col-span-2">
                                <Field label="Billing Address" placeholder="Same as shipping address" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="border border-gold bg-surface p-5">
                        <h3 className={`${cinzel.className} text-[20px] text-gold`}>
                            Order Summary
                        </h3>
                        <div className="mt-4 space-y-3">
                            {["Empire Oversized Tee", "Nocturne Tactical Tee"].map((item) => (
                                <div key={item} className="flex items-center justify-between text-[13px] text-text-primary">
                                    <span>{item}</span>
                                    <span className="text-gold">Rs 1,299</span>
                                </div>
                            ))}
                        </div>
                        <div className="my-4 h-px w-full bg-gold/10" />
                        <div className="space-y-2 text-[13px]">
                            <div className="flex items-center justify-between text-text-muted">
                                <span>Subtotal</span>
                                <span>Rs 2,598</span>
                            </div>
                            <div className="flex items-center justify-between text-text-muted">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="flex items-center justify-between text-text-primary">
                                <span>Total</span>
                                <span className="text-gold">Rs 2,598</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Link href="/checkout/confirmation" className="btn-primary w-full text-[12px]">
                            Place Order
                        </Link>
                        <Link
                            href="/checkout/delivery"
                            className="border border-gold/30 px-4 py-3 text-center text-[12px] uppercase tracking-[0.3em] text-text-muted transition-colors duration-200 hover:border-gold hover:text-gold"
                        >
                            Back to Delivery
                        </Link>
                    </div>
                </div>
            </div>
        </CheckoutShell>
    );
}
