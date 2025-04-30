import {
  IconBuildingFactory,
  IconBuildingWarehouse,
  IconDashboard,
  IconDownload,
  IconShoppingCart,
  IconTable,
} from "@tabler/icons-react";
import Dashboard from "@/feature/dashboard/Dashboard.tsx";
import Export from "@/feature/export/Export.tsx";
import Order from "@/feature/order/Order.tsx";
import { User2 } from "lucide-react";
import Customer from "@/feature/customer/Customer.tsx";

export const NAV_MAIN = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconDashboard,
    element: <Dashboard />,
  },
  {
    title: "Kunden",
    url: "/customer",
    icon: User2,
    element: <Customer />,
  },
  {
    title: "Bestellung",
    url: "/order",
    icon: IconTable,
    element: <Order />,
  },
  {
    title: "Export / Import",
    url: "/export",
    icon: IconDownload,
    element: <Export />,
  },
];

export const NAV_ABTEILUNGEN = [
  {
    title: "Verkauf & Versand",
    url: "/",
    icon: IconShoppingCart,
  },
  {
    title: "Produktion",
    url: "https://www.google.de/ref-to/prod",
    icon: IconBuildingFactory,
  },
  {
    title: "Materialwirtschaft",
    url: "https://www.google.de/ref-to/prod",
    icon: IconBuildingWarehouse,
  },
];
