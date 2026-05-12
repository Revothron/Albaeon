'use client'

import { useState, useMemo } from 'react'
import { Plus, Edit2, Trash2, X, Search } from 'lucide-react'
import {
  AdminPageHeading,
  AdminPrimaryButton,
  AdminFieldLabel,
} from '@/components/admin/AdminUi'
import { adminCinzel, adminRaleway } from '@/components/admin/adminFonts'
import type { AdminCollection } from '@/lib/admin/collections'

type ProductOption = { id: string; name: string; slug: string }

const FILTER_RULES = [
  { value: 'new_arrivals', label: 'New Arrivals (is_new_arrival=true)' },
  { value: 'best_sellers', label: 'Best Sellers (is_best_seller=true)' },
  { value: 'limited_drops', label: 'Limited Drops (is_limited_drop=true)' },
  { value: 'all', label: 'All Products (no filter)' },
]

export default function AdminCollectionsClient({
  collections: initial,
  allProducts = [],
  collectionProductIds = {},
}: {
  collections: AdminCollection[]
  allProducts?: ProductOption[]
  collectionProductIds?: Record<string, string[]>
}) {
  const [collections, setCollections] = useState(initial)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({
    name: '',
    slug: '',
    filter_rule: 'all',
    sort_order: 0,
    product_ids: [] as string[],
  })

  function resetForm() {
    setForm({ name: '', slug: '', filter_rule: 'all', sort_order: 0, product_ids: [] })
    setSearch('')
    setError('')
  }

  function openCreate() {
    resetForm()
    setEditingId(null)
    setShowForm(true)
  }

  function openEdit(col: AdminCollection) {
    setForm({
      name: col.name,
      slug: col.slug,
      filter_rule: col.filter_rule,
      sort_order: col.sort_order,
      product_ids: collectionProductIds[col.id] ?? [],
    })
    setEditingId(col.id)
    setShowForm(true)
    setSearch('')
    setError('')
  }

  function closeForm() {
    setShowForm(false)
    setEditingId(null)
    resetForm()
  }

  async function handleSave() {
    if (!form.name.trim() || !form.slug.trim() || !form.filter_rule) {
      setError('Name, slug, and filter rule are required.')
      return
    }
    setLoading(true)
    setError('')

    try {
      const body = JSON.stringify(form)
      if (editingId) {
        const res = await fetch(`/api/admin/collections/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body,
        })
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error ?? 'Failed to update')
        }
        const updated = await res.json()
        setCollections((prev) => prev.map((c) => (c.id === editingId ? { ...c, ...updated } : c)))
      } else {
        const res = await fetch('/api/admin/collections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
        })
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error ?? 'Failed to create')
        }
        const created = await res.json()
        setCollections((prev) => [...prev, created])
      }
      closeForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete collection "${name}"?`)) return

    setLoading(true)
    try {
      const res = await fetch(`/api/admin/collections/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      setCollections((prev) => prev.filter((c) => c.id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete')
    } finally {
      setLoading(false)
    }
  }

  async function handleToggleActive(col: AdminCollection) {
    try {
      const res = await fetch(`/api/admin/collections/${col.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !col.is_active }),
      })
      if (!res.ok) throw new Error('Failed to toggle')
      const updated = await res.json()
      setCollections((prev) => prev.map((c) => (c.id === col.id ? { ...c, ...updated } : c)))
    } catch {
      alert('Failed to toggle')
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeading
        eyebrow="ADMIN"
        title="Collections"
        subtitle="Manage shop menu collections"
        action={
          <AdminPrimaryButton label="ADD COLLECTION" icon={<Plus className="h-3.5 w-3.5" />} onClick={openCreate} />
        }
      />

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={closeForm}>
          <div className="w-full max-w-lg border border-gold/10 bg-[#1E1A2E] p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <p className={`${adminCinzel.className} text-[10px] tracking-[0.24em] text-gold`}>
                {editingId ? 'EDIT COLLECTION' : 'NEW COLLECTION'}
              </p>
              <button type="button" onClick={closeForm} className="text-text-muted hover:text-gold">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <AdminFieldLabel>NAME</AdminFieldLabel>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value, slug: editingId ? f.slug : e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }))}
                  className={`${adminRaleway.className} h-[46px] w-full border border-gold/12 bg-footer px-3 text-[13px] font-light text-text-primary outline-none placeholder:text-text-muted`}
                  placeholder="New Arrivals"
                />
              </div>

              <div>
                <AdminFieldLabel>SLUG</AdminFieldLabel>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  className={`${adminRaleway.className} h-[46px] w-full border border-gold/12 bg-footer px-3 text-[13px] font-light text-text-primary outline-none placeholder:text-text-muted`}
                  placeholder="new-arrivals"
                />
              </div>

              <div>
                <AdminFieldLabel>FILTER RULE</AdminFieldLabel>
                <select
                  value={form.filter_rule}
                  onChange={(e) => setForm((f) => ({ ...f, filter_rule: e.target.value }))}
                  className={`${adminRaleway.className} h-[46px] w-full border border-gold/12 bg-footer px-3 text-[13px] font-light text-text-primary outline-none`}
                >
                  {FILTER_RULES.map((rule) => (
                    <option key={rule.value} value={rule.value}>{rule.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <AdminFieldLabel>SORT ORDER</AdminFieldLabel>
                <input
                  type="number"
                  min={0}
                  value={form.sort_order}
                  onChange={(e) => setForm((f) => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
                  className={`${adminRaleway.className} h-[46px] w-full border border-gold/12 bg-footer px-3 text-[13px] font-light text-text-primary outline-none`}
                />
              </div>

              <div>
                <AdminFieldLabel>PRODUCTS</AdminFieldLabel>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={`${adminRaleway.className} h-[38px] w-full border border-gold/12 bg-footer pl-9 pr-3 text-[12px] font-light text-text-primary outline-none placeholder:text-text-muted`}
                    placeholder="Search products..."
                  />
                </div>
                <div className="mt-1 max-h-[200px] overflow-y-auto border border-gold/12 bg-footer">
                  {allProducts
                    .filter(
                      (p) =>
                        !search ||
                        p.name.toLowerCase().includes(search.toLowerCase()) ||
                        p.slug.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((product) => {
                      const checked = form.product_ids.includes(product.id)
                      return (
                        <label
                          key={product.id}
                          className={`${adminRaleway.className} flex cursor-pointer items-center gap-2.5 px-3 py-2 text-[12px] font-light transition-colors hover:bg-gold/8 ${checked ? 'text-gold' : 'text-text-primary'}`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              setForm((f) => ({
                                ...f,
                                product_ids: checked
                                  ? f.product_ids.filter((id) => id !== product.id)
                                  : [...f.product_ids, product.id],
                              }))
                            }
                            className="accent-gold h-3.5 w-3.5"
                          />
                          <span className="truncate">{product.name}</span>
                          <span className="ml-auto shrink-0 text-text-muted">{product.slug}</span>
                        </label>
                      )
                    })}
                  {allProducts.length === 0 && (
                    <p className="px-3 py-6 text-center text-[12px] text-text-muted">
                      No active products available.
                    </p>
                  )}
                </div>
                <p className={`${adminRaleway.className} mt-1 text-[11px] text-text-muted`}>
                  {form.product_ids.length} product{form.product_ids.length !== 1 ? 's' : ''} selected
                </p>
              </div>

              {error && (
                <p className={`${adminRaleway.className} text-[12px] text-[var(--status-error)]`}>{error}</p>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeForm}
                  className={`${adminCinzel.className} border border-gold/20 px-5 py-2.5 text-[10px] font-semibold tracking-[0.18em] text-text-muted transition-colors hover:border-gold/40 hover:text-gold`}
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={loading}
                  className={`${adminCinzel.className} bg-gold px-5 py-2.5 text-[10px] font-semibold tracking-[0.18em] text-nav transition-colors hover:bg-gold-hover disabled:opacity-50`}
                >
                  {loading ? 'SAVING...' : editingId ? 'UPDATE' : 'CREATE'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="border border-gold/10 bg-[#1E1A2E]">
        <div className={`grid grid-cols-[2fr_1fr_1.5fr_80px_100px_100px] gap-3 border-b border-gold/10 px-6 py-4 ${adminCinzel.className} text-[10px] tracking-[0.18em] text-text-muted`}>
          <span>NAME</span>
          <span>SLUG</span>
          <span>FILTER RULE</span>
          <span className="text-center">ORDER</span>
          <span className="text-center">STATUS</span>
          <span className="text-right">ACTIONS</span>
        </div>

        {collections.length === 0 ? (
          <div className={`${adminRaleway.className} px-6 py-16 text-center text-[13px] font-light text-text-muted`}>
            No collections yet.
          </div>
        ) : (
          collections.map((col) => (
            <div
              key={col.id}
              className={`grid grid-cols-[2fr_1fr_1.5fr_80px_100px_100px] gap-3 items-center border-t border-gold/6 px-6 py-4 ${adminRaleway.className} text-[13px] font-light text-text-primary`}
            >
              <span className="truncate">{col.name}</span>
              <span className="truncate text-text-muted">{col.slug}</span>
              <span className="truncate text-text-muted text-[11px]">{col.filter_rule}</span>
              <span className="text-center">{col.sort_order}</span>
              <span className="flex justify-center">
                <button
                  type="button"
                  onClick={() => handleToggleActive(col)}
                  className={`inline-flex items-center gap-1.5 text-[11px] ${col.is_active ? 'text-[var(--status-success)]' : 'text-text-muted'}`}
                >
                  <span className={`h-2 w-2 rounded-full ${col.is_active ? 'bg-[var(--status-success)]' : 'bg-text-muted'}`} />
                  {col.is_active ? 'Active' : 'Inactive'}
                </button>
              </span>
              <span className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(col)}
                  className="flex h-8 w-8 items-center justify-center border border-gold/12 text-text-muted transition-colors hover:border-gold/30 hover:text-gold"
                >
                  <Edit2 className="h-3.5 w-3.5" strokeWidth={1.8} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(col.id, col.name)}
                  className="flex h-8 w-8 items-center justify-center border border-[#FF0000]/20 text-[#FF0000]/70 transition-colors hover:border-[#FF0000]/40 hover:text-[#FF0000]"
                >
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={1.8} />
                </button>
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
