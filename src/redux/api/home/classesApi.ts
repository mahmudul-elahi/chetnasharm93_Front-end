import { baseApi } from "../baseApi";

export const classesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllClasses: builder.query({
      query: ({ page = 1, per_page = 10, search = "" }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("per_page", per_page.toString());
        if (search) params.append("search", search);

        return {
          url: `/classes?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Class"],
    }),
    getSingleClassById: builder.query({
      query: (class_id) => {
        return {
          url: `/single-class/${class_id}`,
          method: "GET",
        };
      },
      providesTags: ["Class"],
    }),
  }),
});

export const { useGetAllClassesQuery, useGetSingleClassByIdQuery } = classesApi;
