"use client";

import Image from "next/image";
import { useState } from "react";
import { Check, CircleAlert, Eye, EyeOff, Lock, Shield } from "lucide-react";
import { adminCinzel, adminCormorant, adminRaleway } from "@/components/admin/adminFonts";

const securityNotes = [
    {
        copy: "This panel is restricted to authorised Albaeon administrators only.",
        Icon: Shield,
    },
    {
        copy: "All login attempts are logged and monitored.",
        Icon: EyeOff,
    },
];

export default function AdminLoginView() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-screen bg-[#0F0C14] text-text-primary">
            <div className="mx-auto w-full max-w-[1440px] grid min-h-screen lg:h-screen lg:overflow-hidden lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,749px)_minmax(0,691px)]">
                <section className="relative overflow-hidden bg-[#0A0810] min-h-[320px] sm:min-h-[380px] lg:h-full lg:min-h-0">
                    <Image
                        src="/admin/admin-login-artwork.png"
                        alt=""
                        fill
                        priority
                        className="object-cover object-center opacity-90"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,8,16,0.08)_0%,rgba(10,8,16,0.28)_52%,rgba(10,8,16,0.52)_100%)]" />

                    <div className="relative flex h-full flex-col p-8 sm:p-10 lg:p-16">
                        <div className={`flex items-center gap-2.5 ${adminCinzel.className}`}>
                            <span className="h-1.5 w-1.5 bg-gold" aria-hidden="true" />
                            <span className="text-[9px] font-bold tracking-[0.5em] text-text-muted">
                                ALBAEON ADMIN
                            </span>
                        </div>

                        <div className="mt-auto max-w-[180px] space-y-4">
                            <p className={`${adminCinzel.className} text-[28px] font-bold tracking-[0.08em] text-gold`}>
                                ALBAEON
                            </p>
                            <div className="h-px w-12 bg-gold" />
                            <p className={`${adminCormorant.className} whitespace-pre-line text-[22px] font-light italic leading-[1.4] text-text-primary`}>
                                {"Authority requires\nno announcement."}
                            </p>
                            <p className={`${adminRaleway.className} whitespace-pre-line text-[13px] font-light leading-[1.8] text-text-muted`}>
                                {"Internal admin access only.\nAlbaeon operations panel."}
                            </p>
                        </div>

                        <div className={`mt-10 flex items-center gap-2 ${adminRaleway.className} text-[11px] font-light text-text-muted`}>
                            <Lock className="h-3 w-3" strokeWidth={1.7} />
                            <span>Secured connection - SSL encrypted</span>
                        </div>
                    </div>
                </section>

                <section className="relative bg-nav px-6 py-8 sm:px-10 lg:h-full lg:overflow-hidden lg:px-0">
                    <p className={`${adminRaleway.className} text-right text-[11px] font-light text-text-muted lg:absolute lg:right-8 lg:top-8`}>
                        &copy; 2026 Albaeon
                    </p>

                    <div className="mx-auto mt-8 w-full max-w-[380px] sm:mt-10 lg:mt-0 lg:flex lg:h-full lg:flex-col lg:justify-center lg:py-8">
                        <div className="space-y-[18px]">
                            <div className="space-y-3.5">
                                <div className={`flex items-center gap-2.5 ${adminCinzel.className}`}>
                                    <span className="h-1.5 w-1.5 bg-gold" aria-hidden="true" />
                                    <span className="text-[9px] font-bold tracking-[0.5em] text-text-muted">
                                        ADMIN PANEL
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    <h1 className={`${adminCormorant.className} text-[42px] font-light leading-none text-text-primary`}>
                                        Sign In
                                    </h1>
                                    <p className={`${adminRaleway.className} whitespace-pre-line text-[13px] font-light leading-[1.8] text-text-muted`}>
                                        {"Enter your credentials to access the\nAlbaeon operations panel."}
                                    </p>
                                </div>

                                <div className="h-px w-full bg-[#E6C97914]" />
                            </div>

                            <form className="space-y-[18px]" onSubmit={(event) => event.preventDefault()}>
                                <div className="space-y-2.5">
                                    <label className={`${adminCinzel.className} block text-[9px] font-bold tracking-[0.3em] text-text-muted`}>
                                        EMAIL ADDRESS
                                    </label>
                                    <div className="flex h-[46px] items-center justify-between border border-[#4CAF7D66] bg-footer px-4">
                                        <input
                                            type="email"
                                            defaultValue="admin@albaeon.com"
                                            className={`${adminRaleway.className} h-full w-full bg-transparent text-[14px] font-light text-text-primary outline-none`}
                                        />
                                        <Check className="h-3.5 w-3.5 shrink-0 text-[#4CAF7D]" strokeWidth={2.1} />
                                    </div>
                                </div>

                                <div className="space-y-2.5">
                                    <label className={`${adminCinzel.className} block text-[9px] font-bold tracking-[0.3em] text-text-muted`}>
                                        PASSWORD
                                    </label>
                                    <div className="flex h-[46px] items-center justify-between border border-[#E6C9791F] bg-footer px-4">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            defaultValue="albaeon-admin"
                                            className={`${adminRaleway.className} h-full w-full bg-transparent text-[14px] font-light text-text-primary outline-none`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((value) => !value)}
                                            className="text-text-muted transition-colors duration-200 hover:text-gold"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? <Eye className="h-3.5 w-3.5" strokeWidth={1.8} /> : <EyeOff className="h-3.5 w-3.5" strokeWidth={1.8} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex gap-2.5 border border-[#C0392B40] bg-[#C0392B0F] px-4 py-[14px]">
                                    <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border border-[#C0392B4D] bg-[#C0392B26]">
                                        <CircleAlert className="h-2.5 w-2.5 text-[#C0392B]" strokeWidth={2.2} />
                                    </span>
                                    <div className="space-y-1">
                                        <p className={`${adminCinzel.className} text-[10px] font-bold tracking-[0.2em] text-[#C0392B]`}>
                                            ACCESS DENIED
                                        </p>
                                        <p className={`${adminRaleway.className} text-[13px] font-light text-text-primary`}>
                                            Incorrect email or password. Please try again.
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className={`${adminCinzel.className} flex h-[52px] w-full items-center justify-center bg-gold text-[10px] font-semibold tracking-[0.4em] text-footer transition-colors duration-200 hover:bg-gold-hover`}
                                >
                                    SIGN IN TO ADMIN PANEL
                                </button>
                            </form>

                            <div className="flex items-center gap-3">
                                <div className="h-px flex-1 bg-[#E6C97914]" />
                                <span className="h-1.5 w-1.5 rotate-45 bg-gold" aria-hidden="true" />
                                <div className="h-px flex-1 bg-[#E6C97914]" />
                            </div>

                            <div className="space-y-0">
                                {securityNotes.map(({ copy, Icon }, index) => (
                                    <div
                                        key={copy}
                                        className={`flex items-center gap-2.5 py-3 ${
                                            index < securityNotes.length - 1 ? "border-b border-[#E6C9790F]" : ""
                                        }`}
                                    >
                                        <Icon className="h-3.5 w-3.5 shrink-0 text-text-muted" strokeWidth={1.8} />
                                        <p className={`${adminRaleway.className} text-[12px] font-light leading-[1.6] text-text-muted`}>
                                            {copy}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
