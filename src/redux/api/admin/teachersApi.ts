import { baseApi } from "../baseApi";

export const teachersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all teachers
    getAdminTeachers: builder.query({
      query: ({ page = 1, per_page = 10, search = "", role = "" }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("per_page", per_page.toString());
        if (search) params.append("search", search);
        if (role) params.append("role", role);

        return {
          url: `/admin/teachers?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Teacher"],
    }),

    // Get teacher by ID
    getAdminTeacherById: builder.query({
      query: (id: number) => ({
        url: `/admin/teacher-edit-data/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Teacher", id }],
    }),

    // Create new teacher
    createTeacher: builder.mutation({
      query: (teacherData) => ({
        url: "/admin/teacher-store",
        method: "POST",
        body: teacherData,
      }),
      invalidatesTags: ["Teacher"],
    }),

    // Update teacher
    updateTeacher: builder.mutation({
      query: ({ id, teacherData }) => ({
        url: `/admin/teacher-update/${id}`,
        method: "POST",
        body: teacherData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Teacher", id },
        "Teacher",
      ],
    }),

    // Suspend or activate user
    suspendOrActivateTeacher: builder.mutation({
      query: (id: number) => ({
        url: `/admin/teacher-suspend/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Teacher", id },
        "Teacher",
      ],
    }),
    // top status toggle
    topStatusToggle: builder.mutation({
      query: (id: number) => ({
        url: `/admin/teachers/${id}/toggle-top`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Teacher", id },
        "Teacher",
      ],
    }),
  }),
});

// Export all hooks
export const {
  useGetAdminTeachersQuery,
  useCreateTeacherMutation,
  useGetAdminTeacherByIdQuery,
  useUpdateTeacherMutation,
  useSuspendOrActivateTeacherMutation,
  useTopStatusToggleMutation
} = teachersApi;
