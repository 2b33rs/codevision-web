import { customerApi } from "@/api/endpoints/customerApi";
import { orderApi } from "@/api/endpoints/orderApi";
import { Order } from "@/models/order";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/sidebar/data-table";
import { Grid2x2Plus } from "lucide-react";
import { SearchInput } from "@/components/ui/search-input";
import { Button } from "@/components/ui/button.tsx";
import { Row } from "@/common/flex/Flex.tsx";
import { useState, useMemo } from "react";
import Fuse from "fuse.js";
import { PositionDetailsSidebar } from "@/feature/order/PositionDetailsSidebar.tsx";
import { usePositionSidebar } from "@/hooks/usePositionSidebar.ts";

const CustomerCell = ({ customerId }: { customerId: string }) => {
  const { data, isLoading, isError } =
    customerApi.useGetCustomerByIdQuery(customerId);

  if (isLoading)
    return <div className="text-muted-foreground text-sm">Lädt …</div>;
  if (isError || !data)
    return <div className="text-sm text-red-500">Fehler</div>;

  // Wenn data.name leer ist, zeige "Lager" als Standard
  const displayName = data.name === "" ? "Lager" : data.name;
  const displayEmail = data.name === "" ? "-" : data.email;

  return (
    <div className="text-sm">
      <div className="font-medium">{displayName}</div>
      <div className="text-muted-foreground">{displayEmail}</div>
    </div>
  );
};

interface OrderTableProps {
  setShowModal?: (value: ((prevState: boolean) => boolean) | boolean) => void;
}

const OrderTable = ({ setShowModal }: OrderTableProps) => {
  const { data } = orderApi.useGetOrdersQuery({});
  const orders = Array.isArray(data) ? data : data ? [data] : [];

  const {
    selectedOrder,
    selectedOrders,
    selectedPositionIndex,
    isOpen,
    openSidebar,
    closeSidebar,
    changePosition,
  } = usePositionSidebar();

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
      cell: ({ row }) => (
        <Button
          variant="link"
          onClick={() => openSidebar(row.original)}
          className="h-auto p-0 font-normal"
        >
          {row.original.positions.length} Positionen
        </Button>
      ),
    },
  ];

  return (
    <>
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

      {/* Sidebar für Positionsdetails */}
      {(selectedOrder || selectedOrders) && (
        <PositionDetailsSidebar
          order={selectedOrder || undefined}
          orders={selectedOrders || undefined}
          isOpen={isOpen}
          onClose={closeSidebar}
          selectedPositionIndex={selectedPositionIndex}
          onPositionChange={changePosition}
        />
      )}
    </>
  );
};

export default OrderTable;
