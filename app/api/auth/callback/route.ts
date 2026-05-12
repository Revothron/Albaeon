import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// IMPORTANT: Ensure this URL is listed in Supabase Auth → URL Configuration → Redirect URLs:
//   https://<project>.supabase.co/dashboard/project/<id>/auth/url-configuration
// Add: https://albaeon.com/api/auth/callback
// Add: http://localhost:3000/api/auth/callback (for local dev)

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const redirectUrl = next.startsWith('/') ? `${origin}${next}` : origin
      return NextResponse.redirect(redirectUrl)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=oauth_failed`)
}
