import { baseApi } from "@/api/baseApi";
import { Position } from "@/models/order";
import buildComposeId from "@/common/Utils.ts";

export const positionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    patchPosition: builder.mutation<
      true,
      { orderNumber: string; positions: Position[]; status: Position["Status"] }
    >({
      async queryFn(
        { orderNumber, positions, status },
        _api,
        _opts,
        fetchWithBQ,
      ) {
        const responses = await Promise.all(
          positions.map((pos) => {
            const compositeId = buildComposeId(orderNumber, pos.pos_number);
            return fetchWithBQ({
              url: `/position/${compositeId}`,
              method: "PATCH",
              body: { status },
            });
          }),
        );

        const failed = responses.find((res) => !res.meta?.response?.ok);
        if (failed) {
          return {
            error: {
              status: failed.meta?.response?.status ?? 500,
              data:
                typeof failed.data === "string"
                  ? failed.data
                  : ((failed.data as { message?: string })?.message ??
                    "Unbekannter Fehler"),
            },
          };
        }

        return { data: true };
      },

      invalidatesTags: () => [{ type: "Order" }],
    }),

    requestFinishedGoods: builder.mutation<
      {
        orderNumber: string;
        results: Array<{
          id: string;
          message: string;
          newStatus: string;
        }>;
      },
      {
        orderNumber: string;
        positions: Array<{
          id: string;
        }>;
      }
    >({
      query: (requestData) => ({
        url: "/position/request-finished-goods",
        method: "POST",
        body: requestData,
      }),
      invalidatesTags: () => [{ type: "Order" }],
    }),
  }),
});
