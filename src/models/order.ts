import { BaseEntity } from "@/models/base.ts";

export type Order = OrderTemplate &
  BaseEntity & {
    customerId: string;
  };

export type OrderTemplate = {
  status: "PENDING" | "QUARANTINE" | "COMPLETED" | "CANCELLED";
  orderNumber: string;
};
