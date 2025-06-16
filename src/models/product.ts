import { BaseEntity } from "@/models/base.ts";
import { z } from "zod";
import { Order } from "@/models/order.ts";

export enum ShirtSize {
  S = "S",
  M = "M",
  L = "L",
  XL = "XL",
}

export enum ProductCategory {
  TShirt = "T-Shirt",
}

export type CreateProductDto = {
  color: string;
  shirtSize?: ShirtSize;
  productCategory: ProductCategory;
  minAmount: number;
  name: string;
  typ: string[];
};

export type Product = CreateProductDto &
  BaseEntity & {
    currentStock: number;
    amountInProduction: number;
    orders: Order[];
  };

export type UpdateProductDto = Partial<CreateProductDto>;

export const createProductZ = z.object({
  name: z.string(),
  color: z
    .string()
    .regex(
      /^cmyk\(\s?\d{1,3}%\s?,\s?\d{1,3}%\s?,\s?\d{1,3}%\s?,\s?\d{1,3}%\s?\)$/i,
      "Ungültige CMYK-Farbe – bitte im Format cmyk(0%, 100%, 100%, 0%)",
    ),
  shirtSize: z.nativeEnum(ShirtSize).optional(),
  productCategory: z
    .nativeEnum(ProductCategory)
    .default(ProductCategory.TShirt),
  minAmount: z.coerce.number().int().nonnegative(),
  amountInProduction: z.coerce.number().int().nonnegative().default(0),
  design: z.string().optional(),

  typ: z.array(z.string()),
});
