import { Order } from "@/models/order";
import { PositionPreview } from "@/common/PositionPreview.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Col, Row } from "@/common/flex/Flex.tsx";
import { useMemo, useState } from "react";

interface PositionDetailsSidebarProps {
  order?: Order;
  orders?: Order[];
  isOpen: boolean;
  onClose: () => void;
  selectedPositionIndex?: number;
  onPositionChange?: (index: number) => void;
}

export function PositionDetailsSidebar({
  order,
  orders,
  isOpen,
  onClose,
  selectedPositionIndex = 0,
  onPositionChange,
}: PositionDetailsSidebarProps) {
  // State for tracking the selected order when multiple orders are provided
  const [selectedOrderIndex, setSelectedOrderIndex] = useState(0);

  // Sort orders by createdAt date (newest first) if multiple orders are provided
  const sortedOrders = useMemo(() => {
    if (!orders) return [];
    return [...orders].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [orders]);

  // Determine which order to use
  const currentOrder = useMemo(() => {
    if (order) return order;
    if (sortedOrders.length > 0) return sortedOrders[selectedOrderIndex];
    return null;
  }, [order, sortedOrders, selectedOrderIndex]);

  // If no order is available, don't render anything
  if (!currentOrder) return null;

  // Sort positions by position number
  const sortedPositions = [...currentOrder.positions].sort(
    (a, b) => a.pos_number - b.pos_number,
  );

  const currentPosition = sortedPositions[selectedPositionIndex];
  const canGoBack = selectedPositionIndex > 0;
  const canGoForward = selectedPositionIndex < sortedPositions.length - 1;

  // Navigation between orders
  const canGoPreviousOrder = selectedOrderIndex > 0;
  const canGoNextOrder = selectedOrderIndex < sortedOrders.length - 1;

  const goToPreviousOrder = () => {
    if (canGoPreviousOrder) {
      setSelectedOrderIndex(selectedOrderIndex - 1);
      onPositionChange?.(0); // Reset position index when changing orders
    }
  };

  const goToNextOrder = () => {
    if (canGoNextOrder) {
      setSelectedOrderIndex(selectedOrderIndex + 1);
      onPositionChange?.(0); // Reset position index when changing orders
    }
  };

  const goToPrevious = () => {
    if (canGoBack) {
      onPositionChange?.(selectedPositionIndex - 1);
    }
  };

  const goToNext = () => {
    if (canGoForward) {
      onPositionChange?.(selectedPositionIndex + 1);
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "bg-background fixed top-0 right-0 z-50 h-full w-96 transform border-l shadow-lg transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">
              Auftrag {currentOrder.orderNumber}
            </h2>
            <span className="text-muted-foreground text-sm">
              ({sortedPositions.length} Positionen)
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Order Navigation - Only show if multiple orders are provided */}
        {sortedOrders.length > 1 && (
          <div className="border-b border-t px-4 py-2">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousOrder}
                disabled={!canGoPreviousOrder}
                className="h-8"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Vorherige Bestellung
              </Button>
              <span className="text-muted-foreground text-sm">
                {selectedOrderIndex + 1} / {sortedOrders.length}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextOrder}
                disabled={!canGoNextOrder}
                className="h-8"
              >
                Nächste Bestellung
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            <div className="mt-2 text-center text-sm text-muted-foreground">
              Bestelldatum: {new Date(currentOrder.createdAt).toLocaleDateString("de-DE")}
            </div>
          </div>
        )}

        {/* Position Navigation */}
        {sortedPositions.length > 1 && (
          <div className="flex items-center justify-between">
            <Col f1>
              {sortedPositions.length > 1 && (
                <div className="m-auto">
                  <div className="flex flex-wrap gap-1">
                    <Row f1>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToPrevious}
                        disabled={!canGoBack}
                        className="size-6 p-0"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Col>
                        <Row>
                          {sortedPositions.map((pos, index) => (
                            <Button
                              key={pos.id}
                              variant={
                                index === selectedPositionIndex
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              onClick={() => onPositionChange?.(index)}
                              className="size-6 p-0 text-xs"
                            >
                              {pos.pos_number}
                            </Button>
                          ))}
                        </Row>
                      </Col>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToNext}
                        disabled={!canGoForward}
                        className="size-6 p-0"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Row>
                  </div>
                </div>
              )}
            </Col>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {currentPosition && <PositionPreview pos={currentPosition} orderNumber={currentOrder.orderNumber} isOrderPage={true}/>}
        </div>
      </div>
    </>
  );
}
