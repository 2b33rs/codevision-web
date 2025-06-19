import {
  IconAlertTriangle,
  IconBuildingFactory,
  IconClipboardList,
  IconDashboard,
  IconPackage,
  IconTruck,
  IconUser,
} from "@tabler/icons-react";
import Dashboard from "@/feature/dashboard/Dashboard.tsx";
import Order from "@/feature/order/Order.tsx";
import Customer from "@/feature/customer/Customer.tsx";
import StandardProduct from "@/feature/standard-products/StandardProduct.tsx";
import ProducedOrder from "@/feature/produced-order/ProducedOrder.tsx";
import Complaints from "@/feature/complaints/Complaints.tsx";

export const NAV_MAIN = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconDashboard,
    element: <Dashboard />,
  },
  {
    title: "Kunden",
    url: "/kunde",
    icon: IconUser,
    element: <Customer />,
  },
  {
    title: "Produkte",
    url: "/standardprodukte",
    icon: IconPackage,
    element: <StandardProduct />,
  },
  {
    title: "Bestellungen",
    url: "/bestellung",
    icon: IconClipboardList,
    element: <Order />,
  },

  {
    title: "Lagerbestand",
    url: "/fertigware",
    icon: IconPackage,
    element: <ProducedOrder />,
  },
  {
    title: "Reklamationen",
    url: "/reklamation",
    icon: IconAlertTriangle,
    element: <Complaints />,
  },
];

export const NAV_ABTEILUNGEN = [
  {
    title: "Verkauf & Versand",
    url: "/",
    icon: IconTruck,
  },
  {
    title: "Produktion",
    url: "https://frontend-your-shirt-gmbh.vercel.app/",
    icon: IconBuildingFactory,
  },
  {
    title: "Materialverwaltung",
    url: "https://mawi-frontend-c4g8d9befvdjg4ae.swedencentral-01.azurewebsites.net/",
    icon: IconBuildingFactory,
  },
];
