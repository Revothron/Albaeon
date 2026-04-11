'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const supabase = createClient()
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

    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
    setTimeout(() => router.push('/login'), 2000)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      background: 'var(--background, #241A33)',
    }}>
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
          {success ? 'Password Updated' : 'Set New Password'}
        </h1>

        {success ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '9999px',
              border: '1px solid var(--status-success, #4CAF7D)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
              color: 'var(--status-success, #4CAF7D)', fontSize: '20px',
            }}>✓</div>
            <p style={{ fontFamily: 'inherit', fontSize: '13px', color: 'var(--albaeon-text-muted, #B7AFC3)', lineHeight: 1.7 }}>
              Your password has been updated. Redirecting to login...
            </p>
          </div>
        ) : (
          <>
            {error && (
              <div style={{
                marginBottom: '16px', padding: '12px 16px',
                border: '1px solid rgba(192,57,43,0.4)',
                background: 'rgba(192,57,43,0.08)',
              }}>
                <p style={{ fontFamily: 'inherit', fontSize: '13px', color: 'var(--status-error, #C0392B)' }}>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{
                  display: 'block', fontFamily: 'inherit', fontSize: '9px',
                  fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase',
                  color: 'var(--albaeon-text-muted, #B7AFC3)', marginBottom: '8px',
                }}>
                  NEW PASSWORD
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  required
                  disabled={loading}
                  style={{ background: 'var(--albaeon-bg-secondary, #1A1426)', width: '100%' }}
                />
              </div>
              <div>
                <label style={{
                  display: 'block', fontFamily: 'inherit', fontSize: '9px',
                  fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase',
                  color: 'var(--albaeon-text-muted, #B7AFC3)', marginBottom: '8px',
                }}>
                  CONFIRM PASSWORD
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  required
                  disabled={loading}
                  style={{ background: 'var(--albaeon-bg-secondary, #1A1426)', width: '100%' }}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ width: '100%', marginTop: '8px', opacity: loading ? 0.5 : 1 }}
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </>
        )}

        <div style={{
          marginTop: '28px', paddingTop: '20px',
          borderTop: '1px solid rgba(230,201,121,0.08)',
          textAlign: 'center',
        }}>
          <Link href="/login" style={{
            fontFamily: 'inherit', fontSize: '11px', fontWeight: 300,
            letterSpacing: '1px', color: 'var(--albaeon-text-muted, #B7AFC3)',
            textDecoration: 'none',
          }}>
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}