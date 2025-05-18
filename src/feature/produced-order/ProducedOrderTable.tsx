import { orderApi } from "@/api/endpoints/orderApi.ts";
import SelectablePositionsTable from "@/feature/produced-order/SelectPositionTable.tsx";

const ProducedOrderTable = () => {
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
        <div key={order.id} className="">
          <SelectablePositionsTable
            positions={order.positions}
            orderNumber={order.orderNumber}
            selectableStatus={"READY_FOR_SHIPMENT"}
            actions={[
              {
                label: "Positionen anfordern",
                content: (selected, orderNumber) => (
                  <div className="px-4 py-2 text-sm">
                    {selected.length} Position(en) aus Order #{orderNumber}{" "}
                    anfordern?
                  </div>
                ),
                onConfirm: (selected, orderNumber) => {
                  console.log("Angefordert:", selected, orderNumber);
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

export default ProducedOrderTable;
