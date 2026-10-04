"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/src/redux/hooks";
import { logout, setCredentials } from "@/src/redux/slices/authSlice";
import {
  useGetMeQuery,
  useLoginMutation,
  useLogoutApiMutation,
} from "@/src/redux/api/auth/authApi";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isInitializing, setIsInitializing] = useState(true);

  const {
    user: reduxUser,
    token,
    isAuthenticated: reduxAuth,
  } = useAppSelector((state) => state.auth);

  const [loginMutation] = useLoginMutation();
  const [logoutApi] = useLogoutApiMutation();

  const handleLogout = useCallback(async () => {
    try {
      await logoutApi().unwrap();
    } catch {
      // Ignore logout API errors
    } finally {
      dispatch(logout());
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      document.cookie =
        "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie =
        "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      window.location.href = "/login";
    }
  }, [logoutApi, dispatch]);

  const shouldFetchUser = !!token;

  const {
    data: fetchedUser,
    isLoading: isFetchingUser,
    isError,
    refetch,
    error,
  } = useGetMeQuery(undefined, {
    skip: !shouldFetchUser,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  // Extract user from API response
  const extractedUser =
    fetchedUser?.user || fetchedUser?.data?.user || fetchedUser;


  // Sync fetched user with Redux - IMPORTANT: This ensures has_password is stored
  useEffect(() => {
    if (extractedUser && token) {
      // Check if we need to update Redux (missing has_password or different user)
      const needsUpdate =
        !reduxUser ||
        reduxUser.id !== extractedUser.id ||
        reduxUser.has_password !== extractedUser.has_password;

      if (needsUpdate) {

        dispatch(setCredentials({ token, user: extractedUser }));

        // Also update localStorage directly to ensure persistence
        localStorage.setItem("user", JSON.stringify(extractedUser));
      }
    }
  }, [extractedUser, token, reduxUser, dispatch]);

  // Handle 401 errors
  useEffect(() => {
    if (isError && error) {
      const status = (error as any)?.status;
      const originalStatus = (error as any)?.originalStatus;
      const errorData = (error as any)?.data;
      const errorMessage = errorData?.message || (error as any)?.message;

      if (
        status === 401 ||
        originalStatus === 401 ||
        errorMessage === "Unauthenticated"
      ) {
        console.log("401 detected - logging out user");
        handleLogout();
      }
    }
  }, [isError, error, handleLogout]);

  // Set initializing to false
  useEffect(() => {
    if (!shouldFetchUser) {
      setIsInitializing(false);
    } else if (extractedUser || isError) {
      setIsInitializing(false);
    }
  }, [shouldFetchUser, extractedUser, isError]);

  const login = useCallback(
    async (credentials: {
      email: string;
      password: string;
      rememberMe?: boolean;
    }) => {
      try {
        const result = await loginMutation(credentials).unwrap();
        if (result.token && result.user) {
          if (credentials.rememberMe) {
            localStorage.setItem("rememberMe", "true");
          } else {
            localStorage.removeItem("rememberMe");
          }

          dispatch(setCredentials({ token: result.token, user: result.user }));

          document.cookie = `authToken=${result.token}; path=/; max-age=${credentials.rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60}`;
          document.cookie = `userRole=${result.user.role}; path=/; max-age=${credentials.rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60}`;

          // After login, fetch /me to get full user data including has_password
          setTimeout(() => {
            refetch();
          }, 100);

          return { success: true };
        }
        return { success: false, error: "Invalid response" };
      } catch (error: any) {
        return { success: false, error: error.data?.message || "Login failed" };
      }
    },
    [loginMutation, dispatch, refetch],
  );

  // Determine final user - prioritize Redux user as source of truth
  const user = reduxUser || extractedUser;

  const isAuthenticated = !!user && !!token;
  const isLoading = isInitializing || (shouldFetchUser && isFetchingUser);
  const isRefreshing = isFetchingUser && !isInitializing;

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    isRefreshing,
    isError: isError && shouldFetchUser,
    error: isError ? error : null,
    login,
    logout: handleLogout,
    refreshUser: refetch,
    isAdmin: user?.role === "admin",
    isTeacher: user?.role === "teacher",
    isStudent: user?.role === "student",
  };
};
