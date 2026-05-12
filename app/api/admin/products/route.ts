import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { saveAdminProduct, deleteAdminProduct } from '@/lib/admin/products'
import { cacheDel, CACHE_KEYS } from '@/lib/redis'

const CreateProductSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
  sku: z.string().min(1).max(100),
  description: z.string().optional(),
  price_inr: z.number().positive(),
  price_usd: z.number().positive(),
  category_id: z.string().uuid(),
  status: z.enum(['active', 'draft']),
  is_new_arrival: z.boolean().default(false),
  is_best_seller: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
  meta_title: z.string().max(60).optional(),
  meta_description: z.string().max(160).optional(),
})

const DeleteProductSchema = z.object({
  id: z.string().uuid(),
})

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  const parsed = CreateProductSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed.', issues: parsed.error.issues },
      { status: 422 }
    )
  }

  const result = await saveAdminProduct(parsed.data)

  if (!result.error) {
    await cacheDel(CACHE_KEYS.products())
    if (body.fields?.slug) {
      await cacheDel(CACHE_KEYS.product(body.fields.slug))
    }
  }

  return NextResponse.json(result)
}

export async function DELETE(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  const parsed = DeleteProductSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed.', issues: parsed.error.issues },
      { status: 422 }
    )
  }

  const { id } = parsed.data
  const result = await deleteAdminProduct(id)

  if (!result.error) {
    await cacheDel(CACHE_KEYS.products())
  }

  return NextResponse.json(result)
}
