import type { Metadata } from 'next'

export const revalidate = false;

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Read the Albaeon terms and conditions governing use of our website and purchase of our products.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://albaeon.com'}/terms`,
  },
  robots: { index: true, follow: false },
};

export default function TermsPage() {
    return (
        <div className="bg-primary min-h-screen animate-fadeInUp">
            <div className="max-w-3xl mx-auto px-10 py-16 md:px-10 px-5 py-10">
                <h1 className="text-gold text-3xl font-bold tracking-wider uppercase mb-8 text-center">
                    Terms &amp; Conditions
                </h1>
                <div className="text-text-muted text-sm leading-[1.8] space-y-4">
                    <p>Terms and conditions content will be added here.</p>
                </div>
            </div>
        </div>
    );
}
