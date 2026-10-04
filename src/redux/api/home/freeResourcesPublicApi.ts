import { baseApi } from "../baseApi";

export const freeResourcesPublicApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllVocabularyPublic: builder.query({
      query: ({ page = 1, per_page = 10 }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("per_page", per_page.toString());

        return {
          url: `/vocabularies?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Vocabulary"],
    }),
    getAllSpeakingTopicsPublic: builder.query({
      query: ({ page = 1, per_page = 10 }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("per_page", per_page.toString());

        return {
          url: `/speaking-topics?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["SpeakingTopic"],
    }),
    getAllBasicQuestionsPublic: builder.query({
      query: ({ page = 1, per_page = 10 }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("per_page", per_page.toString());

        return {
          url: `/basic-questions?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["BasicQuestion"],
    }),
  }),
});

export const {
  useGetAllVocabularyPublicQuery,
  useGetAllSpeakingTopicsPublicQuery,
  useGetAllBasicQuestionsPublicQuery
} = freeResourcesPublicApi;
