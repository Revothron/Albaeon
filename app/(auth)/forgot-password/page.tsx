'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      { redirectTo: `${window.location.origin}/reset-password` }
    )

    if (resetError) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
      return
    }

    setSubmitted(true)
    setLoading(false)
  }

  return (
    <div
      className="animate-fadeIn"
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
        background: 'var(--background, #241A33)',
      }}
    >
      {/* Left artwork */}
      <div className="hidden lg:block" style={{ position: 'relative', overflow: 'hidden' }}>
        <Image src="/admin/admin-login-artwork.png" alt="Albaeon" fill className="object-cover" priority />
      </div>

      {/* Right form */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(40px, 8vw, 80px) clamp(24px, 6vw, 64px)',
          gridColumn: '1 / -1',
        }}
        className="lg:col-auto"
      >
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <p style={{
            fontFamily: 'inherit',
            fontSize: '9px',
            fontWeight: 700,
            letterSpacing: '6px',
            textTransform: 'uppercase',
            color: 'var(--albaeon-text-muted, #B7AFC3)',
            marginBottom: '8px',
          }}>
            ALBAEON
          </p>

          <h1 style={{
            fontFamily: 'inherit',
            fontSize: 'clamp(28px, 4vw, 36px)',
            fontWeight: 300,
            color: 'var(--albaeon-text-primary, #E8E2D6)',
            marginBottom: '32px',
            lineHeight: 1.1,
          }}>
            {submitted ? 'Check Your Email' : 'Reset Password'}
          </h1>

          {!submitted ? (
            <>
              <p style={{
                fontFamily: 'inherit',
                fontSize: '13px',
                fontWeight: 300,
                color: 'var(--albaeon-text-muted, #B7AFC3)',
                marginBottom: '28px',
                lineHeight: 1.7,
              }}>
                Enter your email and we will send you a reset link valid for 15 minutes.
              </p>

              {error && (
                <div style={{
                  marginBottom: '16px',
                  padding: '12px 16px',
                  border: '1px solid rgba(192,57,43,0.4)',
                  background: 'rgba(192,57,43,0.08)',
                }}>
                  <p style={{ fontFamily: 'inherit', fontSize: '13px', color: 'var(--status-error, #C0392B)' }}>
                    {error}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    fontFamily: 'inherit',
                    fontSize: '9px',
                    fontWeight: 700,
                    letterSpacing: '3px',
                    textTransform: 'uppercase',
                    color: 'var(--albaeon-text-muted, #B7AFC3)',
                    marginBottom: '8px',
                  }}>
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    disabled={loading}
                    style={{ background: 'var(--albaeon-bg-secondary, #1A1426)' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{ width: '100%', marginTop: '8px', opacity: loading ? 0.5 : 1 }}
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          ) : (
            <div className="animate-fadeInUp" style={{ textAlign: 'center' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '9999px',
                border: '1px solid var(--status-success, #4CAF7D)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                color: 'var(--status-success, #4CAF7D)',
                fontSize: '20px',
              }}>
                ✓
              </div>
              <p style={{
                fontFamily: 'inherit',
                fontSize: '13px',
                fontWeight: 300,
                color: 'var(--albaeon-text-muted, #B7AFC3)',
                lineHeight: 1.7,
                marginBottom: '28px',
              }}>
                A reset link has been sent to{' '}
                <strong style={{ color: 'var(--albaeon-text-primary, #E8E2D6)' }}>{email}</strong>.
                The link expires in 15 minutes.
              </p>
              <button
                type="button"
                onClick={() => { setSubmitted(false); setEmail('') }}
                style={{
                  fontFamily: 'inherit',
                  fontSize: '11px',
                  color: 'var(--albaeon-text-muted, #B7AFC3)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Try a different email
              </button>
            </div>
          )}

          <div style={{
            marginTop: '28px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(230,201,121,0.08)',
            textAlign: 'center',
          }}>
            <Link href="/login" style={{
              fontFamily: 'inherit',
              fontSize: '11px',
              fontWeight: 300,
              letterSpacing: '1px',
              color: 'var(--albaeon-text-muted, #B7AFC3)',
              textDecoration: 'none',
              transition: 'color 0.3s ease',
            }}>
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}