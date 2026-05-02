'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Cinzel } from 'next/font/google'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff } from 'lucide-react'

const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    })

    if (authError) {
      setError('Incorrect email or password. Please try again.')
      setLoading(false)
      return
    }

    router.push('/account')
    router.refresh()
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/api/auth/callback` },
    })
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-5xl xl:max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8 border border-white/5 lg:border-none shadow-2xl lg:shadow-none min-h-[600px] lg:h-[80vh] max-h-[900px]">

        {/* Left Panel */}
        <div className="border border-gold/20 p-6 lg:p-8 xl:p-12 bg-primary-deep flex flex-col h-full">
          <div className="mb-4 lg:mb-8">
            <h2 className={`${cinzel.className} text-gold text-xl lg:text-2xl font-bold tracking-[0.15em] mb-4`}>
              ALBAEON
            </h2>
            <h1 className={`${cinzel.className} text-text-primary text-3xl lg:text-4xl xl:text-5xl tracking-widest uppercase mb-4`}>
              Enter The Empire
            </h1>
            <p className="text-text-muted text-sm leading-relaxed mb-6 max-w-md hidden sm:block">
              Sign in to access your orders, saved designs, and premium drops curated for your region.
            </p>
          </div>
          <div className="relative w-full flex-1 min-h-[250px] border border-gold/30">
            <div className="absolute inset-0 bg-gradient-to-t from-nav to-surface overflow-hidden">
              <Image src="/admin/admin-login-artwork.png" alt="Albaeon" fill priority className="object-cover opacity-80 mix-blend-luminosity" />
              <div className="absolute inset-0 bg-primary/40 mix-blend-multiply" />
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="border border-gold/20 p-6 lg:p-8 xl:p-12 bg-primary flex flex-col justify-center h-full">
          <h1 className={`${cinzel.className} text-text-primary text-2xl xl:text-3xl tracking-widest uppercase mb-2 xl:mb-4`}>
            Customer Login
          </h1>
          <p className="text-text-muted text-sm mb-6 lg:mb-8">Welcome back.</p>

          {error && (
            <div className="mb-4 border border-[var(--status-error)]/40 bg-[var(--status-error)]/10 px-4 py-3">
              <p className="font-sans text-[13px] text-[var(--status-error)]">{error}</p>
            </div>
          )}

          <form className="space-y-4 xl:space-y-5 mb-6" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full bg-nav border border-transparent focus:border-gold/40 text-text-primary px-4 py-3 text-sm transition-colors outline-none disabled:opacity-50"
            />
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full bg-nav border border-transparent focus:border-gold/40 text-text-primary px-4 py-3 pr-10 text-sm transition-colors outline-none disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-gold transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-text-muted cursor-pointer hover:text-text-primary transition-colors">
                <input type="checkbox" className="accent-gold w-4 h-4" />
                Remember me
              </label>
              <Link href="/forgot-password" className="text-gold hover:text-gold-hover transition-colors">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold hover:bg-gold-hover text-nav font-semibold tracking-wider uppercase py-3 transition-colors mt-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Login'}
            </button>
          </form>

          <div>
            <p className="text-text-muted text-xs mb-3">Or continue with</p>
            <button
              type="button"
              onClick={handleGoogle}
              className="w-full border border-gold/30 hover:border-gold hover:bg-nav flex items-center justify-center py-2 xl:py-3 rounded-full transition-colors"
            >
              <svg className="w-5 h-5 fill-gold" viewBox="0 0 24 24">
                <path d="M12.48 10.92v3.28h7.84c-.32 2.04-2.4 5.98-7.84 5.98-4.72 0-8.56-3.9-8.56-8.68s3.84-8.68 8.56-8.68c2.68 0 4.48 1.14 5.52 2.12l2.24-2.16C18.56 1.12 15.84 0 12.48 0 5.6 0 0 5.6 0 12.5s5.6 12.5 12.48 12.5c7.2 0 12-5 12-12.04 0-.82-.08-1.44-.18-2.04H12.48z" />
              </svg>
            </button>
            <p className="text-text-muted text-xs mt-4 text-center">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-gold hover:text-gold-hover transition-colors">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}