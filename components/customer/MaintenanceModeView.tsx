import Image from "next/image";
import Link from "next/link";
import { Cinzel, Cormorant_Garamond, Raleway } from "next/font/google";
import { Instagram, MapPin, MessageCircle } from "lucide-react";
import MaintenanceWatcher from "@/components/customer/MaintenanceWatcher";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });
const raleway = Raleway({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

const serviceStatuses = [
    { label: "Payments", value: "Operational", dotClassName: "bg-[#4CAF7D]", valueClassName: "text-[#4CAF7D]" },
    { label: "Storefront", value: "Maintenance", dotClassName: "bg-[#E6A817]", valueClassName: "text-[#E6A817]" },
    { label: "Order Tracking", value: "Maintenance", dotClassName: "bg-[#E6A817]", valueClassName: "text-[#E6A817]" },
    { label: "Support Email", value: "Available", dotClassName: "bg-[#4CAF7D]", valueClassName: "text-[#4CAF7D]" },
];

const mobileServiceStatuses = [
    { label: "Payments", value: "Operational", dotClassName: "bg-[#4CAF7D]", valueClassName: "text-[#4CAF7D]" },
    { label: "Store", value: "Maintenance", dotClassName: "bg-[#E6A817]", valueClassName: "text-[#E6A817]" },
    { label: "Tracking", value: "Maintenance", dotClassName: "bg-[#E6A817]", valueClassName: "text-[#E6A817]" },
    { label: "Support", value: "Available", dotClassName: "bg-[#4CAF7D]", valueClassName: "text-[#4CAF7D]" },
];

function MaintenanceSigil({ mobile = false }: { mobile?: boolean }) {
    const outerSize = mobile ? "h-20 w-20" : "h-[100px] w-[100px]";
    const innerInset = mobile ? "inset-3" : "inset-[14px]";
    const baseWidth = mobile ? "w-6" : "w-[30px]";
    const sideWidth = mobile ? "w-[18px]" : "w-[22px]";
    const topY = mobile ? "top-[26px]" : "top-8";
    const topBaseLeft = mobile ? "left-7" : "left-[35px]";
    const topRightLeft = mobile ? "left-[52px]" : "left-[65px]";
    const centerDot = mobile ? "left-[38px] top-[39px] h-1 w-1" : "left-12 top-12 h-1 w-1";
    const bottomY = mobile ? "top-[54px]" : "top-[68px]";

    return (
        <div className={`relative ${outerSize}`}>
            <div className="absolute inset-0 rounded-full border border-[#E6C97933] bg-[#130F1899]" />
            <div className={`absolute ${innerInset} rounded-full border border-[#E6C9791A]`} />
            <span className={`absolute ${topBaseLeft} ${topY} h-px ${baseWidth} bg-gold`} />
            <span className={`absolute ${topBaseLeft} ${topY} h-px ${sideWidth} rotate-[49deg] bg-gold`} />
            <span className={`absolute ${topRightLeft} ${topY} h-px ${sideWidth} rotate-[131deg] bg-gold`} />
            <span className={`absolute ${topBaseLeft} ${bottomY} h-px ${baseWidth} bg-gold`} />
            <span className={`absolute ${topBaseLeft} ${bottomY} h-px ${sideWidth} rotate-[311deg] bg-gold`} />
            <span className={`absolute ${topRightLeft} ${bottomY} h-px ${sideWidth} rotate-[229deg] bg-gold`} />
            <span className={`absolute ${centerDot} rounded-full bg-gold`} />
        </div>
    );
}

const socialLinks = [
    { name: "Instagram", href: "#", Icon: Instagram },
    { name: "Location", href: "#", Icon: MapPin },
    { name: "Messages", href: "#", Icon: MessageCircle },
];

function DesktopStatusStrip() {
    return (
        <>
            <div className="absolute inset-x-0 bottom-12 hidden h-[62px] items-center justify-center border-t border-[#E6C9790F] bg-[#0A081099] px-16 md:flex">
                <div className="flex items-center gap-8">
                    {serviceStatuses.map((status, index) => (
                        <div key={status.label} className="flex items-center gap-8">
                            <div className={`flex items-center gap-2 ${raleway.className} text-[12px] font-light`}>
                                <span className={`h-2 w-2 rounded-full ${status.dotClassName}`} aria-hidden="true" />
                                <span className="text-text-muted">{status.label}</span>
                                <span className={status.valueClassName}>{status.value}</span>
                            </div>
                            {index < serviceStatuses.length - 1 ? (
                                <span className="h-4 w-px bg-[#E6C9791A]" aria-hidden="true" />
                            ) : null}
                        </div>
                    ))}
                </div>
            </div>

            <div className={`absolute inset-x-0 bottom-0 hidden h-12 items-center justify-between border-t border-[#E6C9790F] bg-[#0A0810E6] px-16 md:flex ${raleway.className} text-[11px] font-light text-text-muted`}>
                <p>&copy; 2026 Albaeon. All Rights Reserved.</p>
                <div className="flex items-center gap-2" aria-hidden="true">
                    <span className="h-1 w-1 rotate-45 bg-[#E6C97933]" />
                    <span className="h-1 w-1 rotate-45 bg-[#E6C97933]" />
                    <span className="h-1 w-1 rotate-45 bg-[#E6C97933]" />
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/privacy-policy" className="transition-colors duration-200 hover:text-gold">
                        Privacy Policy
                    </Link>
                    <Link href="/terms" className="transition-colors duration-200 hover:text-gold">
                        Terms
                    </Link>
                </div>
            </div>
        </>
    );
}

function DesktopLowerMeta() {
    return (
        <div className="absolute left-1/2 top-[651px] hidden w-[320px] -translate-x-1/2 flex-col items-center gap-2.5 text-center md:flex">
            <p className={`${cinzel.className} text-[9px] font-bold tracking-[0.4em] text-text-muted`}>
                FOLLOW ALBAEON
            </p>

            <div className="flex items-center gap-5 text-text-muted">
                {socialLinks.map(({ name, href, Icon }) => (
                    <a
                        key={name}
                        href={href}
                        aria-label={name}
                        className="flex h-10 w-10 items-center justify-center border border-[#E6C9791F] transition-colors duration-200 hover:border-[#E6C97940] hover:text-gold"
                    >
                        <Icon className="h-[18px] w-[18px]" strokeWidth={1.7} />
                    </a>
                ))}
            </div>

            <div className="h-px w-[200px] bg-[#E6C97914]" />

            <p className={`${raleway.className} text-[13px] font-light text-text-muted`}>
                Need urgent help?
            </p>
            <a
                href="mailto:support@albaeon.com"
                className={`${cinzel.className} text-[9px] font-semibold tracking-[0.1em] text-gold transition-colors duration-200 hover:text-gold-hover`}
            >
                CONTACT US AT SUPPORT@ALBAEON.COM
            </a>
        </div>
    );
}

function MobileStatusGrid() {
    return (
        <div className="grid w-full grid-cols-2 gap-2">
            {mobileServiceStatuses.map((status) => (
                <div
                    key={status.label}
                    className="space-y-1 border border-[#E6C97914] bg-[#0A081099] px-[14px] py-[10px] text-left"
                >
                    <div className={`flex items-center gap-2 ${raleway.className} text-[11px] font-light text-text-muted`}>
                        <span className={`h-2 w-2 rounded-full ${status.dotClassName}`} aria-hidden="true" />
                        <span>{status.label}</span>
                    </div>
                    <p className={`${raleway.className} text-[11px] ${status.valueClassName}`}>
                        {status.value}
                    </p>
                </div>
            ))}
        </div>
    );
}

export default function MaintenanceModeView() {
    return (
        <div className="relative overflow-x-hidden bg-[#0F0C14] text-text-primary">
            <MaintenanceWatcher when="disabled" />
            <div className="absolute inset-0 hidden md:block">
                <Image
                    src="/maintenance/maintenance-desktop.png"
                    alt=""
                    fill
                    priority
                    className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,8,16,0.58)_0%,rgba(10,8,16,0.28)_32%,rgba(10,8,16,0.76)_100%)]" />
            </div>

            <div className="absolute inset-0 md:hidden">
                <Image
                    src="/maintenance/maintenance-desktop.png"
                    alt=""
                    fill
                    priority
                    className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,8,16,0.45)_0%,rgba(10,8,16,0.18)_30%,rgba(10,8,16,0.78)_100%)]" />
            </div>

            <div className="relative z-10 hidden h-screen min-h-[900px] md:block">
                <div className={`absolute inset-x-0 top-0 flex h-[60px] items-center justify-between border-b border-[#E6C97914] bg-[#130F18CC] px-16 ${raleway.className}`}>
                    <div className="flex items-center gap-2.5">
                        <span className="h-1.5 w-1.5 bg-gold" aria-hidden="true" />
                        <Image
                            src="/g3.png"
                            alt="Albaeon"
                            width={96}
                            height={21}
                            priority
                            unoptimized
                            className="h-[21px] w-24 object-contain"
                        />
                    </div>

                    <div className="flex items-center gap-2 text-[12px] font-light text-[#E6A817]">
                        <span className="relative flex h-[14px] w-[14px] items-center justify-center">
                            <span className="absolute h-[14px] w-[14px] rounded-full border border-[#E6A8174D]" />
                            <span className="h-2 w-2 rounded-full bg-[#E6A817]" />
                        </span>
                        <span>Under Maintenance</span>
                    </div>
                </div>

                <div className="absolute left-1/2 top-[235px] flex w-[680px] -translate-x-1/2 flex-col items-center text-center">
                    <MaintenanceSigil />

                    <div className={`mt-3 flex items-center gap-3 ${cinzel.className}`}>
                        <span className="h-px w-10 bg-[#E6C97940]" aria-hidden="true" />
                        <span className="text-[9px] font-bold tracking-[0.6em] text-gold">
                            MAINTENANCE MODE
                        </span>
                        <span className="h-px w-10 bg-[#E6C97940]" aria-hidden="true" />
                    </div>

                    <div className={`mt-3 flex flex-col items-center ${cormorant.className} text-[52px] font-light leading-none`}>
                        <span className="text-text-muted">We Are</span>
                        <span className="text-text-primary">Rebuilding</span>
                        <span className="text-gold">The Temple.</span>
                    </div>

                    <p className={`${cormorant.className} mt-4 whitespace-pre-line text-[18px] font-light italic leading-[1.6] text-text-muted`}>
                        {"Albaeon is currently undergoing scheduled maintenance.\nWe will return shortly, better than before."}
                    </p>

                    <div className="mt-4 h-px w-[60px] bg-gold" />
                </div>

                <DesktopLowerMeta />
                <DesktopStatusStrip />
            </div>

            <div className="relative z-10 h-screen min-h-[844px] md:hidden">
                <div className={`absolute inset-x-0 top-0 flex h-14 items-center justify-between border-b border-[#E6C97914] bg-[#130F18CC] px-[50px] ${raleway.className}`}>
                    <span className={`${cinzel.className} text-[18px] font-bold tracking-[0.06em] text-gold`}>
                        ALBAEON
                    </span>
                    <div className="flex items-center gap-1.5 text-[11px] font-light text-[#E6A817]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#E6A817]" aria-hidden="true" />
                        <span>Maintenance</span>
                    </div>
                </div>

                <div className="absolute left-5 top-[211px] flex w-[350px] flex-col items-center text-center">
                    <MaintenanceSigil mobile />

                    <div className={`mt-3 flex items-center gap-3 ${cinzel.className}`}>
                        <span className="h-px w-6 bg-[#E6C97940]" aria-hidden="true" />
                        <span className="text-[8px] font-bold tracking-[0.4em] text-gold">
                            MAINTENANCE MODE
                        </span>
                        <span className="h-px w-6 bg-[#E6C97940]" aria-hidden="true" />
                    </div>

                    <div className={`mt-3 flex flex-col items-center ${cormorant.className} font-light leading-none`}>
                        <span className="text-[40px] text-text-muted">We Are</span>
                        <span className="text-[48px] text-text-primary">Rebuilding</span>
                        <span className="text-[40px] text-gold">The Temple.</span>
                    </div>

                    <p className={`${cormorant.className} mt-3 whitespace-pre-line text-[16px] font-light italic leading-[1.6] text-text-muted`}>
                        {"Albaeon is currently undergoing scheduled\nmaintenance. We will return shortly."}
                    </p>

                    <div className="mt-3 h-px w-12 bg-gold" />

                    <p className={`${cinzel.className} mt-4 text-[8px] font-bold tracking-[0.3em] text-gold`}>
                        GET NOTIFIED WHEN WE&apos;RE BACK
                    </p>
                    <p className={`${raleway.className} mt-1 text-[11px] font-light leading-[1.7] text-text-muted`}>
                        Leave your email for a return alert.
                    </p>
                </div>

                <div className="absolute left-5 top-[688px] w-[350px]">
                    <MobileStatusGrid />
                </div>

                <div className={`absolute inset-x-0 bottom-0 flex h-[52px] items-center justify-center gap-[200px] border-t border-[#E6C9790F] bg-[#0A0810E6] ${raleway.className} text-[11px] font-light text-text-muted`}>
                    <p>&copy; 2026 Albaeon.</p>
                    <p>
                        <Link href="/privacy-policy" className="transition-colors duration-200 hover:text-gold">
                            Privacy
                        </Link>
                        {" \u00b7 "}
                        <Link href="/terms" className="transition-colors duration-200 hover:text-gold">
                            Terms
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
