import { Order, OrderForm } from "@/models/order.ts";
import { baseApi } from "@/api/baseApi.ts";
import { PositionStatus } from "@/common/PositionStatusBadge.tsx";

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
    //
    getOrdersWithPositionStatus: builder.query<Order[], PositionStatus>({
      query: (status) => ({
        url: `/order/status/${status}`,
        method: "GET",
      }),
      providesTags: ["Order"],
    }),
    //
    getOrderById: builder.query<Order, string>({
      query: (id) => ({
        url: `/order/${id}`,
        method: "GET",
      }),
      providesTags: ["Order"],
    }),
    //
    getOrdersByCustomer: builder.query<Order[], string>({
      query: (customerId) => ({
        url: "/order",
        method: "GET",
        params: { customerId },
      }),
      providesTags: ["Order"],
    }),
  }),
});
