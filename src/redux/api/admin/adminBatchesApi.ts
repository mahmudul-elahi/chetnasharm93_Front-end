import { UpdateBatchData } from "@/types/batches";
import { baseApi } from "../baseApi";

export const adminBatchesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBatchesForAdmin: builder.query({
      query: ({
        page = 1,
        per_page = 10,
        search = "",
        class_id,
        teacher_id,
      }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("per_page", per_page.toString());
        if (class_id) params.append("class_id", class_id.toString());
        if (teacher_id) params.append("teacher_id", teacher_id.toString());
        if (search) params.append("search", search);

        return {
          url: `/admin/batches?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Batch"],
    }),

    getBatchesForAdminById: builder.query({
      query: (id: number) => `/admin/batches/${id}`,
      providesTags: ["Batch"],
    }),

    getAllClassesForBatch: builder.query({
      query: () => `/admin/class-list`,
      providesTags: ["Batch", "Class"],
    }),
    getAllTeachersForBatch: builder.query({
      query: () => `/admin/teacher-list`,
      providesTags: ["Batch", "Teacher"],
    }),
    getTeacherAvailabilityForBatch: builder.query({
      query: (queryData) => ({
        url: "/admin/teacher-availablity/by-date",
        method: "GET",
        params: queryData,
      }),
      providesTags: ["Teacher", "TeacherAvailability"],
    }),
    addBatchForAdmin: builder.mutation({
      query: (batchData) => ({
        url: "/admin/batches",
        method: "POST",
        body: batchData,
      }),
      invalidatesTags: ["Batch"],
    }),
    updateBatchForAdmin: builder.mutation({
      query: (data: UpdateBatchData) => ({
        url: `/admin/batches/${data.id}`,
        method: "POST",
        body: {
          class_id: data.class_id,
          teacher_id: data.teacher_id,
          name: data.name,
          total_seat: data.total_seat,
          start_date: data.start_date,
          end_date: data.end_date,
          zoom_link: data.zoom_link,
          status: data.status,
          active_status: data.active_status,
          schedules: data.schedules,
        },
      }),
      invalidatesTags: ["Batch"],
    }),
    updateActiveStatusBatchForAdmin: builder.mutation({
      query: (batchId) => ({
        url: `/admin/batch-active-status/${batchId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Batch"],
    }),
    deleteBatchForAdmin: builder.mutation({
      query: (batchId) => ({
        url: `/admin/batches/${batchId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Batch"],
    }),
  }),
});

export const {
  useGetBatchesForAdminQuery,
  useGetBatchesForAdminByIdQuery,
  useGetAllClassesForBatchQuery,
  useGetAllTeachersForBatchQuery,
  useGetTeacherAvailabilityForBatchQuery,
  useLazyGetTeacherAvailabilityForBatchQuery,
  useAddBatchForAdminMutation,
  useUpdateBatchForAdminMutation,
  useUpdateActiveStatusBatchForAdminMutation,
  useDeleteBatchForAdminMutation,
} = adminBatchesApi;
