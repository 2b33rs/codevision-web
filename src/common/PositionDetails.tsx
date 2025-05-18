import { CMYKColorField } from "@/components/CMYKColorField.tsx";
import { PositionStatusBadge } from "@/common/PositionStatusBadge.tsx";
import { Position } from "@/models/order.ts";

const PositionDetails = ({ position }: { position: Position }) => {
  return (
    <div key={position.id}>
      <div className="grid grid-cols-5 items-center gap-2">
        <div>{position.amount}×</div>
        <div>Größe: {position.shirtSize}</div>
        <div className="text-muted-foreground mt-1 pl-1 text-xs">
          {" "}
          {position.design && (
            <a
              href={position.design}
              className="hover:text-foreground underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              {position.design}
            </a>
          )}
        </div>
        <div className="scale-[0.85]">
          <CMYKColorField value={position.color} disabled />
        </div>
        <PositionStatusBadge status={position.Status} />
      </div>
    </div>
  );
};

export default PositionDetails;
