import { baseApi } from "@/api/baseApi";
import { CreateProductDto, Product, UpdateProductDto } from "@/models/product";

// Payload ohne positionId – wird separat übergeben
export interface ProductionOrderPayload {
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
}

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listProducts: builder.query<Product[], { query?: string }>({
      query: ({ query }) => {
        const params = new URLSearchParams();
        if (query) params.set("query", query);
        return `/product?${params.toString()}`;
      },
      providesTags: ["Product"],
    }),

    getProductById: builder.query<Product, string>({
      query: (id) => `/product/${id}`,
      providesTags: ["Product"],
    }),

    createProduct: builder.mutation<Product, CreateProductDto>({
      query: (body) => ({
        url: "/product",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Product"],
    }),

    updateProduct: builder.mutation<Product, { id: string; data: UpdateProductDto }>({
      query: ({ id, data }) => ({
        url: `/product/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),

    deleteProduct: builder.mutation<Product, string>({
      query: (id) => ({
        url: `/product/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),

    // ✅ Produktionsauftrag – positionId nur in URL, nicht im Body
    createProductionOrder: builder.mutation<
      { status: "ok"; message: string; productionOrder: any },
      { positionId: string; body: ProductionOrderPayload }
    >({
      query: ({ positionId, body }) => ({
        url: `/product/${positionId}/production-order`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});
