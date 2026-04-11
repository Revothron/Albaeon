import Navbar from '@/components/customer/Navbar'
import Footer from '@/components/customer/Footer'
import WishlistSync from '@/components/customer/WishlistSync'

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <WishlistSync />
      <Navbar />
      {children}
      <Footer />
    </>
  )
}