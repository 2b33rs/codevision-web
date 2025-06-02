import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || "http://localhost:8080/",
  }),
  tagTypes: ["User", "Order", "Customer", "Product", "Complaint"],
  refetchOnReconnect: true,
  refetchOnFocus: true,
  endpoints: () => ({}),
});
