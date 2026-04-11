import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  getCustomerOrders,
  formatOrderAmount,
  getOrderListMeta,
} from '@/lib/customer/orders'
import OrdersPageClient from '@/components/customer/account/OrdersPageClient'

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const orders = await getCustomerOrders()

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
      getOrderListMeta={getOrderListMeta}
      formatOrderAmount={formatOrderAmount}
    />
  )
}