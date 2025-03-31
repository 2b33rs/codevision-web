import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export let GLOBAL_API_TOKEN: null | string = null;

export function setGlobalApiToken(token: string) {
  GLOBAL_API_TOKEN = token;
}

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/",
    // prepareHeaders: (headers) => {
    //   if (GLOBAL_API_TOKEN) {
    //     headers.set("Authorization", "Bearer " + GLOBAL_API_TOKEN);
    //   }
    //   return headers;
    // },
  }),
  tagTypes: ["User", "Order"],
  refetchOnReconnect: true,
  refetchOnFocus: true,
  endpoints: () => ({}),
});
