import { AdminAnalyticsPage } from "@/components/admin/AdminAnalytics";
import { adminAnalyticsScreens } from "@/lib/admin/analytics";

export default function AnalyticsOrdersPage() {
    return <AdminAnalyticsPage screen={adminAnalyticsScreens.orders} />;
}
