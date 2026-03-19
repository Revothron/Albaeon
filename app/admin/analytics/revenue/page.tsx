import { AdminAnalyticsPage } from "@/components/admin/AdminAnalytics";
import { adminAnalyticsScreens } from "@/lib/admin/analytics";

export default function AnalyticsRevenuePage() {
    const baseScreen = adminAnalyticsScreens.revenue;
    const filteredSeries = baseScreen.series.filter((item) => item.label !== "Coupons");
    const filteredColumns = baseScreen.table.columns.filter((column) => column.key !== "coupons");
    const filteredRows = baseScreen.table.rows.map((row) => {
        const { coupons, ...rest } = row.cells;
        return { ...row, cells: rest };
    });

    return (
        <AdminAnalyticsPage
            screen={{
                ...baseScreen,
                series: filteredSeries,
                table: {
                    ...baseScreen.table,
                    columns: filteredColumns,
                    rows: filteredRows,
                    gridTemplateColumns: "minmax(0,1fr) 90px 150px 150px 150px",
                },
            }}
        />
    );
}
