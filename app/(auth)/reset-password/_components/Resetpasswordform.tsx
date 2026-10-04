"use client";

import { useResetPasswordMutation } from "@/src/redux/api/auth/authApi";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, AlertCircle, ArrowRight } from "lucide-react";
import MyButton from "@/components/ui/MyButton";
import { SpinnerCustom } from "@/components/ui/spinner";

// ── Validation ────────────────────────────────────────────────────────────────
const resetSchema = z
  .object({
    new_password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(50, "Password is too long")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    new_password_confirmation: z
      .string()
      .min(1, "Please confirm your password"),
  })
  .refine((d) => d.new_password === d.new_password_confirmation, {
    message: "Passwords do not match",
    path: ["new_password_confirmation"],
  });

type ResetFormData = z.infer<typeof resetSchema>;

// ── Password strength ─────────────────────────────────────────────────────────
const getPasswordStrength = (password: string) => {
  if (!password) return { score: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { score, label: "Weak",   color: "bg-red-500" };
  if (score <= 2) return { score, label: "Fair",   color: "bg-yellow-500" };
  if (score <= 3) return { score, label: "Good",   color: "bg-blue-500" };
  return            { score, label: "Strong", color: "bg-green-500" };
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function ResetPasswordForm() {
  const searchParams  = useSearchParams();
  const router        = useRouter();
  const email         = searchParams.get("email") ?? "";
  const otp           = searchParams.get("otp")   ?? "";

  const [showNew,     setShowNew]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
    defaultValues: { new_password: "", new_password_confirmation: "" },
    mode: "onChange",
  });

  const passwordValue    = watch("new_password");
  const passwordStrength = getPasswordStrength(passwordValue || "");

  const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    register("new_password_confirmation").onChange(e);
    if (passwordValue) trigger("new_password_confirmation");
  };

  const onSubmit = async (data: ResetFormData) => {
    setServerError(null);
    try {
      await resetPassword({
        email,
        otp,
        new_password:              data.new_password,
        new_password_confirmation: data.new_password_confirmation,
      }).unwrap();
      toast.success("Password reset successful! Please sign in.");
      router.push("/login");
    } catch (err: any) {
      const msg = err?.data?.message ?? "Failed to reset password. Try again.";
      setServerError(msg);
      toast.error(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
      {/* Server error */}
      {serverError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
          <p className="text-sm text-red-600 dark:text-red-400">{serverError}</p>
        </div>
      )}

      {/* ── New Password ── */}
      <div className="space-y-1.5">
        <label htmlFor="new_password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          New Password
        </label>

        {/* Premium input row */}
        <div
          className={`group flex items-center rounded-full overflow-hidden transition-all duration-200
            ${errors.new_password 
              ? "border-2 border-red-400 bg-red-50/10 ring-2 ring-red-400/20" 
              : "border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
            }
            ${!errors.new_password && "hover:border-[#8350D9] hover:shadow-md hover:shadow-[#8350D9]/5"}
            focus-within:ring-2 focus-within:ring-[#8350D9]/30 focus-within:border-[#8350D9] focus-within:shadow-lg focus-within:shadow-[#8350D9]/10
            shadow-sm
          `}
        >
          <div className="bg-gray-100 dark:bg-gray-800 size-10 sm:size-11 flex justify-center items-center transition-all duration-200 group-hover:bg-[#8350D9]/10 group-focus-within:bg-[#8350D9]/10">
            <Lock size={14} className="text-gray-500 transition-all duration-200 group-hover:text-[#8350D9] group-hover:scale-110 group-focus-within:text-[#8350D9] group-focus-within:scale-110" />
          </div>
          <input
            {...register("new_password")}
            id="new_password"
            type={showNew ? "text" : "password"}
            placeholder="Enter your new password..."
            disabled={isLoading}
            aria-invalid={errors.new_password ? "true" : "false"}
            className="bg-transparent w-full h-10 sm:h-11 px-3 outline-none text-sm text-gray-900 dark:text-white placeholder:text-gray-400"
          />
          <button
            type="button"
            onClick={() => setShowNew((p) => !p)}
            className="bg-gray-100 dark:bg-gray-800 size-10 sm:size-11 flex justify-center items-center text-gray-500 hover:text-[#8350D9] transition-all duration-200 hover:scale-110"
            aria-label={showNew ? "Hide password" : "Show password"}
          >
            {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>

        {/* Strength bar */}
        {passwordValue && (
          <div className="flex flex-col gap-1 mt-0.5">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    level <= passwordStrength.score
                      ? passwordStrength.color
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <span className="inline-block w-1 h-1 rounded-full bg-[#8350D9]/50" />
              Password strength:{" "}
              <span className={`font-medium ${
                passwordStrength.label === "Weak"   ? "text-red-500"    :
                passwordStrength.label === "Fair"   ? "text-yellow-500" :
                passwordStrength.label === "Good"   ? "text-blue-500"   :
                "text-green-500"
              }`}>
                {passwordStrength.label}
              </span>
            </p>
          </div>
        )}

        {errors.new_password && (
          <p className="flex items-center gap-1 text-xs text-red-500 mt-1" role="alert">
            <AlertCircle className="w-3 h-3" /> {errors.new_password.message}
          </p>
        )}
      </div>

      {/* ── Confirm Password ── */}
      <div className="space-y-1.5">
        <label htmlFor="new_password_confirmation" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Confirm Password
        </label>

        {/* Premium input row */}
        <div
          className={`group flex items-center rounded-full overflow-hidden transition-all duration-200
            ${errors.new_password_confirmation 
              ? "border-2 border-red-400 bg-red-50/10 ring-2 ring-red-400/20" 
              : "border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
            }
            ${!errors.new_password_confirmation && "hover:border-[#8350D9] hover:shadow-md hover:shadow-[#8350D9]/5"}
            focus-within:ring-2 focus-within:ring-[#8350D9]/30 focus-within:border-[#8350D9] focus-within:shadow-lg focus-within:shadow-[#8350D9]/10
            shadow-sm
          `}
        >
          <div className="bg-gray-100 dark:bg-gray-800 size-10 sm:size-11 flex justify-center items-center transition-all duration-200 group-hover:bg-[#8350D9]/10 group-focus-within:bg-[#8350D9]/10">
            <Lock size={14} className="text-gray-500 transition-all duration-200 group-hover:text-[#8350D9] group-hover:scale-110 group-focus-within:text-[#8350D9] group-focus-within:scale-110" />
          </div>
          <input
            {...register("new_password_confirmation")}
            onChange={handleConfirmChange}
            id="new_password_confirmation"
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm your new password..."
            disabled={isLoading}
            aria-invalid={errors.new_password_confirmation ? "true" : "false"}
            className="bg-transparent w-full h-10 sm:h-11 px-3 outline-none text-sm text-gray-900 dark:text-white placeholder:text-gray-400"
          />
          <button
            type="button"
            onClick={() => setShowConfirm((p) => !p)}
            className="bg-gray-100 dark:bg-gray-800 size-10 sm:size-11 flex justify-center items-center text-gray-500 hover:text-[#8350D9] transition-all duration-200 hover:scale-110"
            aria-label={showConfirm ? "Hide password" : "Show password"}
          >
            {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>

        {errors.new_password_confirmation && (
          <p className="flex items-center gap-1 text-xs text-red-500 mt-1" role="alert">
            <AlertCircle className="w-3 h-3" /> {errors.new_password_confirmation.message}
          </p>
        )}
      </div>

      {/* ── Premium Submit Button ── */}
      <MyButton 
        type="submit" 
        disabled={isLoading} 
        className="w-full rounded-full h-10 sm:h-11 md:h-12 text-sm sm:text-base bg-gradient-to-r from-[#8350D9] to-[#6B3BA8] hover:from-[#6B3BA8] hover:to-[#8350D9] transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-[#8350D9]/25 active:scale-[0.98]"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            Resetting… <SpinnerCustom />
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            Reset Password <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </span>
        )}
      </MyButton>
    </form>
  );
}