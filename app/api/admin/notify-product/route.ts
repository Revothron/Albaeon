import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendNewProductNotification } from '@/lib/emails'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase
      .from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { productName, productDescription, productPrice, productImage, productSlug } = await req.json()

    // Get all customer emails
    const adminSupabase = createAdminClient()
    const { data: customers } = await adminSupabase
      .from('profiles')
      .select('email')
      .eq('role', 'customer')
      .eq('is_active', true)

    const recipients = (customers ?? [])
      .map((c) => c.email)
      .filter(Boolean) as string[]

    if (recipients.length === 0) {
      return NextResponse.json({ ok: true, sent: 0 })
    }

    await sendNewProductNotification({
      recipients,
      productName,
      productDescription,
      productPrice,
      productImage,
      productSlug,
    })

    return NextResponse.json({ ok: true, sent: recipients.length })
  } catch (err) {
    console.error('Product notification error:', err)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}