import Link from 'next/link'
import { notFound } from 'next/navigation'
import { adminCinzel, adminCormorant, adminRaleway } from '@/components/admin/adminFonts'
import { AdminStatusBadge } from '@/components/admin/AdminUi'
import {
    getAdminCustomerByIdFromDB,
    type AdminCustomerOrderStatus,
} from '@/lib/admin/customers'
import { requireAdminPage } from '@/lib/auth/require-admin-page'
import CustomerActions from '@/components/admin/CustomerActions'

function getInitials(name: string) {
    return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()
}

function getStatusTone(status: AdminCustomerOrderStatus) {
    switch (status) {
        case 'Delivered': return 'success'
        case 'Shipped': return 'info'
        case 'Processing': return 'warning'
        default: return 'muted'
    }
}

function DetailCard({ title, children, className = '' }: {
    title: string; children: React.ReactNode; className?: string
}) {
    return (
        <section className={`border border-gold/10 bg-[#1E1A2E] p-6 ${className}`}>
            <p className={`${adminCinzel.className} text-[10px] font-semibold tracking-[0.3em] text-gold`}>
                {title}
            </p>
            <div className="mt-4">{children}</div>
        </section>
    )
}

function StatRow({ label, value, valueClassName = 'text-text-primary', withBorder = true }: {
    label: string; value: string; valueClassName?: string; withBorder?: boolean
}) {
    return (
        <div className={`flex items-center justify-between gap-4 py-2.5 ${withBorder ? 'border-b border-gold/6' : ''}`}>
            <span className={`${adminRaleway.className} text-[13px] font-light text-text-muted`}>{label}</span>
            <span className={`${adminCinzel.className} text-[14px] ${valueClassName}`}>{value}</span>
        </div>
    )
}

export const dynamic = 'force-dynamic';

