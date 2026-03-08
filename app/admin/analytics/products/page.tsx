import { AdminAnalyticsPage } from "@/components/admin/AdminAnalytics";
import { adminAnalyticsScreens } from "@/lib/admin/analytics";

export default function AnalyticsProductsPage() {
    return <AdminAnalyticsPage screen={adminAnalyticsScreens.products} />;
}
