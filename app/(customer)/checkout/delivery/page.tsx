import CheckoutShell from '@/components/customer/checkout/CheckoutShell'
import DeliveryForm from '@/components/customer/checkout/DeliveryForm'
export const dynamic = 'force-dynamic'

export default function CheckoutDeliveryPage() {
  return (
    <CheckoutShell
      title="Delivery"
      subtitle="Enter your shipping address."
      activeStep="delivery"
    >
      <DeliveryForm />
    </CheckoutShell>
  )
}