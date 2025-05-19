import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Shirt } from "lucide-react";
import { Position } from "@/models/order";
import { PositionStatusBadge } from "@/common/PositionStatusBadge";
import buildComposeId from "@/common/Utils";
import { toast } from "sonner";

function cmykToRgb(c: number, m: number, y: number, k: number): string {
  const r = 255 * (1 - c) * (1 - k);
  const g = 255 * (1 - m) * (1 - k);
  const b = 255 * (1 - y) * (1 - k);
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

function parseCmykString(cmyk: string): string {
  const match = cmyk.match(/cmyk\((\d+)%?,\s*(\d+)%?,\s*(\d+)%?,\s*(\d+)%?\)/i);
  if (!match) return "#000";
  const [, c, m, y, k] = match.map(Number);
  return cmykToRgb(c / 100, m / 100, y / 100, k / 100);
}

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
  const handleAction = async (status: "INSPECTED" | "CANCELLED") => {
    try {
      const responses = await Promise.all(
        positions.map((position) => {
          const compositeId = buildComposeId(orderNumber, position.pos_number);
          return fetch(
            `https://codevision-backend-production.up.railway.app/position/${compositeId}`,
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status }),
            }
          );
        })
      );

      const success = responses.every((res) => res.ok);

      if (success) {
        toast.success(`${positions.length} Position(en) als "${status}" markiert.`);
        onOpenChange(false);
        onComplete();
      } else {
        toast.error("Einige Positionen konnten nicht aktualisiert werden.");
      }
    } catch (error) {
      toast.error("Fehler beim PATCH: " + (error as Error).message);
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
          {positions.map((pos, idx) => {
            const fillColor = parseCmykString(pos.color || "cmyk(0%,0%,0%,100%)");
            return (
              <div key={idx} className="border rounded p-4 text-sm space-y-1 bg-muted">
                <div className="flex items-center gap-2 mb-2">
                  <Shirt className="w-5 h-5" style={{ fill: fillColor }} />
                  <strong>Position {pos.pos_number}</strong>
                </div>
                <div><strong>Produkt:</strong> {pos.name}</div>
                <div><strong>Menge:</strong> {pos.amount}</div>
                <div><strong>Größe:</strong> {pos.shirtSize}</div>
                <div><strong>Farbe:</strong> {pos.color}</div>
                <div><strong>Design:</strong> {pos.design}</div>
                {pos.description && (
                  <div><strong>Beschreibung:</strong> {pos.description}</div>
                )}
                <div className="flex items-center gap-2">
                  <strong>Status:</strong>
                  <PositionStatusBadge status={pos.Status} />
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => handleAction("CANCELLED")}
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90"
          >
            Reklamieren
          </button>
          <button
            onClick={() => handleAction("INSPECTED")}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Check erfolgreich
          </button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
