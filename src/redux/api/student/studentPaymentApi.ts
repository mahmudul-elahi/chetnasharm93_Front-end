import { baseApi } from "../baseApi";

export const studentPaymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // get payment history
    getPaymentHistoryForStudent: builder.query({
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

    // student payment to enroll a batch
    createPayment: builder.mutation({
      query: ({ batch_id, payment_method }) => ({
        url: `/student/create-payment`,
        method: "POST",
        body: {
          batch_id,
          payment_method,
        },
      }),
      invalidatesTags: (result, error, { batch_id }) => [
        { type: "Payment", batch_id },
        "Payment",
        "Batch",
      ],
    }),
  }),
});

export const { useGetPaymentHistoryForStudentQuery, useCreatePaymentMutation } =
  studentPaymentApi;
