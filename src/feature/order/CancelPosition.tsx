import { useState } from "react";
import { Button } from "@/components/ui/button";
import { XCircle, Check } from "lucide-react";
import { toast } from "sonner";
import { Position } from "@/models/order";
import { useCreateComplaintMutation } from "@/api/endpoints/complaintsApi";
import { orderApi } from "@/api/endpoints/orderApi";

interface CancelPositionProps {
  position: Position;
  onSuccess?: () => void;
}

// Function to call external production API
const deleteProductionOrders = async (
  orderNumber: string,
  positionNumber: number,
  productionOrders: Position["productionOrders"],
) => {
  const baseUrl = "https://backend-your-shirt-gmbh-production.up.railway.app";

  for (const productionOrder of productionOrders || []) {
    try {
      const businessKey = `${orderNumber}.${positionNumber}.${productionOrder.productionorder_number}`;

      const response = await fetch(
        `${baseUrl}/fertigungsauftraege/${businessKey}/loeschen`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to delete production order ${businessKey}`);
      }
    } catch (error) {
      console.error(`❌ Error deleting production order:`, error);
      // Ignoriere Fehler für optimistic UI
    }
  }
};

export const CancelPositionButton = ({
  position,
  onSuccess,
}: CancelPositionProps) => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [createComplaint] = useCreateComplaintMutation();

  const { data: orderData } = orderApi.useGetOrderByIdQuery(position.orderId);

  const handleCancel = async () => {
    if (!orderData || isCancelled) return;

    setIsLoading(true);

    // Optimistic Update - sofort als storniert anzeigen
    setIsCancelled(true);
    toast.success(`Position ${position.pos_number} wurde storniert`);
    onSuccess?.();

    try {
      // Im Hintergrund die API-Calls machen
      if (position.productionOrders?.length > 0) {
        await deleteProductionOrders(
          orderData.orderNumber,
          position.pos_number,
          position.productionOrders,
        );
      }

      await createComplaint({
        positionId: position.id,
        ComplaintReason: "OTHER",
        ComplaintKind: "INTERN",
        createNewOrder: false,
      }).unwrap();
    } catch (error) {
      console.error("Cancel error:", error);
      // Bei Fehler Toast zeigen, aber Button bleibt disabled
      toast.error("Stornierung verarbeitet, aber Backend-Fehler aufgetreten");
    } finally {
      setIsLoading(false);
    }
  };

  // Berechne den ursprünglichen Status nur wenn noch nicht storniert
  const originallyCanellable =
    position.Status === "OPEN" || position.Status === "IN_PROGRESS";
  const showAsDisabled = isCancelled || !originallyCanellable || !orderData;

  return (
    <Button
      variant={showAsDisabled ? "secondary" : "destructive"}
      size="sm"
      disabled={showAsDisabled}
      onClick={handleCancel}
      className="w-full"
    >
      {isCancelled ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Storniert
        </>
      ) : (
        <>
          <XCircle className="mr-2 h-4 w-4" />
          {isLoading
            ? "Storniere..."
            : originallyCanellable
              ? "Position stornieren"
              : "Nicht stornierbar"}
        </>
      )}
    </Button>
  );
};
