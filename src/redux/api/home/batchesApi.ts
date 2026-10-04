import { baseApi } from "../baseApi";

export const batchesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBatchesByClassId: builder.query({
      query: ({ class_id, page = 1, per_page = 10, search = "" }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("per_page", per_page.toString());
        if (search) params.append("search", search);

        return {
          url: `/batches/${class_id}?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Batch"],
    }),
    getSingleBatchById: builder.query({
      query: (batch_id) => {
        return {
          url: `/single-batch/${batch_id}`,
          method: "GET",
        };
      },
      providesTags: ["Batch"],
    }),
  }),
});

export const { useGetAllBatchesByClassIdQuery, useGetSingleBatchByIdQuery } =
  batchesApi;
