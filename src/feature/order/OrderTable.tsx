import { customerApi } from "@/api/endpoints/customerApi";
import { Order } from "@/models/order.ts";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/sidebar/data-table.tsx";
import { orderApi } from "@/api/endpoints/orderApi.ts";
import { Grid2x2Plus } from "lucide-react";
import PositionDetails from "@/common/PositionDetails.tsx";

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

const OrderDetailsCell = ({ order }: { order: Order }) => {
  const MAX_VISIBLE = 4;
  const visiblePositions = order.positions.slice(0, MAX_VISIBLE);
  const hasMore = order.positions.length > MAX_VISIBLE;

  return (
    <div className="pl-6" title="Weitere Details folgen …">
      <div className="text-muted-foreground space-y-2 text-sm">
        {visiblePositions.map((position) => (
          <PositionDetails position={position} />
        ))}
        {hasMore && (
          <div className="text-muted-foreground mt-1 text-xs italic">…</div>
        )}
      </div>
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
      header: "Details",
      cell: ({ row }) => <OrderDetailsCell order={row.original} />,
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
