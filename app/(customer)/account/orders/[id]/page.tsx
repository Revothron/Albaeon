import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import OrderDetailsView from '@/components/customer/account/OrderDetailsView'
import { getCustomerOrderById } from '@/lib/customer/orders'

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { id } = await params
  const order = await getCustomerOrderById(decodeURIComponent(id))

  if (!order) notFound()

  return <OrderDetailsView order={order} />
}