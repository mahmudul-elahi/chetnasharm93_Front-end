import { baseApi } from "../baseApi";

export const classesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTeachers: builder.query({
      query: ({ page = 1, per_page = 10, search = "", is_top }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("per_page", per_page.toString());
        if (search) params.append("search", search);
        if (is_top) params.append("is_top", is_top);

        return {
          url: `/teachers?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Teacher"],
    }),
    getTeacherById: builder.query({
      query: (id: number) => ({
        url: `/teachers/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Teacher", id }],
    }),
  }),
});

export const { useGetAllTeachersQuery, useGetTeacherByIdQuery } = classesApi;
