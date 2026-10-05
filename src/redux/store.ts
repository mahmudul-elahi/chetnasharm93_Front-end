import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import tabReducer from './slices/tabSlice';
import { baseApi } from "./api/baseApi";

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^|;\\s*)${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
};

const loadAuthState = () => {
  if (typeof window === "undefined") return undefined;
  try {
    const token =
      localStorage.getItem("authToken") ||
      sessionStorage.getItem("authToken") ||
      getCookie("authToken");

    const rawUser =
      localStorage.getItem("user") ||
      sessionStorage.getItem("user");

    const user = rawUser ? JSON.parse(rawUser) : null;

    if (token && token !== "undefined" && token !== "null") {
      return {
        auth: {
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        },
      };
    }
  } catch (error) {
    console.error("Error loading auth state:", error);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("user");
  }
  return {
    auth: {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    },
  };
};

const setCookie = (name: string, value: string, hours = 24 * 30) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + hours * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
};

const clearCookie = (name: string) => {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tab: tabReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  preloadedState: loadAuthState(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

store.subscribe(() => {
  if (typeof window === "undefined") return;
  const { user, token, isAuthenticated } = store.getState().auth;

  if (isAuthenticated && token) {
    localStorage.setItem("authToken", token);
    sessionStorage.setItem("authToken", token);
    setCookie("authToken", token, 24 * 30);

    // Only update user-related storage if user exists
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("user", JSON.stringify(user));
      const role = user.role ? String(user.role).toLowerCase() : "student";
      setCookie("userRole", role, 24 * 30);
    }
  } else if (!isAuthenticated) {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("user");
    clearCookie("authToken");
    clearCookie("userRole");
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;