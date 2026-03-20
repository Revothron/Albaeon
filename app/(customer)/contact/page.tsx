import Image from "next/image";
import { Cinzel } from "next/font/google";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

function ContactField({
    placeholder,
    tall = false,
}: {
    placeholder: string;
    tall?: boolean;
}) {
    if (tall) {
        return (
            <textarea
                rows={6}
                placeholder={placeholder}
                className="h-[120px] w-full resize-none rounded-[10px] bg-primary-deep px-3 py-2.5 font-sans text-[12px] text-text-primary outline-none placeholder:text-text-muted sm:h-[181px] sm:px-4 sm:py-4 sm:text-[15px]"
            />
        );
    }

    return (
        <input
            type="text"
            placeholder={placeholder}
            className="w-full rounded-[10px] bg-primary-deep px-3 font-sans text-[12px] text-text-primary outline-none placeholder:text-text-muted sm:px-4 sm:text-[15px]"
        />
    );
}

export default function ContactPage() {
    return (
        <section className="min-h-screen bg-primary">
            <div className="desktop-frame flex flex-col gap-6 py-5 sm:py-8 lg:gap-6 lg:py-12">
                <div className="space-y-2.5">
                    <h1 className={`${cinzel.className} text-[34px] text-gold sm:text-[46px] lg:text-[56px]`}>
                        Contact Us
                    </h1>
                    <p className="font-sans text-[12px] text-text-muted sm:text-[14px] lg:text-[16px]">
                        We reply within 24 hours across all international regions.
                    </p>
                </div>

                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)] lg:gap-5">
                    <div className="space-y-3.5 rounded-[10px] border border-gold bg-surface p-3 sm:p-5">
                        <ContactField placeholder="Full Name" />
                        <ContactField placeholder="Email Address" />
                        <ContactField placeholder="Message" tall />
                        <button
                            type="button"
                            className="inline-flex h-[38px] items-center justify-center self-start rounded-[20px] bg-gold px-4 font-sans text-[12px] font-bold text-nav transition-colors duration-200 hover:bg-gold-hover sm:h-[50px] sm:px-6 sm:text-[15px]"
                        >
                            Send Message
                        </button>
                    </div>

                    <div className="space-y-4 border border-gold bg-surface p-3 sm:p-5">
                        <div className="space-y-2">
                            <h2 className={`${cinzel.className} text-[24px] text-gold sm:text-[28px] lg:text-[34px]`}>
                                Support
                            </h2>
                            <p className="whitespace-pre-line font-sans text-[12px] leading-[1.6] text-text-primary sm:text-[14px] sm:leading-[1.8] lg:text-[15px]">
                                {"Email: support@albaeon.com\nHours: Mon-Sat, 8AM-8PM UTC\nHead Office: Kerala, India"}
                            </p>
                        </div>

                        <div className="relative h-[120px] overflow-hidden bg-primary-deep sm:h-[180px] lg:h-[220px]">
                            <Image
                                src="/about-contact/contact-support.png"
                                alt="Albaeon support"
                                fill
                                sizes="(max-width: 1024px) 100vw, 400px"
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

