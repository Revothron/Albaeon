import { AdminAnalyticsPage } from "@/components/admin/AdminAnalytics";
import { adminAnalyticsScreens } from "@/lib/admin/analytics";

export default function AnalyticsCategoriesPage() {
    return <AdminAnalyticsPage screen={adminAnalyticsScreens.categories} />;
}
