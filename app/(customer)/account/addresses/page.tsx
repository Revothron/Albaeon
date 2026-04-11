import { redirect } from 'next/navigation'
import { Cinzel } from 'next/font/google'
import { createClient } from '@/lib/supabase/server'
import AccountShell from '@/components/customer/account/AccountShell'
import AddressesClient from '@/components/customer/account/AddressesClient'

const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })

export default async function AddressesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

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
      >
        <AddressesClient addresses={addresses ?? []} userId={user.id} />
      </AccountShell>
    </div>
  )
}