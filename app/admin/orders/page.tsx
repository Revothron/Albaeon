import Link from "next/link";
import { Download, Eye } from "lucide-react";
import {
    AdminDateRangeBox,
    AdminFieldLabel,
    AdminOutlineButton,
    AdminPagination,
    AdminPageHeading,
    AdminSelectBox,
    AdminStatusBadge,
    AdminTextInput,
} from "@/components/admin/AdminUi";
import { adminCinzel, adminRaleway } from "@/components/admin/adminFonts";

const orders = [
    {
        id: "ALB-00142",
        customer: "Arjun Sharma",
        email: "arjun@gmail.com",
        date: "28 Feb 2026",
        amount: "Rs 1,299",
        payment: { label: "Paid", tone: "success" as const },
        fulfillment: { label: "Shipped", tone: "info" as const },
        provider: "Banian",
    },
    {
        id: "ALB-00141",
        customer: "Priya Nair",
        email: "priya@gmail.com",
        date: "27 Feb 2026",
        amount: "Rs 2,199",
        payment: { label: "Paid", tone: "success" as const },
        fulfillment: { label: "Fulfilled", tone: "success" as const },
        provider: "Gelato",
    },
    {
        id: "ALB-00140",
        customer: "Rahul Verma",
        email: "rahul@gmail.com",
        date: "26 Feb 2026",
        amount: "Rs 1,799",
        payment: { label: "Paid", tone: "success" as const },
        fulfillment: { label: "Processing", tone: "warning" as const },
        provider: "Banian",
    },
    {
        id: "ALB-00139",
        customer: "Sneha Patel",
        email: "sneha@gmail.com",
        date: "25 Feb 2026",
        amount: "Rs 3,598",
        payment: { label: "Paid", tone: "success" as const },
        fulfillment: { label: "Pending", tone: "muted" as const },
        provider: "Banian",
    },
    {
        id: "ALB-00138",
        customer: "Kiran Mehta",
        email: "kiran@gmail.com",
        date: "24 Feb 2026",
        amount: "Rs 1,299",
        payment: { label: "Paid", tone: "success" as const },
        fulfillment: { label: "Fulfilled", tone: "success" as const },
        provider: "Gelato",
    },
    {
        id: "ALB-00137",
        customer: "Maya Kapoor",
        email: "maya@gmail.com",
        date: "24 Feb 2026",
        amount: "Rs 2,499",
        payment: { label: "Pending", tone: "warning" as const },
        fulfillment: { label: "Processing", tone: "warning" as const },
        provider: "Banian",
    },
    {
        id: "ALB-00136",
        customer: "Ethan Cole",
        email: "ethan@g.com",
        date: "23 Feb 2026",
        amount: "$210",
        payment: { label: "Paid", tone: "success" as const },
        fulfillment: { label: "Delivered", tone: "success" as const },
        provider: "Gelato",
    },
];

const headerColumns = [
    "",
    "ORDER ID",
    "CUSTOMER",
    "DATE",
    "AMOUNT",
    "PAYMENT",
    "FULFILLMENT",
    "PROVIDER",
    "ACTION",
];

function CheckCell() {
    return (
        <span className="inline-flex h-3 w-3 border border-text-muted/60" aria-hidden="true" />
    );
}

export default function AdminOrdersPage() {
    return (
        <div className="space-y-5 md:space-y-6">
            <AdminPageHeading
                eyebrow="ORDERS"
                title="Orders"
                subtitle="1,284 total orders"
                action={<AdminOutlineButton label="EXPORT CSV" icon={<Download className="h-3.5 w-3.5" strokeWidth={1.8} />} />}
            />

            <section className="border border-gold/10 bg-[#1E1A2E] px-5 py-4 md:px-6">
                <div className="grid gap-3 xl:grid-cols-[260px_150px_170px_120px_minmax(0,1fr)_110px]">
                    <div>
                        <AdminFieldLabel>DATE RANGE</AdminFieldLabel>
                        <AdminDateRangeBox fromLabel="From date" toLabel="To date" />
                    </div>
                    <div>
                        <AdminFieldLabel>PAYMENT STATUS</AdminFieldLabel>
                        <AdminSelectBox value="All" />
                    </div>
                    <div>
                        <AdminFieldLabel>FULFILLMENT STATUS</AdminFieldLabel>
                        <AdminSelectBox value="All" />
                    </div>
                    <div>
                        <AdminFieldLabel>PROVIDER</AdminFieldLabel>
                        <AdminSelectBox value="All" />
                    </div>
                    <div>
                        <AdminFieldLabel>SEARCH ORDER</AdminFieldLabel>
                        <AdminTextInput placeholder="Order ID, customer name..." />
                    </div>
                    <div className="self-end">
                        <button
                            type="button"
                            className={`${adminRaleway.className} inline-flex h-[38px] items-center border border-gold/20 px-4 text-[12px] text-text-muted transition-colors duration-200 hover:text-text-primary`}
                        >
                            RESET
                        </button>
                    </div>
                </div>
            </section>

            <section className="overflow-x-auto border border-gold/10 bg-[#1E1A2E]">
                <table className="w-full min-w-[1180px] border-collapse">
                    <thead className="bg-nav">
                        <tr className={`${adminCinzel.className} text-[10px] tracking-[0.18em] text-text-muted`}>
                            {headerColumns.map((column, index) => (
                                <th key={`${column}-${index}`} className="px-3 py-4 text-center font-semibold md:px-6">
                                    {column || <CheckCell />}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id} className="border-t border-gold/6">
                                <td className="px-3 py-4 text-center md:px-6">
                                    <CheckCell />
                                </td>
                                <td className={`${adminCinzel.className} px-3 py-4 text-center text-[13px] text-gold md:px-6`}>
                                    {order.id}
                                </td>
                                <td className="px-3 py-4 text-center md:px-6">
                                    <div className="space-y-1">
                                        <p className={`${adminRaleway.className} text-[13px] font-medium text-text-primary`}>
                                            {order.customer}
                                        </p>
                                        <p className={`${adminRaleway.className} text-[11px] font-light text-text-muted`}>
                                            {order.email}
                                        </p>
                                    </div>
                                </td>
                                <td className={`${adminRaleway.className} px-3 py-4 text-center text-[13px] font-light text-text-muted md:px-6`}>
                                    {order.date}
                                </td>
                                <td className={`${adminCinzel.className} px-3 py-4 text-center text-[13px] text-text-primary md:px-6`}>
                                    {order.amount}
                                </td>
                                <td className="px-3 py-4 text-center md:px-6">
                                    <AdminStatusBadge label={order.payment.label} tone={order.payment.tone} />
                                </td>
                                <td className="px-3 py-4 text-center md:px-6">
                                    <AdminStatusBadge label={order.fulfillment.label} tone={order.fulfillment.tone} />
                                </td>
                                <td className={`${adminRaleway.className} px-3 py-4 text-center text-[12px] font-light text-text-muted md:px-6`}>
                                    {order.provider}
                                </td>
                                <td className="px-3 py-4 text-center md:px-6">
                                    <Link
                                        href={`/admin/orders/${order.id.toLowerCase()}`}
                                        className="inline-flex text-gold transition-colors duration-200 hover:text-gold-hover"
                                        aria-label={`View ${order.id}`}
                                    >
                                        <Eye className="h-3.5 w-3.5" strokeWidth={1.8} />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <AdminPagination
                    summary="Showing 1-7 of 1,284 orders"
                    pages={[1, 2, 3, "...", 184]}
                    currentPage={1}
                />
            </section>
        </div>
    );
}
