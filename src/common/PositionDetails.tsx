import { CMYKColorField } from "@/components/CMYKColorField.tsx";
import { PositionStatusBadge } from "@/common/PositionStatusBadge.tsx";
import { Position } from "@/models/order.ts";
import { ComplaintDto } from "@/models/complaints";

const PositionDisplayRow = ({
  position,
  customer,
}: {
  position: Position;
  customer?: { name: string; email: string } | null;
}) => {
  return (
    <div className="grid grid-cols-6 items-center gap-2">
      <div>{position.amount}×</div>
      <div>Größe: {position.shirtSize}</div>
      <div className="text-muted-foreground mt-1 pl-1 text-xs">
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
  );
};

const PositionDetails = ({ position }: { position: Position }) => {
  return (
    <div key={position.id}>
      <PositionDisplayRow position={position} />
    </div>
  );
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
