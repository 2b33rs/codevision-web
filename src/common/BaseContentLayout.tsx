import React from "react";
import { Row } from "@/common/flex/Flex.tsx";

interface BaseContentLayout {
  children?: React.ReactNode;
}

export const BaseContentLayout: React.FC<BaseContentLayout> = (props) => {
  return (
    <Row f1 className={"px-4"}>
      {props.children}
    </Row>
  );
};
