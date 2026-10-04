import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { logout, setCredentials } from "../slices/authSlice";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  prepareHeaders: (headers, { getState }) => {
    headers.set("accept", "application/json");
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
}) as BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>;

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null; //  shared promise

const refreshToken = async (expiredToken: string): Promise<string | null> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/refresh`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${expiredToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data.token ?? null;
};

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    //  If not already refreshing, start a single refresh
    if (!isRefreshing) {
      isRefreshing = true;
      const expiredToken = (api.getState() as RootState).auth.token;

      //  Store the promise so ALL waiting requests share the same refresh
      refreshPromise = refreshToken(expiredToken ?? "").finally(() => {
        isRefreshing = false;
      });
    }

    //  ALL requests (including /me, /teachers, etc.) wait for the SAME promise
    const newToken = await refreshPromise;

    if (newToken) {
      api.dispatch(
        setCredentials({
          token: newToken,
          user: (api.getState() as RootState).auth.user,
        }),
      );

      //  Retry with new token injected directly
      const retryArgs: FetchArgs =
        typeof args === "string"
          ? { url: args, headers: { authorization: `Bearer ${newToken}` } }
          : {
              ...(args as FetchArgs),
              headers: {
                ...(((args as FetchArgs).headers as Record<string, string>) ??
                  {}),
                authorization: `Bearer ${newToken}`,
              },
            };

      result = await rawBaseQuery(retryArgs, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Class",
    "Batch",
    "User",
    "Payment",
    "Teacher",
    "Settings",
    "TeacherAvailability",
    "Attendance",
    "Student",
    "Enrollment",
    "Wishlist",
    "ClassRecording",
    "Note",
    "StudentNote",
    "Vocabulary",
    "SpeakingTopic",
    "BasicQuestion",
    "Assignment"
  ] as const,
  endpoints: () => ({}),
});
