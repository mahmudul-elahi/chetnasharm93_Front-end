import { baseApi } from "../baseApi";
interface resetPasswordData {
  email: string;
  otp: string;
  new_password: string;
  new_password_confirmation: string;
}

export const authApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({ url: "/register", method: "POST", body: data }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),
    getMe: builder.query({
      query: () => "/me",
      providesTags: ["User"],
      extraOptions: { maxRetries: 0 },
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/profile-update",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    refresh: builder.mutation<{ token: string; user: any }, void>({
      query: () => ({ url: "/refresh", method: "POST" }),
    }),
    logoutApi: builder.mutation<void, void>({
      query: () => ({ url: "/logout", method: "POST" }),
    }),
    sendOtp: builder.mutation<void, { email: string }>({
      query: (data) => ({ url: "/send-otp", method: "POST", body: data }),
    }),
    verifyOtp: builder.mutation<void, { email: string; otp: string }>({
      query: (data) => ({ url: "/verify-otp", method: "POST", body: data }),
    }),
    resetPassword: builder.mutation<void, resetPasswordData>({
      query: (data) => ({ url: "/password-reset", method: "POST", body: data }),
    }),
    profileUpdate: builder.mutation<void, FormData>({
      query: (data) => ({ url: "/profile-update", method: "POST", body: data }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetMeQuery,
  useUpdateProfileMutation,
  useRefreshMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
  useLogoutApiMutation,
  useProfileUpdateMutation,
} = authApi;
