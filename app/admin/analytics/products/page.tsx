import { AdminAnalyticsPage } from "@/components/admin/AdminAnalytics";
import { adminAnalyticsScreens } from "@/lib/admin/analytics";

export default function AnalyticsProductsPage() {
    const baseScreen = adminAnalyticsScreens.products;
    const reportOptions = [
        "Monthly Report",
        "3-Month Report",
        "6-Month Report",
        "Yearly Report",
    ];

    return (
        <AdminAnalyticsPage
            screen={{
                ...baseScreen,
                table: {
                    ...baseScreen.table,
                    reportOptions,
                },
            }}
        />
    );
}
