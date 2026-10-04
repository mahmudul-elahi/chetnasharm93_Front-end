import { UpdateBatchData } from "@/types/batches";
import { baseApi } from "../baseApi";

export const classRecordingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClassRecordingByBatch: builder.query({
      query: ({ page = 1, per_page = 10, search = "", batch_id }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("per_page", per_page.toString());
        if (search) params.append("search", search);

        return {
          url: `/teacher/recordings/${batch_id}?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["ClassRecording"],
    }),

    getSingleClassRecording: builder.query({
      query: (id: number) => `/teacher/edit-recording/${id}`,
      providesTags: ["ClassRecording"],
    }),

    addClassRecording: builder.mutation({
      query: (data) => ({
        url: "/teacher/recordings",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ClassRecording"],
    }),
    updateClassRecording: builder.mutation({
      query: (data) => ({
        url: `/teacher/recordings/${data.id}`,
        method: "POST",
        body:data
        
      }),
      invalidatesTags: ["ClassRecording"],
    }),
    deleteClassRecording: builder.mutation({
      query: (id: number) => ({
        url: `/teacher/recordings/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ClassRecording"],
    }),
  }),
});

export const {
    useGetClassRecordingByBatchQuery,
    useGetSingleClassRecordingQuery,
    useAddClassRecordingMutation,
    useUpdateClassRecordingMutation,
    useDeleteClassRecordingMutation
} = classRecordingsApi;
