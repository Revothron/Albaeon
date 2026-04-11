'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Cinzel } from 'next/font/google'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)

    const [firstName, ...rest] = fullName.trim().split(' ')
    const lastName = rest.join(' ')

    const { error: signUpError } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          full_name: fullName.trim(),
        },
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/api/auth/callback` },
    })
  }

  if (success) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center space-y-6 border border-gold/20 p-8 bg-primary-deep">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[var(--status-success)] text-[var(--status-success)] text-xl">
            ✓
          </div>
          <h2 className={`${cinzel.className} text-[24px] text-gold`}>Check Your Email</h2>
          <p className="font-sans text-[13px] text-text-muted leading-[1.7]">
            A verification link has been sent to{' '}
            <span className="text-text-primary">{email}</span>.
            Please verify your email to activate your account.
          </p>
          <Link href="/login" className="block font-sans text-[13px] text-gold hover:text-gold-hover transition-colors">
            Back to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-5xl xl:max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8 border border-white/5 lg:border-none shadow-2xl lg:shadow-none min-h-[600px] lg:h-[85vh] max-h-[900px]">

        {/* Left Panel */}
        <div className="border border-gold/20 p-6 lg:p-8 xl:p-12 bg-primary-deep flex flex-col h-full">
          <div className="mb-4 lg:mb-8">
            <h2 className={`${cinzel.className} text-gold text-xl lg:text-2xl font-bold tracking-[0.15em] mb-4`}>
              ALBAEON
            </h2>
            <h1 className={`${cinzel.className} text-text-primary text-3xl lg:text-4xl xl:text-5xl tracking-[0.1em] uppercase mb-4 leading-[1.1]`}>
              Create Your<br />Global Account
            </h1>
            <p className="text-text-muted text-sm leading-relaxed mb-4 max-w-md font-light hidden sm:block">
              Join Albaeon to track orders, save favorites, and unlock member-only drops worldwide.
            </p>
          </div>
          <div className="relative w-full flex-1 min-h-[200px] border border-gold/30">
            <div className="absolute inset-0 bg-gradient-to-t from-nav to-surface overflow-hidden">
              <Image src="/admin/admin-login-artwork.png" alt="Albaeon" fill priority className="object-cover opacity-80 mix-blend-luminosity scale-105" />
              <div className="absolute inset-0 bg-primary/40 mix-blend-multiply" />
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="border border-gold/20 p-6 lg:p-8 xl:p-12 bg-primary flex flex-col justify-center h-full">
          <h1 className={`${cinzel.className} text-gold text-2xl xl:text-3xl tracking-[0.1em] uppercase mb-6`}>
            Create Account
          </h1>

          {error && (
            <div className="mb-4 border border-[var(--status-error)]/40 bg-[var(--status-error)]/10 px-4 py-3">
              <p className="font-sans text-[13px] text-[var(--status-error)]">{error}</p>
            </div>
          )}

          <form className="space-y-3 xl:space-y-4 mb-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              disabled={loading}
              className="w-full bg-nav border border-transparent focus:border-gold/40 text-text-primary px-4 py-3 text-sm transition-colors outline-none disabled:opacity-50"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full bg-nav border border-transparent focus:border-gold/40 text-text-primary px-4 py-3 text-sm transition-colors outline-none disabled:opacity-50"
            />
            <input
              type="password"
              placeholder="Create Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="w-full bg-nav border border-transparent focus:border-gold/40 text-text-primary px-4 py-3 text-sm transition-colors outline-none disabled:opacity-50"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              className="w-full bg-nav border border-transparent focus:border-gold/40 text-text-primary px-4 py-3 text-sm transition-colors outline-none disabled:opacity-50"
            />

            <p className="text-text-muted text-[10px] pt-1 leading-snug">
              By creating an account, you agree to the{' '}
              <Link href="/terms" className="text-gold hover:text-gold-hover">Terms</Link>
              {' '}&amp;{' '}
              <Link href="/privacy-policy" className="text-gold hover:text-gold-hover">Privacy Policy</Link>.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold hover:bg-gold-hover text-nav font-bold py-3 xl:py-3.5 transition-colors mt-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mb-4">
            <p className="text-text-muted text-[11px] mb-3">Or sign up with</p>
            <button
              type="button"
              onClick={handleGoogle}
              className="w-full border border-gold/40 hover:border-gold hover:bg-nav flex items-center justify-center py-2 xl:py-2.5 rounded-full transition-colors"
            >
              <svg className="w-5 h-5 fill-gold" viewBox="0 0 24 24">
                <path d="M12.48 10.92v3.28h7.84c-.32 2.04-2.4 5.98-7.84 5.98-4.72 0-8.56-3.9-8.56-8.68s3.84-8.68 8.56-8.68c2.68 0 4.48 1.14 5.52 2.12l2.24-2.16C18.56 1.12 15.84 0 12.48 0 5.6 0 0 5.6 0 12.5s5.6 12.5 12.48 12.5c7.2 0 12-5 12-12.04 0-.82-.08-1.44-.18-2.04H12.48z" />
              </svg>
            </button>
          </div>

          <p className="text-text-muted text-[11px] mt-auto lg:mt-0">
            Already have an account?{' '}
            <Link href="/login" className="text-gold hover:text-gold-hover transition-colors">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}