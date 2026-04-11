import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminSupportInbox from '@/components/admin/AdminSupportInbox'

export default async function AdminSupportPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  return (
    <div className="animate-fadeInUp">
      <AdminSupportInbox />
    </div>
  )
}