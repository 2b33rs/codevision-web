import { customerApi } from "@/api/endpoints/customerApi";
import { orderApi } from "@/api/endpoints/orderApi";
import { Order } from "@/models/order";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/sidebar/data-table";
import { Grid2x2Plus } from "lucide-react";
import { SearchInput } from "@/components/ui/search-input";
import PositionDetailsDialog from "@/feature/order/PositionDetailsDialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Row } from "@/common/flex/Flex.tsx";
import { useState, useMemo } from "react";
import Fuse from "fuse.js";

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

  const [searchValue, setSearchValue] = useState("");

  const filteredOrders = useMemo(() => {
    if (!searchValue) return orders;
    const fuse = new Fuse(orders, {
      keys: [
        "orderNumber",
        "positions.name",
        "positions.color",
        "positions.shirtSize",
      ],
      threshold: 0.3,
      ignoreLocation: true,
    });
    return fuse.search(searchValue).map((result) => result.item);
  }, [orders, searchValue]);

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
      data={filteredOrders}
      columns={columns}
      initialSorting={[{ id: "orderNumber", desc: true }]}
      toolbar={
        <Row f1 className="w-full justify-between gap-2">
          <SearchInput
            value={searchValue}
            onChange={setSearchValue}
            placeholder="Suche nach Auftragsnummer oder Position …"
            className="max-w-sm"
          />
          <Button onClick={() => setShowModal?.(true)} variant="default">
            <Grid2x2Plus className="mr-2 h-4 w-4" />
            Bestellung aufgeben
          </Button>
        </Row>
      }
    />
  );
};

export default OrderTable;
