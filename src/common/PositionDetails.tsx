import { CMYKColorField } from "@/components/CMYKColorField.tsx";
import { PositionStatusBadge } from "@/common/PositionStatusBadge.tsx";
import { Position } from "@/models/order.ts";
import { ComplaintDto } from "@/models/complaints";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card.tsx";
import { PositionPreview } from "@/common/PositionPreview.tsx";

const PositionDisplayRow = ({
  position,
  customer,
}: {
  position: Position;
  customer?: { name: string; email: string } | null;
}) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="grid grid-cols-5 items-center gap-2">
          <div>{position.amount}×</div>
          <div>Größe: {position.shirtSize}</div>
          <div className="scale-[0.85]">
            <CMYKColorField value={position.color} disabled />
          </div>
          {customer ? (
            <div
              className="text-muted-foreground truncate text-xs"
              title={`${customer.name} (${customer.email})`}
            >
              {customer.name} ({customer.email})
            </div>
          ) : (
            <div />
          )}
          <PositionStatusBadge status={position.Status} />
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-auto p-2">
        <PositionPreview pos={position} />
      </HoverCardContent>
    </HoverCard>
  );
};

const PositionDetails = ({ position }: { position: Position }) => {
  return <PositionDisplayRow position={position} />;
};

export default PositionDetails;

export const PositionDetailsForComplaint = ({
  complaint,
}: {
  complaint: ComplaintDto;
}) => {
  const position = complaint.position;
  const customer = position.order.customer;

  return (
    <div key={position.id}>
      <PositionDisplayRow position={position} customer={customer} />
    </div>
  );
};
