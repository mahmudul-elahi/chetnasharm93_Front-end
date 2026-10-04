import { baseApi } from "../baseApi";

export const adminSettingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get settings
    getAdminSettings: builder.query({
      query: () => ({
        url: `/admin/settings`,
        method: "GET",
      }),
      providesTags: ["Settings"],
    }),
    // Get env settings
    getAdminEnvSettings: builder.query({
      query: () => ({
        url: `/admin/env-settings`,
        method: "GET",
      }),
      providesTags: ["Settings"],
    }),
    // update settings
    updateAdminSettings: builder.mutation({
      query: (settingsData) => ({
        url: "/admin/settings",
        method: "POST",
        body: settingsData,
      }),
      invalidatesTags: ["Settings"],
    }),
    // update env settings
    updateAdminEnvSettings: builder.mutation({
      query: (envData) => ({
        url: "/admin/env-settings",
        method: "POST",
        body: envData,
      }),
      invalidatesTags: ["Settings"],
    }),
  }),
});

export const { useGetAdminSettingsQuery, useGetAdminEnvSettingsQuery, useUpdateAdminSettingsMutation, useUpdateAdminEnvSettingsMutation } =
  adminSettingsApi;
