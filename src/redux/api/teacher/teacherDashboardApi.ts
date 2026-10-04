import { UpdateBatchData } from "@/types/batches";
import { baseApi } from "../baseApi";

export const teacherDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStatesForTeacher: builder.query({
      query: () => {
        return {
          url: `/teacher/dashboard`,
          method: "GET",
        };
      },
    }),
  }),
});

export const { useGetDashboardStatesForTeacherQuery } = teacherDashboardApi;
