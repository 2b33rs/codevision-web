import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Position } from "@/models/order";
import { toast } from "sonner";
import { positionApi } from "@/api/endpoints/positionApi.ts";
import { PositionPreview } from "@/common/PositionPreview.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useState } from "react";

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
  const [checked, setChecked] = useState<boolean[]>(new Array(5).fill(false));
  const [viewPreview, setViewPreview] = useState(false);
  const [rejectedAmount, setRejectedAmount] = useState<number>(0);

  const checklistLabels = [
    "Farbe innerhalb Toleranz",
    "Druck ohne Einschlüsse oder Risse",
    "Position Druck innerhalb Toleranz",
    "Label korrekt angebracht",
    "Nähte in Ordnung",
  ];

  const isChecklistComplete = checked.every(Boolean);

  const toggleCheck = (index: number) => {
    const updated = [...checked];
    updated[index] = !updated[index];
    setChecked(updated);
  };

  const handleAction = async (status: Position["Status"]) => {
    if (status === "CANCELLED") {
      console.log(`Reklamierte Anzahl: ${rejectedAmount}`);
    }

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {positions.length === 1
              ? `Position für Bestellung ${orderNumber} prüfen`
              : `Positionen für Bestellung ${orderNumber} prüfen`}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {viewPreview ? (
            <>
              {positions.map((pos, idx) => (
                <PositionPreview key={idx} pos={pos} />
              ))}
            </>
          ) : (
            <>
              <div className="space-y-3">
                {checklistLabels.map((label, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <Checkbox
                      id={`check-${idx}`}
                      checked={checked[idx]}
                      onCheckedChange={() => toggleCheck(idx)}
                    />
                    <label htmlFor={`check-${idx}`}>{label}</label>
                  </div>
                ))}
              </div>
              <div className="pt-4">
                <label className="text-sm font-medium block mb-1">
                  Anzahl reklamierter Teile
                </label>
                <Input
                  type="number"
                  min={0}
                  value={rejectedAmount}
                  onChange={(e) => setRejectedAmount(Number(e.target.value))}
                />
              </div>
            </>
          )}
        </div>

        <div className="mt-4 flex flex-wrap justify-between items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => setViewPreview((prev) => !prev)}
          >
            {viewPreview ? "Zurück zur Checkliste" : "Position(en) anzeigen"}
          </Button>

          <div className="flex gap-2">
            <Button
              onClick={() => handleAction("CANCELLED")}
              variant="secondary"
            >
              Reklamieren
            </Button>
            <Button
              onClick={() => handleAction("COMPLETED")}
              variant="default"
              disabled={!isChecklistComplete}
            >
              An Kunden versenden
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
