'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Plus, Edit2, Trash2, X, Check, Loader2, Camera } from 'lucide-react'
import {
  AdminPageHeading,
  AdminPrimaryButton,
  AdminFieldLabel,
} from '@/components/admin/AdminUi'
import { adminCinzel, adminRaleway, adminCormorant } from '@/components/admin/adminFonts'
import type { AdminCategory } from '@/lib/admin/categories'

export default function AdminCategoriesClient({
  categories: initial,
}: {
  categories: AdminCategory[]
}) {
  const [categories, setCategories] = useState(initial)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', slug: '' })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [cloudinaryId, setCloudinaryId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function resetForm() {
    setForm({ name: '', slug: '' })
    setImagePreview(null)
    setCloudinaryId(null)
    setError('')
  }

  function openCreate() {
    resetForm()
    setEditingId(null)
    setShowForm(true)
  }

  function openEdit(cat: AdminCategory) {
    setForm({ name: cat.name, slug: cat.slug })
    setImagePreview(cat.image_url)
    setCloudinaryId(cat.cloudinary_id)
    setEditingId(cat.id)
    setShowForm(true)
    setError('')
  }

  function closeForm() {
    setShowForm(false)
    setEditingId(null)
    resetForm()
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'albaeon/categories')
      const res = await fetch('/api/images/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.error || !data.data) throw new Error(data.error ?? 'Upload failed')
      setImagePreview(data.data.url)
      setCloudinaryId(data.data.public_id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image upload failed')
    } finally {
      setUploading(false)
    }
  }

  async function handleSave() {
    if (!form.name.trim() || !form.slug.trim()) {
      setError('Name and slug are required.')
      return
    }
    setLoading(true)
    setError('')

    try {
      if (editingId) {
        const res = await fetch(`/api/admin/categories/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, image_url: imagePreview, cloudinary_id: cloudinaryId }),
        })
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error ?? 'Failed to update')
        }
        const updated = await res.json()
        setCategories((prev) => prev.map((c) => (c.id === editingId ? { ...c, ...updated } : c)))
      } else {
        const res = await fetch('/api/admin/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, image_url: imagePreview, cloudinary_id: cloudinaryId }),
        })
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error ?? 'Failed to create')
        }
        const created = await res.json()
        setCategories((prev) => [...prev, { ...created, product_count: 0 }])
      }
      closeForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete "${name}"? Products in this category will become uncategorized.`)) return

    setLoading(true)
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Failed to delete')
      }
      setCategories((prev) => prev.filter((c) => c.id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete')
    } finally {
      setLoading(false)
    }
  }

  async function handleToggleActive(cat: AdminCategory) {
    try {
      const res = await fetch(`/api/admin/categories/${cat.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !cat.is_active }),
      })
      if (!res.ok) throw new Error('Failed to toggle')
      const updated = await res.json()
      setCategories((prev) => prev.map((c) => (c.id === cat.id ? { ...c, ...updated } : c)))
    } catch {
      alert('Failed to toggle category status')
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeading
        eyebrow="ADMIN"
        title="Categories"
        subtitle="Manage product categories"
        action={
          <AdminPrimaryButton label="ADD CATEGORY" icon={<Plus className="h-3.5 w-3.5" />} onClick={openCreate} />
        }
      />

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={closeForm}>
          <div className="w-full max-w-lg border border-gold/10 bg-[#1E1A2E] p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <p className={`${adminCinzel.className} text-[10px] tracking-[0.24em] text-gold`}>
                {editingId ? 'EDIT CATEGORY' : 'NEW CATEGORY'}
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
                  placeholder="T-Shirts"
                />
              </div>

              <div>
                <AdminFieldLabel>SLUG</AdminFieldLabel>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  className={`${adminRaleway.className} h-[46px] w-full border border-gold/12 bg-footer px-3 text-[13px] font-light text-text-primary outline-none placeholder:text-text-muted`}
                  placeholder="t-shirts"
                />
              </div>

              <div>
                <AdminFieldLabel>IMAGE</AdminFieldLabel>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {imagePreview ? (
                  <div className="relative">
                    <div className="relative h-[140px] w-full overflow-hidden border border-gold/12 bg-nav">
                      <Image src={imagePreview} alt="Category preview" fill sizes="460px" className="object-cover" />
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className={`${adminCinzel.className} mt-2 inline-flex items-center gap-1.5 text-[9px] tracking-[0.2em] text-gold hover:text-gold-hover disabled:opacity-50`}
                    >
                      {uploading ? (
                        <><Loader2 className="h-3 w-3 animate-spin" strokeWidth={1.8} /> UPLOADING...</>
                      ) : (
                        <><Camera className="h-3 w-3" strokeWidth={1.8} /> REPLACE IMAGE</>
                      )}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex h-[100px] w-full flex-col items-center justify-center gap-2 border border-dashed border-gold/25 bg-gold/[0.03] disabled:opacity-50"
                  >
                    {uploading ? (
                      <Loader2 className="h-6 w-6 animate-spin text-gold" strokeWidth={1.8} />
                    ) : (
                      <Camera className="h-6 w-6 text-gold" strokeWidth={1.8} />
                    )}
                    <span className={`${adminCinzel.className} text-[10px] tracking-[0.18em] text-gold`}>
                      {uploading ? 'UPLOADING...' : 'UPLOAD IMAGE'}
                    </span>
                    <span className={`${adminRaleway.className} text-[11px] font-light text-text-muted`}>
                      JPG, PNG or WebP
                    </span>
                  </button>
                )}
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
        <div className={`grid grid-cols-[60px_2fr_1fr_120px_100px_140px] gap-3 border-b border-gold/10 px-6 py-4 ${adminCinzel.className} text-[10px] tracking-[0.18em] text-text-muted`}>
          <span className="text-center">IMAGE</span>
          <span>NAME</span>
          <span>SLUG</span>
          <span className="text-center">PRODUCTS</span>
          <span className="text-center">STATUS</span>
          <span className="text-right">ACTIONS</span>
        </div>

        {categories.length === 0 ? (
          <div className={`${adminRaleway.className} px-6 py-16 text-center text-[13px] font-light text-text-muted`}>
            No categories yet. Click &quot;Add Category&quot; to create one.
          </div>
        ) : (
          categories.map((cat) => (
            <div
              key={cat.id}
              className={`grid grid-cols-[60px_2fr_1fr_120px_100px_140px] gap-3 items-center border-t border-gold/6 px-6 py-4 ${adminRaleway.className} text-[13px] font-light text-text-primary`}
            >
              <div className="flex justify-center">
                {cat.image_url ? (
                  <div className="relative h-[40px] w-[40px] overflow-hidden border border-gold/12 bg-nav">
                    <Image src={cat.image_url} alt={cat.name} fill sizes="40px" className="object-cover" />
                  </div>
                ) : (
                  <div className="flex h-[40px] w-[40px] items-center justify-center border border-gold/12 bg-nav text-[9px] text-text-muted">
                    —
                  </div>
                )}
              </div>
              <span className="truncate">{cat.name}</span>
              <span className="truncate text-text-muted">{cat.slug}</span>
              <span className="text-center">
                <span className={`${adminCinzel.className} ${cat.product_count > 0 ? 'text-gold' : 'text-text-muted'}`}>
                  {cat.product_count}
                </span>
              </span>
              <span className="flex justify-center">
                <button
                  type="button"
                  onClick={() => handleToggleActive(cat)}
                  className={`inline-flex items-center gap-1.5 text-[11px] ${cat.is_active ? 'text-[var(--status-success)]' : 'text-text-muted'}`}
                >
                  <span className={`h-2 w-2 rounded-full ${cat.is_active ? 'bg-[var(--status-success)]' : 'bg-text-muted'}`} />
                  {cat.is_active ? 'Active' : 'Inactive'}
                </button>
              </span>
              <span className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(cat)}
                  className="flex h-8 w-8 items-center justify-center border border-gold/12 text-text-muted transition-colors hover:border-gold/30 hover:text-gold"
                >
                  <Edit2 className="h-3.5 w-3.5" strokeWidth={1.8} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(cat.id, cat.name)}
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
