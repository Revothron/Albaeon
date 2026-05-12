import type { Metadata } from 'next'

export const revalidate = false;

export const metadata: Metadata = {
  title: 'Shipping Policy',
  description: 'Albaeon shipping policy — delivery timelines, carriers, and international shipping information.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://albaeon.com'}/shipping-policy`,
  },
  robots: { index: true, follow: false },
};

export default function ShippingPolicyPage() {
    return (
        <div className="bg-primary min-h-screen animate-fadeInUp">
            <div className="max-w-3xl mx-auto px-10 py-16 md:px-10 px-5 py-10">
                <h1 className="text-gold text-3xl font-bold tracking-wider uppercase mb-8 text-center">
                    Shipping Policy
                </h1>
                <div className="text-text-muted text-sm leading-[1.8] space-y-4">
                    <p>Shipping policy content will be added here.</p>
                </div>
            </div>
        </div>
    );
}
