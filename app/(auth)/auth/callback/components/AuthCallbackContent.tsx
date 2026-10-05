"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/src/redux/hooks";
import { setCredentials } from "@/src/redux/slices/authSlice";
import { toast } from "sonner";
import { useGetMeQuery } from "@/src/redux/api/auth/authApi";
import { User } from "@/types/user";
import Loader from "@/components/ui/Loader";

export default function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [hasDispatched, setHasDispatched] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string>("/dashboard");

  // Get stored redirect URL from sessionStorage (before OAuth)
  useEffect(() => {
    const storedRedirect = sessionStorage.getItem("google_oauth_redirect");
    
    if (storedRedirect) {
      let finalRedirect = storedRedirect;
      
      // Don't redirect to root or login pages
      if (finalRedirect === "/" || finalRedirect === "/login" || finalRedirect === "/register") {
        finalRedirect = "/dashboard";
      }
      
      setRedirectUrl(finalRedirect);
      
      // Clear it immediately after reading (cleanup)
      sessionStorage.removeItem("google_oauth_redirect");
    }
  }, []);

  // First, extract and store the token
  useEffect(() => {
    const urlToken = searchParams.get("token");
    const errorParam = searchParams.get("error");

    if (errorParam) {
      setError(errorParam);
      toast.error("Google authentication failed");
      setTimeout(() => router.push("/login"), 2000);
      return;
    }

    if (urlToken && !hasDispatched) {
      setToken(urlToken);

      // Store token in localStorage for persistence
      localStorage.setItem("authToken", urlToken);
      sessionStorage.setItem("authToken", urlToken);

      // Set cookies for middleware
      const maxAge = 30 * 24 * 60 * 60; // 30 days
      document.cookie = `authToken=${urlToken}; path=/; max-age=${maxAge}; SameSite=Lax`;
      
      // Dispatch temporary user (will be updated after fetching)
      dispatch(
        setCredentials({
          token: urlToken,
          user: {} as User,
        }),
      );

      setHasDispatched(true);
    } else if (!urlToken && !errorParam) {
      router.push("/login");
    }
  }, [searchParams, router, dispatch, hasDispatched]);

  // Fetch user data using the token
  const {
    data: userData,
    isLoading: isUserLoading,
    isError: isUserError,
    error: fetchError,
  } = useGetMeQuery(undefined, {
    skip: !hasDispatched,
  });

  // Update Redux with user data when fetched
  useEffect(() => {
    if (userData?.user && token) {
      // Update Redux with full user data
      dispatch(
        setCredentials({
          token: token,
          user: userData.user,
        }),
      );

      // Persist user to localStorage and sessionStorage
      localStorage.setItem("user", JSON.stringify(userData.user));
      sessionStorage.setItem("user", JSON.stringify(userData.user));

      // Set user role cookie
      const maxAge = 30 * 24 * 60 * 60;
      const userRole = userData.user.role ? String(userData.user.role).toLowerCase() : "student";
      document.cookie = `userRole=${userRole}; path=/; max-age=${maxAge}; SameSite=Lax`;

      toast.success("Successfully Signed in with Google!");

      // Use the stored redirect URL (from sessionStorage) or default to /dashboard
      const finalRedirectUrl = redirectUrl || "/dashboard";

      window.location.href = finalRedirectUrl;
    }
  }, [userData, token, dispatch, redirectUrl]);

  // Handle error
  useEffect(() => {
    if (isUserError && hasDispatched) {
      console.error("Failed to fetch user data:", fetchError);
      toast.error("Failed to fetch user data. Please try again.");

      // Clear all stored data
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("google_oauth_redirect");
      document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      setTimeout(() => router.push("/login"), 2000);
    }
  }, [isUserError, fetchError, router, hasDispatched]);

  return (
    <div className="min-h-[calc(100vh-112px)] w-full flex items-center justify-center gap-4">
      <div>
        <div className="relative flex justify-center py-10">
          <Loader />
        </div>
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 md:mb-4">
          {error ? "Authentication Failed" : "Completing sign in..."}
        </h2>
        <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-500 dark:text-gray-400 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto">
          {error
            ? error
            : isUserLoading
              ? "Fetching your account information..."
              : "Please wait while we redirect you"}
        </p>
      </div>
    </div>
  );
}