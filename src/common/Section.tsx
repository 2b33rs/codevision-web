import React, { isValidElement, ReactNode } from "react";
import { LucideIcon, OctagonAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { Col, Row } from "@/common/flex/Flex.tsx";

interface SectionProps {
  title?: string;
  extraLeft?: LucideIcon | ReactNode;
  hasError?: boolean;
  errorTooltipMessage?: string;
  children: ReactNode;
  showBottomHorizontalLine?: boolean;
}

export const Section = ({
  title,
  extraLeft,
  hasError,
  errorTooltipMessage,
  children,
  showBottomHorizontalLine = true,
}: SectionProps) => {
  return (
    <Col gap={0}>
      <Row
        align={"center"}
        className={cn(
          "py-4",
          // hasError &&
          //   "border border-destructive bg-destructive/20 text-foreground",
        )}
      >
        {extraLeft &&
          (isValidElement(extraLeft) ? (
            extraLeft
          ) : (
            <Col className={"aspect-square"} align={"center"}>
              {React.createElement(extraLeft as LucideIcon, { size: 25 })}
            </Col>
          ))}
        {title && <h1 className="text-lg">{title}</h1>}
        {hasError && (
          <div title={errorTooltipMessage} className={"ml-auto"}>
            <OctagonAlert className="text-destructive mr-2" size={20} />
          </div>
        )}
      </Row>
      {children}
      {showBottomHorizontalLine && <hr className={"mt-4 mb-2 opacity-50"} />}
    </Col>
  );
};
