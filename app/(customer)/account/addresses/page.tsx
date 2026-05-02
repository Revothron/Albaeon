import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AccountShell from '@/components/customer/account/AccountShell'
import AddressesClient from '@/components/customer/account/AddressesClient'

export default async function AddressesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name, display_name, email')
    .eq('id', user.id)
    .single()

  const displayName =
    profile?.display_name ??
    [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') ??
    user.email?.split('@')[0] ?? 'Account'

  const email = profile?.email ?? user.email ?? ''

  const { data: addresses } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', user.id)
    .order('is_default', { ascending: false })

  return (
    <div className="animate-fadeInUp">
      <AccountShell
        activeTab="addresses"
        title="My Addresses"
        subtitle="Manage your shipping and billing addresses."
        displayName={displayName}
        email={email}
      >
        <AddressesClient addresses={addresses ?? []} userId={user.id} />
      </AccountShell>
    </div>
  )
}