import { customerApi } from "@/api/endpoints/customerApi";
import { orderApi } from "@/api/endpoints/orderApi";
import { Order } from "@/models/order";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/sidebar/data-table";
import { Grid2x2Plus } from "lucide-react";
import PositionDetailsDialog from "@/feature/order/PositionDetailsDialog.tsx";

const CustomerCell = ({ customerId }: { customerId: string }) => {
  const { data, isLoading, isError } =
    customerApi.useGetCustomerByIdQuery(customerId);

  if (isLoading)
    return <div className="text-muted-foreground text-sm">Lädt …</div>;
  if (isError || !data)
    return <div className="text-sm text-red-500">Fehler</div>;

  return (
    <div className="text-sm">
      <div className="font-medium">{data.name}</div>
      <div className="text-muted-foreground">{data.email}</div>
    </div>
  );
};

interface OrderTableProps {
  setShowModal?: (value: ((prevState: boolean) => boolean) | boolean) => void;
}

const OrderTable = ({ setShowModal }: OrderTableProps) => {
  const { data } = orderApi.useGetOrdersQuery({});
  const orders = Array.isArray(data) ? data : data ? [data] : [];

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "orderNumber",
      header: "Auftragsnummer",
      cell: ({ getValue }) => (
        <div className="font-medium">{getValue() as string}</div>
      ),
    },
    {
      accessorKey: "customerId",
      header: "Kunde",
      cell: ({ getValue }) => (
        <CustomerCell customerId={getValue() as string} />
      ),
    },
    {
      header: "Anzahl Positionen",
      cell: ({ row }) => <PositionDetailsDialog order={row.original} />,
    },
  ];

  return (
    <DataTable
      data={orders || []}
      columns={columns}
      cta={{
        text: "Bestellung aufgeben",
        icon: Grid2x2Plus,
        onClick: () => {
          setShowModal?.(true);
        },
        isLoading: false,
      }}
    />
  );
};

export default OrderTable;
