import Navbar from "@/components/customer/Navbar";
import Footer from "@/components/customer/Footer";

export default function CustomerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
        </>
    );
}
