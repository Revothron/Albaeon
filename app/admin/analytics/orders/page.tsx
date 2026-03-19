import { AdminAnalyticsPage } from "@/components/admin/AdminAnalytics";
import { adminAnalyticsScreens } from "@/lib/admin/analytics";

export default function AnalyticsOrdersPage() {
    const baseScreen = adminAnalyticsScreens.orders;
    const filteredColumns = baseScreen.table.columns.filter((column) => column.key !== "coupons");
    const filteredRows = baseScreen.table.rows.map((row) => {
        const { coupons, ...rest } = row.cells;
        return { ...row, cells: rest };
    });

    return (
        <AdminAnalyticsPage
            screen={{
                ...baseScreen,
                table: {
                    ...baseScreen.table,
                    columns: filteredColumns,
                    rows: filteredRows,
                    gridTemplateColumns: "minmax(0,1fr) 120px 140px 140px 120px 150px",
                },
            }}
        />
    );
}
