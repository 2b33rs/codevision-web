import { useState } from "react";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import { toast } from "sonner";
import { Position } from "@/models/order";
import { useCreateComplaintMutation } from "@/api/endpoints/complaintsApi";
import { orderApi } from "@/api/endpoints/orderApi";

interface CancelPositionProps {
  position: Position;
  onSuccess?: () => void;
}

// Helper function to check if position is cancellable
const isPositionCancellable = (position: Position): boolean => {
  return position.Status === "OPEN" || position.Status === "IN_PROGRESS";
};

// Function to call external production API with correct businessKey
const deleteProductionOrders = async (
  orderNumber: string,
  positionNumber: number,
  productionOrders: Position["productionOrders"],
) => {
  const baseUrl = "https://backend-your-shirt-gmbh-production.up.railway.app";

  for (const productionOrder of productionOrders || []) {
    try {
      // Erstelle den korrekten businessKey: orderNumber.pos_number.productionorder_number
      const businessKey = `${orderNumber}.${positionNumber}.${productionOrder.productionorder_number}`;

      const response = await fetch(
        `${baseUrl}/fertigungsauftraege/${businessKey}/loeschen`,
        {
          method: "PATCH",
        },
      );

      if (!response.ok) {
        throw new Error(
          `Failed to delete production order ${businessKey}: ${response.statusText}`,
        );
      }

      console.log(`✅ Successfully deleted production order: ${businessKey}`);
    } catch (error) {
      console.error(
        `❌ Error deleting production order ${productionOrder.productionorder_number}:`,
        error,
      );
      throw error;
    }
  }
};

export const CancelPositionButton = ({
  position,
  onSuccess,
}: CancelPositionProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [createComplaint] = useCreateComplaintMutation();

  // Hole die Order-Daten um an orderNumber zu kommen
  const { data: orderData, isLoading: orderLoading } =
    orderApi.useGetOrderByIdQuery(position.orderId);

  const cancellable = isPositionCancellable(position);

  const handleCancel = async () => {
    if (!cancellable || isLoading || !orderData) return;

    setIsLoading(true);

    try {
      // 1. Lösche Fertigungsaufträge bei der Produktion mit korrektem businessKey
      if (position.productionOrders && position.productionOrders.length > 0) {
        await deleteProductionOrders(
          orderData.orderNumber,
          position.pos_number,
          position.productionOrders,
        );
        toast.success("Fertigungsaufträge erfolgreich gelöscht");
      }

      // 2. Erstelle interne Reklamation
      await createComplaint({
        positionId: position.id,
        ComplaintReason: "OTHER", // Verwende OTHER als Fallback
        ComplaintKind: "INTERN",
        createNewOrder: false,
      }).unwrap();

      toast.success(
        `Position ${position.pos_number} wurde erfolgreich storniert`,
      );
      onSuccess?.();
    } catch (error) {
      console.error("Cancel position error:", error);

      // Zeige spezifische Fehlermeldung je nach Fehlertyp
      if (error && typeof error === "object" && "data" in error) {
        const errorData = error.data as any;
        if (errorData?.message?.includes("allowed values")) {
          toast.error("Fehler: Stornierung nicht möglich - Ungültiger Grund");
        } else {
          toast.error(
            `Fehler beim Stornieren: ${errorData?.message || "Unbekannter Fehler"}`,
          );
        }
      } else {
        toast.error("Fehler beim Stornieren der Position");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Button ist disabled wenn Order-Daten noch laden
  const isDisabled = !cancellable || isLoading || orderLoading || !orderData;

  return (
    <Button
      variant={cancellable ? "destructive" : "secondary"}
      size="sm"
      disabled={isDisabled}
      onClick={handleCancel}
      className="w-full"
    >
      <XCircle className="mr-2 h-4 w-4" />
      {orderLoading
        ? "Lade Daten..."
        : isLoading
          ? "Storniere..."
          : cancellable
            ? "Position stornieren"
            : "Nicht stornierbar"}
    </Button>
  );
};
