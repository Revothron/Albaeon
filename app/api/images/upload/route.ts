import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { uploadImage } from '@/lib/cloudinary'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ data: null, error: 'Forbidden' }, { status: 403 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const folder = (formData.get('folder') as string) ?? 'albaeon/products'

    if (!file) {
      return NextResponse.json({ data: null, error: 'No file provided' }, { status: 400 })
    }

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ data: null, error: 'Invalid file type' }, { status: 400 })
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ data: null, error: 'File too large. Max 10MB.' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const result = await uploadImage(buffer, { folder })

    return NextResponse.json({
      data: {
        public_id: result.public_id,
        url: result.secure_url,
        width: result.width,
        height: result.height,
      },
      error: null,
    })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ data: null, error: 'Upload failed' }, { status: 500 })
  }
}