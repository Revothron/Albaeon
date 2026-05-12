import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getGelatoOrder } from '@/lib/gelato'
import { requireAdmin } from '@/lib/auth/require-admin'

export async function GET(req: Request) {
  const authError = await requireAdmin()
  if (authError) return authError

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  try {
    const data = await getGelatoOrder(id)
    return NextResponse.json({ data, error: null })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}