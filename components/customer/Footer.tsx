import Image from "next/image";
import Link from "next/link";
import { Cinzel } from "next/font/google";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const companyLinks = [
    { name: "Shop", href: "/shop" },
    { name: "About", href: "/about" },
    { name: "Cart", href: "/cart" },
    { name: "My Account", href: "/account" },
];

const policyLinks = [
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms & Conditions", href: "/terms" },
    { name: "Return & Refund Policy", href: "/return-policy" },
    { name: "Shipping Policy", href: "/shipping-policy" },
];

const supportLinks = [
    { name: "Contact Us", href: "/contact" },
    { name: "Order Tracking", href: "/track-order" },
];

function InstagramIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2.75" y="2.75" width="18.5" height="18.5" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
        </svg>
    );
}

function FacebookIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h-2a4 4 0 0 0-4 4v3H6v4h3v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h2V3z" />
        </svg>
    );
}

function XIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4l16 16" />
            <path d="M20 4 4 20" />
        </svg>
    );
}

const socialLinks = [
    { name: "Instagram", href: "#", Icon: InstagramIcon },
    { name: "Facebook", href: "#", Icon: FacebookIcon },
    { name: "X", href: "#", Icon: XIcon },
];

const footerColumns = [
    { title: "Company", links: companyLinks, widthClassName: "lg:w-[180px]" },
    { title: "Policies", links: policyLinks, widthClassName: "lg:w-[260px]" },
    { title: "Support", links: supportLinks, widthClassName: "lg:w-[220px]" },
];

export default function Footer() {
    return (
        <footer className="bg-footer">
            <div className="mx-auto flex max-w-[1440px] flex-col gap-9 px-6 py-14 sm:px-10 lg:px-14">
                <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
                    <div className="flex max-w-[283px] flex-col items-center gap-3.5 text-center lg:items-start lg:text-left">
                        <Link href="/" aria-label="Albaeon home">
                            <Image
                                src="/path1.png"
                                alt="Albaeon monogram"
                                width={77}
                                height={66}
                                priority
                                className="h-auto w-[77px]"
                            />
                        </Link>

                        <p className="max-w-[280px] text-[14px] leading-[1.4] text-text-muted">
                            Mythic architecture for modern wardrobes.
                        </p>

                        <div className="flex items-center gap-3.5 text-text-muted">
                            {socialLinks.map(({ name, href, Icon }) => (
                                <a
                                    key={name}
                                    href={href}
                                    aria-label={name}
                                    className="transition-colors duration-200 hover:text-gold"
                                >
                                    <Icon />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="grid gap-10 sm:grid-cols-2 lg:flex lg:gap-14">
                        {footerColumns.map(({ title, links, widthClassName }) => (
                            <div key={title} className={`text-center lg:text-left ${widthClassName}`}>
                                <h2 className={`${cinzel.className} text-[24px] font-normal text-gold`}>
                                    {title}
                                </h2>

                                <ul className="mt-2.5">
                                    {links.map((link) => (
                                        <li key={link.name}>
                                            <Link
                                                href={link.href}
                                                className="font-sans text-[14px] leading-[1.9] text-text-primary transition-colors duration-200 hover:text-gold"
                                            >
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="text-center font-sans text-[13px] text-text-muted lg:text-left">
                    © 2026 Albaeon. All Rights Reserved.
                </p>
            </div>
        </footer>
    );
}
