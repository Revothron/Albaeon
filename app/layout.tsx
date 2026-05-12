import type { Metadata } from "next";
import { Manrope, Geist_Mono } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: 'Albaeon — Mythology Meets Modern Streetwear',
    template: '%s | Albaeon',
  },
  description: 'Premium print-on-demand clothing rooted in mythology, ancient iconography, and dark architectural aesthetics. Crafted for those who wear meaning.',
  keywords: ['albaeon', 'mythology clothing', 'dark streetwear', 'print on demand', 'ancient iconography', 'premium apparel'],
  authors: [{ name: 'Albaeon' }],
  creator: 'Albaeon',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://albaeon.com'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://albaeon.com',
    siteName: 'Albaeon',
    title: 'Albaeon — Mythology Meets Modern Streetwear',
    description: 'Premium print-on-demand clothing rooted in mythology, ancient iconography, and dark architectural aesthetics.',
    images: [
      {
        url: '/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Albaeon — Mythology Meets Modern Streetwear',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Albaeon — Mythology Meets Modern Streetwear',
    description: 'Premium print-on-demand clothing rooted in mythology, ancient iconography, and dark architectural aesthetics.',
    images: ['/og-default.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
