import { IconDashboard, IconDownload, IconTable } from "@tabler/icons-react";
import Dashboard from "@/feature/dashboard/Dashboard.tsx";
import Matrix from "@/feature/matrix/Matrix.tsx";
import Export from "@/feature/export/Export.tsx";

export const NAV_MAIN = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: IconDashboard,
        element: <Dashboard />,
    },
    {
        title: "Risiko-Matrix",
        url: "/matrix",
        icon: IconTable,
        element: <Matrix/>
    },
    {
        title: "Export / Import",
        url: "/export",
        icon: IconDownload,
        element: <Export/>,
    },
]