import { Product } from "@/models/product.ts";
import { Position } from "@/models/order.ts";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card.tsx";
import { Badge } from "@/components/ui/badge";
import { ProductionOrderList } from "@/common/ProductionOrderList.tsx";

interface ProductOrdersCellProps {
  product: Product;
}

export function ProductOrdersCell({ product }: ProductOrdersCellProps) {
  // If no orders, return nothing
  if (!product.orders || product.orders.length === 0) {
    return null;
  }

  // Get all positions from all orders
  const allPositions = product.orders.flatMap((order) => order.positions);

  // Filter positions that are not COMPLETED or CANCELLED
  const activePositions = allPositions.filter(
    (position) =>
      position.Status !== "COMPLETED" && position.Status !== "CANCELLED",
  );

  // If no active positions, return nothing
  if (activePositions.length === 0) {
    return null;
  }

  // Calculate total amount in production
  const amountInProduction = activePositions.reduce((total, position) => {
    // Sum up amounts from production orders
    const productionAmount =
      position.productionOrders?.reduce((sum, po) => sum + po.amount, 0) || 0;

    return total + productionAmount;
  }, 0);

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button className="w-full cursor-pointer rounded p-2 text-left text-sm">
          <div className="flex items-center justify-between">
            <Badge variant="secondary">
              {amountInProduction} in Produktion
            </Badge>
          </div>
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-[30vw] p-4">
        <div className="space-y-3">
          {activePositions.map((position) => (
            <ProductionInfo key={position.id} position={position} />
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

// Component to display production information for a position
function ProductionInfo({ position }: { position: Position }) {
  // Filter out production orders that are not relevant
  const activeProductionOrders =
    position.productionOrders?.filter(
      (po) => po.Status !== "COMPLETED" && po.Status !== "CANCELLED",
    ) || [];

  if (activeProductionOrders.length === 0) {
    return null;
  }

  return (
    <div className="rounded-md p-2">
      <div className="flex items-center justify-between">
        <div className="text-muted-foreground">
          Position {position.pos_number}: {position.amount}×{" "}
          {position.shirtSize} - {position.name}
        </div>
        <Badge variant="outline">{position.Status}</Badge>
      </div>
      <div className="mt-2">
        <ProductionOrderList productionOrders={activeProductionOrders} />
      </div>
    </div>
  );
}
