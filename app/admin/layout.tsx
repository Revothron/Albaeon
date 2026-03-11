"use client";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { usePathname } from "next/navigation";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-footer text-text-primary md:flex">
            <AdminSidebar />
            <div className="min-w-0 flex-1">
                <div className="w-full max-w-[1220px]">
                    <AdminHeader />
                    <main className="p-4 md:p-8">{children}</main>
                </div>
            </div>
        </div>
    );
}
