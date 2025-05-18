import { useState } from "react";
import { orderApi } from "@/api/endpoints/orderApi.ts";
import SelectablePositionsTable from "@/feature/produced-order/SelectPositionTable.tsx";
import { toast } from "sonner";
import buildComposeId from "@/common/Utils.ts";
import {Position} from "@/models/order.ts";

const VisualCheckTable = () => {
  const { data: producedOrders = [], refetch } =
      orderApi.useGetOrdersWithPositionStatusQuery("READY_FOR_SHIPMENT");

  const [refreshCounter, setRefreshCounter] = useState(0);

  const ordersWithCount = producedOrders.map((order) => {
    const readyCount = order.positions.filter(
        (pos) => pos.Status === "READY_FOR_SHIPMENT"
    ).length;
    return { ...order, readyCount };
  });

  const sortedOrders = ordersWithCount.sort((a, b) =>
      a.orderNumber.localeCompare(b.orderNumber)
  );


  const handleStatusChange = async (
      selected: Position[],
      orderNumber: string,
      status: "COMPLETED" | "CANCELLED"
  ) => {
    try {
      const responses = await Promise.all(
          selected.map((position: Position) => {
            const compositeId = buildComposeId(
                orderNumber,
                position.pos_number
            );
            return fetch(
                `https://codevision-backend-production.up.railway.app/position/${compositeId}`,
                {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ status }),
                }
            );
          })
      );

      const allSuccessful = responses.every((res) => res.ok);

      if (allSuccessful) {
        toast.success(
            `${selected.length} Position(en) aus Order #${orderNumber} erfolgreich auf "${status}" gesetzt.`
        );
        await refetch();
        setRefreshCounter((prev) => prev + 1); // 🔁 trigger Table reset
      } else {
        toast.error("Einige Positionen konnten nicht aktualisiert werden.");
      }
    } catch (error) {
      toast.error(
          "Fehler beim PATCH-Request: " + (error as Error).message
      );
    }
  };

  return (
      <div className="space-y-6">
        {sortedOrders.map((order) => (
            <div key={order.id}>
              <SelectablePositionsTable
                  key={`${order.id}-${refreshCounter}`} // 🔁 forces reset
                  positions={order.positions}
                  orderNumber={order.orderNumber}
                  selectableStatus={"READY_FOR_SHIPMENT"}
                  actions={[
                    {
                      label: "Visueller Check durchgeführt",
                      content: (selected, orderNumber) => (
                          <div className="px-4 py-2 text-sm">
                            {selected.length} Position(en) aus Order #{orderNumber} geprüft?
                          </div>
                      ),
                      onConfirm: (selected, orderNumber) =>
                          handleStatusChange(selected, orderNumber, "COMPLETED"),
                      renderDropdown: true,
                    },
                    {
                      label: "Reklamieren",
                      content: (selected, orderNumber) => (
                          <div className="px-4 py-2 text-sm">
                            {selected.length} Position(en) aus Order #{orderNumber} reklamieren?
                          </div>
                      ),
                      onConfirm: (selected, orderNumber) =>
                          handleStatusChange(selected, orderNumber, "CANCELLED"),
                      renderDropdown: true,
                    },
                  ]}
              />
            </div>
        ))}
      </div>
  );
};

export default VisualCheckTable;
