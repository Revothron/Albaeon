import Navbar from "@/components/customer/Navbar";
import Footer from "@/components/customer/Footer";
import MaintenanceModeView from "@/components/customer/MaintenanceModeView";
import { getMaintenanceMode } from "@/lib/maintenance";
import MaintenanceWatcher from "@/components/customer/MaintenanceWatcher";

export const dynamic = "force-dynamic";

export default async function CustomerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const maintenanceModeEnabled = await getMaintenanceMode();

    if (maintenanceModeEnabled) {
        return <MaintenanceModeView />;
    }

    return (
        <>
            <MaintenanceWatcher when="enabled" />
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
        </>
    );
}
