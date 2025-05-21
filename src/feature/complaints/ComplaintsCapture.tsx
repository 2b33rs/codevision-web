import { toast } from "sonner";
import SelectablePositionsTable from "@/feature/produced-order/SelectPositionTable.tsx";
import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import { orderApi } from "@/api/endpoints/orderApi";
import { Order, Position } from "@/models/order";
import { positionApi } from "@/api/endpoints/positionApi.ts";
import { SearchInput } from "@/components/ui/search-input";
import { H2 } from "@/common/Text.tsx";

const selectableStatuses = [
  "IN_PROGRESS",
  "READY_FOR_SHIPMENT",
  "INSPECTED",
  "READY_FOR_INSPECTION",
  "COMPLETED",
];

const ComplaintsCapture = () => {
  const { data: allOrders = [], refetch } = orderApi.useGetOrdersQuery({});
  const [patchPosition] = positionApi.usePatchPositionMutation();
  const [searchValue, setSearchValue] = useState("");

  const validOrders = useMemo(() => {
    return (allOrders as Order[]).filter((order: Order) =>
      order.positions.some((pos: Position) => pos.Status !== "CANCELLED"),
    );
  }, [allOrders]);

  const filteredOrders = useMemo(() => {
    if (!searchValue) return validOrders;
    const fuse = new Fuse(validOrders, {
      keys: [
        "orderNumber",
        "positions.name",
        "positions.color",
        "positions.shirtSize",
      ],
      threshold: 0.3,
      ignoreLocation: true,
    });
    return fuse.search(searchValue).map((r) => r.item);
  }, [validOrders, searchValue]);

  const handleComplaint = async (
    selectedPositions: Position[],
    orderNumber: string,
  ) => {
    try {
      await patchPosition({
        orderNumber,
        positions: selectedPositions,
        status: "CANCELLED",
      }).unwrap();

      toast.success(`Reklamation eingereicht`);

      await refetch(); // 👈 Daten neu laden
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unbekannter Fehler";
      toast.error("Fehler beim Einreichen der Reklamation: " + errorMessage);
    }
  };

  return (
    <div className="space-y-6">
      <H2>Reklamation erfassen</H2>
      <SearchInput
        value={searchValue}
        onChange={setSearchValue}
        placeholder="Suche nach Auftragsnummer oder Position …"
        className="max-w-sm"
      />
      {filteredOrders.map((order) => (
        <div key={order.id}>
          <SelectablePositionsTable
            positions={order.positions}
            orderNumber={order.orderNumber}
            selectableStatus={selectableStatuses} // Array übergeben
            actions={[
              {
                label: "Reklamieren",
                onConfirm: handleComplaint,
              },
            ]}
          />
        </div>
      ))}
    </div>
  );
};
export default ComplaintsCapture;
