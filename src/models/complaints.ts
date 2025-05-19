import { BaseEntity } from "@/models/base";
import { Position } from "@/models/order.ts";
import { Customer } from "@/models/customer";

export interface ComplaintDto extends BaseEntity {
  ComplaintReason:
    | "WRONG_SIZE"
    | "WRONG_COLOR"
    | "PRINT_INCORRECT"
    | "PRINT_OFF_CENTER"
    | "DAMAGED_ITEM"
    | "STAINED"
    | "LATE_DELIVERY"
    | "WRONG_PRODUCT"
    | "MISSING_ITEM"
    | "BAD_QUALITY"
    | "NOT_AS_DESCRIBED"
    | "OTHER";
  ComplaintKind: "INTERN" | "EXTERN";
  createNewOrder: boolean;
  newOrderId?: string | null;
  customer?: Customer | null;
  position: Position & {
    order: {
      positions: Position[];
      customer?: Customer;
    };
  };
}
