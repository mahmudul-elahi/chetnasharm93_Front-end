import { baseApi } from "../baseApi";

export const wishlistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // get wishlist for student
    getWishList: builder.query({
      query: ({ page = 1, per_page = 10, search = "" }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("per_page", per_page.toString());
        if (search) params.append("search", search);

        return {
          url: `/student/waiting-list?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Wishlist"],
    }),

    // add to wish List
    addToWishList: builder.mutation({
      query: ({ batch_id }) => ({
        url: `/student/waiting-list`,
        method: "POST",
        body: {
          batch_id,
        },
      }),
      invalidatesTags: (result, error, { batch_id }) => [
        { type: "Wishlist", batch_id },
        "Wishlist",
        "Wishlist",
      ],
    }),
  }),
});

export const { useGetWishListQuery, useAddToWishListMutation } = wishlistApi;
