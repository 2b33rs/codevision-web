import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Order } from "@/models/order";
import { useState } from "react";
import { PositionPreview } from "@/common/PositionPreview.tsx";

export default function PositionDetailsDialog({ order }: { order: Order }) {
  const [open, setOpen] = useState(false);

  const sortedPositions = [...order.positions].sort(
    (a, b) => a.pos_number - b.pos_number,
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="text-foreground hover:text-primary text-sm font-medium underline-offset-4 transition-colors hover:underline"
          title="Details anzeigen"
        >
          {order.positions.length} Positionen
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Positionen für Auftrag {order.orderNumber}</DialogTitle>
        </DialogHeader>
        <div className="max-h-[70vh] space-y-4 overflow-y-auto">
          {sortedPositions.map((pos, idx) => (
            <PositionPreview key={idx} pos={pos} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
