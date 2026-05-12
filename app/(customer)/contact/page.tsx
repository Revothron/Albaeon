export const revalidate = 3600;

'use client'

import type { Metadata } from 'next'
import Image from 'next/image'
import { Cinzel } from 'next/font/google'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Albaeon. We respond to all queries within 24-48 hours.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://albaeon.com'}/contact`,
  },
  openGraph: {
    title: 'Contact Albaeon',
    description: 'Get in touch with Albaeon. We respond to all queries within 24-48 hours.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://albaeon.com'}/contact`,
  },
};
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })

type FormState = 'idle' | 'loading' | 'success' | 'error'

const quickLinks = [
  { label: 'Track Your Order', href: '/track-order' },
  { label: 'Return & Refund Policy', href: '/return-policy' },
  { label: 'Shipping Policy', href: '/shipping-policy' },
  { label: 'My Orders', href: '/account/orders' },
]

const responseTimes = [
  { label: 'India Orders', time: '< 12 hrs' },
  { label: 'International', time: '< 24 hrs' },
  { label: 'Returns', time: '< 48 hrs' },
]

export default function ContactPage() {
  const supabase = createClient()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit() {
    if (!name.trim()) { setErrorMsg('Please enter your name.'); setFormState('error'); return }
    if (!email.trim() || !email.includes('@')) { setErrorMsg('Please enter a valid email.'); setFormState('error'); return }
    if (!message.trim()) { setErrorMsg('Please enter a message.'); setFormState('error'); return }

    setFormState('loading')
    setErrorMsg('')

    try {
      const { data: { user } } = await supabase.auth.getUser()

      const { data: ticket, error } = await supabase
        .from('support_tickets')
        .insert({
          user_id: user?.id ?? null,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          subject: subject.trim() || 'General Enquiry',
          message: message.trim(),
          status: 'unread',
          priority: 'normal',
        })
        .select('id')
        .single()

      if (error) throw error

      // Send auto-reply email
      await fetch('/api/support/autoreply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email.trim().toLowerCase(),
          customerName: name.trim(),
          subject: subject.trim() || 'General Enquiry',
          ticketId: ticket?.id ?? '',
        }),
      }).catch(console.error)

      setFormState('success')
      setName('')
      setEmail('')
      setSubject('')
      setMessage('')
    } catch (err) {
      console.error('Support ticket error:', err)
      setErrorMsg('Something went wrong. Please try again or email support@albaeon.com')
      setFormState('error')
    }
  }

  return (
    <section className="min-h-screen bg-primary animate-fadeInUp">
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

          {/* Form */}
          <div className="space-y-3.5 rounded-[10px] border border-gold bg-surface p-3 sm:p-5">

            {formState === 'success' && (
              <div className="space-y-1 border-l-[3px] border-[var(--status-success)] bg-[#4CAF7D10] px-4 py-4">
                <p className={`${cinzel.className} text-[14px] text-[var(--status-success)]`}>Message Sent</p>
                <p className="font-sans text-[13px] leading-[1.6] text-text-muted">
                  We received your message and will reply within 24 hours. Check your inbox for a confirmation.
                </p>
              </div>
            )}

            {formState === 'error' && errorMsg && (
              <div className="border-l-[3px] border-[var(--status-error)] bg-[#C0392B10] px-4 py-3">
                <p className="font-sans text-[13px] text-[var(--status-error)]">{errorMsg}</p>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="font-sans text-[10px] uppercase tracking-[0.2em] text-text-muted">
                Full Name *
              </label>
              <input
                type="text"
                placeholder="Arjun Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={formState === 'loading' || formState === 'success'}
                className="w-full rounded-[10px] bg-primary-deep px-3 py-2.5 font-sans text-[12px] text-text-primary outline-none placeholder:text-text-muted disabled:opacity-50 sm:px-4 sm:text-[15px]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-sans text-[10px] uppercase tracking-[0.2em] text-text-muted">
                Email Address *
              </label>
              <input
                type="email"
                placeholder="arjun@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={formState === 'loading' || formState === 'success'}
                className="w-full rounded-[10px] bg-primary-deep px-3 py-2.5 font-sans text-[12px] text-text-primary outline-none placeholder:text-text-muted disabled:opacity-50 sm:px-4 sm:text-[15px]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-sans text-[10px] uppercase tracking-[0.2em] text-text-muted">
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={formState === 'loading' || formState === 'success'}
                className="w-full rounded-[10px] bg-primary-deep px-3 py-2.5 font-sans text-[12px] text-text-primary outline-none disabled:opacity-50 sm:px-4 sm:text-[15px]"
              >
                <option value="">General Enquiry</option>
                <option value="Order Issue">Order Issue</option>
                <option value="Return / Exchange">Return / Exchange</option>
                <option value="Shipping Query">Shipping Query</option>
                <option value="Product Question">Product Question</option>
                <option value="Payment Issue">Payment Issue</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-sans text-[10px] uppercase tracking-[0.2em] text-text-muted">
                Message *
              </label>
              <textarea
                rows={6}
                placeholder="Describe your issue or question in detail..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={formState === 'loading' || formState === 'success'}
                className="h-[120px] w-full resize-none rounded-[10px] bg-primary-deep px-3 py-2.5 font-sans text-[12px] text-text-primary outline-none placeholder:text-text-muted disabled:opacity-50 sm:h-[181px] sm:px-4 sm:py-4 sm:text-[15px]"
              />
            </div>

            {formState !== 'success' && (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={formState === 'loading'}
                className="inline-flex h-[38px] items-center justify-center self-start rounded-[20px] bg-gold px-4 font-sans text-[12px] font-bold text-nav transition-colors duration-200 hover:bg-gold-hover disabled:cursor-not-allowed disabled:opacity-50 sm:h-[50px] sm:px-6 sm:text-[15px]"
              >
                {formState === 'loading' ? 'Sending...' : 'Send Message'}
              </button>
            )}

            {formState === 'success' && (
              <button
                type="button"
                onClick={() => setFormState('idle')}
                className="font-sans text-[13px] text-gold transition-colors hover:text-gold-hover"
              >
                Send another message
              </button>
            )}
          </div>

          {/* Support Info */}
          <div className="space-y-4 border border-gold bg-surface p-3 sm:p-5">
            <div className="space-y-2">
              <h2 className={`${cinzel.className} text-[24px] text-gold sm:text-[28px] lg:text-[34px]`}>
                Support
              </h2>
              <p className="whitespace-pre-line font-sans text-[12px] leading-[1.6] text-text-primary sm:text-[14px] sm:leading-[1.8] lg:text-[15px]">
                {'Email: support@albaeon.com\nHours: Mon-Sat, 8AM-8PM UTC\nHead Office: Kerala, India'}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {responseTimes.map((item) => (
                <div key={item.label} className="space-y-0.5 border border-gold/20 bg-primary-deep px-3 py-2">
                  <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-text-muted">{item.label}</p>
                  <p className={`${cinzel.className} text-[14px] text-gold`}>{item.time}</p>
                </div>
              ))}
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

            <div className="space-y-2 border-t border-gold/10 pt-4">
              <p className={`${cinzel.className} text-[11px] tracking-[0.2em] text-text-muted`}>
                QUICK LINKS
              </p>
              <div className="flex flex-col gap-1.5">
                {quickLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="font-sans text-[13px] text-text-muted transition-colors hover:text-gold"
                  >
                    {`→ ${link.label}`}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}