import { AdminAnalyticsPage } from "@/components/admin/AdminAnalytics";
import { adminAnalyticsScreens } from "@/lib/admin/analytics";

export default function AnalyticsRevenuePage() {
    return <AdminAnalyticsPage screen={adminAnalyticsScreens.revenue} />;
}
