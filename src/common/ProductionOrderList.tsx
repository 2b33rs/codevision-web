import { ProductionOrder } from "@/models/order.ts";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";

interface ProductionOrderListProps {
  productionOrders?: ProductionOrder[];
}

export function ProductionOrderList({
  productionOrders = [],
}: ProductionOrderListProps) {
  if (productionOrders.length === 0) {
    return (
      <div className="text-muted-foreground text-sm">
        Keine Fertigungsaufträge vorhanden
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">Fertigungsaufträge:</div>
      {productionOrders.map((order) => (
        <div
          key={order.id}
          className="bg-muted/50 rounded-md border p-3 text-sm"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {order.orderType}
              </Badge>
              <span>Menge: {order.amount}</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {order.Status}
            </Badge>
          </div>
          <div className="text-muted-foreground mt-1 text-xs">
            {formatDistanceToNow(new Date(order.createdAt), {
              addSuffix: true,
              locale: de,
            })}
          </div>
          {order.dyeingNecessary && (
            <div className="mt-1">
              <Badge variant="destructive" className="text-xs">
                Färbung erforderlich
              </Badge>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
