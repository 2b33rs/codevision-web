import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Position } from "@/models/order";
import { toast } from "sonner";
import { positionApi } from "@/api/endpoints/positionApi.ts";
import { useCreateComplaintMutation } from "@/api/endpoints/complaintsApi";
import { ComplaintDto } from "@/models/complaints";
import { PositionPreview } from "@/common/PositionPreview.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { useState } from "react";
import InvoicePDF from "@/feature/order/InvoicePDF.tsx";
import DeliveryNotePDF from "@/feature/order/DeliveryNotePDF.tsx";
import { Col } from "@/common/flex/Flex.tsx";
import { downloadPDF } from "@/utils/pdfUtils";

const checklistLabels = [
  "Farbe innerhalb Toleranz",
  "Druck ohne Einschlüsse oder Risse",
  "Position Druck innerhalb Toleranz",
  "Label korrekt angebracht",
  "Nähte in Ordnung",
];

const complaintReasons: Record<number, ComplaintDto["ComplaintReason"]> = {
  0: "WRONG_COLOR",
  1: "PRINT_INCORRECT",
  2: "PRINT_OFF_CENTER",
  3: "WRONG_PRODUCT",
  4: "DAMAGED_ITEM",
};

export default function VisualCheckDialog({
  positions,
  orderNumber,
  onComplete,
  open,
  onOpenChange,
}: {
  positions: Position[];
  orderNumber: string;
  onComplete: () => void;
  open: boolean;
  onOpenChange: (val: boolean) => void;
}) {
  const [patchPosition] = positionApi.usePatchPositionMutation();
  const [createComplaint] = useCreateComplaintMutation();
  const [checked, setChecked] = useState<boolean[]>(new Array(5).fill(false));
  const [complaintDialog, setComplaintDialog] = useState<{
    positionId: string;
    reason: ComplaintDto["ComplaintReason"];
  } | null>(null);

  const isChecklistComplete = checked.every(Boolean);

  const toggleCheck = (index: number) => {
    const updated = [...checked];
    updated[index] = !updated[index];
    setChecked(updated);
  };

  const handleAction = async (status: Position["Status"]) => {
    try {
      const success = await patchPosition({
        orderNumber,
        positions,
        status,
      }).unwrap();

      if (success) {
        toast.success(
          `${positions.length} Position(en) als "${status}" markiert.`,
        );
        onOpenChange(false);
        onComplete();
      }
    } catch (error) {
      toast.error("Fehler beim Status-Update: " + (error as Error).message);
    }
  };

  const submitComplaint = async (
    positionId: string,
    reason: ComplaintDto["ComplaintReason"],
    createNewOrder: boolean,
  ) => {
    const body = {
      positionId,
      ComplaintReason: reason,
      ComplaintKind: "INTERN" as const,
      createNewOrder,
    };

    console.log("🚀 Reklamations-Body:", body);

    try {
      await createComplaint(body).unwrap();
      toast.success("Reklamation erfolgreich gesendet.");
      setComplaintDialog(null);
      onOpenChange(false);
    } catch (error) {
      toast.error("Fehler bei der Reklamation: " + (error as Error).message);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent style={{ width: "100%", maxWidth: "55vw", padding: 24 }}>
          <DialogHeader>
            <DialogTitle>
              {positions.length === 1
                ? `Position für Bestellung ${orderNumber} prüfen`
                : `Positionen für Bestellung ${orderNumber} prüfen`}
            </DialogTitle>
          </DialogHeader>

          <div className="flex max-h-[60vh] gap-6 overflow-y-auto">
            {/* Permanente Vorschau */}
            <div className="w-1/2 space-y-4">
              {positions.map((pos, idx) => (
                <PositionPreview key={idx} pos={pos} />
              ))}
            </div>

            <div className="w-1/2 space-y-4">
              <Col f1>
                {positions.length === 1 && (
                  <div className="mb-4 flex gap-4">
                    <Button
                      variant={"link"}
                      onClick={() =>
                        downloadPDF(
                          <InvoicePDF
                            positions={[positions[0]]}
                            orderNumber={orderNumber}
                          />,
                          `Rechnung_Position_${positions[0].pos_number}.pdf`,
                        )
                      }
                    >
                      📄 Rechnung herunterladen
                    </Button>
                    <Button
                      variant={"link"}
                      onClick={() =>
                        downloadPDF(
                          <DeliveryNotePDF
                            positions={[positions[0]]}
                            orderNumber={orderNumber}
                          />,
                          `Lieferschein_Position_${positions[0].pos_number}.pdf`,
                        )
                      }
                    >
                      📦 Lieferschein herunterladen
                    </Button>
                  </div>
                )}
              </Col>
              <div className="space-y-3">
                {checklistLabels.map((label, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id={`check-${idx}`}
                        checked={checked[idx]}
                        onCheckedChange={() => toggleCheck(idx)}
                      />
                      <label htmlFor={`check-${idx}`}>{label}</label>
                    </div>

                    <Button
                      variant="default"
                      size="sm"
                      className={`bg-red-500 text-white transition-colors hover:bg-red-700 ${
                        checked[idx] ? "invisible" : ""
                      }`}
                      onClick={() =>
                        setComplaintDialog({
                          reason: complaintReasons[idx],
                          positionId: positions[0].id,
                        })
                      }
                    >
                      Reklamieren
                    </Button>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <Button
                  onClick={() => handleAction("COMPLETED")}
                  variant="default"
                  disabled={!isChecklistComplete}
                >
                  An Kunden versenden
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reklamationsentscheidung */}
      <Dialog
        open={!!complaintDialog}
        onOpenChange={() => setComplaintDialog(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Neu produzieren?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Möchtest du diese Position neu produzieren lassen?</p>
            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() =>
                  complaintDialog &&
                  submitComplaint(
                    complaintDialog.positionId,
                    complaintDialog.reason,
                    false,
                  )
                }
              >
                Nein
              </Button>
              <Button
                onClick={() =>
                  complaintDialog &&
                  submitComplaint(
                    complaintDialog.positionId,
                    complaintDialog.reason,
                    true,
                  )
                }
              >
                Ja, neu produzieren
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
