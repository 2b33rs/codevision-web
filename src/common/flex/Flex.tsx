import React, { forwardRef } from "react";

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "row" | "col";
  justify?: "start" | "end" | "center" | "between" | "around" | "stretch";
  align?: "start" | "end" | "center" | "stretch";
  gap?: 0 | 1 | 2 | 4 | 6 | 8 | 12 | 16 | 20 | 24 | 32 | 40 | 48 | 56 | 64;
  children?: React.ReactNode;
  className?: string;
}

export const Flex = forwardRef<HTMLDivElement, FlexProps>((props, ref) => {
  const {
    direction = "row",
    justify = "start",
    align = "stretch",
    gap = 4,
    children,
    className = "",
    ...tail
  } = props;

  return (
    <div
      ref={ref}
      className={`flex flex-${direction} justify-${justify} items-${align} gap-${gap} ${className}`}
      {...tail}
    >
      {children}
    </div>
  );
});

export const VerticalFlex: React.FC<FlexProps> = (props) => {
  return <Flex direction="col" {...props} />;
};

export const HorizontalFlex: React.FC<FlexProps> = (props) => {
  return <Flex direction="row" {...props} />;
};

export const FlexOne: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  return <div className="flex-1">{children}</div>;
};
