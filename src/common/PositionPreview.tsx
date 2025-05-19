import { Shirt } from "lucide-react";
import { PositionStatusBadge } from "@/common/PositionStatusBadge.tsx";
import { Position } from "@/models/order.ts";
import { cmykToRGB, parseCMYK } from "@/lib/colorUtils.ts";

export function PositionPreview({ pos }: { pos: Position }) {
  const fillColor = parseCMYK(pos.color || "cmyk(0%,0%,0%,100%)");

  return (
    <div className="bg-background rounded-md border p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <Shirt className="h-5 w-5" style={{ fill: cmykToRGB(fillColor) }} />
          <strong className="text-base">Position {pos.pos_number}</strong>
        </div>
        <PositionStatusBadge status={pos.Status} />
      </div>
      <div className="mt-3 flex flex-col gap-6 text-sm sm:flex-row">
        <div className="flex-1 space-y-1">
          <div className="font-medium">{pos.name}</div>
          <div>
            {pos.amount} × {pos.shirtSize}
          </div>
          {pos.description && (
            <div className="text-muted-foreground text-sm">
              {pos.description}
            </div>
          )}
        </div>
        <div className="flex w-24 shrink-0 flex-col items-center gap-2">
          <div
            className="h-6 w-6 rounded-full border"
            style={{ backgroundColor: cmykToRGB(fillColor) }}
            title={pos.color}
          />
          {pos.design && (
            <div className="relative size-10 transition-all duration-300 hover:size-28">
              <Shirt className="text-muted absolute inset-0 h-full w-full opacity-30" />
              <img
                src={pos.design}
                alt="Kein Design"
                className="mask mask-squircle h-full w-full rounded-sm object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
