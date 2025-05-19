import { useState } from "react";
import { orderApi } from "@/api/endpoints/orderApi.ts";
import SelectablePositionsTable from "@/feature/produced-order/SelectPositionTable.tsx";
import VisualCheckDialog from "./VisualCheckDialog.tsx";
import { Position } from "@/models/order.ts";

const VisualCheckTable = () => {
  const { data: producedOrders = [] } =
    orderApi.useGetOrdersWithPositionStatusQuery("READY_FOR_INSPECTION");

  const [dialogData, setDialogData] = useState<{
    positions: Position[];
    orderNumber: string;
  } | null>(null);

  const ordersWithCount = producedOrders.map((order) => {
    const readyCount = order.positions.filter(
      (pos) => pos.Status === "READY_FOR_INSPECTION",
    ).length;
    return { ...order, readyCount };
  });

  const sortedOrders = ordersWithCount.sort(
    (a, b) => b.readyCount - a.readyCount,
  );

  return (
    <div className="space-y-6">
      {sortedOrders.map((order) => (
        <div key={order.id}>
          <SelectablePositionsTable
            key={order.id}
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
          onComplete={() => setDialogData(null)}
        />
      )}
    </div>
  );
};

export default VisualCheckTable;
