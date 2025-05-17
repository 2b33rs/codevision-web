import { Order } from "@/models/order.ts";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/sidebar/data-table.tsx";
import { orderApi } from "@/api/endpoints/orderApi.ts";

const ComplaintsTable = () => {
  const { data } = orderApi.useGetOrdersQuery();
  const columns: ColumnDef<Order>[] = [
    { accessorKey: "customerId", header: "Kunde" },
    { accessorKey: "orderNumber", header: "Auftragsnummer" },
    { accessorKey: "positionId", header: "PositionsId" },
    { accessorKey: "cathegory", header: "Kategorie" },
    { accessorKey: "color", header: "Farbe" },
    { accessorKey: "size", header: "Größe" },
    { accessorKey: "amount", header: "Menge" },
    { accessorKey: "reason", header: "Grund" },
  ];

  return <DataTable data={data || []} columns={columns} />;
};

export default ComplaintsTable;
