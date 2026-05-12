import type { Metadata } from "next";
import Image from "next/image";
import { Cinzel } from "next/font/google";

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn the story behind Albaeon — a brand rooted in mythology, ancient iconography, and the architecture of forgotten worlds.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://albaeon.com'}/about`,
  },
  openGraph: {
    title: 'About Albaeon',
    description: 'Learn the story behind Albaeon — a brand rooted in mythology and ancient iconography.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://albaeon.com'}/about`,
    images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'About Albaeon' }],
  },
};

export const revalidate = 3600;

const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const coreValues = [
    {
        title: "Mythic Identity",
        body: "Symbol-driven design language rooted in timeless stories.",
    },
    {
        title: "Architectural Form",
        body: "Precise construction and silhouette discipline for every piece.",
    },
    {
        title: "Global Craft",
        body: "Designed for international wearability across climates and cities.",
    },
];

function ValueCard({
    title,
    body,
}: {
    title: string;
    body: string;
}) {
    return (
        <div className="flex flex-col gap-2.5 border border-gold bg-surface p-4 sm:p-5">
            <h2 className={`${cinzel.className} text-[18px] text-gold sm:text-[24px] lg:text-[28px]`}>
                {title}
            </h2>
            <p className="font-sans text-[11px] leading-[1.5] text-text-primary sm:text-[13px] lg:text-[14px]">
                {body}
            </p>
        </div>
    );
}

export default function AboutPage() {
    return (
        <section className="min-h-screen bg-primary animate-fadeInUp">
            <div className="desktop-frame flex flex-col gap-6 py-5 sm:py-8 lg:gap-7 lg:py-12">
                <div className="space-y-2.5">
                    <h1 className={`${cinzel.className} text-[34px] text-gold sm:text-[46px] lg:text-[56px]`}>
                        About Albaeon
                    </h1>
                    <p className="max-w-[920px] w-full mx-auto px-5 font-sans text-[12px] leading-[1.4] text-text-muted sm:text-[15px] lg:text-[18px] lg:leading-[1.5]">
                        Albaeon is an international clothing brand built on myth, structure, and premium modern craft.
                    </p>
                </div>

                <div className="grid gap-4 lg:grid-cols-[minmax(0,560px)_minmax(0,1fr)] lg:items-center lg:gap-7">
                    <div className="relative h-[220px] overflow-hidden border border-gold sm:h-[320px] lg:h-[460px]">
                        <Image
                            src="/about-contact/about-image.png"
                            alt="About Albaeon"
                            fill
                            priority
                            sizes="(max-width: 1024px) 100vw, 560px"
                            className="object-cover"
                        />
                    </div>

                    <div className="space-y-4">
                        <p className="font-sans text-[12px] leading-[1.5] text-text-primary sm:text-[14px] lg:text-[16px] lg:leading-[1.6]">
                            Our collections are inspired by ancient forms, imperial silhouettes, and contemporary urban movement. We design for people who cross cultures without losing identity.
                        </p>
                        <p className="font-sans text-[12px] leading-[1.5] text-text-primary sm:text-[14px] lg:text-[16px] lg:leading-[1.6]">
                            From concept to material selection, every garment carries a language of controlled power: dark structure, gold authority, and clean readability.
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className={`${cinzel.className} text-[28px] text-gold sm:text-[34px] lg:text-[40px]`}>
                        Core Values
                    </h2>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
                        {coreValues.map((value) => (
                            <ValueCard
                                key={value.title}
                                title={value.title}
                                body={value.body}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
