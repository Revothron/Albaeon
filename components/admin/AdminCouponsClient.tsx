'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import {
  AdminPageHeading,
  AdminPagination,
  AdminTextInput,
} from '@/components/admin/AdminUi'
import { adminCinzel, adminRaleway } from '@/components/admin/adminFonts'
import type { AdminCoupon } from '@/lib/admin/coupons'

// ── Coupon form modal ─────────────────────────────────
function CouponModal({
  coupon,
  onClose,
  onSaved,
}: {
  coupon?: AdminCoupon
  onClose: () => void
  onSaved: () => void
}) {
  const isEdit = !!coupon

  const [code, setCode] = useState(coupon?.code ?? '')
  const [type, setType] = useState<'percentage' | 'flat'>(coupon?.type ?? 'percentage')
  const [value, setValue] = useState(String(coupon?.value ?? ''))
  const [minOrder, setMinOrder] = useState(String(coupon?.min_order_amount ?? ''))
  const [usageLimit, setUsageLimit] = useState(String(coupon?.usage_limit ?? ''))
  const [perUser, setPerUser] = useState(String(coupon?.per_user_limit ?? 1))
  const [isActive, setIsActive] = useState(coupon?.is_active ?? true)
  const [expiresAt, setExpiresAt] = useState(
    coupon?.expires_at ? coupon.expires_at.slice(0, 10) : ''
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSave() {
    if (!code.trim()) { setError('Code is required.'); return }
    if (!value || isNaN(Number(value))) { setError('Value is required.'); return }
    if (type === 'percentage' && Number(value) > 100) { setError('Percentage cannot exceed 100.'); return }

    setSaving(true)
    setError('')

    const fields = {
      code: code.trim().toUpperCase(),
      type,
      value: Number(value),
      min_order_amount: minOrder ? Number(minOrder) : null,
      usage_limit: usageLimit ? Number(usageLimit) : null,
      per_user_limit: Number(perUser) || 1,
      is_active: isActive,
      expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
    }

    const res = await fetch('/api/admin/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: isEdit ? 'update' : 'create',
        id: coupon?.id,
        fields,
      }),
    })

    const data = await res.json()
    if (data.error) { setError(data.error); setSaving(false); return }

    onSaved()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-[480px] border border-gold/20 bg-[#1E1A2E] p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <p className={`${adminCinzel.className} text-[11px] tracking-[0.3em] text-gold`}>
            {isEdit ? 'EDIT COUPON' : 'CREATE COUPON'}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="font-sans text-[20px] text-text-muted hover:text-gold transition-colors"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="mb-4 border border-[var(--status-error)]/40 bg-[var(--status-error)]/10 px-4 py-3">
            <p className={`${adminRaleway.className} text-[13px] text-[var(--status-error)]`}>{error}</p>
          </div>
        )}

        <div className="space-y-4">
          {/* Code */}
          <div className="space-y-1.5">
            <p className={`${adminCinzel.className} text-[9px] tracking-[0.28em] text-text-muted`}>COUPON CODE *</p>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. MYTH10"
              className={`${adminRaleway.className} h-[42px] w-full border border-gold/12 bg-footer px-4 text-[14px] font-light text-text-primary outline-none focus:border-gold/30`}
            />
          </div>

          {/* Type */}
          <div className="space-y-1.5">
            <p className={`${adminCinzel.className} text-[9px] tracking-[0.28em] text-text-muted`}>DISCOUNT TYPE *</p>
            <div className="grid grid-cols-2 gap-2">
              {(['percentage', 'flat'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`${adminCinzel.className} border py-2.5 text-[10px] font-semibold tracking-[0.18em] transition-colors ${
                    type === t
                      ? 'border-gold bg-gold/12 text-gold'
                      : 'border-gold/12 text-text-muted hover:border-gold/30'
                  }`}
                >
                  {t === 'percentage' ? '% PERCENTAGE' : '₹ FLAT'}
                </button>
              ))}
            </div>
          </div>

          {/* Value */}
          <div className="space-y-1.5">
            <p className={`${adminCinzel.className} text-[9px] tracking-[0.28em] text-text-muted`}>
              VALUE * {type === 'percentage' ? '(%)' : '(₹)'}
            </p>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={type === 'percentage' ? '10' : '100'}
              className={`${adminRaleway.className} h-[42px] w-full border border-gold/12 bg-footer px-4 text-[14px] font-light text-text-primary outline-none focus:border-gold/30`}
            />
          </div>

          {/* Min order */}
          <div className="space-y-1.5">
            <p className={`${adminCinzel.className} text-[9px] tracking-[0.28em] text-text-muted`}>
              MINIMUM ORDER (₹) — optional
            </p>
            <input
              type="number"
              value={minOrder}
              onChange={(e) => setMinOrder(e.target.value)}
              placeholder="e.g. 500"
              className={`${adminRaleway.className} h-[42px] w-full border border-gold/12 bg-footer px-4 text-[14px] font-light text-text-primary outline-none focus:border-gold/30`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Usage limit */}
            <div className="space-y-1.5">
              <p className={`${adminCinzel.className} text-[9px] tracking-[0.28em] text-text-muted`}>USAGE LIMIT</p>
              <input
                type="number"
                value={usageLimit}
                onChange={(e) => setUsageLimit(e.target.value)}
                placeholder="Unlimited"
                className={`${adminRaleway.className} h-[42px] w-full border border-gold/12 bg-footer px-4 text-[14px] font-light text-text-primary outline-none focus:border-gold/30`}
              />
            </div>

            {/* Per user */}
            <div className="space-y-1.5">
              <p className={`${adminCinzel.className} text-[9px] tracking-[0.28em] text-text-muted`}>PER USER</p>
              <input
                type="number"
                value={perUser}
                onChange={(e) => setPerUser(e.target.value)}
                placeholder="1"
                className={`${adminRaleway.className} h-[42px] w-full border border-gold/12 bg-footer px-4 text-[14px] font-light text-text-primary outline-none focus:border-gold/30`}
              />
            </div>
          </div>

          {/* Expires at */}
          <div className="space-y-1.5">
            <p className={`${adminCinzel.className} text-[9px] tracking-[0.28em] text-text-muted`}>EXPIRES ON — optional</p>
            <input
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className={`${adminRaleway.className} h-[42px] w-full border border-gold/12 bg-footer px-4 text-[14px] font-light text-text-primary outline-none focus:border-gold/30`}
            />
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between border-t border-gold/10 pt-4">
            <div>
              <p className={`${adminRaleway.className} text-[13px] text-text-primary`}>Active</p>
              <p className={`${adminRaleway.className} text-[11px] font-light text-text-muted`}>
                Customers can use this coupon
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsActive((v) => !v)}
              className={`relative h-5 w-10 rounded-full border transition-colors duration-200 ${
                isActive ? 'border-gold bg-gold/30' : 'border-gold/25 bg-footer'
              }`}
              role="switch"
              aria-checked={isActive}
            >
              <span className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full transition-transform duration-200 ${
                isActive ? 'translate-x-5 bg-gold' : 'translate-x-0 bg-text-muted'
              }`} />
            </button>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className={`${adminCinzel.className} flex-1 border border-gold/20 py-2.5 text-[10px] font-semibold tracking-[0.18em] text-text-muted hover:text-gold transition-colors`}
          >
            CANCEL
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className={`${adminCinzel.className} flex-1 bg-gold py-2.5 text-[10px] font-semibold tracking-[0.18em] text-nav hover:bg-gold-hover transition-colors disabled:opacity-50`}
          >
            {saving ? 'SAVING...' : isEdit ? 'SAVE CHANGES' : 'CREATE COUPON'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────
export default function AdminCouponsClient({
  coupons: initialCoupons,
  total,
  currentPage,
}: {
  coupons: AdminCoupon[]
  total: number
  currentPage: number
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [coupons, setCoupons] = useState(initialCoupons)
  const [search, setSearch] = useState(searchParams.get('search') ?? '')
  const [showModal, setShowModal] = useState(false)
  const [editCoupon, setEditCoupon] = useState<AdminCoupon | undefined>()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  useEffect(() => { setCoupons(initialCoupons) }, [initialCoupons])

  const totalPages = Math.ceil(total / 20)
  const start = Math.min((currentPage - 1) * 20 + 1, total)
  const end = Math.min(currentPage * 20, total)

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (search) params.set('search', search)
    else params.delete('search')
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }

  async function handleDelete(id: string, code: string) {
    if (!window.confirm(`Delete coupon ${code}? This cannot be undone.`)) return
    setDeletingId(id)
    const res = await fetch('/api/admin/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id }),
    })
    const data = await res.json()
    if (!data.error) {
      setCoupons((prev) => prev.filter((c) => c.id !== id))
    }
    setDeletingId(null)
  }

  async function handleToggle(id: string, currentActive: boolean) {
    setTogglingId(id)
    const res = await fetch('/api/admin/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'toggle', id, is_active: !currentActive }),
    })
    const data = await res.json()
    if (!data.error) {
      setCoupons((prev) =>
        prev.map((c) => c.id === id ? { ...c, is_active: !currentActive } : c)
      )
    }
    setTogglingId(null)
  }

  function formatExpiry(expires_at: string | null) {
    if (!expires_at) return 'Never'
    const d = new Date(expires_at)
    const now = new Date()
    if (d < now) return `Expired ${d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  function isExpired(expires_at: string | null) {
    if (!expires_at) return false
    return new Date(expires_at) < new Date()
  }

  return (
    <div className="space-y-5 animate-fadeInUp">
      <AdminPageHeading
        eyebrow="PROMOTIONS"
        title="Coupons"
        subtitle={`${total} coupons · ${coupons.filter((c) => c.is_active).length} active`}
        action={
          <button
            type="button"
            onClick={() => { setEditCoupon(undefined); setShowModal(true) }}
            className={`${adminCinzel.className} inline-flex items-center gap-2 bg-gold px-5 py-2.5 text-[10px] font-semibold tracking-[0.18em] text-nav transition-colors duration-200 hover:bg-gold-hover`}
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
            CREATE COUPON
          </button>
        }
      />

      {/* Search */}
      <section className="border border-gold/10 bg-[#1E1A2E] px-5 py-4">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1">
            <AdminTextInput
              placeholder="Search by coupon code..."
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className={`${adminCinzel.className} border border-gold/20 px-5 text-[10px] font-semibold tracking-[0.18em] text-text-muted hover:text-gold transition-colors`}
          >
            SEARCH
          </button>
          {search && (
            <button
              type="button"
              onClick={() => { setSearch(''); router.push(pathname) }}
              className={`${adminCinzel.className} border border-gold/20 px-5 text-[10px] font-semibold tracking-[0.18em] text-text-muted hover:text-gold transition-colors`}
            >
              CLEAR
            </button>
          )}
        </form>
      </section>

      {/* Table */}
      <section className="overflow-hidden border border-gold/10 bg-[#1E1A2E]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse">
            <thead className="bg-nav">
              <tr className={`${adminCinzel.className} text-[10px] tracking-[0.18em] text-text-muted`}>
                {['CODE', 'TYPE', 'VALUE', 'MIN ORDER', 'USAGE', 'EXPIRY', 'STATUS', 'ACTIONS'].map((col) => (
                  <th key={col} className="px-5 py-4 text-left font-semibold">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan={8} className={`${adminRaleway.className} py-12 text-center text-[13px] text-text-muted`}>
                    No coupons found
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon.id} className="border-t border-gold/6 hover:bg-gold/[0.02] transition-colors">
                    {/* Code */}
                    <td className="px-5 py-4">
                      <p className={`${adminCinzel.className} text-[14px] text-gold`}>{coupon.code}</p>
                    </td>

                    {/* Type */}
                    <td className="px-5 py-4">
                      <span className={`${adminCinzel.className} border px-2.5 py-1 text-[9px] tracking-[0.15em] ${
                        coupon.type === 'percentage'
                          ? 'border-[var(--status-info)]/30 text-[var(--status-info)]'
                          : 'border-gold/30 text-gold'
                      }`}>
                        {coupon.type === 'percentage' ? 'PERCENT' : 'FLAT'}
                      </span>
                    </td>

                    {/* Value */}
                    <td className={`${adminCinzel.className} px-5 py-4 text-[14px] text-text-primary`}>
                      {coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`}
                    </td>

                    {/* Min order */}
                    <td className={`${adminRaleway.className} px-5 py-4 text-[13px] font-light text-text-muted`}>
                      {coupon.min_order_amount ? `₹${coupon.min_order_amount.toLocaleString('en-IN')}` : '—'}
                    </td>

                    {/* Usage */}
                    <td className="px-5 py-4">
                      <p className={`${adminCinzel.className} text-[13px] text-text-primary`}>
                        {coupon.used_count} / {coupon.usage_limit ?? '∞'}
                      </p>
                      <p className={`${adminRaleway.className} text-[11px] font-light text-text-muted`}>
                        {coupon.per_user_limit} per user
                      </p>
                    </td>

                    {/* Expiry */}
                    <td className={`${adminRaleway.className} px-5 py-4 text-[13px] font-light ${
                      isExpired(coupon.expires_at) ? 'text-[var(--status-error)]' : 'text-text-muted'
                    }`}>
                      {formatExpiry(coupon.expires_at)}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => handleToggle(coupon.id, coupon.is_active)}
                        disabled={togglingId === coupon.id}
                        className="flex items-center gap-2 transition-colors disabled:opacity-50"
                      >
                        {coupon.is_active ? (
                          <ToggleRight className="h-5 w-5 text-[var(--status-success)]" strokeWidth={1.8} />
                        ) : (
                          <ToggleLeft className="h-5 w-5 text-text-muted" strokeWidth={1.8} />
                        )}
                        <span className={`${adminRaleway.className} text-[12px] font-light ${
                          coupon.is_active ? 'text-[var(--status-success)]' : 'text-text-muted'
                        }`}>
                          {coupon.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => { setEditCoupon(coupon); setShowModal(true) }}
                          className="text-gold hover:text-gold-hover transition-colors"
                          aria-label={`Edit ${coupon.code}`}
                        >
                          <Pencil className="h-3.5 w-3.5" strokeWidth={1.8} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(coupon.id, coupon.code)}
                          disabled={deletingId === coupon.id}
                          className="text-[var(--status-error)] hover:opacity-70 transition-opacity disabled:opacity-40"
                          aria-label={`Delete ${coupon.code}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.8} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <AdminPagination
          summary={`Showing ${start}-${end} of ${total} coupons`}
          pages={totalPages <= 5
            ? Array.from({ length: totalPages }, (_, i) => i + 1)
            : [1, 2, 3, '...', totalPages]}
          currentPage={currentPage}
        />
      </section>

      {/* Modal */}
      {showModal && (
        <CouponModal
          coupon={editCoupon}
          onClose={() => { setShowModal(false); setEditCoupon(undefined) }}
          onSaved={() => router.refresh()}
        />
      )}
    </div>
  )
}