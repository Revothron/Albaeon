'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SignOutButton() {
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="flex w-full items-center justify-center border border-red-500 px-3.5 py-3 font-sans text-[14px] font-semibold text-red-500 transition-colors duration-200 hover:bg-red-500/10"
    >
      Logout
    </button>
  )
}