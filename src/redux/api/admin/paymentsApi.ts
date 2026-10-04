import { baseApi } from "../baseApi";

export const paymentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentsForAdmin: builder.query({
      query: ({ page = 1, per_page = 10, search = "" }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("per_page", per_page.toString());
        if (search) params.append("search", search);

        return {
          url: `/payments?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Payment"],
    }),
    updatePaymentStatusForAdmin: builder.mutation({
      query: ({ id, transaction_id }) => ({
        url: `/admin/mark-as-paid/${id}?transaction_id=${transaction_id.toString()}`,
        method: "POST",
      }),
      invalidatesTags: ["Payment"],
    }),
  }),
});

export const {
  useGetPaymentsForAdminQuery,
  useUpdatePaymentStatusForAdminMutation,
} = paymentsApi;
