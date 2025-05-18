import { Badge } from "@/components/ui/badge";
import { Loader2, Truck, CheckCircle, Ban, SearchCheck } from "lucide-react";
import React from "react";

export type PositionStatus =
  | "IN_PROGRESS"
  | "READY_FOR_SHIPMENT"
  | "INSPECTED"
  | "COMPLETED"
  | "CANCELLED"
  | string;

const config: Record<
  Exclude<PositionStatus, string>,
  {
    label: string;
    color: string;
    icon: React.ReactNode;
  }
> = {
  IN_PROGRESS: {
    label: "In Bearbeitung",
    color: "bg-muted text-yellow-800",
    icon: <Loader2 className="mr-1 h-4 w-4 animate-spin" />,
  },
  READY_FOR_SHIPMENT: {
    label: "Bereit für Versand",
    color: "bg-blue-100 text-blue-800",
    icon: <Truck className="mr-1 h-4 w-4" />,
  },
  INSPECTED: {
    label: "Geprüft",
    color: "bg-purple-100 text-purple-800",
    icon: <SearchCheck className="mr-1 h-4 w-4" />,
  },
  COMPLETED: {
    label: "Versendet",
    color: "bg-green-100 text-green-800",
    icon: <CheckCircle className="mr-1 h-4 w-4" />,
  },
  CANCELLED: {
    label: "Reklamiert",
    color: "bg-red-100 text-red-800",
    icon: <Ban className="mr-1 h-4 w-4" />,
  },
};

function isKnownStatus(
  status: string,
): status is Exclude<PositionStatus, string> {
  return Object.prototype.hasOwnProperty.call(config, status);
}


export function PositionStatusBadge({ status }: { status: PositionStatus }) {
  if (!isKnownStatus(status)) status = "IN_PROGRESS";
  const { label, color, icon } =
    config[status as Exclude<PositionStatus, string>];

  return (
    <Badge
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${color}`}
    >
      {icon}
      {label}
    </Badge>
  );
}
