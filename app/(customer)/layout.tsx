import Navbar from "@/components/customer/Navbar";
import Footer from "@/components/customer/Footer";
import MaintenanceModeView from "@/components/customer/MaintenanceModeView";

function isMaintenanceModeEnabled(value?: string) {
    if (!value) {
        return false;
    }

    const normalized = value.trim().toLowerCase();

    return !["false", "0", "off", "no"].includes(normalized);
}

export default function CustomerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const maintenanceModeEnabled = isMaintenanceModeEnabled(process.env.MAINTENANCE_MODE);

    if (maintenanceModeEnabled) {
        return <MaintenanceModeView />;
    }

    return (
        <>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
        </>
    );
}
