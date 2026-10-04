import { baseApi } from "../baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all users
    getAdminUsers: builder.query({
      query: ({ page = 1, per_page = 10, search = "", role = "" }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("per_page", per_page.toString());
        if (search) params.append("search", search);
        if (role) params.append("role", role);

        return {
          url: `/admin/users?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["User"],
    }),

    // Get user by ID
    getUserById: builder.query({
      query: (id: number) => ({
        url: `/admin/user-edit-data/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),

    // Create new user
    createUser: builder.mutation({
      query: (userData) => ({
        url: "/admin/user-store",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    // Update user
    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/user-update/${id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "User", id },
        "User",
      ],
    }),

    // Suspend or activate user
    suspendOrActivateUser: builder.mutation({
      query: (id: number) => ({
        url: `/admin/user-suspend/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [{ type: "User", id }, "User"],
    }),
    // delete user

    DeleteUser: builder.mutation({
      query: (id: number) => ({
        url: `/admin/user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "User", id }, "User"],
    }),
  }),
});

// Export all hooks
export const {
  useGetAdminUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useSuspendOrActivateUserMutation,
  useDeleteUserMutation
} = userApi;
