import { PositionStatusBadge } from "@/common/PositionStatusBadge.tsx" // Passe den Pfad ggf. an
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Order } from "@/models/order";
import { Shirt } from "lucide-react";
import { useState } from "react";

// CMYK zu RGB Konvertierung
function cmykToRgb(c: number, m: number, y: number, k: number): string {
  const r = 255 * (1 - c) * (1 - k);
  const g = 255 * (1 - m) * (1 - k);
  const b = 255 * (1 - y) * (1 - k);
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

function parseCmykString(cmyk: string): string {
  const match = cmyk.match(/cmyk\((\d+)%?,\s*(\d+)%?,\s*(\d+)%?,\s*(\d+)%?\)/i);
  if (!match) return "#000"; // fallback
  const [, c, m, y, k] = match.map(Number);
  return cmykToRgb(c / 100, m / 100, y / 100, k / 100);
}




export default function PositionDetailsDialog({ order }: { order: Order }) {
  const [open, setOpen] = useState(false);

  const sortedPositions = [...order.positions].sort(
    (a, b) => a.pos_number - b.pos_number
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="text-sm font-medium text-foreground underline-offset-4 hover:underline transition-colors hover:text-primary"
          title="Details anzeigen"
        >
          {order.positions.length} Positionen
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Positionen für Auftrag {order.orderNumber}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          {sortedPositions.map((pos, idx) => {
            const fillColor = parseCmykString(pos.color || "cmyk(0%,0%,0%,100%)");

            return (
              <div
                key={idx}
                className="border rounded p-4 text-sm space-y-1 bg-muted"
              >
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
      </DialogContent>
    </Dialog>
  );
}
