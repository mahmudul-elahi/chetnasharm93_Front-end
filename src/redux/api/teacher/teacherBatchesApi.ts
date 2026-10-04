import { UpdateBatchData } from "@/types/batches";
import { baseApi } from "../baseApi";

export const teacherBatchesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBatchesForTeacher: builder.query({
      query: ({ page = 1, per_page = 10, search = "" }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("per_page", per_page.toString());
        if (search) params.append("search", search);

        return {
          url: `/teacher/batches?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Batch"],
    }),
    getSingleBatchForTeacher: builder.query({
      query: (id: number) => `/teacher/single-batch/${id}`,
      providesTags: ["Batch"],
    }),
    updateBatchZoomLink: builder.mutation({
      query: (data) => ({
        url: `/update-zoom-link/${data.id}`,
        method: "PATCH",
        body: { zoom_link: data.zoom_link },
      }),
      invalidatesTags: ["Batch"],
    }),
    getStudentsForTeacher: builder.query({
      query: ({ batch_id, page = 1, per_page = 10, search = "" }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("per_page", per_page.toString());
        if (search) params.append("search", search);

        return {
          url: `/enrollments/${batch_id}?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Batch", "Student"],
    }),
    getAllStudents: builder.query({
      query: ({ page = 1, per_page = 10, search = "" }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("per_page", per_page.toString());
        if (search) params.append("search", search);

        return {
          url: `/teacher/students?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Student"],
    }),
    getStudentNotes: builder.query({
      query: ({ student_id, batch_id }) => {
        const params = new URLSearchParams();
        params.append("batch_id", batch_id.toString());
        return {
          url: `/teacher/students/${student_id}/notes?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Note"],
    }),
  }),
});

export const {
  useGetBatchesForTeacherQuery,
  useGetSingleBatchForTeacherQuery,
  useGetStudentsForTeacherQuery,
  useGetAllStudentsQuery,
  useGetStudentNotesQuery,
  useUpdateBatchZoomLinkMutation,
} = teacherBatchesApi;
