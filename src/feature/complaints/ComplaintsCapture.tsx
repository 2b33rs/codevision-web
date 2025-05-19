import { useCancelPositionMutation } from "@/api/endpoints/positionApi";
import { toast } from "sonner";
import SelectablePositionsTable from "@/feature/produced-order/SelectPositionTable.tsx";
import { useMemo } from "react";
import { orderApi } from "@/api/endpoints/orderApi";
import { Order, Position } from "@/models/order";

const selectableStatuses = ["IN_PROGRESS", "READY_FOR_SHIPMENT", "INSPECTED", "READY_FOR_INSPECTION", "COMPLETED"];


const ComplaintsCapture = () => {
  const { data: allOrders = [], refetch } = orderApi.useGetOrdersQuery({});
  const [cancelPosition] = useCancelPositionMutation();

  const validOrders = useMemo(() => {
    return (allOrders as Order[]).filter((order: Order) =>
      order.positions.some((pos: Position) => pos.Status !== "CANCELLED")
    );
  }, [allOrders]);




  const handleComplaint = async (
    selectedPositions: Position[],
    orderNumber: string
  ) => {
    try {
      await cancelPosition({ orderNumber, positions: selectedPositions, status: "CANCELLED" }).unwrap();

      toast.success(
        `Reklamation eingereicht`
      );

      await refetch(); // 👈 Daten neu laden
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unbekannter Fehler";
      toast.error("Fehler beim Einreichen der Reklamation: " + errorMessage);
    }
  };


  return (
    <div className="space-y-6">
      {validOrders.map((order) => (
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
