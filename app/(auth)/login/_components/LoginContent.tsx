"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  Zap,
  Users,
  AlertCircle,
  User,
  UsersRound,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { zodResolver } from "@hookform/resolvers/zod";
import { SpinnerCustom } from "@/components/ui/spinner";
import { useLoginMutation } from "@/src/redux/api/auth/authApi";
import { useAppDispatch } from "@/src/redux/hooks";
import { setCredentials } from "@/src/redux/slices/authSlice";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import MyButton from "@/components/ui/MyButton";

// ── Validation ────────────────────────────────────────────────────────────────
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

const features = [
  {
    icon: Shield,
    title: "Secure Learning",
    desc: "Your data is protected with enterprise-grade security",
    bgClass: "bg-blue-100 dark:bg-blue-900/30",
    iconClass: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: Zap,
    title: "Instant Access",
    desc: "Get immediate access to all your purchased courses",
    bgClass: "bg-purple-100 dark:bg-purple-900/30",
    iconClass: "text-purple-600 dark:text-purple-400",
  },
  {
    icon: UsersRound,
    title: "Community Support",
    desc: "Join 10,000+ learners and get support from experts",
    bgClass: "bg-green-100 dark:bg-green-900/30",
    iconClass: "text-green-600 dark:text-green-400",
  },
];

