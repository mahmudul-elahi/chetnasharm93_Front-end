import { baseApi } from "../baseApi";

export const adminClassApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClassesForAdmin: builder.query({
      query: ({ page = 1, per_page = 10, search = "" }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("per_page", per_page.toString());
        if (search) params.append("search", search);

        return {
          url: `/admin/classes?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Class"],
    }),

    getClassForAdminById: builder.query({
      query: (id: string) => `/admin/classes/${id}`,
      providesTags: ["Class"],
    }),

    addClassForAdmin: builder.mutation({
      query: (data) => ({
        url: "/admin/classes",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Class"],
    }),

    updateClassForAdmin: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/classes/${id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Class"],
    }),
    updateClassStatusForAdmin: builder.mutation({
      query: (id: string) => ({
        url: `/admin/class-status/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Class"],
    }),
  }),
});

export const {
  useGetClassesForAdminQuery,
  useGetClassForAdminByIdQuery,
  useAddClassForAdminMutation,
  useUpdateClassForAdminMutation,
  useUpdateClassStatusForAdminMutation,
} = adminClassApi;
