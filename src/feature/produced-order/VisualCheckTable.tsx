import { orderApi } from "@/api/endpoints/orderApi.ts";
import SelectablePositionsTable from "@/feature/produced-order/SelectPositionTable.tsx";
import { toast } from "sonner";
import buildComposeId from "@/common/Utils.ts"

const VisualCheckTable = () => {
  const { data: producedOrders = [] } =
      orderApi.useGetOrdersWithPositionStatusQuery("READY_FOR_SHIPMENT");

  const ordersWithCount = producedOrders.map((order) => {
    const readyCount = order.positions.filter(
        (pos) => pos.Status === "READY_FOR_SHIPMENT",
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
                      onConfirm: async (selected, orderNumber) => {
                        try {
                          const responses = await Promise.all(
                              selected.map((position) => {
                                const compositeId = buildComposeId(orderNumber, position.pos_number);
                                return fetch(`https://codevision-backend-production.up.railway.app/position/${compositeId}`, {
                                  method: "PATCH",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({ status: "COMPLETED" }),
                                });
                              })
                          );

                          const allSuccessful = responses.every((res) => res.ok);

                          if (allSuccessful) {
                            toast.success(
                                `${selected.length} Position(en) aus Order #${orderNumber} erfolgreich als visuell geprüft markiert.`
                            );
                          } else {
                            toast.error("Einige Positionen konnten nicht aktualisiert werden.");
                          }
                        } catch (error) {
                          toast.error("Fehler beim PATCH-Request: " + (error as Error).message);
                        }
                      },
                      renderDropdown: true,
                    },
                    {
                      label: "Reklamieren",
                      content: (selected, orderNumber) => (
                          <div className="px-4 py-2 text-sm">
                            {selected.length} Position(en) aus Order #{orderNumber} reklamieren?
                          </div>
                      ),
                      onConfirm: async (selected, orderNumber) => {
                        try {
                          const responses = await Promise.all(
                              selected.map((position) => {
                                const compositeId = buildComposeId(orderNumber, position.pos_number);
                                return fetch(`https://codevision-backend-production.up.railway.app/position/${compositeId}`, {
                                  method: "PATCH",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({ status: "CANCELLED" }),
                                });
                              })
                          );

                          const allSuccessful = responses.every((res) => res.ok);

                          if (allSuccessful) {
                            toast.success(
                                `${selected.length} Position(en) aus Order #${orderNumber} erfolgreich reklamiert.`
                            );
                          } else {
                            toast.error("Einige Positionen konnten nicht reklamiert werden.");
                          }
                        } catch (error) {
                          toast.error("Fehler beim PATCH-Request: " + (error as Error).message);
                        }
                      },
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
