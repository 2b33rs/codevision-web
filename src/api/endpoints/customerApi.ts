import { baseApi } from "@/api/baseApi";
import {
  Customer,
  CreateCustomerDto,
  UpdateCustomerDto,
} from "@/models/customer";

export const customerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listCustomers: builder.query<Customer[], void>({
      query: () => "/customer",
      providesTags: ["Customer"],
    }),
    getCustomerById: builder.query<Customer, string>({
      query: (id) => `/customer/${id}`,
      providesTags: (_res, _err, id) => [{ type: "Customer", id }],
    }),
    createCustomer: builder.mutation<Customer, CreateCustomerDto>({
      query: (body) => ({
        url: "/customer",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Customer"],
    }),
    updateCustomer: builder.mutation<
      Customer,
      { id: string; data: UpdateCustomerDto }
    >({
      query: ({ id, data }) => ({
        url: `/customer/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_res, _err, { id }) => [{ type: "Customer", id }],
    }),
    deleteCustomer: builder.mutation<Customer, string>({
      query: (id) => ({
        url: `/customer/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, id) => [{ type: "Customer", id }],
    }),
  }),
});
