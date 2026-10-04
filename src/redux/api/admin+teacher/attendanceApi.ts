import { UpdateBatchData } from "@/types/batches";
import { baseApi } from "../baseApi";

export const attendanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMonthlyAttendanceByBatchId: builder.query({
      query: ({ batch_id, month }) => {
        if (!batch_id || !month) {
          throw new Error("batch_id and month are required");
        }
        const params = new URLSearchParams();
        params.append("month", month.toString());

        return {
          url: `/attendance-monthly/${batch_id}?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result, error, { batch_id, month }) =>
        result
          ? [
              { type: "Attendance", id: "LIST" },
              { type: "Attendance", id: `${batch_id}-${month}` },
              { type: "Batch", id: batch_id },
            ]
          : [{ type: "Attendance", id: "LIST" }],
    }),
    getDailyAttendanceByBatchIdAndDate: builder.query({
      query: ({ batch_id, date }) => {
        if (!batch_id || !date) {
          throw new Error("batch_id and Date are required");
        }
        const params = new URLSearchParams();
        params.append("date", date.toString());

        return {
          url: `/attendances/${batch_id}?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result, error, { batch_id, date }) =>
        result
          ? [
              { type: "Attendance", id: "LIST" },
              { type: "Attendance", id: `${batch_id}-${date}` },
              { type: "Batch", id: batch_id },
            ]
          : [{ type: "Attendance", id: "LIST" }],
    }),

    updateStudentAttendanceStatus: builder.mutation({
      query: ({ batch_id, class_date, attendances }) => ({
        url: `/attendance-save`,
        method: "POST",
        body: {
          batch_id,
          class_date,
          attendances,
        },
      }),

      invalidatesTags: (result, error, { batch_id, class_date }) =>
        result
          ? [
              { type: "Attendance", id: "LIST" },
              { type: "Attendance", id: `${batch_id}-${class_date}` },
              { type: "Batch", id: batch_id },
            ]
          : [{ type: "Attendance", id: "LIST" }],
    }),
  }),
});

export const {
  useGetMonthlyAttendanceByBatchIdQuery,
  useLazyGetMonthlyAttendanceByBatchIdQuery,
  useGetDailyAttendanceByBatchIdAndDateQuery,
  useUpdateStudentAttendanceStatusMutation,
} = attendanceApi;