export default function LoginContent() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const searchParams = useSearchParams();

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);

  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
    mode: "onChange",
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    localStorage.setItem("rememberMe", String(data.rememberMe));

    try {
      const result = await login({
        email: data.email,
        password: data.password,
      }).unwrap();

      const { user, token } = result;

      // Set loading state for the button
      setIsRedirecting(true);

      // Create promises for storage operations
      const storageOperations = async () => {
        const cookieAge = data.rememberMe
          ? 30 * 24 * 60 * 60
          : 24 * 60 * 60;
        document.cookie = `authToken=${token}; path=/; max-age=${cookieAge}; SameSite=Lax`;
        if (user?.role) {
          document.cookie = `userRole=${user.role}; path=/; max-age=${cookieAge}; SameSite=Lax`;
        }

        if (data.rememberMe) {
          localStorage.setItem("authToken", token);
          localStorage.setItem("user", JSON.stringify(user));

          // Verify localStorage was set correctly
          const storedToken = localStorage.getItem("authToken");
          const storedUser = localStorage.getItem("user");

          if (!storedToken || !storedUser) {
            throw new Error("Failed to save to localStorage");
          }
        } else {
          sessionStorage.setItem("authToken", token);
          sessionStorage.setItem("user", JSON.stringify(user));

          // Verify sessionStorage was set correctly
          const storedToken = sessionStorage.getItem("authToken");
          const storedUser = sessionStorage.getItem("user");

          if (!storedToken || !storedUser) {
            throw new Error("Failed to save to sessionStorage");
          }
        }
      };

      // Create promise for Redux dispatch
      const reduxOperation = () => {
        return new Promise((resolve) => {
          dispatch(setCredentials({ user, token }));
          // Give Redux a moment to update its state
          setTimeout(resolve, 0);
        });
      };

      // Wait for both storage and Redux operations to complete
      await Promise.all([storageOperations(), reduxOperation()]);

      toast.success("Sign in successfully!");

      const redirectUrl = searchParams.get("redirect") || "/dashboard";

      // Refresh and redirect after everything is confirmed
      router.refresh();
      router.replace(redirectUrl);
    } catch (err: any) {
      const msg =
        err?.data?.message || err?.data?.error || "Invalid email or password";

      setServerError(msg);
      toast.error(msg);
      setIsRedirecting(false); // Reset loading state on error
    }
  };
  const handleGoogleLogin = () => {
    // Get the current redirect URL (where user wants to go after login)
    const redirectUrl =
      searchParams.get("redirect") || window.location.pathname;

    // Store in sessionStorage (clears when tab/browser closes)
    sessionStorage.setItem("google_oauth_redirect", redirectUrl);

    // Redirect to Google OAuth
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google/redirect`;
  };

  const goToForgot = () => {
    router.push(`/forgot-password?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto ">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center lg:p-4">
        {/* ── Left info panel ─────────────────────────── */}
        <div className="hidden lg:flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome Back! 👋
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Access your courses, track progress, and continue your learning
              journey.
            </p>
          </div>

          {/* feature list */}
          <div className="flex flex-col gap-6">
            {features.map(({ icon: Icon, title, desc, bgClass, iconClass }) => (
              <div key={title} className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 ${bgClass} rounded-lg flex items-center justify-center shrink-0`}
                >
                  <Icon className={`w-5 h-5 ${iconClass}`} />
                </div>
                <div className="flex flex-col gap-0.5">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* stats */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
            {[
              { value: "10K+", label: "Learners" },
              { value: "500+", label: "Courses" },
              { value: "4.9★", label: "Rating" },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col gap-0.5">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right form card ──────────────────────────── */}
        <div className="w-full lg:flex lg:justify-end">
          <div className="max-w-md mx-auto lg:mx-0 lg:max-w-lg w-full">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
              <div className="p-4 sm:p-6 md:p-8">
                {/* Header */}
                <div className="flex flex-col items-center gap-1 text-center mb-6">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    Sign In
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    Welcome back! Please enter your details
                  </p>
                </div>

                {/* Server Error */}
                {serverError && (
                  <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                    <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {serverError}
                    </p>
                  </div>
                )}

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4 sm:space-y-5"
                >
                  {/* Email Field */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Email Address
                    </label>
                    <div
                      className={`flex items-center rounded-full overflow-hidden transition-all duration-200
  ${
    errors.email
      ? "border-2 border-red-400 bg-red-50/10 ring-2 ring-red-400/20"
      : "border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
  }
  ${
    !errors.email &&
    "hover:border-[#8350D9] hover:shadow-md hover:shadow-[#8350D9]/5"
  }
  focus-within:ring-2 focus-within:ring-[#8350D9]/30 focus-within:border-[#8350D9] focus-within:shadow-lg focus-within:shadow-[#8350D9]/10
  shadow-sm
`}
                    >
                      <div className="bg-gray-100 dark:bg-gray-800 size-10 sm:size-11 flex justify-center items-center">
                        <Mail size={14} className="text-gray-500" />
                      </div>
                      <input
                        {...register("email")}
                        type="email"
                        id="email"
                        placeholder="Enter your email..."
                        onChange={(e) => {
                          register("email").onChange(e);
                          setEmail(e.target.value);
                        }}
                        disabled={isLoading}
                        aria-invalid={errors.email ? "true" : "false"}
                        className="bg-white dark:bg-gray-900 w-full h-10 sm:h-11 px-3 outline-none text-sm text-gray-900 dark:text-white placeholder:text-gray-400"
                      />
                    </div>
                    {errors.email && (
                      <p
                        className="flex items-center gap-1 text-xs text-red-500"
                        role="alert"
                      >
                        <AlertCircle className="w-3 h-3" />{" "}
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={goToForgot}
                        className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-colors cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div
                      className={`flex items-center rounded-full overflow-hidden transition-all duration-200
  ${
    errors.email
      ? "border-2 border-red-400 bg-red-50/10 ring-2 ring-red-400/20"
      : "border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
  }
  ${
    !errors.email &&
    "hover:border-[#8350D9] hover:shadow-md hover:shadow-[#8350D9]/5"
  } focus-within:ring-2 focus-within:ring-[#8350D9]/30 focus-within:border-[#8350D9] focus-within:shadow-lg focus-within:shadow-[#8350D9]/10 shadow-sm
`}
                    >
                      <div className="bg-gray-100 dark:bg-gray-800 size-10 sm:size-11 flex justify-center items-center">
                        <Lock size={14} className="text-gray-500" />
                      </div>
                      <input
                        {...register("password")}
                        type={showPassword ? "text" : "password"}
                        id="password"
                        placeholder="Enter your password..."
                        disabled={isLoading}
                        aria-invalid={errors.password ? "true" : "false"}
                        className="bg-white dark:bg-gray-900 w-full h-10 sm:h-11 px-3 outline-none text-sm text-gray-900 dark:text-white placeholder:text-gray-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        className="bg-gray-100 dark:bg-gray-800 size-10 sm:size-11 flex justify-center items-center text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
                      >
                        {showPassword ? (
                          <EyeOff size={14} />
                        ) : (
                          <Eye size={14} />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p
                        className="flex items-center gap-1 text-xs text-red-500"
                        role="alert"
                      >
                        <AlertCircle className="w-3 h-3" />{" "}
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Remember me */}
                  <label className="flex items-center gap-2 cursor-pointer w-fit">
                    <input
                      {...register("rememberMe")}
                      type="checkbox"
                      disabled={isLoading}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Remember me
                    </span>
                  </label>

                  {/* Submit Button */}
                  <MyButton
                    type="submit"
                    disabled={isLoading || isRedirecting}
                    className="w-full text-sm sm:text-base"
                  >
                    {isLoading || isRedirecting ? (
                      <span className="flex items-center justify-center gap-2">
                        Signing in <SpinnerCustom />
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Sign In <ArrowRight className="w-4 h-4" />
                      </span>
                    )}
                  </MyButton>
                </form>

                {/* Divider */}
                <div className="relative flex items-center gap-3 my-6">
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                  <span className="text-xs text-gray-400 shrink-0">
                    Or continue with
                  </span>
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                </div>

                {/* Google Button */}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleGoogleLogin();
                  }}
                  className={`w-full h-10 sm:h-11 flex items-center justify-center border rounded-full hover:bg-gray-50 transition-colors ${isLoading ? "pointer-events-none opacity-50" : ""}`}
                >
                  <FcGoogle className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm ml-2">Google</span>
                </a>
                {/* Sign up link */}
                <p className="text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-6">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/register"
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-semibold transition-colors"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
