import { BaseEntity } from "@/models/base.ts";
import { z } from "zod";
import { Customer } from "@/models/customer.ts";

export const positionInputZ = z.object({
  amount: z.coerce.number().int().positive(),
  pos_number: z.coerce.number().int().positive(),

  name: z
    .string()
    .optional()
    .transform((val) => val ?? ""),
  productCategory: z.string(),
  design: z.string().optional(),
  typ: z.array(z.string()),
  color: z

    .string()
    .regex(
      /^cmyk\(\s*\d{1,3}%\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*\)$/i,
      "Ungültige CMYK-Farbe",
    ),
  shirtSize: z.string(),
  description: z.string().nullable().optional(),

  standardProductId: z
    .string()
    .uuid()
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val))
    .optional(),

  price: z.string(),
});

export const createOrderFormZ = z.object({
  customerId: z.string().uuid(),
  positions: z.array(positionInputZ),
});

export type CreateOrderForm = z.infer<typeof createOrderFormZ>;

export type Position = BaseEntity &
  z.infer<typeof positionInputZ> & {
    standardProductId: string;
    orderId: string;
    Status: string;
    createdAt: string;
    updatedAt: string;
    price: string;
    productionOrders: ProductionOrder[];
  };

export type Order = BaseEntity & {
  customerId: string;
  customer: Customer;
  orderNumber: string;
  status: "PENDING" | "QUARANTINE" | "COMPLETED" | "CANCELLED";
  positions: Position[];
};

export const orderSchema = createOrderFormZ;
export type OrderForm = CreateOrderForm;

export type ProductionOrder = {
  id: string;
  positionId: string;
  amount: number;
  designUrl?: string;
  orderType: "COMPLAINT" | "PRODUCTION" | "REORDER";
  dyeingNecessary: boolean;
  Status: string;
  materialId: number;
  productTemplate: {
    typ: string;
    groesse: string;
    farbcode: {
      c: number;
      k: number;
      m: number;
      y: number;
    };
    kategorie: string;
    artikelnummer: number;
  };
  createdAt: string;
  updatedAt: string;
};
