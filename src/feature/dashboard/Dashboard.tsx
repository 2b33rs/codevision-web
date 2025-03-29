import {SectionCards} from "@/components/sidebar/section-cards.tsx";
import {ChartAreaInteractive} from "@/components/sidebar/chart-area-interactive.tsx";
import {DataTable} from "@/components/sidebar/data-table.tsx";

const Dashboard = () => {
    return (
        <>
            <SectionCards/>
            <div className="px-4 lg:px-6">
                <ChartAreaInteractive/>
            </div>
            <DataTable data={[
                {
                    "id": 1,
                    "header": "Cover page",
                    "type": "Cover page",
                    "status": "In Process",
                    "target": "18",
                    "limit": "5",
                    "reviewer": "Eddie Lake"
                }
            ]}/>
        </>
    );
};

export default Dashboard;