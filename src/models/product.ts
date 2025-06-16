import { BaseEntity } from "@/models/base.ts";
import { z } from "zod";

// ✅ Enums
export enum ShirtSize {
  S = "S",
  M = "M",
  L = "L",
  XL = "XL",
}

export enum ProductCategory {
  TShirt = "T-Shirt",
}

// ✅ DTOs
export type CreateProductDto = {
  color: string;
  shirtSize?: ShirtSize;
  productCategory: ProductCategory;
  minAmount: number;
  name: string;
  typ: string[];
  design?: string;
  amountInProduction?: number; // optional in DTO, default via Zod
};

// ✅ Produktmodell inklusive BaseEntity
export type Product = CreateProductDto &
  BaseEntity & {
    currentStock: number;
    amountInProduction: number;
    designUrl?: string;
    orderType?: string;
    dyeingNecessary?: boolean;
    materialId?: number;
    farbcode?: {
      cyan: number;
      magenta: number;
      yellow: number;
      black: number;
    };
  };

// ✅ Teilweise Aktualisierung
export type UpdateProductDto = Partial<CreateProductDto>;

// ✅ Produktionsauftrag-DTO
export type CreateProductionOrderDto = {
  positionId: string;
  amount: number;
  designUrl: string;
  orderType: string;
  dyeingNecessary: boolean;
  materialId: number;
  productTemplate: {
    kategorie: string;
    groesse: string;
    typ: string;
    farbcode: {
      cyan: number;
      magenta: number;
      yellow: number;
      black: number;
    };
  };
};

// ✅ Zod-Validierung für CreateProductDto
export const createProductZ = z.object({
  name: z.string(),
  color: z
    .string()
    .regex(
      /^cmyk\(\s?\d{1,3}%\s?,\s?\d{1,3}%\s?,\s?\d{1,3}%\s?,\s?\d{1,3}%\s?\)$/i,
      "Ungültige CMYK-Farbe – bitte im Format cmyk(0%, 100%, 100%, 0%)"
    ),
  shirtSize: z.nativeEnum(ShirtSize).optional(),
  productCategory: z.nativeEnum(ProductCategory).default(ProductCategory.TShirt),
  minAmount: z.coerce.number().int().nonnegative(),
  amountInProduction: z.coerce.number().int().nonnegative().default(0),
  design: z.string().optional(),
  typ: z.array(z.string()),
});
