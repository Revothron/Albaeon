import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getGelatoTemplateVariants } from '@/lib/gelato'

export async function GET(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const templateId = searchParams.get('templateId')
  if (!templateId) return NextResponse.json({ error: 'templateId required' }, { status: 400 })

  try {
    const variants = await getGelatoTemplateVariants(templateId)
    return NextResponse.json({ variants, error: null })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}