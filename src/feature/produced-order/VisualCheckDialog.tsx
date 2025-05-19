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

        <div className="max-h-[60vh] space-y-4 overflow-y-auto">
          {positions.map((pos, idx) => {
            return <PositionPreview key={idx} pos={pos}></PositionPreview>;
          })}
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button
            onClick={() => handleAction("CANCELLED")}
            variant={"secondary"}
          >
            Reklamieren
          </Button>
          <Button onClick={() => handleAction("COMPLETED")} variant={"default"}>
            An Kunden versenden
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
