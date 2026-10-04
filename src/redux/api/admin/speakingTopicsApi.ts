import { baseApi } from "../baseApi";

export const speakingTopicsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSpeakingTopicsForAdmin: builder.query({
      query: ({ page = 1, per_page = 10, search = "" }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("per_page", per_page.toString());
        if (search) params.append("search", search);

        return {
          url: `/admin/speaking-topics?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["SpeakingTopic"],
    }),

    getSingleSpeakingTopicForAdminById: builder.query({
      query: (id: number) => `/admin/speaking-topics/${id}`,
      providesTags: ["SpeakingTopic"],
    }),

    addSpeakingTopicForAdmin: builder.mutation({
      query: (data) => ({
        url: "/admin/speaking-topics",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SpeakingTopic"],
    }),

    updateSpeakingTopicForAdmin: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/speaking-topics/${id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SpeakingTopic"],
    }),

    deleteSpeakingTopicForAdmin: builder.mutation({
      query: (id) => ({
        url: `/admin/speaking-topics/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SpeakingTopic"],
    }),
  }),
});

export const {
  useGetAllSpeakingTopicsForAdminQuery,
  useGetSingleSpeakingTopicForAdminByIdQuery,
  useAddSpeakingTopicForAdminMutation,
  useUpdateSpeakingTopicForAdminMutation,
  useDeleteSpeakingTopicForAdminMutation,
} = speakingTopicsApi;