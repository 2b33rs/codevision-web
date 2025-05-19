import { baseApi } from "@/api/baseApi.ts";
import { ComplaintDto } from "@/models/complaints.ts";

export const complaintsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getComplaints: build.query<
      ComplaintDto[],
      { positionId?: string; orderId?: string; customerId?: string }
    >({
      query: (params) => ({
        url: "/complaints",
        method: "GET",
        params,
      }),
    }),

    createComplaint: build.mutation<
      ComplaintDto,
      {
        positionId: string;
        ComplaintReason:
          | "WRONG_SIZE"
          | "WRONG_COLOR"
          | "PRINT_INCORRECT"
          | "PRINT_OFF_CENTER"
          | "DAMAGED_ITEM"
          | "STAINED"
          | "LATE_DELIVERY"
          | "WRONG_PRODUCT"
          | "MISSING_ITEM"
          | "BAD_QUALITY"
          | "NOT_AS_DESCRIBED"
          | "OTHER";
        ComplaintKind: "INTERN" | "EXTERN";
        createNewOrder: boolean;
      }
    >({
      query: (body) => ({
        url: "/complaints",
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetComplaintsQuery, useCreateComplaintMutation } =
  complaintsApi;
