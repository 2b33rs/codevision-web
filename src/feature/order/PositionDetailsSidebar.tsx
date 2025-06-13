import { Order } from "@/models/order";
import { PositionPreview } from "@/common/PositionPreview.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Col, Row } from "@/common/flex/Flex.tsx";

interface PositionDetailsSidebarProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  selectedPositionIndex?: number;
  onPositionChange?: (index: number) => void;
}

export function PositionDetailsSidebar({
  order,
  isOpen,
  onClose,
  selectedPositionIndex = 0,
  onPositionChange,
}: PositionDetailsSidebarProps) {
  const sortedPositions = [...order.positions].sort(
    (a, b) => a.pos_number - b.pos_number,
  );

  const currentPosition = sortedPositions[selectedPositionIndex];
  const canGoBack = selectedPositionIndex > 0;
  const canGoForward = selectedPositionIndex < sortedPositions.length - 1;

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
              Auftrag {order.orderNumber}
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

        {/* Navigation */}
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
          {currentPosition && <PositionPreview pos={currentPosition} />}
        </div>
      </div>
    </>
  );
}