export default async function CustomerDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    await requireAdminPage()

    const { id } = await params

    const customerData = await getAdminCustomerByIdFromDB(id)

    if (!customerData) notFound()

    return (
        <div className="space-y-5 animate-fadeInUp">
            <div>
                <div className={`flex items-center gap-1.5 ${adminRaleway.className} text-[12px] font-light`}>
                    <Link href="/admin/customers" className="text-text-muted hover:text-gold transition-colors">
                        Customers
                    </Link>
                    <span className="text-text-muted">/</span>
                    <span className="text-gold">{customerData.name}</span>
                </div>
                <h1 className={`${adminCormorant.className} mt-2 text-[32px] font-light text-text-primary`}>
                    {customerData.name}
                </h1>
            </div>

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
                <div className="space-y-4">

                    {/* Profile */}
                    <DetailCard title="CUSTOMER PROFILE">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-gold text-[14px] text-gold">
                                    {getInitials(customerData.name)}
                                </div>
                                <div className="min-w-0 flex-1 space-y-1">
                                    <p className={`${adminRaleway.className} text-[15px] font-medium text-text-primary`}>
                                        {customerData.name}
                                    </p>
                                    <p className={`${adminRaleway.className} text-[13px] font-light text-text-muted`}>
                                        {customerData.username} / {customerData.email} / {customerData.phone}
                                    </p>
                                    <p className={`${adminRaleway.className} text-[12px] font-light text-text-muted`}>
                                        Member since {customerData.memberSince}
                                    </p>
                                    <p className={`${adminRaleway.className} text-[12px] font-light text-text-muted`}>
                                        {customerData.country} / {customerData.city}, {customerData.region} {customerData.postal}
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                {[
                                    { label: 'Total Orders', value: String(customerData.orders), cls: 'text-text-primary' },
                                    { label: 'Total Spent', value: customerData.spent, cls: 'text-gold' },
                                    { label: 'AOV', value: customerData.aov, cls: 'text-text-primary' },
                                    { label: 'Last Order', value: customerData.lastOrder, cls: 'text-text-primary' },
                                ].map((stat) => (
                                    <div key={stat.label} className="space-y-1">
                                        <p className={`${adminRaleway.className} text-[12px] font-light text-text-muted`}>{stat.label}</p>
                                        <p className={`${adminCinzel.className} text-[16px] ${stat.cls}`}>{stat.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </DetailCard>

                    {/* Order History */}
                    <DetailCard title="ORDER HISTORY">
                        {customerData.orderHistory.length === 0 ? (
                            <p className={`${adminRaleway.className} text-[13px] text-text-muted`}>No orders yet.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <div className="min-w-[520px]">
                                    <div className="flex items-center bg-nav px-6 py-3">
                                        {['ORDER ID', 'DATE', 'AMOUNT', 'STATUS', 'ACTION'].map((heading, i) => (
                                            <div
                                                key={heading}
                                                className={`${adminCinzel.className} text-[10px] font-semibold tracking-[0.2em] text-text-muted ${i === 0 ? 'w-[140px]' : i === 1 ? 'w-[130px]' : i === 2 ? 'w-[120px]' : i === 3 ? 'w-[140px]' : 'w-[80px]'
                                                    }`}
                                            >
                                                {heading}
                                            </div>
                                        ))}
                                    </div>
                                    {customerData.orderHistory.map((order, i) => (
                                        <div
                                            key={order.id}
                                            className={`flex items-center px-6 py-3 ${i < customerData.orderHistory.length - 1 ? 'border-b border-gold/6' : ''}`}
                                        >
                                            <div className={`${adminCinzel.className} w-[140px] text-[13px] text-gold`}>{order.id}</div>
                                            <div className={`${adminRaleway.className} w-[130px] text-[12px] font-light text-text-muted`}>{order.date}</div>
                                            <div className={`${adminCinzel.className} w-[120px] text-[13px] text-text-primary`}>{order.amount}</div>
                                            <div className="w-[140px]">
                                                <AdminStatusBadge label={order.status} tone={getStatusTone(order.status)} />
                                            </div>
                                            <div className="w-[80px]">
                                                <Link
                                                    href={`/admin/orders/${order.id.toLowerCase()}`}
                                                    className={`${adminCinzel.className} text-[9px] font-semibold tracking-[0.12em] text-gold transition-colors duration-200 hover:text-gold-hover`}
                                                >
                                                    View →
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </DetailCard>

                    {/* Addresses */}
                    <DetailCard title="ADDRESSES">
                        <div className="grid gap-4 md:grid-cols-2">
                            {[
                                { label: 'SHIPPING ADDRESS', lines: customerData.shippingAddress },
                                { label: 'BILLING ADDRESS', lines: customerData.billingAddress },
                            ].map((addr) => (
                                <div key={addr.label} className="space-y-2">
                                    <p className={`${adminCinzel.className} text-[9px] font-semibold tracking-[0.25em] text-text-muted`}>
                                        {addr.label}
                                    </p>
                                    <div className={`${adminRaleway.className} space-y-1 text-[13px] font-light leading-7 text-text-primary`}>
                                        {addr.lines.map((line, i) => <p key={i}>{line}</p>)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </DetailCard>
                </div>

                {/* Right sidebar */}
                <div className="space-y-4">
                    <DetailCard title="CUSTOMER STATS">
                        <div>
                            <StatRow label="Total Orders" value={String(customerData.orders)} />
                            <StatRow label="Total Spent" value={customerData.spent} valueClassName="text-gold" />
                            <StatRow label="AOV" value={customerData.aov} />
                            <StatRow label="Last Order" value={customerData.lastOrder} />
                            <StatRow label="Country" value={customerData.country} />
                            <StatRow label="Segment" value={customerData.segment} withBorder={false} />
                        </div>
                    </DetailCard>

                    <DetailCard title="ACCOUNT ACTIONS">
                        <CustomerActions
                            customer={{
                                id: customerData.id,
                                name: customerData.name,
                                email: customerData.email,
                                phone: customerData.phone,
                                registered: customerData.registered,
                                memberSince: customerData.memberSince,
                                country: customerData.country,
                                city: customerData.city,
                                region: customerData.region,
                                postal: customerData.postal,
                                segment: customerData.segment,
                                orders: typeof customerData.orders === 'number' ? customerData.orders : Number(customerData.orders),
                                spent: customerData.spent,
                                aov: customerData.aov,
                                lastOrder: customerData.lastOrder,
                                shippingAddress: customerData.shippingAddress,
                                billingAddress: customerData.billingAddress,
                                orderHistory: customerData.orderHistory,
                            }}
                        />
                    </DetailCard>
                </div>
            </div>
        </div>
    )
}