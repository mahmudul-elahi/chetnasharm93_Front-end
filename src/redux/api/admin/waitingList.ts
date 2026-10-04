import { baseApi } from "../baseApi";

export const waitingList = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // get waiting list for admin
    getWaitingListForAdmin: builder.query({
      query: ({ page = 1, per_page = 10, search = "", batch_id }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("per_page", per_page.toString());
        if (search) params.append("search", search);
        if (batch_id) params.append("batch_id", batch_id);

        return {
          url: `/admin/waiting-list?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Wishlist"],
    }),
  }),
});

export const {useGetWaitingListForAdminQuery} = waitingList;
