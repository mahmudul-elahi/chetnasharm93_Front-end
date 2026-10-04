import { baseApi } from "../baseApi";
import { Assignment, CreateAssignmentData, UpdateAssignmentData, AssignmentSubmission } from "@/types/assignments";

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

export const teacherAssignmentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAssignmentsByBatch: builder.query<PaginatedResponse<Assignment>, { batchId: number; page?: number; per_page?: number }>({
      query: ({ batchId, page = 1, per_page = 10 }) => ({
        url: `/teacher/assignments/${batchId}?page=${page}&per_page=${per_page}`,
        method: "GET",
      }),
      providesTags: ["Assignment"],
    }),
    getAssignment: builder.query<Assignment, number>({
      query: (id) => ({
        url: `/teacher/assignments-edit/${id}`,
        method: "GET",
      }),
      transformResponse: (response: { success: boolean; data: Assignment }) => response.data,
      providesTags: ["Assignment"],
    }),
    createAssignment: builder.mutation<Assignment, { batchId: number; data: FormData }>({
      query: ({ batchId, data }) => {
        data.append("batch_id", batchId.toString());
        return {
          url: `/teacher/assignments`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Assignment"],
    }),
    updateAssignment: builder.mutation<Assignment, { id: number; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/teacher/assignments/${id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Assignment"],
    }),
    deleteAssignment: builder.mutation<void, number>({
      query: (id) => ({
        url: `/teacher/assignments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Assignment"],
    }),
    getAssignmentSubmissions: builder.query<PaginatedResponse<AssignmentSubmission>, { assignmentId: number; page?: number; per_page?: number }>({
      query: ({ assignmentId, page = 1, per_page = 10 }) => ({
        url: `/teacher/assignments/${assignmentId}/submissions?page=${page}&per_page=${per_page}`,
        method: "GET",
      }),
      providesTags: ["Assignment"],
    }),
    gradeSubmission: builder.mutation<void, { submissionId: number; data: { obtained_marks: number; feedback: string } }>({
      query: ({ submissionId, data }) => ({
        url: `/teacher/assignments/submissions/${submissionId}/grade`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Assignment"],
    }),
  }),
});

export const {
  useGetAssignmentsByBatchQuery,
  useGetAssignmentQuery,
  useCreateAssignmentMutation,
  useUpdateAssignmentMutation,
  useDeleteAssignmentMutation,
  useGetAssignmentSubmissionsQuery,
  useGradeSubmissionMutation,
} = teacherAssignmentsApi;
