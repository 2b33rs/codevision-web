import { BaseEntity } from "@/models/base.ts";

export enum ShirtSize {
  S = "S",
  M = "M",
  L = "L",
  XL = "XL",
}

export enum ProductCategory {
  TShirt = "T_SHIRT",
}

export type CreateProductDto = {
  name: string;
  color?: string;
  shirtSize?: ShirtSize;
  productCategory: ProductCategory;
  minAmount: number;
  currentStock: number;
  amountInProduction: number;
};

export type UpdateProductDto = Partial<CreateProductDto>;

export type Product = CreateProductDto & BaseEntity;
