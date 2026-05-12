import CheckoutShell from '@/components/customer/checkout/CheckoutShell'
import PaymentContent from '@/components/customer/checkout/PaymentContent'
export const dynamic = 'force-dynamic'

export default function CheckoutPaymentPage() {
  return (
    <CheckoutShell
      title="Payment"
      subtitle="Review your order and complete payment."
      activeStep="payment"
    >
      <PaymentContent />
    </CheckoutShell>
  )
}