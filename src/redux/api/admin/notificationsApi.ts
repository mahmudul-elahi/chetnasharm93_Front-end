import { baseApi } from "../baseApi";

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotificationsForAdmin: builder.query({
      query: ({ page = 1, per_page = 10, message_type, batch_id }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("per_page", per_page.toString());
        if (message_type) params.append("message_type", message_type);
        if (batch_id) params.append("batch_id", batch_id);

        return {
          url: `/admin/notification-logs?${params.toString()}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const {useGetNotificationsForAdminQuery} = notificationsApi;
