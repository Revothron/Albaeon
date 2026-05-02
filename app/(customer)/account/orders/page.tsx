import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCustomerOrders, formatOrderAmount } from '@/lib/customer/orders'
import OrdersPageClient from '@/components/customer/account/OrdersPageClient'

export default async function OrdersPage() {
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

  const orders = await getCustomerOrders(user.id)

  const openOrders = orders.filter((o) => o.status !== 'Delivered').length
  const totalSpend = orders.reduce((sum, o) => sum + o.payment.amountCharged, 0)

  const metrics = [
    { label: 'Open Orders', value: String(openOrders).padStart(2, '0') },
    { label: 'Saved Items', value: '—' },
    { label: 'Yearly Spend', value: formatOrderAmount(totalSpend, '₹') },
  ]

  return (
    <OrdersPageClient
      orders={orders}
      metrics={metrics}
      displayName={displayName}
      email={email}
    />
  )
}