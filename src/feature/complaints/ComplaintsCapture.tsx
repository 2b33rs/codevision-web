import SelectablePositionsTable from "@/feature/produced-order/SelectPositionTable.tsx";
import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import { orderApi } from "@/api/endpoints/orderApi";
import { Order, Position } from "@/models/order";
import { SearchInput } from "@/components/ui/search-input";
import { H2 } from "@/common/Text.tsx";
import ComplaintDialog from "./ComplaintDialog";
import { useEffect } from "react";

const selectableStatuses = [
  "IN_PROGRESS",
  "READY_FOR_SHIPMENT",
  "INSPECTED",
  "READY_FOR_INSPECTION",
  "COMPLETED",
];

const ComplaintsCapture = () => {
  const { data: allOrders = [], refetch } = orderApi.useGetOrdersQuery({});
  const [searchValue, setSearchValue] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);

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

  useEffect(() => {
    if (selectedPosition) {
      setDialogOpen(true);
    }
  }, [selectedPosition]);

  const openComplaintDialog = (selectedPositions: Position[]) => {
    const position = selectedPositions[0];
    setSelectedPosition(position);
  };


  return (
      <>
        <div className="flex h-full flex-col space-y-4">
          {/* Fixed Header */}
          <div className="space-y-4 sticky top-0 z-10 pb-2">
            <H2>Reklamation erfassen</H2>
            <SearchInput
                value={searchValue}
                onChange={setSearchValue}
                placeholder="Suche nach Auftragsnummer oder Position …"
                className="max-w-sm"
            />
          </div>

          {/* Scrollable Content */}
          <div
              className="overflow-y-auto space-y-4 pr-2"
              style={{ maxHeight: "calc(100vh - 150px)" }}
          >
            {filteredOrders.map((order) => (
                <div key={order.id}>
                  <SelectablePositionsTable
                      positions={order.positions}
                      orderNumber={order.orderNumber}
                      selectableStatus={selectableStatuses}
                      singleSelect
                      actions={[
                        {
                          label: "Reklamieren",
                          onConfirm: openComplaintDialog,
                        },
                      ]}
                  />
                </div>
            ))}
          </div>
        </div>

        {selectedPosition && (
            <ComplaintDialog
                open={dialogOpen}
                onOpenChange={(open) => {
                  setDialogOpen(open);
                  if (!open) setSelectedPosition(null);
                }}
                positionId={selectedPosition.id}
                onSuccess={refetch}
            />
        )}


      </>
  );
};

export default ComplaintsCapture;