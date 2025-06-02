import Fuse from "fuse.js";
import { orderApi } from "@/api/endpoints/orderApi.ts";
import SelectablePositionsTable from "@/feature/produced-order/SelectPositionTable.tsx";
import { toast } from "sonner";
import { positionApi } from "@/api/endpoints/positionApi.ts";

interface Props {
  searchValue?: string;
}

const PartialOrdersTable = ({ searchValue }: Props) => {
  const { data: orders = [] } =
    orderApi.useGetOrdersWithPositionStatusQuery("READY_FOR_SHIPMENT");

  const [patchPosition] = positionApi.usePatchPositionMutation();

  const filteredOrders =
    searchValue && orders.length > 0
      ? new Fuse(orders, {
        keys: [
          "orderNumber",
          "positions.name",
          "positions.color",
          "positions.shirtSize",
        ],
        threshold: 0.3,
        ignoreLocation: true,
      })
        .search(searchValue)
        .map((res) => res.item)
      : orders;

  const partialOrders = filteredOrders.filter((order) => {
    const total = order.positions.length;
    const ready = order.positions.filter((p) => p.Status === "READY_FOR_SHIPMENT").length;
    return ready > 0 && ready < total;
  });

  return (
    <div className="space-y-1">
      {partialOrders.map((order) => (
        <div key={order.id} className="bg-muted-foreground/2 p-1">
          <SelectablePositionsTable
            positions={order.positions}
            orderNumber={order.orderNumber}
            selectableStatus={"READY_FOR_SHIPMENT"}
            actions={[
              {
                label: "Positionen anfordern",
                content: (selected, orderNumber) => (
                  <div className="px-4 py-2 text-sm">
                    {selected.length} Position(en) aus Order #{orderNumber} anfordern?
                  </div>
                ),
                onConfirm: async (selected, orderNumber) => {
                  try {
                    await patchPosition({
                      orderNumber,
                      positions: selected,
                      status: "IN_PROGRESS",
                    }).unwrap();
                    toast.success(`${selected.length} Position(en) angefordert.`);
                  } catch {
                    toast.error("Fehler beim Anfordern der Positionen.");
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

export default PartialOrdersTable;
