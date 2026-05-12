import CheckoutShell from '@/components/customer/checkout/CheckoutShell'
import ConfirmationContent from '@/components/customer/checkout/ConfirmationContent'
export const dynamic = 'force-dynamic'

export default function CheckoutConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>
}) {
  return (
    <CheckoutShell
      title="Confirmation"
      subtitle="Your order has been placed successfully."
      activeStep="confirmation"
    >
      <ConfirmationContent searchParamsPromise={searchParams} />
    </CheckoutShell>
  )
}