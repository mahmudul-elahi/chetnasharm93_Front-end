import { UpdateBatchData } from "@/types/batches";
import { baseApi } from "../baseApi";

export const adminDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardTotalStudentForAdmin: builder.query({
      query: ({ year }) => {
        const params = new URLSearchParams();
        if (year) params.append("year", year.toString());
        return {
          url: `/admin/total-student-per-month?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Student"],
    }),
    getDashboardEnrollmentsForAdmin: builder.query({
      query: ({ year }) => {
        const params = new URLSearchParams();
        if (year) params.append("year", year.toString());
        return {
          url: `/admin/total-enrollment-per-month?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Enrollment"],
    }),
    getRevenueStatesForAdmin: builder.query({
      query: () => {
        return {
          url: `/admin/revenue-stats`,
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useGetDashboardTotalStudentForAdminQuery,
  useGetDashboardEnrollmentsForAdminQuery,
  useGetRevenueStatesForAdminQuery
} = adminDashboardApi;
