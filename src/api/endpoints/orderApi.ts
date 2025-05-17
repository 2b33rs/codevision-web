import { Order, OrderForm } from "@/models/order.ts";
import { baseApi } from "@/api/baseApi.ts";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<Order, OrderForm>({
      query: (body) => ({
        url: "/order",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Order"],
    }),
    //
    getOrders: builder.query<
      Order[] | Order,
      { customerId?: string; orderId?: string }
    >({
      query: (params) => ({
        url: "/order",
        method: "GET",
        params,
      }),
      providesTags: ["Order"],
    }),
  }),
});
