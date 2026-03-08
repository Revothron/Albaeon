import Link from "next/link";
import { Download, Eye } from "lucide-react";
import {
    AdminFieldLabel,
    AdminOutlineButton,
    AdminPagination,
    AdminPageHeading,
    AdminSelectBox,
    AdminTextInput,
} from "@/components/admin/AdminUi";
import { adminCinzel, adminRaleway } from "@/components/admin/adminFonts";
import { adminCustomers } from "@/lib/admin/customers";

export default function AdminCustomersPage() {
    return (
        <div className="space-y-5 md:space-y-6">
            <AdminPageHeading
                eyebrow="CUSTOMERS"
                title="Customers"
                subtitle="3,284 registered customers"
                action={<AdminOutlineButton label="EXPORT CSV" icon={<Download className="h-3.5 w-3.5" strokeWidth={1.8} />} />}
            />

            <section className="border border-gold/10 bg-[#1E1A2E] px-5 py-4 md:px-6">
                <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_160px_180px]">
                    <div>
                        <AdminFieldLabel>SEARCH CUSTOMERS</AdminFieldLabel>
                        <AdminTextInput placeholder="Search by name, email, username..." />
                    </div>
                    <div>
                        <AdminFieldLabel>COUNTRY</AdminFieldLabel>
                        <AdminSelectBox value="All Countries" />
                    </div>
                    <div>
                        <AdminFieldLabel>SORT</AdminFieldLabel>
                        <AdminSelectBox value="Recent Registered" />
                    </div>
                </div>
            </section>

            <section className="overflow-x-auto border border-gold/10 bg-[#1E1A2E]">
                <table className="w-full min-w-[1560px] border-collapse">
                    <thead className="bg-nav">
                        <tr className={`${adminCinzel.className} text-[10px] tracking-[0.18em] text-text-muted`}>
                            {["NAME", "USERNAME", "REGISTERED", "EMAIL", "ORDERS", "SPENT", "LAST ORDER", "AOV", "COUNTRY", "CITY", "REGION", "POSTAL", "VIEW"].map((column) => (
                                <th key={column} className="px-3 py-3 text-center font-semibold md:px-6">
                                    {column}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {adminCustomers.map((customer) => (
                            <tr key={customer.id} className="border-t border-gold/6">
                                <td className={`${adminRaleway.className} px-3 py-3 text-center text-[13px] font-medium text-text-primary md:px-6`}>
                                    {customer.name}
                                </td>
                                <td className={`${adminRaleway.className} px-3 py-3 text-center text-[12px] font-light text-text-muted md:px-6`}>
                                    {customer.username}
                                </td>
                                <td className={`${adminRaleway.className} px-3 py-3 text-center text-[12px] font-light text-text-muted md:px-6`}>
                                    {customer.registered}
                                </td>
                                <td className={`${adminRaleway.className} px-3 py-3 text-center text-[12px] font-light text-text-muted md:px-6`}>
                                    {customer.email}
                                </td>
                                <td className={`${adminCinzel.className} px-3 py-3 text-center text-[13px] text-text-primary md:px-6`}>
                                    {customer.orders}
                                </td>
                                <td className={`${adminCinzel.className} px-3 py-3 text-center text-[13px] text-gold md:px-6`}>
                                    {customer.spent}
                                </td>
                                <td className={`${adminRaleway.className} px-3 py-3 text-center text-[12px] font-light text-text-muted md:px-6`}>
                                    {customer.lastOrder}
                                </td>
                                <td className={`${adminCinzel.className} px-3 py-3 text-center text-[13px] text-text-primary md:px-6`}>
                                    {customer.aov}
                                </td>
                                <td className={`${adminRaleway.className} px-3 py-3 text-center text-[12px] font-light text-text-muted md:px-6`}>
                                    {customer.countryCode}
                                </td>
                                <td className={`${adminRaleway.className} px-3 py-3 text-center text-[12px] font-light text-text-muted md:px-6`}>
                                    {customer.city}
                                </td>
                                <td className={`${adminRaleway.className} px-3 py-3 text-center text-[12px] font-light text-text-muted md:px-6`}>
                                    {customer.region}
                                </td>
                                <td className={`${adminRaleway.className} px-3 py-3 text-center text-[12px] font-light text-text-muted md:px-6`}>
                                    {customer.postal}
                                </td>
                                <td className="px-3 py-3 text-center md:px-6">
                                    <Link
                                        href={`/admin/customers/${customer.id}`}
                                        className="inline-flex text-gold transition-colors duration-200 hover:text-gold-hover"
                                        aria-label={`View ${customer.name}`}
                                    >
                                        <Eye className="h-3.5 w-3.5" strokeWidth={1.8} />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <AdminPagination
                    summary={`Showing 1-${adminCustomers.length} of 3,284 customers`}
                    pages={[1, 2, 3, "...", 548]}
                    currentPage={1}
                />
            </section>
        </div>
    );
}
