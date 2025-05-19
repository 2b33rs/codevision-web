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

  const ordersWithCount = producedOrders.map((order) => {
    const readyCount = order.positions.filter(
      (pos) => pos.Status === "READY_FOR_INSPECTION",
    ).length;
    return { ...order, readyCount };
  });

  const handleComplete = async () => {
    await refetch();
    setRefreshCounter((prev) => prev + 1);
  const sortedOrders = ordersWithCount.sort((a, b) =>
    a.orderNumber.localeCompare(b.orderNumber),
  );

  const handleStatusChange = async (
    selected: Position[],
    orderNumber: string,
    status: "INSPECTED" | "CANCELLED",
  ) => {
    try {
      const responses = await Promise.all(
        selected.map((position: Position) => {
          const compositeId = buildComposeId(orderNumber, position.pos_number);
          return fetch(
            `https://codevision-backend-production.up.railway.app/position/${compositeId}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ status }),
            },
          );
        }),
      );

      const allSuccessful = responses.every((res) => res.ok);

      if (allSuccessful) {
        toast.success(
          `${selected.length} Position(en) aus Order #${orderNumber} erfolgreich auf "${status}" gesetzt.`,
        );
        await refetch();
        setRefreshCounter((prev) => prev + 1); // 🔁 trigger Table reset
      } else {
        toast.error("Einige Positionen konnten nicht aktualisiert werden.");
      }
    } catch (error) {
      toast.error("Fehler beim PATCH-Request: " + (error as Error).message);
    }
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
