import { UpdateBatchData } from "@/types/batches";
import { baseApi } from "../baseApi";

export const vocabulariesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllVocabulariesForAdmin: builder.query({
      query: ({ page = 1, per_page = 10, search = "" }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("per_page", per_page.toString());
        if (search) params.append("search", search);

        return {
          url: `/admin/vocabularies?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Vocabulary"],
    }),

    getSingleVocabularyForAdminById: builder.query({
      query: (id: number) => `/admin/vocabularies/${id}`,
      providesTags: ["Vocabulary"],
    }),

    addVocabulariesForAdmin: builder.mutation({
      query: (data) => ({
        url: "/admin/vocabularies",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Vocabulary"],
    }),
    updateVocabularyForAdmin: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/vocabularies/${id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Vocabulary"],
    }),

    deleteVocabularyForAdmin: builder.mutation({
      query: (id) => ({
        url: `/admin/vocabularies/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Vocabulary"],
    }),
  }),
});

export const {
  useGetAllVocabulariesForAdminQuery,
  useGetSingleVocabularyForAdminByIdQuery,
  useAddVocabulariesForAdminMutation,
  useUpdateVocabularyForAdminMutation,
  useDeleteVocabularyForAdminMutation,
} = vocabulariesApi;
