import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  getAllCollections,
  createCollection,
  setCollectionProducts,
} from '@/lib/admin/collections'
import { z } from 'zod'

const CreateCollectionSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  filter_rule: z.string().min(1),
  sort_order: z.number().int().min(0).optional(),
  is_active: z.boolean().optional(),
  product_ids: z.array(z.string().uuid()).optional(),
})

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const collections = await getAllCollections()
  return NextResponse.json(collections)
}

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

  const parsed = CreateCollectionSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed.', issues: parsed.error.issues },
      { status: 422 }
    )
  }

  const { collection, error } = await createCollection(parsed.data)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (collection && parsed.data.product_ids) {
    const { error: assocError } = await setCollectionProducts(
      collection.id,
      parsed.data.product_ids
    )
    if (assocError) {
      console.error('Failed to associate products:', assocError)
    }
  }

  return NextResponse.json(collection)
}
