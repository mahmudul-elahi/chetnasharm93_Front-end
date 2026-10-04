import { baseApi } from "../baseApi";

export const basicQuestionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBasicQuestionsForAdmin: builder.query({
      query: ({ page = 1, per_page = 10, search = "" }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("per_page", per_page.toString());
        if (search) params.append("search", search);

        return {
          url: `/admin/basic-questions?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["BasicQuestion"],
    }),

    getSingleBasicQuestionForAdminById: builder.query({
      query: (id: number) => `/admin/basic-questions/${id}`,
      providesTags: ["BasicQuestion"],
    }),

    addBasicQuestionForAdmin: builder.mutation({
      query: (data) => ({
        url: "/admin/basic-questions",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["BasicQuestion"],
    }),

    updateBasicQuestionForAdmin: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/basic-questions/${id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["BasicQuestion"],
    }),

    deleteBasicQuestionForAdmin: builder.mutation({
      query: (id) => ({
        url: `/admin/basic-questions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["BasicQuestion"],
    }),
  }),
});

export const {
  useGetAllBasicQuestionsForAdminQuery,
  useGetSingleBasicQuestionForAdminByIdQuery,
  useAddBasicQuestionForAdminMutation,
  useUpdateBasicQuestionForAdminMutation,
  useDeleteBasicQuestionForAdminMutation,
} = basicQuestionsApi;