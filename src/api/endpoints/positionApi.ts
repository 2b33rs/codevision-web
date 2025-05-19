import { baseApi } from "@/api/baseApi";
import { Position } from "@/models/order";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import buildComposeId from "@/common/Utils.ts";

type CancelStatusArgs = {
  orderNumber: string;
  positions: Position[];
  status: "CANCELLED";
};

export const positionApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    cancelPosition: builder.mutation<true, CancelStatusArgs>({
      async queryFn({ orderNumber, positions, status }, _queryApi, _extraOptions, fetchWithBQ) {
        const responses = await Promise.all(
          positions.map((pos) => {
            const compositeId = buildComposeId(orderNumber, pos.pos_number);
            return fetchWithBQ({
              url: `/position/${compositeId}`,
              method: "PATCH",
              body: { status },
            });
          })
        );

        const failed = responses.find((res) => !res.meta?.response?.ok);

        if (failed) {
          const statusCode = failed.meta?.response?.status ?? 500;
          type ErrorResponse = { message?: string };
          const errorMessage =
            typeof failed.data === "string"
              ? failed.data
              : (failed.data as ErrorResponse)?.message ?? "Unbekannter Fehler";

          return {
            error: {
              status: statusCode,
              data: errorMessage,
            } as FetchBaseQueryError,
          };
        }

        return { data: true };
      },
    }),
  }),
});

export const { useCancelPositionMutation } = positionApi;
