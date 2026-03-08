import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-footer text-text-primary md:flex">
            <AdminSidebar />
            <div className="min-w-0 flex-1">
                <AdminHeader />
                <main className="p-4 md:p-8">{children}</main>
            </div>
        </div>
    );
}
