import Link from "next/link";

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

export default function Footer() {
    return (
        <footer className="bg-footer border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* ── Logo ── */}
                    <div>
                        <Link
                            href="/"
                            className="text-gold text-xl font-bold tracking-[0.2em] uppercase"
                        >
                            Albaeon
                        </Link>
                        <p className="mt-4 text-text-muted text-sm leading-relaxed">
                            Ancient empire meets architectural fashion.
                        </p>
                    </div>

                    {/* ── Company ── */}
                    <div>
                        <h4 className="text-text-primary text-sm font-semibold tracking-wider uppercase mb-5">
                            Company
                        </h4>
                        <ul className="space-y-3">
                            {companyLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-text-muted text-sm hover:text-gold transition-colors duration-300"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* ── Policies ── */}
                    <div>
                        <h4 className="text-text-primary text-sm font-semibold tracking-wider uppercase mb-5">
                            Policies
                        </h4>
                        <ul className="space-y-3">
                            {policyLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-text-muted text-sm hover:text-gold transition-colors duration-300"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* ── Support ── */}
                    <div>
                        <h4 className="text-text-primary text-sm font-semibold tracking-wider uppercase mb-5">
                            Support
                        </h4>
                        <ul className="space-y-3">
                            {supportLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-text-muted text-sm hover:text-gold transition-colors duration-300"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* ── Bottom Bar ── */}
            <div className="border-t border-white/5 px-6 py-6">
                <p className="text-center text-text-muted text-xs tracking-wider">
                    © 2026 Albaeon. All Rights Reserved.
                </p>
            </div>
        </footer>
    );
}
