import { UpdateBatchData } from "@/types/batches";
import { baseApi } from "../baseApi";

export const classNotesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllNotesByBatch: builder.query({
      query: ({ page = 1, per_page = 10, search = "", batch_id }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("per_page", per_page.toString());
        if (search) params.append("search", search);

        return {
          url: `/teacher/notes/${batch_id}?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Note"],
    }),

    getSingleNote: builder.query({
      query: (id: number) => `/teacher/notes-edit/${id}`,
      providesTags: ["Note"],
    }),

    addNote: builder.mutation({
      query: (data) => ({
        url: "/teacher/notes",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Note"],
    }),
    updateNote: builder.mutation({
      query: (data) => ({
        url: `/teacher/notes/${data.id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Note"],
    }),
    deleteNote: builder.mutation({
      query: (id: number) => ({
        url: `/teacher/notes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Note"],
    }),
  }),
});

export const {
  useGetAllNotesByBatchQuery,
  useGetSingleNoteQuery,
  useAddNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = classNotesApi;
