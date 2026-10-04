import { baseApi } from "../baseApi";

export const studentNotesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addStudentNote: builder.mutation({
      query: (data) => ({
        url: "/teacher/student-notes",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["StudentNote"],
    }),
    updateStudentNote: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/teacher/student-notes/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["StudentNote"],
    }),
    deleteStudentNote: builder.mutation({
      query: (id) => ({
        url: `/teacher/student-notes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["StudentNote"],
    }),
  }),
});

export const {
  useAddStudentNoteMutation,
  useUpdateStudentNoteMutation,
  useDeleteStudentNoteMutation,
} = studentNotesApi;
