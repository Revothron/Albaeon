'use client'

import { useState, useEffect } from 'react'
import { Cinzel, Cormorant_Garamond } from 'next/font/google'
import { CircleCheck, Eye, Info, Lock, TriangleAlert } from 'lucide-react'
import AccountShell from '@/components/customer/account/AccountShell'
import DeleteAccountModal from '@/components/customer/account/DeleteAccountModal'
import { createClient } from '@/lib/supabase/client'

const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })
const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })

function Field({
  label, value, placeholder, helperText, icon, readOnly = false, type = 'text',
}: {
  label: string; value?: string; placeholder?: string; helperText?: string;
  icon?: React.ReactNode; readOnly?: boolean; type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="font-sans text-[11px] uppercase tracking-[0.08em] text-text-muted">{label}</label>
      <div className="relative">
        <input
          type={type}
          defaultValue={value}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`w-full border border-gold/15 bg-primary px-3.5 font-sans text-[14px] text-text-primary outline-none ${icon ? 'pr-10' : ''}`}
        />
        {icon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">{icon}</span>
        )}
      </div>
      {helperText && (
        <p className="font-sans text-[11px] text-text-muted">{helperText}</p>
      )}
    </div>
  )
}

function ToggleRow({
  title, subtitle, enabled, isLast = false, onToggle,
}: {
  title: string; subtitle: string; enabled: boolean; isLast?: boolean; onToggle: () => void;
}) {
  return (
    <div className={`flex items-center justify-between gap-4 py-4 transition-all duration-300 ${isLast ? '' : 'border-b border-[rgba(230,201,121,0.08)]'}`}>
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
        style={{ background: enabled ? 'var(--gold)' : 'rgba(183,175,195,0.20)' }}
      >
        <span
          className={`absolute top-[3px] h-[18px] w-[18px] rounded-full transition-all duration-300 ${enabled ? 'left-[23px]' : 'left-[3px]'}`}
          style={{ background: 'var(--text-primary)' }}
        />
      </button>
    </div>
  )
}

export default function ProfileSettingsPage() {
  const supabase = createClient()
  const [profile, setProfile] = useState<{
    first_name: string; last_name: string; display_name: string;
    email: string; phone: string; updated_at: string;
  } | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    first_name: '', last_name: '', display_name: '', phone: '',
  })
  const [orderUpdatesEnabled, setOrderUpdatesEnabled] = useState(true)
  const [promotionsEnabled, setPromotionsEnabled] = useState(false)
  const [restockEnabled, setRestockEnabled] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

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

    await supabase
      .from('profiles')
      .update({
        first_name: form.first_name,
        last_name: form.last_name,
        display_name: form.display_name,
        phone: form.phone,
      })
      .eq('id', user.id)

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const displayName =
    profile?.display_name ??
    [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') ??
    '—'

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
      >
        <div className="space-y-4">
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
                    className="w-full border border-gold/15 bg-primary px-3.5 py-2 font-sans text-[14px] text-text-primary outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-sans text-[11px] uppercase tracking-[0.08em] text-text-muted">Last Name</label>
                  <input
                    type="text"
                    value={form.last_name}
                    onChange={(e) => setForm((p) => ({ ...p, last_name: e.target.value }))}
                    className="w-full border border-gold/15 bg-primary px-3.5 py-2 font-sans text-[14px] text-text-primary outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-sans text-[11px] uppercase tracking-[0.08em] text-text-muted">Display Name</label>
                <input
                  type="text"
                  value={form.display_name}
                  onChange={(e) => setForm((p) => ({ ...p, display_name: e.target.value }))}
                  className="w-full border border-gold/15 bg-primary px-3.5 py-2 font-sans text-[14px] text-text-primary outline-none"
                />
                <p className="font-sans text-[11px] text-text-muted">Visible to others on the Albaeon platform</p>
              </div>

              <Field
                label="Email Address"
                value={profile?.email ?? ''}
                helperText="Sign-in email cannot be changed here"
                icon={<Lock className="h-4 w-4 text-text-muted" />}
                readOnly
              />

              <div className="space-y-1.5">
                <label className="font-sans text-[11px] uppercase tracking-[0.08em] text-text-muted">Phone Number</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  className="w-full border border-gold/15 bg-primary px-3.5 py-2 font-sans text-[14px] text-text-primary outline-none"
                />
                <p className="font-sans text-[11px] text-text-muted">Used for order status lookups</p>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>

          {/* Password section — unchanged */}
          <div className="space-y-5 border border-gold bg-surface p-5 sm:p-7">
            <div className="space-y-5">
              <h2 className={`${cormorant.className} text-[20px] text-text-primary`}>Change Password</h2>
              <div className="h-px w-full bg-gold/10" />
            </div>
            <div className="space-y-2 border-l-2 border-[var(--status-info)] bg-[#4A90C410] px-[18px] py-[14px]">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-4 w-4 text-[var(--status-info)]" />
                <p className="font-sans text-[13px] leading-[1.6] text-text-muted">
                  Manage your password through your account settings or via the forgot password flow.
                </p>
              </div>
            </div>
            <div className="space-y-4 opacity-40">
              <Field label="Current Password" placeholder="Enter current password" type="password" icon={<Eye className="h-4 w-4 text-text-muted" />} />
              <Field label="New Password" placeholder="Enter new password" type="password" />
              <Field label="Confirm Password" placeholder="Confirm password" type="password" />
              <div className="flex justify-end">
                <button type="button" className="border border-gold/20 px-6 py-2.5 font-sans text-[13px] text-text-muted">
                  Update Password
                </button>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="space-y-5 border border-gold bg-surface p-5 sm:p-7">
            <h2 className={`${cormorant.className} text-[20px] text-text-primary`}>Security & Notifications</h2>
            <div className="h-px w-full bg-gold/10" />
            <div>
              <ToggleRow title="Order updates" subtitle="Confirmations, shipping, delivery" enabled={orderUpdatesEnabled} onToggle={() => setOrderUpdatesEnabled((c) => !c)} />
              <ToggleRow title="Promotions & offers" subtitle="New arrivals, drops, discounts" enabled={promotionsEnabled} onToggle={() => setPromotionsEnabled((c) => !c)} />
              <ToggleRow title="Restock alerts" subtitle="Sold-out items you viewed" enabled={restockEnabled} onToggle={() => setRestockEnabled((c) => !c)} isLast />
            </div>
          </div>

          {/* Danger zone */}
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

          {/* Save success toast */}
          {saved && (
            <div className="flex justify-end">
              <div className="flex w-full max-w-[300px] items-start gap-3 border-l-[3px] border-[var(--status-success)] bg-surface px-[18px] py-[14px]">
                <CircleCheck className="mt-0.5 h-4 w-4 text-[var(--status-success)]" />
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="font-sans text-[13px] text-text-primary">Profile updated</p>
                  <p className="font-sans text-[12px] text-text-muted">Your changes were saved successfully.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </AccountShell>
    </div>
  )
}