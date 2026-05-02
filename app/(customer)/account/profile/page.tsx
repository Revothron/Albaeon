'use client'

import { useState, useEffect } from 'react'
import { Cinzel, Cormorant_Garamond } from 'next/font/google'
import { CircleCheck, Eye, EyeOff, Info, TriangleAlert } from 'lucide-react'
import AccountShell from '@/components/customer/account/AccountShell'
import DeleteAccountModal from '@/components/customer/account/DeleteAccountModal'
import { createClient } from '@/lib/supabase/client'

const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })
const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })

function ToggleRow({ title, subtitle, enabled, isLast = false, onToggle }: {
  title: string; subtitle: string; enabled: boolean; isLast?: boolean; onToggle: () => void
}) {
  return (
    <div className={`flex items-center justify-between gap-4 py-4 ${isLast ? '' : 'border-b border-gold/10'}`}>
      <div className="space-y-1">
        <p className="font-sans text-[14px] text-text-primary">{title}</p>
        <p className="font-sans text-[12px] text-text-muted">{subtitle}</p>
      </div>
      <button
        type="button"
        onClick={onToggle}
        role="switch"
        aria-checked={enabled}
        className="relative flex h-6 w-11 flex-shrink-0 cursor-pointer items-center rounded-full transition-colors duration-300"
        style={{ background: enabled ? 'var(--gold)' : 'rgba(230,201,121,0.18)' }}
      >
        <span
          className={`absolute top-[3px] h-[18px] w-[18px] rounded-full bg-nav transition-all duration-300 ${enabled ? 'left-[23px]' : 'left-[3px]'}`}
        />
      </button>
    </div>
  )
}

