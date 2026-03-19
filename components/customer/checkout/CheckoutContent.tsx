import Link from "next/link";
import { Cinzel, Cormorant_Garamond, Raleway } from "next/font/google";
import {
    Check,
    CheckCircle2,
    Download,
    Info,
    Lock,
    Plus,
    RefreshCw,
    ShieldCheck,
    Truck,
    X,
} from "lucide-react";
import OrderSummaryCard from "@/components/customer/checkout/OrderSummaryCard";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "600", "700"] });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400"] });
const raleway = Raleway({ subsets: ["latin"], weight: ["300", "400", "500", "600"] });

type CheckoutStepKey = "delivery" | "payment" | "confirmation";

const addressCards = [
    {
        tag: "HOME",
        name: "Arjun Sharma",
        body: "42, MG Road, Indiranagar\nBengaluru, Karnataka 560038\nIndia\n+91 98765 43210",
        active: true,
    },
    {
        tag: "WORK",
        name: "Arjun Sharma",
        body: "12, Brigade Road, Apt 4B\nBengaluru, Karnataka 560025\nIndia\n+91 98765 43210",
    },
];

function DeliveryContent() {
    return (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
            <div className="flex flex-col gap-6">
                <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-7 w-7 items-center justify-center bg-gold text-[11px] font-bold text-nav">
                                1
                            </div>
                            <span className={`${cinzel.className} text-[11px] font-bold tracking-[0.4em] text-gold`}>
                                DELIVERY ADDRESS
                            </span>
                        </div>
                        <button
                            type="button"
                            className="flex h-[38px] items-center gap-2 border border-gold/20 px-3 text-[9px] font-semibold tracking-[0.2em] text-gold"
                        >
                            <Plus className="h-3 w-3" />
                            ADD NEW ADDRESS
                        </button>
                    </div>
                    <p className={`${raleway.className} pl-10 text-[13px] text-text-muted`}>
                        Where should we deliver your order?
                    </p>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    {addressCards.map((card) => (
                        <div
                            key={card.tag}
                            className={`flex flex-col gap-2.5 bg-surface p-5 ${
                                card.active
                                    ? "border border-gold border-l-[3px]"
                                    : "border border-gold/10"
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className={`${cinzel.className} text-[9px] font-bold tracking-[0.3em] ${card.active ? "text-gold" : "text-text-muted"}`}>
                                    {card.tag}
                                </span>
                                <div className={`h-[18px] w-[18px] ${card.active ? "bg-gold" : "border border-gold/20"}`} />
                            </div>
                            <span className={`${raleway.className} text-[14px] font-medium text-text-primary`}>
                                {card.name}
                            </span>
                            <span className={`${raleway.className} whitespace-pre-line text-[13px] leading-[2] text-text-muted`}>
                                {card.body}
                            </span>
                            <span className={`${cinzel.className} text-[9px] font-semibold tracking-[0.2em] ${card.active ? "text-gold" : "text-text-muted"}`}>
                                EDIT
                            </span>
                        </div>
                    ))}
                </div>

                <div className="flex h-[120px] flex-col items-center justify-center gap-2 border border-gold/20 text-gold">
                    <span className={`${raleway.className} text-[22px]`}>+</span>
                    <span className={`${cinzel.className} text-[10px] font-semibold tracking-[0.3em]`}>
                        ADD NEW ADDRESS
                    </span>
                </div>

                <div className="flex flex-col gap-4 border border-gold/10 bg-surface p-8">
                    <div className="flex flex-wrap items-center gap-7">
                        <span className={`${cinzel.className} text-[10px] font-semibold tracking-[0.3em] text-gold`}>
                            SHIPPING
                        </span>
                        <span className={`${cinzel.className} text-[10px] font-semibold tracking-[0.3em] text-text-muted`}>
                            BILLING
                        </span>
                    </div>

                    <div className="space-y-3">
                        <span className={`${cinzel.className} text-[9px] font-bold tracking-[0.3em] text-text-muted`}>
                            ADDRESS TAG
                        </span>
                        <div className="grid gap-3 sm:grid-cols-3">
                            {["HOME", "WORK", "OTHER"].map((tag, index) => (
                                <div
                                    key={tag}
                                    className={`flex h-[42px] items-center justify-center border px-3 text-[10px] font-semibold tracking-[0.2em] ${
                                        index === 0 ? "border-gold text-gold" : "border-gold/15 text-text-muted"
                                    }`}
                                >
                                    {tag}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid gap-5 lg:grid-cols-2">
                        {[
                            { label: "FULL NAME", value: "Arjun Sharma", accent: true },
                            { label: "PHONE NUMBER", value: "+91 98765 43210" },
                        ].map((field) => (
                            <div key={field.label} className="space-y-2">
                                <span className={`${cinzel.className} text-[9px] font-bold tracking-[0.3em] text-text-muted`}>
                                    {field.label}
                                </span>
                                <div
                                    className={`flex h-[46px] items-center bg-primary-deep px-4 text-[14px] text-text-primary ${
                                        field.accent ? "border border-[#4CAF7D66]" : "border border-gold/15"
                                    }`}
                                >
                                    {field.value}
                                </div>
                            </div>
                        ))}
                    </div>

                    {[
                        { label: "ADDRESS LINE 1", value: "42, MG Road, Indiranagar", active: true },
                        { label: "ADDRESS LINE 2 (OPTIONAL)", value: "Apartment, floor, landmark..." },
                    ].map((field) => (
                        <div key={field.label} className="space-y-2">
                            <span className={`${cinzel.className} text-[9px] font-bold tracking-[0.3em] text-text-muted`}>
                                {field.label}
                            </span>
                            <div
                                className={`flex h-[46px] items-center bg-primary-deep px-4 text-[14px] ${
                                    field.active ? "text-text-primary border border-gold/15" : "text-text-muted border border-gold/10"
                                }`}
                            >
                                {field.value}
                            </div>
                        </div>
                    ))}

                    <div className="grid gap-5 lg:grid-cols-4">
                        {["CITY", "STATE", "PIN CODE", "COUNTRY"].map((label) => (
                            <div key={label} className="space-y-2">
                                <span className={`${cinzel.className} text-[9px] font-bold tracking-[0.3em] text-text-muted`}>
                                    {label}
                                </span>
                                <div className="flex h-[46px] items-center justify-between border border-gold/15 bg-primary-deep px-4 text-[14px] text-text-primary">
                                    {label === "COUNTRY" ? "India" : "Bengaluru"}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex h-[18px] w-[18px] items-center justify-center border border-gold bg-gold/10">
                            <Check className="h-[10px] w-[10px] text-gold" />
                        </div>
                        <span className={`${raleway.className} text-[13px] text-text-primary`}>
                            Save as default shipping address
                        </span>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[#C0392B]">
                            <Info className="h-[11px] w-[11px]" />
                            <span className={`${raleway.className} text-[11px]`}>This field is required</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#4CAF7D]">
                            <Check className="h-[11px] w-[11px]" />
                            <span className={`${raleway.className} text-[11px]`}>Looks good</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <span className={`${cinzel.className} text-[10px] font-bold tracking-[0.4em] text-gold`}>
                        SHIPPING METHOD
                    </span>
                    <div className="h-px w-full bg-gold/10" />
                    <div className="flex items-center justify-between border border-gold border-l-[3px] bg-surface p-5">
                        <div className="flex items-center gap-4">
                            <div className="flex h-[18px] w-[18px] items-center justify-center bg-gold/20">
                                <Truck className="h-[12px] w-[12px] text-gold" />
                            </div>
                            <div className="space-y-1">
                                <span className={`${cinzel.className} text-[12px] tracking-[0.15em] text-gold`}>
                                    Standard Shipping (5-7 days)
                                </span>
                                <span className={`${raleway.className} text-[12px] text-text-muted`}>
                                    Free on all orders
                                </span>
                            </div>
                        </div>
                        <span className={`${cinzel.className} text-[15px] text-[#4CAF7D]`}>Free</span>
                    </div>
                    <div className="flex items-center gap-2 text-text-muted">
                        <Info className="h-[12px] w-[12px]" />
                        <span className={`${raleway.className} text-[11px]`}>
                            Currently we offer standard shipping only. Express options coming soon.
                        </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <Link
                            href="/checkout/payment"
                            className="flex h-[52px] w-[300px] items-center justify-center bg-gold text-[10px] font-semibold tracking-[0.3em] text-nav"
                        >
                            CONTINUE TO PAYMENT →
                        </Link>
                        <div className="flex items-center gap-2 text-text-muted">
                            <Lock className="h-[12px] w-[12px]" />
                            <span className={`${raleway.className} text-[12px]`}>
                                Your data is encrypted and secure
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <OrderSummaryCard variant="delivery" />
        </div>
    );
}

function PaymentContent() {
    return (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between border border-gold/10 bg-surface px-5 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-[22px] w-[22px] items-center justify-center border border-[#4CAF7D] bg-[#4CAF7D1A]">
                            <Check className="h-[12px] w-[12px] text-[#4CAF7D]" />
                        </div>
                        <span className={`${cinzel.className} text-[9px] font-bold tracking-[0.3em] text-[#4CAF7D]`}>
                            DELIVERING TO
                        </span>
                        <span className={`${raleway.className} text-[13px] text-text-muted`}>
                            42, MG Road, Bengaluru 560038 · Standard Shipping · Free
                        </span>
                    </div>
                    <span className={`${cinzel.className} text-[9px] font-semibold tracking-[0.2em] text-gold`}>
                        EDIT
                    </span>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="flex h-7 w-7 items-center justify-center bg-gold text-[11px] font-bold text-nav">
                            2
                        </div>
                        <span className={`${cinzel.className} text-[11px] font-bold tracking-[0.4em] text-gold`}>
                            PAYMENT
                        </span>
                    </div>
                    <p className={`${raleway.className} pl-10 text-[13px] text-text-muted`}>
                        Choose your payment method
                    </p>
                </div>

                <div className="flex flex-col gap-4 border border-gold border-l-[3px] bg-surface p-7">
                    <div className="flex items-center justify-between">
                        <div className="flex items-start gap-4">
                            <Lock className="mt-1 h-5 w-5 text-gold" />
                            <div className="space-y-1">
                                <span className={`${cinzel.className} text-[11px] font-bold tracking-[0.2em] text-gold`}>
                                    SECURE PAYMENT
                                </span>
                                <span className={`${raleway.className} text-[13px] text-text-muted`}>
                                    Powered by Razorpay · ₹ INR
                                </span>
                            </div>
                        </div>
                        <div className="flex h-7 w-[100px] items-center justify-center border border-gold/30 text-[11px] text-text-muted">
                            Razorpay
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {["UPI", "Net Banking", "Visa", "Mastercard", "RuPay", "Wallets", "EMI"].map((method) => (
                            <div key={method} className="border border-gold/10 bg-primary-deep px-3 py-1 text-[11px] text-text-muted">
                                {method}
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-3 border-l-2 border-[#4A90C4] bg-[#4A90C410] px-4 py-3">
                        <Info className="mt-0.5 h-[14px] w-[14px] text-[#4A90C4]" />
                        <p className={`${raleway.className} text-[13px] leading-[1.7] text-text-muted`}>
                            You will be redirected to Razorpay's secure payment page to complete your purchase. Supports UPI, Net Banking, Credit / Debit Cards, Wallets, and EMI options.
                        </p>
                    </div>
                </div>

                <div className="space-y-3">
                    <span className={`${cinzel.className} text-[10px] font-bold tracking-[0.4em] text-gold`}>
                        BILLING ADDRESS
                    </span>
                    <div className="h-px w-full bg-gold/10" />
                    <div className="flex items-center gap-3 border border-gold/10 bg-surface px-4 py-3">
                        <div className="flex h-[18px] w-[18px] items-center justify-center bg-gold text-nav">
                            <div className="h-[8px] w-[8px] rounded-full bg-nav" />
                        </div>
                        <span className={`${raleway.className} text-[14px] text-text-primary`}>
                            Same as shipping address
                        </span>
                    </div>
                    <div className="flex items-center gap-3 border border-gold/10 bg-surface px-4 py-3">
                        <div className="h-[18px] w-[18px] border border-text-muted/30" />
                        <span className={`${raleway.className} text-[14px] text-text-muted`}>
                            Use a different billing address
                        </span>
                    </div>
                </div>

                <div className="space-y-3">
                    <span className={`${cinzel.className} text-[10px] font-bold tracking-[0.4em] text-gold`}>
                        REVIEW YOUR ORDER
                    </span>
                    <div className="h-px w-full bg-gold/10" />
                    {[
                        { name: "EMPIRE OVERSIZED TEE", meta: "Black · XL · Qty 1", price: "₹1,299" },
                        { name: "PANTHEON HOODIE", meta: "White · L · Qty 1", price: "₹2,199" },
                    ].map((item) => (
                        <div key={item.name} className="flex items-center gap-4 border-b border-gold/10 py-3">
                            <div className="h-14 w-14 border border-gold/10 bg-primary-deep" />
                            <div className="flex flex-1 flex-col gap-1">
                                <span className={`${cinzel.className} text-[12px] font-semibold text-text-primary`}>
                                    {item.name}
                                </span>
                                <span className={`${raleway.className} text-[12px] text-text-muted`}>
                                    {item.meta}
                                </span>
                            </div>
                            <span className={`${cinzel.className} text-[15px] text-gold`}>
                                {item.price}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="space-y-4">
                    <div className="flex gap-3 border-l-2 border-[#C0392B] bg-[#C0392B14] px-5 py-4">
                        <div className="flex h-[18px] w-[18px] items-center justify-center border border-[#C0392B]">
                            <X className="h-[12px] w-[12px] text-[#C0392B]" />
                        </div>
                        <div className="space-y-1">
                            <span className={`${cinzel.className} text-[11px] font-bold tracking-[0.2em] text-[#C0392B]`}>
                                PAYMENT FAILED
                            </span>
                            <p className={`${raleway.className} text-[13px] text-text-primary`}>
                                Your Razorpay payment could not be processed. Please try again or use a different payment method.
                            </p>
                            <span className={`${cinzel.className} text-[9px] font-semibold tracking-[0.2em] text-gold`}>
                                TRY A DIFFERENT PAYMENT METHOD →
                            </span>
                        </div>
                    </div>

                    <div className="flex h-[58px] items-center justify-center bg-gold text-[12px] font-semibold tracking-[0.3em] text-nav">
                        Pay ₹3,368 Securely via Razorpay →
                    </div>
                    <span className={`${cinzel.className} text-[10px] font-semibold tracking-[0.2em] text-text-muted`}>
                        Processing via Razorpay...
                    </span>

                    <div className="flex flex-wrap justify-center gap-7 text-text-muted">
                        {[
                            { icon: Lock, label: "Encrypted & Secure" },
                            { icon: ShieldCheck, label: "No card data stored by Albaeon" },
                            { icon: RefreshCw, label: "Payments secured by Razorpay" },
                        ].map((item) => (
                            <div key={item.label} className="flex items-center gap-2">
                                <item.icon className="h-[14px] w-[14px]" />
                                <span className={`${raleway.className} text-[12px]`}>{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <OrderSummaryCard variant="payment" />
        </div>
    );
}

function ConfirmationContent() {
    return (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center gap-3 border border-gold/20 bg-surface px-10 py-12 text-center">
                    <div className="flex h-24 w-24 items-center justify-center border-2 border-[#4CAF7D] bg-[#4CAF7D1A]">
                        <Check className="h-10 w-10 text-[#4CAF7D]" />
                    </div>
                    <span className={`${cinzel.className} text-[10px] font-bold tracking-[0.5em] text-[#4CAF7D]`}>
                        PAYMENT SUCCESSFUL
                    </span>
                    <span className={`${cormorant.className} text-[38px] font-light text-text-primary sm:text-[48px]`}>
                        Order Confirmed
                    </span>
                    <span className={`${cinzel.className} text-[18px] font-semibold text-gold`}>
                        ALB-00142
                    </span>
                    <div className="h-px w-[60px] bg-gold" />
                    <span className={`${cormorant.className} text-[22px] font-light text-text-primary`}>
                        Thank you, Arjun.
                    </span>
                    <p className={`${raleway.className} max-w-[500px] text-[14px] text-text-muted`}>
                        Your order has been placed and a confirmation email has been sent to arjun@gmail.com
                    </p>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <div className="flex flex-col gap-3 border border-gold/10 bg-primary-deep p-5">
                        <span className={`${cinzel.className} text-[9px] font-bold tracking-[0.3em] text-text-muted`}>
                            DELIVERING TO
                        </span>
                        <span className={`${raleway.className} whitespace-pre-line text-[14px] text-text-primary`}>
                            {"Arjun Sharma\n42, MG Road, Indiranagar\nBengaluru, Karnataka 560038\nIndia"}
                        </span>
                        <div className="h-px w-full bg-gold/10" />
                        <span className={`${cinzel.className} text-[9px] font-bold tracking-[0.3em] text-text-muted`}>
                            ESTIMATED DELIVERY
                        </span>
                        <span className={`${raleway.className} text-[14px] text-text-primary`}>5-7 Business Days</span>
                        <span className={`${raleway.className} text-[12px] text-[#4CAF7D]`}>
                            Standard Shipping · Free
                        </span>
                    </div>

                    <div className="flex flex-col gap-3 border border-gold/10 bg-primary-deep p-5">
                        <span className={`${cinzel.className} text-[9px] font-bold tracking-[0.3em] text-text-muted`}>
                            PAYMENT DETAILS
                        </span>
                        {[
                            { label: "Method", value: "Razorpay · UPI / HDFC Bank" },
                            { label: "Transaction ID", value: "pay_NxK8mZ7Qrp1234" },
                        ].map((row) => (
                            <div key={row.label} className="flex items-center justify-between text-[13px] text-text-muted">
                                <span>{row.label}</span>
                                <span className="text-text-primary">{row.value}</span>
                            </div>
                        ))}
                        <div className="flex items-center justify-between text-[13px] text-text-muted">
                            <span>Status</span>
                            <span className="border border-[#4CAF7D] bg-[#4CAF7D1A] px-2 py-0.5 text-[9px] text-[#4CAF7D]">
                                PAID
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-[13px] text-text-muted">
                            <span>Amount Charged</span>
                            <span className={`${cinzel.className} text-[16px] text-gold`}>₹3,368.00</span>
                        </div>
                        <div className="flex items-center justify-between text-[13px] text-text-muted">
                            <span>Date</span>
                            <span>4 March 2026, 4:33 PM</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <span className={`${cinzel.className} text-[10px] font-bold tracking-[0.4em] text-gold`}>
                        ITEMS IN YOUR ORDER
                    </span>
                    <div className="h-px w-full bg-gold/10" />
                    {[
                        { name: "EMPIRE OVERSIZED TEE", meta: "Black · XL · Qty 1", sku: "SKU: ALB-EMT-BLK-XL", price: "₹1,299" },
                        { name: "PANTHEON HOODIE", meta: "White · L · Qty 1", sku: "SKU: ALB-PAN-WHT-L", price: "₹2,199" },
                    ].map((item) => (
                        <div key={item.name} className="flex items-center gap-4 border-b border-gold/10 py-4">
                            <div className="h-[72px] w-[72px] border border-gold/10 bg-primary-deep" />
                            <div className="flex flex-1 flex-col gap-1">
                                <span className={`${cinzel.className} text-[12px] font-semibold text-text-primary`}>
                                    {item.name}
                                </span>
                                <span className={`${raleway.className} text-[12px] text-text-muted`}>
                                    {item.meta}
                                </span>
                                <span className={`${raleway.className} text-[10px] text-text-muted`}>
                                    {item.sku}
                                </span>
                            </div>
                            <span className={`${cinzel.className} text-[16px] text-gold`}>
                                {item.price}
                            </span>
                        </div>
                    ))}

                    <div className="flex flex-col gap-2 border border-gold/10 bg-primary-deep px-6 py-5">
                        {[
                            { label: "Subtotal", value: "₹3,498" },
                            { label: "Shipping", value: "Free", accent: true },
                            { label: "Discount (MYTH10)", value: "-₹130", accent: true },
                        ].map((row) => (
                            <div key={row.label} className="flex items-center justify-between text-[13px] text-text-muted">
                                <span>{row.label}</span>
                                <span className={row.accent ? "text-[#4CAF7D]" : "text-text-primary"}>{row.value}</span>
                            </div>
                        ))}
                        <div className="h-px w-full bg-gold/20" />
                        <div className="flex items-center justify-between">
                            <span className={`${cinzel.className} text-[12px] font-bold tracking-[0.2em] text-gold`}>
                                TOTAL CHARGED
                            </span>
                            <span className={`${cinzel.className} text-[22px] text-gold`}>₹3,368.00</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <span className={`${cinzel.className} text-[10px] font-bold tracking-[0.4em] text-gold`}>
                        WHAT HAPPENS NEXT
                    </span>
                    <div className="h-px w-full bg-gold/10" />
                    <div className="grid gap-4 lg:grid-cols-3">
                        {[
                            { step: "01", title: "ORDER PROCESSING", body: "Your order is being prepared and sent to our fulfilment partner." },
                            { step: "02", title: "ORDER SHIPPED", body: "You will receive a shipping confirmation email with your tracking number." },
                            { step: "03", title: "DELIVERED", body: "Estimated 5-7 business days from order confirmation." },
                        ].map((item, index) => (
                            <div
                                key={item.step}
                                className={`flex flex-col gap-2 ${index < 2 ? "lg:border-r lg:border-gold/10 lg:pr-6" : ""}`}
                            >
                                <span className={`${cormorant.className} text-[32px] text-gold`}>{item.step}</span>
                                <span className={`${cinzel.className} text-[11px] font-semibold tracking-[0.2em] text-text-primary`}>
                                    {item.title}
                                </span>
                                <span className={`${raleway.className} text-[13px] text-text-muted`}>
                                    {item.body}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-wrap gap-4">
                    <Link
                        href="/track-order"
                        className="flex h-[50px] w-[220px] items-center justify-center border border-gold text-[10px] font-semibold tracking-[0.3em] text-gold"
                    >
                        TRACK MY ORDER
                    </Link>
                    <button className="flex h-[50px] w-[220px] items-center justify-center border border-gold/20 text-[10px] font-semibold tracking-[0.3em] text-text-muted">
                        <Download className="mr-2 h-[14px] w-[14px]" />
                        DOWNLOAD INVOICE
                    </button>
                    <Link
                        href="/shop"
                        className="flex h-[50px] w-[220px] items-center justify-center bg-gold text-[10px] font-semibold tracking-[0.3em] text-nav"
                    >
                        CONTINUE SHOPPING
                    </Link>
                </div>
            </div>

            <div className="flex flex-col gap-4 border border-gold/20 bg-[#1E1A2E] p-7">
                <div className="flex items-center gap-2 border-b border-gold/10 pb-4 text-[#4CAF7D]">
                    <CheckCircle2 className="h-[22px] w-[22px]" />
                    <span className={`${cinzel.className} text-[11px] font-bold tracking-[0.3em]`}>
                        ORDER CONFIRMED
                    </span>
                </div>

                <span className={`${cinzel.className} text-[9px] font-bold tracking-[0.3em] text-text-muted`}>ORDER NUMBER</span>
                <span className={`${cinzel.className} text-[20px] text-gold`}>ALB-00142</span>
                <span className={`${cinzel.className} text-[9px] font-bold tracking-[0.3em] text-text-muted`}>PLACED ON</span>
                <span className={`${raleway.className} text-[14px] text-text-primary`}>4 March 2026, 4:33 PM</span>
                <div className="h-px w-full bg-gold/10" />

                <span className={`${cinzel.className} text-[10px] font-bold tracking-[0.4em] text-gold`}>ORDER SUMMARY</span>
                {[
                    { name: "EMPIRE OVERSIZED TEE", meta: "Black · XL · x1", price: "₹1,299" },
                    { name: "PANTHEON HOODIE", meta: "White · L · x1", price: "₹2,199" },
                ].map((item) => (
                    <div key={item.name} className="flex items-center gap-3 border-b border-gold/10 py-3">
                        <div className="h-12 w-12 border border-gold/10 bg-primary-deep" />
                        <div className="flex flex-1 flex-col gap-1">
                            <span className={`${cinzel.className} text-[10px] font-semibold text-text-primary`}>{item.name}</span>
                            <span className={`${raleway.className} text-[10px] text-text-muted`}>{item.meta}</span>
                        </div>
                        <span className={`${cinzel.className} text-[13px] text-gold`}>{item.price}</span>
                    </div>
                ))}
                <div className="flex items-center justify-between">
                    <span className={`${cinzel.className} text-[11px] font-bold text-gold`}>TOTAL</span>
                    <span className={`${cinzel.className} text-[20px] text-gold`}>₹3,368</span>
                </div>
                <div className="h-px w-full bg-gold/10" />
                <span className={`${cinzel.className} text-[9px] font-bold tracking-[0.3em] text-text-muted`}>CONFIRMATION SENT TO</span>
                <span className={`${raleway.className} text-[13px] text-text-primary`}>arjun@gmail.com</span>
                <span className={`${raleway.className} text-[12px] text-text-muted`}>
                    Check your inbox for order details and tracking updates.
                </span>
                <div className="h-px w-full bg-gold/10" />
                <span className={`${cinzel.className} text-[9px] font-bold tracking-[0.3em] text-text-muted`}>NEED HELP?</span>
                <span className={`${cinzel.className} text-[9px] font-semibold tracking-[0.2em] text-gold`}>CONTACT SUPPORT →</span>
                <span className={`${cinzel.className} text-[9px] font-semibold tracking-[0.2em] text-text-muted`}>TRACK MY ORDER →</span>
                <span className={`${cinzel.className} text-[9px] font-semibold tracking-[0.2em] text-text-muted`}>RETURN POLICY →</span>
            </div>
        </div>
    );
}

export default function CheckoutContent({ step }: { step: CheckoutStepKey }) {
    if (step === "payment") {
        return <PaymentContent />;
    }

    if (step === "confirmation") {
        return <ConfirmationContent />;
    }

    return <DeliveryContent />;
}
