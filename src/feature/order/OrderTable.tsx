import { customerApi } from "@/api/endpoints/customerApi";

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
import { Order } from "@/models/order.ts";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/sidebar/data-table.tsx";
import { orderApi } from "@/api/endpoints/orderApi.ts";
import { CMYKColorField } from "@/components/CMYKColorField.tsx";
import { PositionStatusBadge } from "@/common/PositionStatusBadge.tsx";
import { Grid2x2Plus } from "lucide-react";

const OrderDetailsCell = ({ order }: { order: Order }) => {
  const MAX_VISIBLE = 4;
  const visiblePositions = order.positions.slice(0, MAX_VISIBLE);
  const hasMore = order.positions.length > MAX_VISIBLE;

  return (
    <div className="pl-6" title="Weitere Details folgen …">
      <div className="text-muted-foreground space-y-2 text-sm">
        {visiblePositions.map((position) => (
          <div key={position.id}>
            <div className="grid grid-cols-5 items-center gap-2">
              <div>{position.amount}×</div>
              <div>Größe: {position.shirtSize}</div>
              <div className="text-muted-foreground mt-1 pl-1 text-xs">
                {" "}
                {position.design && (
                  <a
                    href={position.design}
                    className="hover:text-foreground underline underline-offset-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {position.design}
                  </a>
                )}
              </div>
              <div className="scale-[0.85]">
                <CMYKColorField value={position.color} disabled />
              </div>
              <PositionStatusBadge status={position.Status} />
            </div>
          </div>
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
