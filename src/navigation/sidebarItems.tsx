import {
  IconBuildingFactory,
  IconBuildingWarehouse,
  IconDashboard,
  IconShoppingCart,
  IconTable,
} from "@tabler/icons-react";
import Dashboard from "@/feature/dashboard/Dashboard.tsx";
import Order from "@/feature/order/Order.tsx";
import { BookCheck, FileWarning, Package, User2 } from "lucide-react";
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
    url: "/kunden",
    icon: User2,
    element: <Customer />,
  },
  {
    title: "Bestellung",
    url: "/bestellung",
    icon: IconTable,
    element: <Order />,
  },
  {
    title: "Standartprodukte",
    url: "/produkt",
    icon: Package,
    element: <StandardProduct />,
  },
  {
    title: "Fertigware",
    url: "/fertigware",
    icon: BookCheck,
    element: <ProducedOrder />,
  },
  {
    title: "Reklamationen",
    url: "/reklamationen",
    icon: FileWarning,
    element: <Complaints />,
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
