import Image from "next/image";
import Link from "next/link";
import { Cinzel, Raleway } from "next/font/google";
import { ArrowLeft, CheckCircle2, Lock } from "lucide-react";
import CheckoutContent from "@/components/customer/checkout/CheckoutContent";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "600", "700"] });
const raleway = Raleway({ subsets: ["latin"], weight: ["300", "400", "500", "600"] });

export type CheckoutStepKey = "delivery" | "payment" | "confirmation";

function CheckoutNavbar({ step }: { step: CheckoutStepKey }) {
    const isConfirmation = step === "confirmation";
    const backLink = step === "payment" ? "/checkout/delivery" : "/cart";
    const backLabel = step === "payment" ? "BACK TO DELIVERY" : "BACK TO CART";

    return (
        <div className="flex h-[88px] items-center justify-between border-b border-gold/10 bg-nav px-16">
            {isConfirmation ? (
                <div className="h-px w-[133px]" />
            ) : (
                <Link href={backLink} className="flex items-center gap-2 text-text-muted">
                    <ArrowLeft className="h-[15px] w-[15px]" />
                    <span className={`${cinzel.className} text-[15px] font-semibold tracking-[0.3em]`}>
                        {backLabel}
                    </span>
                </Link>
            )}

            <Image src="/g3.png" alt="Albaeon" width={153} height={35} priority />

            {isConfirmation ? (
                <div className="flex items-center gap-2 text-[#4CAF7D]">
                    <CheckCircle2 className="h-[16px] w-[16px]" />
                    <span className={`${raleway.className} text-[15px] font-light`}>
                        Order Confirmed
                    </span>
                    <div className="h-[16px] w-px bg-gold/20" />
                    <div className="flex h-5 w-[68px] items-center justify-center border border-gold/20 text-[12px] text-text-muted">
                        Razorpay
                    </div>
                </div>
            ) : (
                <div className="flex items-center gap-2 text-text-muted">
                    <Lock className="h-[16px] w-[16px]" />
                    <span className={`${raleway.className} text-[15px] font-light`}>
                        Secure Checkout
                    </span>
                    <div className="h-[18px] w-px bg-gold/20" />
                    <div className="flex h-5 w-[68px] items-center justify-center border border-gold/20 text-[12px] text-text-muted">
                        Razorpay
                    </div>
                </div>
            )}
        </div>
    );
}

function StepBadge({ label, state }: { label: string; state: "active" | "inactive" | "done" }) {
    const isDone = state === "done";
    const isActive = state === "active";

    const circleClass = isDone
        ? "border border-[#4CAF7D] bg-[#4CAF7D1A] text-[#4CAF7D]"
        : isActive
            ? "bg-gold text-nav"
            : "border border-text-muted/30 text-text-muted";

    const labelClass = isDone
        ? "text-[#4CAF7D]"
        : isActive
            ? "text-gold"
            : "text-text-muted";

    return (
        <div className="flex items-center gap-2">
            <div className={`flex h-6 w-6 items-center justify-center text-[11px] font-bold ${circleClass}`}>
                {isDone ? "✓" : label === "DELIVERY" ? "1" : label === "PAYMENT" ? "2" : "3"}
            </div>
            <span className={`${cinzel.className} text-[10px] font-semibold tracking-[0.3em] ${labelClass}`}>
                {label}
            </span>
        </div>
    );
}

function Connector({ variant }: { variant: "solid" | "dashed" | "done" }) {
    if (variant === "dashed") {
        return <div className="w-20 border-t border-dashed border-text-muted/30" />;
    }

    return (
        <div className={`h-px w-20 ${variant === "done" ? "bg-[#4CAF7D]" : "bg-gold"}`} />
    );
}

function CheckoutSteps({ step }: { step: CheckoutStepKey }) {
    const states: Array<"active" | "inactive" | "done"> =
        step === "delivery"
            ? ["active", "inactive", "inactive"]
            : step === "payment"
                ? ["done", "active", "inactive"]
                : ["done", "done", "done"];

    return (
        <div className="flex h-[52px] items-center justify-center border-b border-gold/10 bg-primary-deep px-16">
            <div className="flex items-center gap-4">
                <StepBadge label="DELIVERY" state={states[0]} />
                <Connector variant={states[0] === "done" ? "done" : "solid"} />
                <StepBadge label="PAYMENT" state={states[1]} />
                <Connector variant={states[1] === "done" ? "done" : "dashed"} />
                <StepBadge label="CONFIRMATION" state={states[2]} />
            </div>
        </div>
    );
}

function CheckoutFooter({ step }: { step: CheckoutStepKey }) {
    if (step === "confirmation") {
        return (
            <footer className="mt-12 border-t border-gold/10 bg-footer px-16 py-14">
                <div className="mx-auto flex w-full max-w-[1312px] flex-col gap-10">
                    <div className="grid gap-10 lg:grid-cols-[320px_repeat(3,1fr)] lg:gap-20">
                        <div className="space-y-2">
                            <span className={`${cinzel.className} text-[24px] font-bold text-gold`}>ALBAEON</span>
                            <p className={`${raleway.className} text-[13px] text-text-muted`}>
                                Mythic architecture for modern wardrobes.
                            </p>
                        </div>
                        {[
                            {
                                title: "Company",
                                links: ["Shop", "About", "Cart", "My Account"],
                            },
                            {
                                title: "Policies",
                                links: ["Privacy Policy", "Terms", "Return & Refund", "Shipping Policy"],
                            },
                            {
                                title: "Support",
                                links: ["Contact Us", "Order Tracking"],
                            },
                        ].map((col) => (
                            <div key={col.title} className="space-y-2">
                                <span className={`${cinzel.className} text-[18px] text-gold`}>{col.title}</span>
                                {col.links.map((link) => (
                                    <span key={link} className={`${raleway.className} block text-[13px] text-text-muted`}>
                                        {link}
                                    </span>
                                ))}
                            </div>
                        ))}
                    </div>

                    <div className="h-px w-full bg-gold/10" />

                    <div className="flex flex-wrap items-center justify-between gap-3 text-[12px] text-text-muted">
                        <span>&copy; 2026 Albaeon. All Rights Reserved.</span>
                        <span>Privacy Policy · Terms · Shipping Policy</span>
                    </div>
                </div>
            </footer>
        );
    }

    return (
        <footer className="flex h-[52px] items-center justify-between border-t border-gold/10 bg-footer px-16 text-[11px] text-text-muted">
            <span>&copy; 2026 Albaeon. All Rights Reserved.</span>
            <span>Privacy Policy · Terms · Shipping Policy</span>
            <div className="flex items-center gap-2">
                <Lock className="h-[11px] w-[11px]" />
                <span>Secure Checkout</span>
            </div>
        </footer>
    );
}

export default function CheckoutShell({
    activeStep,
}: {
    title: string;
    subtitle: string;
    activeStep: CheckoutStepKey;
    children: React.ReactNode;
}) {
    return (
        <section className="min-h-screen bg-primary text-text-primary">
            <CheckoutNavbar step={activeStep} />
            <CheckoutSteps step={activeStep} />
            <div className={`px-16 ${activeStep === "confirmation" ? "pt-14" : "pt-12"} pb-20`}>
                <div className="mx-auto w-full max-w-[1312px]">
                    <CheckoutContent step={activeStep} />
                </div>
            </div>
            <CheckoutFooter step={activeStep} />
        </section>
    );
}
