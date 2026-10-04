import { UpdateBatchData } from "@/types/batches";
import { baseApi } from "../baseApi";

export const studentBatchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyBatchesForStudent: builder.query({
      query: ({ page = 1, per_page = 10, search = "" }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("per_page", per_page.toString());
        if (search) params.append("search", search);

        return {
          url: `/student/batches?${params.toString()}`,
          method: "GET",
        };
      },
    }),

    getSingleBatchForStudent: builder.query({
      query: (id: number) => `/student/single-batch/${id}`,
      providesTags: ["Batch"],
    }),
    getClassRecordingsByBatchForStudent: builder.query({
      query: (id: number) => `/student/recordings/${id}`,
      providesTags: ["ClassRecording"],
    }),
    getClassNotesByBatchForStudent: builder.query({
      query: (id: number) => `/student/notes/${id}`,
      providesTags: ["Note"],
    }),
    getSingleClassNotesByBatchForStudent: builder.query({
      query: (id: number) => ``,
      providesTags: ["Note"],
    }),
  }),
});

export const {
  useGetMyBatchesForStudentQuery,
  useGetSingleBatchForStudentQuery,
  useGetClassRecordingsByBatchForStudentQuery,
  useGetClassNotesByBatchForStudentQuery,
} = studentBatchApi;
