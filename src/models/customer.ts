import { BaseEntity } from "@/models/base.ts";

export enum CustomerType {
  Webshop = "WEBSHOP",
  Business = "BUSINESS",
}

export type CreateCustomerDto = {
  name: string;
  email: string;
  phone: string;
  addr_country: "DE";
  addr_city: string;
  addr_zip: string;
  addr_street: string;
  addr_line1: string;
  addr_line2: string;
  customerType: CustomerType;
};

export type UpdateCustomerDto = Partial<CreateCustomerDto>;

export type Customer = CreateCustomerDto &
  BaseEntity & {
    // TODO remove when orders is there
    orders?: {
      id: string;
      orderNumber: string;
      createdAt: string;
      updatedAt: string;
      deletedAt?: string | null;
      customerId: string;
    }[];
  };
