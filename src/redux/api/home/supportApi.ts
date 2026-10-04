import { baseApi } from "../baseApi";

export const supportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSupportInfo: builder.query({
      query: () => {
        return {
          url: `/support`,
          method: "GET",
        };
      },
    }),
  }),
});

export const { useGetSupportInfoQuery } = supportApi;
