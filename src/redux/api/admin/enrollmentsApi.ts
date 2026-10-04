import { UpdateBatchData } from "@/types/batches";
import { baseApi } from "../baseApi";

export const enrollmentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBatchesByClassForAdmin: builder.query({
      query: ({ class_id }) => {
        return {
          url: `/admin/batches-by-class/${class_id}`,
          method: "GET",
        };
      },
      providesTags: ["Enrollment"],
    }),
    getEnrollmentsForAdmin: builder.query({
      query: ({ page = 1, per_page = 10, search = "", batch_id }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("per_page", per_page.toString());
        if (search) params.append("search", search);

        return {
          url: `/enrollments/${batch_id}?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Enrollment"],
    }),
    changeBatchOfAStudentForAdmin: builder.mutation({
      query: (data) => ({
        url: "/admin/change-batch",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Enrollment"],
    }),
  }),
});

export const {
  useLazyGetBatchesByClassForAdminQuery,
  useLazyGetEnrollmentsForAdminQuery,
  useChangeBatchOfAStudentForAdminMutation,
} = enrollmentsApi;
