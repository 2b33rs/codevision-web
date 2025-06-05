import { baseApi } from "@/api/baseApi.ts";

type VersandKategorie = {
  kategorie: string;
  groessen: string[];
  typen: string[];
};

export const mawiApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<VersandKategorie[], void>({
      query: () =>
        "https://mawi-backend-atfhg6amfbcfgmd5.swedencentral-01.azurewebsites.net/api/versandverkauf/kategorien",
    }),
  }),
  overrideExisting: false,
});
