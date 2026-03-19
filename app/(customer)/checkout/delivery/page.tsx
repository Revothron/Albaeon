import Link from "next/link";
import { Cinzel } from "next/font/google";
import CheckoutShell from "@/components/customer/checkout/CheckoutShell";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

function Field({
    label,
    placeholder,
    span = "full",
}: {
    label: string;
    placeholder: string;
    span?: "full" | "half";
}) {
    return (
        <label className={`flex flex-col gap-2 ${span === "half" ? "lg:col-span-1" : "lg:col-span-2"}`}>
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

function DeliveryOption({
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

export default function CheckoutDeliveryPage() {
    return (
        <CheckoutShell
            title="Delivery"
            subtitle="Confirm your shipping address and choose the delivery method."
            activeStep="delivery"
        >
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                <div className="space-y-5">
                    <div className="border border-gold bg-surface p-5 sm:p-6">
                        <h2 className={`${cinzel.className} text-[22px] text-gold sm:text-[26px]`}>
                            Shipping Address
                        </h2>
                        <div className="mt-4 grid gap-4 lg:grid-cols-2">
                            <Field label="First Name" placeholder="Alex" span="half" />
                            <Field label="Last Name" placeholder="Morgan" span="half" />
                            <Field label="Email" placeholder="alex@albaeon.com" />
                            <Field label="Phone" placeholder="+91 98765 43210" />
                            <Field label="Address" placeholder="42, MG Road" />
                            <Field label="Apartment / Suite" placeholder="Indiranagar" />
                            <Field label="City" placeholder="Bengaluru" span="half" />
                            <Field label="State" placeholder="Karnataka" span="half" />
                            <Field label="Postal Code" placeholder="560038" span="half" />
                            <Field label="Country" placeholder="India" span="half" />
                        </div>
                    </div>

                    <div className="border border-gold bg-surface p-5 sm:p-6">
                        <h2 className={`${cinzel.className} text-[22px] text-gold sm:text-[26px]`}>
                            Delivery Method
                        </h2>
                        <div className="mt-4 space-y-3">
                            <DeliveryOption
                                title="Standard Delivery · 3-5 days"
                                subtitle="Free on all orders above Rs 1,999"
                                active
                            />
                            <DeliveryOption
                                title="Express Delivery · 1-2 days"
                                subtitle="Rs 149 charged on checkout"
                            />
                            <DeliveryOption
                                title="Scheduled Delivery"
                                subtitle="Pick a preferred delivery date"
                            />
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
                        <Link href="/checkout/payment" className="btn-primary w-full text-[12px]">
                            Continue to Payment
                        </Link>
                        <Link
                            href="/cart"
                            className="border border-gold/30 px-4 py-3 text-center text-[12px] uppercase tracking-[0.3em] text-text-muted transition-colors duration-200 hover:border-gold hover:text-gold"
                        >
                            Back to Cart
                        </Link>
                    </div>
                </div>
            </div>
        </CheckoutShell>
    );
}
