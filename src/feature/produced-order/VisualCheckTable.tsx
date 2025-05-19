import { useState } from "react";
import { orderApi } from "@/api/endpoints/orderApi.ts";
import SelectablePositionsTable from "@/feature/produced-order/SelectPositionTable.tsx";
import VisualCheckDialog from "./VisualCheckDialog.tsx";
import { Position } from "@/models/order.ts";

const VisualCheckTable = () => {
  const { data: producedOrders = [], refetch } =
    orderApi.useGetOrdersWithPositionStatusQuery("READY_FOR_INSPECTION");

  const [refreshCounter, setRefreshCounter] = useState(0);
  const [dialogData, setDialogData] = useState<{
    positions: Position[];
    orderNumber: string;
  } | null>(null);

  const handleComplete = async () => {
    await refetch();
    setRefreshCounter((prev) => prev + 1);
  };

  const sortedOrders = [...producedOrders].sort((a, b) =>
    a.orderNumber.localeCompare(b.orderNumber)
  );

  return (
    <div className="space-y-6">
      {sortedOrders.map((order) => (
        <div key={order.id}>
          <SelectablePositionsTable
            key={`${order.id}-${refreshCounter}`}
            positions={order.positions}
            orderNumber={order.orderNumber}
            selectableStatus={"READY_FOR_INSPECTION"}
            actions={[
              {
                label: "Check durchführen",
                content: () => null,
                onConfirm: (selected, orderNumber) =>
                  setDialogData({ positions: selected, orderNumber }),
                renderDropdown: false,
              },
            ]}
          />
        </div>
      ))}

      {dialogData && (
        <VisualCheckDialog
          positions={dialogData.positions}
          orderNumber={dialogData.orderNumber}
          open={!!dialogData}
          onOpenChange={(val) => {
            if (!val) setDialogData(null);
          }}
          onComplete={() => {
            setDialogData(null);
            handleComplete();
          }}
        />
      )}

    </div>
  );
};

export default VisualCheckTable;
