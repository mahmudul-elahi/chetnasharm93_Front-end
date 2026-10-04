import { baseApi } from "../baseApi";
import { StudentAssignment } from "@/types/assignments";

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

export const studentAssignmentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStudentAssignments: builder.query<PaginatedResponse<StudentAssignment>, { page?: number; per_page?: number }>({
      query: ({ page = 1, per_page = 10 }) => ({
        url: `/student/assignments?page=${page}&per_page=${per_page}`,
        method: "GET",
      }),
      providesTags: ["Assignment"],
    }),
    submitAssignment: builder.mutation<any, { assignmentId: number; data: FormData }>({
      query: ({ assignmentId, data }) => ({
        url: `/student/assignments/${assignmentId}/submit`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Assignment"],
    }),
  }),
});

export const {
  useGetStudentAssignmentsQuery,
  useSubmitAssignmentMutation,
} = studentAssignmentsApi;