export default function ProfileSettingsPage() {
  const supabase = createClient()

  const [profile, setProfile] = useState<{
    first_name: string; last_name: string; display_name: string
    email: string; phone: string; updated_at: string
  } | null>(null)

  const [isEmailUser, setIsEmailUser] = useState(true)
  const [form, setForm] = useState({ first_name: '', last_name: '', display_name: '', phone: '' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Password
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSaved, setPasswordSaved] = useState(false)

  // Notifications
  const [orderUpdates, setOrderUpdates] = useState(true)
  const [promotions, setPromotions] = useState(false)
  const [restock, setRestock] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Check if email/password or OAuth user
      const identities = user.identities ?? []
      const hasEmailIdentity = identities.some((i) => i.provider === 'email')
      setIsEmailUser(hasEmailIdentity)

      const { data } = await supabase
        .from('profiles')
        .select('first_name, last_name, display_name, email, phone, updated_at')
        .eq('id', user.id)
        .single()

      if (data) {
        setProfile(data)
        setForm({
          first_name: data.first_name ?? '',
          last_name: data.last_name ?? '',
          display_name: data.display_name ?? '',
          phone: data.phone ?? '',
        })
      }
    }
    load()
  }, [])

  async function handleSave() {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('profiles').update({
      first_name: form.first_name,
      last_name: form.last_name,
      display_name: form.display_name,
      phone: form.phone,
    }).eq('id', user.id)

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  async function handlePasswordUpdate() {
    setPasswordError('')
    if (!currentPassword) { setPasswordError('Enter your current password.'); return }
    if (newPassword.length < 8) { setPasswordError('New password must be at least 8 characters.'); return }
    if (newPassword !== confirmPassword) { setPasswordError('Passwords do not match.'); return }

    setPasswordSaving(true)

    // Re-authenticate with current password
    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.email) return

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    })

    if (signInError) {
      setPasswordError('Current password is incorrect.')
      setPasswordSaving(false)
      return
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) {
      setPasswordError(error.message)
      setPasswordSaving(false)
      return
    }

    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setPasswordSaving(false)
    setPasswordSaved(true)
    setTimeout(() => setPasswordSaved(false), 3000)
  }

  const displayName =
    profile?.display_name ??
    [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') ?? '—'

  const updatedLabel = profile?.updated_at
    ? new Date(profile.updated_at).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
      })
    : '—'

  return (
    <div className="animate-fadeInUp">
      <AccountShell
        activeTab="profile"
        title="My Profile"
        subtitle="Update your personal information and account settings."
        displayName={displayName}
        email={profile?.email ?? ''}
      >
        <div className="space-y-4">

          {/* Profile Info */}
          <div className="space-y-5 border border-gold bg-surface p-5 sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <h2 className={`${cormorant.className} text-[20px] text-text-primary`}>Profile Information</h2>
              <p className="font-sans text-[12px] text-text-muted">Last updated {updatedLabel}</p>
            </div>
            <div className="h-px w-full bg-gold/10" />

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="h-[72px] w-[72px] rounded-full border border-gold bg-primary" />
              <div className="space-y-1">
                <p className={`${cinzel.className} text-[20px] text-text-primary`}>{displayName}</p>
                <p className="font-sans text-[12px] text-text-muted">
                  Member since {profile?.updated_at ? new Date(profile.updated_at).getFullYear() : '—'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="font-sans text-[11px] uppercase tracking-[0.08em] text-text-muted">First Name</label>
                  <input
                    type="text"
                    value={form.first_name}
                    onChange={(e) => setForm((p) => ({ ...p, first_name: e.target.value }))}
                    className="w-full border border-gold/15 bg-primary px-3.5 py-2 font-sans text-[14px] text-text-primary outline-none focus:border-gold/40"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-sans text-[11px] uppercase tracking-[0.08em] text-text-muted">Last Name</label>
                  <input
                    type="text"
                    value={form.last_name}
                    onChange={(e) => setForm((p) => ({ ...p, last_name: e.target.value }))}
                    className="w-full border border-gold/15 bg-primary px-3.5 py-2 font-sans text-[14px] text-text-primary outline-none focus:border-gold/40"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-sans text-[11px] uppercase tracking-[0.08em] text-text-muted">Display Name</label>
                <input
                  type="text"
                  value={form.display_name}
                  onChange={(e) => setForm((p) => ({ ...p, display_name: e.target.value }))}
                  className="w-full border border-gold/15 bg-primary px-3.5 py-2 font-sans text-[14px] text-text-primary outline-none focus:border-gold/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-sans text-[11px] uppercase tracking-[0.08em] text-text-muted">Email Address</label>
                <input
                  type="email"
                  value={profile?.email ?? ''}
                  readOnly
                  className="w-full border border-gold/15 bg-primary px-3.5 py-2 font-sans text-[14px] text-text-muted outline-none opacity-60 cursor-not-allowed"
                />
                <p className="font-sans text-[11px] text-text-muted">Sign-in email cannot be changed here</p>
              </div>

              <div className="space-y-1.5">
                <label className="font-sans text-[11px] uppercase tracking-[0.08em] text-text-muted">Phone Number</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  className="w-full border border-gold/15 bg-primary px-3.5 py-2 font-sans text-[14px] text-text-primary outline-none focus:border-gold/40"
                />
              </div>

              <div className="flex justify-end">
                <button type="button" onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="space-y-5 border border-gold bg-surface p-5 sm:p-7">
            <h2 className={`${cormorant.className} text-[20px] text-text-primary`}>Change Password</h2>
            <div className="h-px w-full bg-gold/10" />

            {!isEmailUser ? (
              <div className="flex gap-3 border-l-2 border-[var(--status-info)] bg-[#4A90C410] px-4 py-3">
                <Info className="mt-0.5 h-4 w-4 text-[var(--status-info)]" />
                <p className="font-sans text-[13px] leading-[1.6] text-text-muted">
                  Your account is linked to Google. Password changes are managed through your Google account.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {passwordError && (
                  <div className="border-l-2 border-[var(--status-error)] bg-[#C0392B10] px-4 py-3">
                    <p className="font-sans text-[13px] text-[var(--status-error)]">{passwordError}</p>
                  </div>
                )}

                {/* Current password */}
                <div className="space-y-1.5">
                  <label className="font-sans text-[11px] uppercase tracking-[0.08em] text-text-muted">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrent ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full border border-gold/15 bg-primary px-3.5 py-2 pr-10 font-sans text-[14px] text-text-primary outline-none focus:border-gold/40"
                    />
                    <button type="button" onClick={() => setShowCurrent((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-gold transition-colors">
                      {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* New password */}
                <div className="space-y-1.5">
                  <label className="font-sans text-[11px] uppercase tracking-[0.08em] text-text-muted">New Password</label>
                  <div className="relative">
                    <input
                      type={showNew ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full border border-gold/15 bg-primary px-3.5 py-2 pr-10 font-sans text-[14px] text-text-primary outline-none focus:border-gold/40"
                    />
                    <button type="button" onClick={() => setShowNew((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-gold transition-colors">
                      {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm password */}
                <div className="space-y-1.5">
                  <label className="font-sans text-[11px] uppercase tracking-[0.08em] text-text-muted">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full border border-gold/15 bg-primary px-3.5 py-2 pr-10 font-sans text-[14px] text-text-primary outline-none focus:border-gold/40"
                    />
                    <button type="button" onClick={() => setShowConfirm((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-gold transition-colors">
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button type="button" onClick={handlePasswordUpdate} disabled={passwordSaving} className="btn-primary disabled:opacity-50">
                    {passwordSaving ? 'Updating...' : 'Update Password'}
                  </button>
                </div>

                {passwordSaved && (
                  <div className="flex items-center gap-2 border-l-2 border-[var(--status-success)] bg-[#4CAF7D10] px-4 py-3">
                    <CircleCheck className="h-4 w-4 text-[var(--status-success)]" />
                    <p className="font-sans text-[13px] text-[var(--status-success)]">Password updated successfully.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="space-y-5 border border-gold bg-surface p-5 sm:p-7">
            <h2 className={`${cormorant.className} text-[20px] text-text-primary`}>Security & Notifications</h2>
            <div className="h-px w-full bg-gold/10" />
            <div>
              <ToggleRow title="Order updates" subtitle="Confirmations, shipping, delivery" enabled={orderUpdates} onToggle={() => setOrderUpdates((c) => !c)} />
              <ToggleRow title="Promotions & offers" subtitle="New arrivals, drops, discounts" enabled={promotions} onToggle={() => setPromotions((c) => !c)} />
              <ToggleRow title="Restock alerts" subtitle="Sold-out items you viewed" enabled={restock} onToggle={() => setRestock((c) => !c)} isLast />
            </div>
          </div>

          {/* Danger Zone */}
          <div className="space-y-5 border border-red-500/20 bg-[#C0392B0A] p-5 sm:p-7">
            <div className="flex items-center gap-2">
              <TriangleAlert className="h-4 w-4 text-[var(--status-error)]" />
              <h2 className={`${cormorant.className} text-[20px] text-[var(--status-error)]`}>Danger Zone</h2>
            </div>
            <div className="h-px w-full bg-red-500/15" />
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-1.5">
                <p className="font-sans text-[14px] font-medium text-text-primary">Delete Account</p>
                <p className="max-w-[560px] font-sans text-[13px] leading-[1.7] text-text-muted">
                  Permanently delete your account, order history, and all personal data. This cannot be undone.
                </p>
              </div>
              <DeleteAccountModal email={profile?.email ?? ''} />
            </div>
          </div>

          {saved && (
            <div className="flex justify-end">
              <div className="flex w-full max-w-[300px] items-start gap-3 border-l-[3px] border-[var(--status-success)] bg-surface px-4 py-3">
                <CircleCheck className="mt-0.5 h-4 w-4 text-[var(--status-success)]" />
                <div className="space-y-0.5">
                  <p className="font-sans text-[13px] text-text-primary">Profile updated</p>
                  <p className="font-sans text-[12px] text-text-muted">Your changes were saved.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </AccountShell>
    </div>
  )
}