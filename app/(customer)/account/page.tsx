import Link from 'next/link'
import { Cinzel } from 'next/font/google'
import { createClient } from '@/lib/supabase/server'
import { getCustomerOrders, formatOrderAmount } from '@/lib/customer/orders'
import { redirect } from 'next/navigation'
import SignOutButton from '@/components/customer/account/SignOutButton'

export const dynamic = 'force-dynamic';

const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })

function DesktopStatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5 border border-gold bg-surface p-4">
      <p className="font-sans text-[12px] text-text-muted">{label}</p>
      <p className={`${cinzel.className} text-[30px] text-gold xl:text-[36px]`}>{value}</p>
    </div>
  )
}

function MobileInfoCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col gap-1.5 border border-gold bg-surface p-3.5">
      <h2 className={`${cinzel.className} text-[24px] text-gold`}>{title}</h2>
      <p className="whitespace-pre-line font-sans text-[12px] leading-[1.5] text-text-primary">{body}</p>
    </div>
  )
}

export default async function AccountDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name, display_name, email')
    .eq('id', user.id)
    .single()

  const { data: addresses } = await supabase
    .from('addresses')
    .select('city, country, type')
    .eq('user_id', user.id)
    .order('is_default', { ascending: false })

  const { data: wishlistItems } = await supabase
    .from('wishlists')
    .select('products (name)')
    .eq('user_id', user.id)
    .limit(3)

  const orders = await getCustomerOrders()

  const displayName =
    profile?.display_name ??
    [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') ??
    user.email?.split('@')[0] ?? 'Account'

  const email = profile?.email ?? user.email ?? ''
  const openOrders = orders.filter((o) => o.status !== 'Delivered').length
  const totalSpend = orders.reduce((sum, o) => sum + o.payment.amountCharged, 0)

  const metrics = [
    { label: 'Open Orders', value: String(openOrders).padStart(2, '0') },
    { label: 'Saved Items', value: String(wishlistItems?.length ?? 0).padStart(2, '0') },
    { label: 'Yearly Spend', value: formatOrderAmount(totalSpend, '₹') },
  ]

  const recentOrders = orders.slice(0, 2).map((o) => ({
    item: `#${o.id} — ${o.items[0]?.name ?? 'Order'}`,
    status: o.status,
    statusClassName:
      o.status === 'Shipped' ? 'text-[var(--status-info)]'
      : o.status === 'Delivered' ? 'text-[var(--status-success)]'
      : 'text-gold',
  }))

  const addressSummary = addresses
    ?.slice(0, 3)
    .map((a) => `${a.type === 'shipping' ? 'Shipping' : 'Billing'}: ${a.city}, ${a.country}`)
    .join('\n') ?? 'No addresses saved'

  const wishlistSummary =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    wishlistItems?.map((w: any) => w.products?.name).filter(Boolean).join('\n') ??
    'No saved items'

  const tabs = [
    { label: 'Dashboard', href: '/account', active: true },
    { label: 'Orders', href: '/account/orders' },
    { label: 'Addresses', href: '/account/addresses' },
    { label: 'Profile', href: '/account/profile' },
  ]

  return (
    <section className="min-h-screen bg-primary animate-fadeInUp">
      <div className="desktop-frame flex flex-col gap-6 py-5 sm:py-8 lg:gap-[26px] lg:py-11">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <h1 className={`${cinzel.className} text-[36px] text-gold sm:text-[44px] lg:text-[54px]`}>
              My Account
            </h1>
            <p className="max-w-[560px] font-sans text-[12px] text-text-muted sm:text-[14px] lg:text-[16px]">
              Control orders, addresses, profile details, and saved products from one place.
            </p>
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <Link href="/account/profile" className="inline-flex items-center justify-center border border-gold px-[18px] py-3 font-sans text-[14px] font-semibold text-gold transition-colors duration-200 hover:bg-gold hover:text-nav">
              Edit Profile
            </Link>
            <Link href="/account/orders" className="inline-flex items-center justify-center bg-gold px-[18px] py-3 font-sans text-[14px] font-bold text-nav transition-colors duration-200 hover:bg-gold-hover">
              View Orders
            </Link>
          </div>
        </div>

        {/* ── Desktop Layout ─────────────── */}
        <div className="hidden gap-6 lg:flex">
          <aside className="w-[340px] border border-gold bg-surface p-6">
            <div className="space-y-[18px]">
              <div className="flex flex-col items-center justify-center gap-3 bg-primary-deep p-[18px] text-center">
                <div className="h-[74px] w-[74px] rounded-full border border-gold bg-primary" />
                <p className={`${cinzel.className} text-[29px] text-gold`}>{displayName}</p>
                <p className="font-sans text-[14px] text-text-muted">{email}</p>
              </div>

              <div className="space-y-2.5">
                {tabs.map((tab) => (
                  <Link
                    key={tab.label}
                    href={tab.href}
                    className={`block px-3.5 py-3 font-sans text-[14px] font-semibold transition-colors duration-200 ${
                      tab.active ? 'bg-gold text-nav' : 'bg-primary-deep text-text-primary hover:text-gold'
                    }`}
                  >
                    {tab.label}
                  </Link>
                ))}
              </div>

              <SignOutButton />
            </div>
          </aside>

          <div className="flex-1 space-y-[18px]">
            <div className="grid gap-[14px] lg:grid-cols-2 2xl:grid-cols-3">
              {metrics.map((metric) => (
                <DesktopStatCard key={metric.label} label={metric.label} value={metric.value} />
              ))}
            </div>

            <div className="space-y-3 border border-gold bg-surface p-[22px]">
              <div className="flex items-center justify-between gap-4">
                <h2 className={`${cinzel.className} text-[26px] text-gold xl:text-[30px]`}>Recent Orders</h2>
                <Link href="/account/orders" className="font-sans text-[14px] font-semibold text-gold transition-colors duration-200 hover:text-gold-hover">
                  View All
                </Link>
              </div>

              {recentOrders.length > 0 ? (
                <div className="space-y-3">
                  {recentOrders.map((order) => (
                    <div key={order.item} className="flex items-center justify-between gap-4 bg-primary-deep px-3.5 py-3">
                      <p className="font-sans text-[14px] font-semibold text-text-primary">{order.item}</p>
                      <p className={`font-sans text-[14px] font-semibold ${order.statusClassName}`}>{order.status}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="font-sans text-[13px] text-text-muted">No orders yet.</p>
              )}
            </div>

            <div className="grid gap-[14px] lg:grid-cols-2">
              <div className="space-y-2.5 border border-gold bg-surface p-[18px]">
                <h2 className={`${cinzel.className} text-[24px] text-gold xl:text-[28px]`}>Addresses</h2>
                <p className="whitespace-pre-line font-sans text-[14px] leading-[1.7] text-text-primary">
                  {addressSummary}
                </p>
              </div>

              <div className="space-y-2.5 border border-gold bg-surface p-[18px]">
                <h2 className={`${cinzel.className} text-[24px] text-gold xl:text-[28px]`}>Wishlist Snapshot</h2>
                <p className="whitespace-pre-line font-sans text-[14px] leading-[1.7] text-text-primary">
                  {wishlistSummary}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Mobile Layout ──────────────── */}
        <div className="space-y-2.5 lg:hidden">
          <MobileInfoCard
            title="Orders"
            body={recentOrders[0] ? `${recentOrders[0].item} / ${recentOrders[0].status}` : 'No orders yet'}
          />
          <MobileInfoCard title="Addresses" body={addressSummary} />
          <MobileInfoCard
            title="Profile Details"
            body={`${displayName}\n${email}`}
          />
          <MobileInfoCard title="Wishlist" body={`Saved Items: ${wishlistItems?.length ?? 0}`} />
        </div>
      </div>
    </section>
  )
}