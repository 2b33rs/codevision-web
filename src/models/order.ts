import { BaseEntity } from "@/models/base.ts";
import { z } from "zod";

export const positionInputZ = z.object({
  amount: z.coerce.number().int().positive(),
  pos_number: z.coerce.number().int().positive(),
  name: z.string().min(1),
  productCategory: z.literal("T_SHIRT"),
  design: z.string().min(1),
  color: z
    .string()
    .regex(
      /^cmyk\(\s*\d{1,3}%\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*\)$/i,
      "Ungültige CMYK-Farbe",
    ),
  shirtSize: z.enum(["S", "M", "L", "XL"]),
  description: z.string().nullable().optional(),
});

export const createOrderFormZ = z.object({
  customerId: z.string().uuid(),
  positions: z.array(positionInputZ),
});

export type CreateOrderForm = z.infer<typeof createOrderFormZ>;

export type Order = BaseEntity & {
  customerId: string;
  orderNumber: string;
  status: "PENDING" | "QUARANTINE" | "COMPLETED" | "CANCELLED";
  positions: z.infer<typeof positionInputZ>[];
};

export const orderSchema = createOrderFormZ;
export type OrderForm = CreateOrderForm;
