import type { Metadata } from 'next'

export const revalidate = false;

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Read the Albaeon privacy policy — how we collect, use, and protect your personal data.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://albaeon.com'}/privacy-policy`,
  },
  robots: { index: true, follow: false },
};

export default function PrivacyPolicyPage() {
    return (
        <div className="bg-primary min-h-screen animate-fadeInUp">
            <div className="max-w-3xl mx-auto px-10 py-16 md:px-10 px-5 py-10">
                <h1 className="text-gold text-3xl font-bold tracking-wider uppercase mb-8 text-center">
                    Privacy Policy
                </h1>
                <div className="text-text-muted text-sm leading-[1.8] space-y-4">
                    <p>Privacy policy content will be added here.</p>
                </div>
            </div>
        </div>
    );
}
