'use client'

import { useState } from 'react'
import { Cinzel } from 'next/font/google'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })

type Address = {
  id: string
  type: string
  full_name: string
  line1: string
  line2: string | null
  city: string
  state: string
  postal_code: string
  country: string
  phone: string | null
  is_default: boolean
}

function AddressCard({
  address,
  onDelete,
  onSetDefault,
}: {
  address: Address
  onDelete: (id: string) => void
  onSetDefault: (id: string) => void
}) {
  const body = [
    address.full_name,
    address.line1,
    address.line2,
    `${address.city}, ${address.state} ${address.postal_code}`,
    address.country,
    address.phone,
  ]
    .filter(Boolean)
    .join('\n')

  return (
    <div className="space-y-4 border border-gold bg-surface p-5 sm:p-6 card-hover">
      <div className="flex items-center justify-between gap-3">
        <h2 className={`${cinzel.className} text-[20px] text-gold`}>
          {address.type === 'shipping' ? 'Shipping Address' : 'Billing Address'}
        </h2>
        <span className={`badge ${address.is_default ? 'badge-success' : 'badge-neutral'}`}>
          {address.is_default ? 'PRIMARY' : 'SECONDARY'}
        </span>
      </div>

      <p className="whitespace-pre-line font-sans text-[14px] leading-[2.1] text-text-primary">
        {body}
      </p>

      <div className="h-px w-full bg-gold/10" />

      <div className="flex flex-wrap items-center gap-4">
        {!address.is_default && (
          <button
            type="button"
            onClick={() => onSetDefault(address.id)}
            className="font-sans text-[13px] text-text-muted hover:text-gold transition-colors"
          >
            Set as primary
          </button>
        )}
        <button
          type="button"
          onClick={() => onDelete(address.id)}
          className="font-sans text-[13px] text-[var(--status-error)] hover:opacity-80 transition-opacity"
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default function AddressesClient({
  addresses: initialAddresses,
  userId,
}: {
  addresses: Address[]
  userId: string
}) {
  const supabase = createClient()
  const router = useRouter()
  const [addresses, setAddresses] = useState(initialAddresses)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    type: 'shipping',
    full_name: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
    phone: '',
    is_default: false,
  })

  async function handleDelete(id: string) {
    await supabase.from('addresses').delete().eq('id', id)
    setAddresses((prev) => prev.filter((a) => a.id !== id))
  }

  async function handleSetDefault(id: string) {
    await supabase.from('addresses').update({ is_default: false }).eq('user_id', userId)
    await supabase.from('addresses').update({ is_default: true }).eq('id', id)
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, is_default: a.id === id }))
    )
  }

  async function handleSave() {
    setSaving(true)
    const { data } = await supabase
      .from('addresses')
      .insert({ ...form, user_id: userId })
      .select()
      .single()

    if (data) {
      setAddresses((prev) => [...prev, data])
      setShowForm(false)
      setForm({
        type: 'shipping', full_name: '', line1: '', line2: '',
        city: '', state: '', postal_code: '', country: 'India',
        phone: '', is_default: false,
      })
    }
    setSaving(false)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      {addresses.length === 0 && !showForm && (
        <p className="font-sans text-[14px] text-text-muted py-4">No addresses saved yet.</p>
      )}

      <div className="grid gap-4 2xl:grid-cols-2">
        {addresses.map((addr) => (
          <AddressCard
            key={addr.id}
            address={addr}
            onDelete={handleDelete}
            onSetDefault={handleSetDefault}
          />
        ))}
      </div>

      {!showForm ? (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="btn-primary"
        >
          Add New Address
        </button>
      ) : (
        <div className="border border-gold bg-surface p-5 space-y-4">
          <h3 className={`${cinzel.className} text-[20px] text-gold`}>New Address</h3>

          {[
            { label: 'Full Name', key: 'full_name', placeholder: 'Arjun Sharma' },
            { label: 'Phone', key: 'phone', placeholder: '+91 98765 43210' },
            { label: 'Address Line 1', key: 'line1', placeholder: '42, MG Road' },
            { label: 'Address Line 2', key: 'line2', placeholder: 'Apartment, floor...' },
            { label: 'City', key: 'city', placeholder: 'Bengaluru' },
            { label: 'State', key: 'state', placeholder: 'Karnataka' },
            { label: 'Postal Code', key: 'postal_code', placeholder: '560038' },
            { label: 'Country', key: 'country', placeholder: 'India' },
          ].map(({ label, key, placeholder }) => (
            <div key={key} className="space-y-1.5">
              <label className="font-sans text-[11px] uppercase tracking-[0.08em] text-text-muted">
                {label}
              </label>
              <input
                type="text"
                placeholder={placeholder}
                value={form[key as keyof typeof form] as string}
                onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                className="w-full border border-gold/15 bg-primary px-3.5 py-2.5 font-sans text-[14px] text-text-primary outline-none focus:border-gold/40"
              />
            </div>
          ))}

          <div className="space-y-1.5">
            <label className="font-sans text-[11px] uppercase tracking-[0.08em] text-text-muted">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
              className="w-full border border-gold/15 bg-primary px-3.5 py-2.5 font-sans text-[14px] text-text-primary outline-none"
            >
              <option value="shipping">Shipping</option>
              <option value="billing">Billing</option>
            </select>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_default}
              onChange={(e) => setForm((prev) => ({ ...prev, is_default: e.target.checked }))}
              className="h-4 w-4 border border-gold accent-gold"
            />
            <span className="font-sans text-[13px] text-text-primary">Set as default address</span>
          </label>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="btn-primary disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Address'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2 border border-gold/15 bg-surface p-5 sm:p-6">
        <h2 className={`${cinzel.className} text-[20px] text-text-primary`}>Address Tips</h2>
        <p className="font-sans text-[13px] leading-[1.8] text-text-muted">
          Keep your shipping address up to date to avoid delivery delays. Your primary address is used automatically at checkout.
        </p>
      </div>
    </div>
  )
}