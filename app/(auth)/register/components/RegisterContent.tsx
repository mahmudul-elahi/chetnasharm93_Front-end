"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  AlertCircle,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SpinnerCustom } from "@/components/ui/spinner";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { useRegisterMutation } from "@/src/redux/api/auth/authApi";
import RegisterFeatureInfo from "./RegisterFeatureInfo";
import MyButton from "@/components/ui/MyButton";

// Validation schema
// FIX 1: Removed agreeToTerms from schema since the checkbox is commented out.
// Having it as required (val === true) with a default of false meant the form
// could never pass validation — the submit button was effectively broken.
const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "Full name is required")
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name is too long"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(50, "Password is too long"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerApi, { isLoading }] = useRegisterMutation();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      // FIX 1 cont: agreeToTerms removed from defaultValues too
    },
    mode: "onChange",
  });

  const passwordValue = watch("password");

  // FIX 2: Destructure RHF's onChange from register() so we can call both
  // RHF's handler AND our trigger() without overwriting each other.
  // Previously spreading {...register("confirmPassword")} and then setting
  // onChange separately caused RHF's onChange to be silently overwritten,
  // which broke field tracking and dirty/touched state.
  const { onChange: confirmPasswordOnChange, ...confirmPasswordRest } =
    register("confirmPassword");

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);

    try {
      const payload = {
        name: data.fullName,
        email: data.email,
        password: data.password,
        password_confirmation: data.confirmPassword,
      };

      const result = await registerApi(payload).unwrap();

      // FIX 3: Broadened success check — API may return boolean true, string
      // "true", numeric 1, or a truthy "success" field. The original strict
      // `=== true` check caused successful responses to fall into the error
      // branch whenever the API returned a non-boolean truthy value.
      const isSuccess =
        result.status === true ||
        result.status === "true" ||
        result.status === 1 ||
        result.success === true;

      if (isSuccess) {
        toast.success(result.message || "Account created successfully!");
        router.push("/login");
      } else {
        toast.error(result.message || "Registration failed");
        setServerError(result.message || "Registration failed");
      }
    } catch (error: any) {
      let errorMessage = "Registration failed. Please try again.";

      if (error?.data) {
        const errorData = error.data;

        if (errorData.errors) {
          if (errorData.errors.email) {
            const emailMsg = Array.isArray(errorData.errors.email)
              ? errorData.errors.email[0]
              : errorData.errors.email;
            setError("email", { type: "manual", message: emailMsg });
          }

          if (errorData.errors.name) {
            const nameMsg = Array.isArray(errorData.errors.name)
              ? errorData.errors.name[0]
              : errorData.errors.name;
            setError("fullName", { type: "manual", message: nameMsg });
          }

          if (errorData.errors.password) {
            const pwdMsg = Array.isArray(errorData.errors.password)
              ? errorData.errors.password[0]
              : errorData.errors.password;
            setError("password", { type: "manual", message: pwdMsg });
          }

          const firstErrorKey = Object.keys(errorData.errors)[0];
          const firstError = errorData.errors[firstErrorKey];
          errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } else if (error?.error) {
        errorMessage = error.error;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      toast.error(errorMessage);
      setServerError(errorMessage);
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

  return (
    <div className="w-full max-w-7xl mx-auto mb-10">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center lg:p-4">
        {/* Left Side - Features */}
        <div>
          <RegisterFeatureInfo />
        </div>

        {/* Right Side - Register Form */}
        <div className="w-full lg:flex lg:justify-end">
          <div className="max-w-md mx-auto lg:mx-0 lg:max-w-lg w-full">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
              <div className="p-4 sm:p-6 md:p-8">
                {/* Header */}
                <div className="flex flex-col items-center gap-1 text-center mb-6">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    Create Account
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    Join us today! Fill in your details below
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
                  {/* Full Name Field */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="fullName"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Full Name
                    </label>
                    <div
                      className={`flex items-center rounded-full overflow-hidden transition-all duration-200 ${errors.fullName ? "border-2 border-red-400 bg-red-50/10 ring-2 ring-red-400/20" : "border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"} ${!errors.fullName && "hover:border-[#8350D9] hover:shadow-md hover:shadow-[#8350D9]/5"} focus-within:ring-2 focus-within:ring-[#8350D9]/30 focus-within:border-[#8350D9] focus-within:shadow-lg focus-within:shadow-[#8350D9]/10 shadow-sm`}
                    >
                      <div className="bg-gray-100 dark:bg-gray-800 size-10 sm:size-11 flex justify-center items-center">
                        <User size={14} className="text-gray-500" />
                      </div>
                      <input
                        {...register("fullName")}
                        type="text"
                        id="fullName"
                        placeholder="Enter your full name..."
                        disabled={isLoading}
                        aria-invalid={errors.fullName ? "true" : "false"}
                        className="bg-white dark:bg-gray-900 w-full h-10 sm:h-11 px-3 outline-none text-sm text-gray-900 dark:text-white placeholder:text-gray-400"
                      />
                    </div>
                    {errors.fullName && (
                      <p
                        className="flex items-center gap-1 text-xs text-red-500"
                        role="alert"
                      >
                        <AlertCircle className="w-3 h-3" />{" "}
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Email Address
                    </label>
                    <div
                      className={`flex items-center rounded-full overflow-hidden transition-all duration-200 ${errors.email ? "border-2 border-red-400 bg-red-50/10 ring-2 ring-red-400/20" : "border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"} ${!errors.email && "hover:border-[#8350D9] hover:shadow-md hover:shadow-[#8350D9]/5"} focus-within:ring-2 focus-within:ring-[#8350D9]/30 focus-within:border-[#8350D9] focus-within:shadow-lg focus-within:shadow-[#8350D9]/10 shadow-sm`}
                    >
                      <div className="bg-gray-100 dark:bg-gray-800 size-10 sm:size-11 flex justify-center items-center">
                        <Mail size={14} className="text-gray-500" />
                      </div>
                      <input
                        {...register("email")}
                        type="email"
                        id="email"
                        placeholder="you@example.com"
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
                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Password
                    </label>
                    <div
                      className={`flex items-center rounded-full overflow-hidden transition-all duration-200 ${errors.password ? "border-2 border-red-400 bg-red-50/10 ring-2 ring-red-400/20" : "border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"} ${!errors.password && "hover:border-[#8350D9] hover:shadow-md hover:shadow-[#8350D9]/5"} focus-within:ring-2 focus-within:ring-[#8350D9]/30 focus-within:border-[#8350D9] focus-within:shadow-lg focus-within:shadow-[#8350D9]/10 shadow-sm`}
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

                  {/* Confirm Password Field */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Confirm Password
                    </label>
                    <div
                      className={`flex items-center rounded-full overflow-hidden transition-all duration-200 ${errors.confirmPassword ? "border-2 border-red-400 bg-red-50/10 ring-2 ring-red-400/20" : "border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"} ${!errors.confirmPassword && "hover:border-[#8350D9] hover:shadow-md hover:shadow-[#8350D9]/5"} focus-within:ring-2 focus-within:ring-[#8350D9]/30 focus-within:border-[#8350D9] focus-within:shadow-lg focus-within:shadow-[#8350D9]/10 shadow-sm`}
                    >
                      <div className="bg-gray-100 dark:bg-gray-800 size-10 sm:size-11 flex justify-center items-center">
                        <Lock size={14} className="text-gray-500" />
                      </div>
                      <input
                        // FIX 2: Spread the rest of register() props (ref, name, onBlur)
                        // separately from onChange so we can compose both handlers.
                        {...confirmPasswordRest}
                        onChange={async (e) => {
                          await confirmPasswordOnChange(e); // RHF must run first
                          if (passwordValue) trigger("confirmPassword");
                        }}
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        placeholder="Confirm your password..."
                        disabled={isLoading}
                        aria-invalid={errors.confirmPassword ? "true" : "false"}
                        className="bg-white dark:bg-gray-900 w-full h-10 sm:h-11 px-3 outline-none text-sm text-gray-900 dark:text-white placeholder:text-gray-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((p) => !p)}
                        aria-label={
                          showConfirmPassword
                            ? "Hide confirm password"
                            : "Show confirm password"
                        }
                        className="bg-gray-100 dark:bg-gray-800 size-10 sm:size-11 flex justify-center items-center text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={14} />
                        ) : (
                          <Eye size={14} />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p
                        className="flex items-center gap-1 text-xs text-red-500"
                        role="alert"
                      >
                        <AlertCircle className="w-3 h-3" />{" "}
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <MyButton
                    type="submit"
                    disabled={isLoading}
                    className="w-full text-sm sm:text-base"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        Creating account <SpinnerCustom />
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Create Account <ArrowRight className="w-4 h-4" />
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

                {/* Sign In Link */}
                <p className="text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-6">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-semibold transition-colors"
                  >
                    Sign in
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
