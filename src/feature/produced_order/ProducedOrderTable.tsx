import { Order } from "@/models/order.ts";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/sidebar/data-table.tsx";
import { orderApi } from "@/api/endpoints/orderApi.ts";

const ProducedOrderTable = () => {
  const { data } = orderApi.useGetOrdersQuery();
  const columns: ColumnDef<Order>[] = [
    // TODO Variablen anpassen
    { accessorKey: "ordernumber", header: "Bestellnummer"},
    { accessorKey: "orderposition", header: "Position"},
    { accessorKey: "count", header: "Anzahl" },
    { accessorKey: "companyname", header: "Firmenname"},
    { accessorKey: "address", header: "Adresse"},
    { accessorKey: "postalcode", header: "Postleitzahl"},
    { accessorKey: "city", header: "Ort"},
    { accessorKey: "select", header: "Auswählen"},
  ];

  return <DataTable data={data || []} columns={columns} />;
};

export default ProducedOrderTable;
