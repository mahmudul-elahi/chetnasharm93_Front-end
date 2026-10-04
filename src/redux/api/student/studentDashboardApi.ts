import { UpdateBatchData } from "@/types/batches";
import { baseApi } from "../baseApi";

export const studentDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStatesForStudent: builder.query({
      query: () => {
        return {
          url: `/student/dashboard`,
          method: "GET",
        };
      },
    }),
    getActivityNotes: builder.query({
      query: (args) => {
        const { page = 1, per_page = 5 } = args || {};
        return {
          url: `/student/activity-notes`,
          method: "GET",
          params: { page, per_page },
        };
      },
    }),
  }),
});

export const {
  useGetDashboardStatesForStudentQuery,
  useGetActivityNotesQuery,
} = studentDashboardApi;
