"use client";

import MyButton from "@/components/ui/MyButton";
import { SpinnerCustom } from "@/components/ui/spinner";
import { useSendOtpMutation } from "@/src/redux/api/auth/authApi";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, ArrowRight } from "lucide-react";

export default function ForgotPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [sendOtp, { isLoading }] = useSendOtpMutation();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendOtp({ email }).unwrap();
      toast.success("OTP sent! Check your inbox.");
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to send OTP. Try again.");
    }
  };

  // Track if email has been touched for error state
  const [touched, setTouched] = useState(false);
  const hasError = touched && !email;

  return (
    <form onSubmit={handleSendOtp} className="space-y-4 sm:space-y-5">
      {/* ── Email field ─────────────────────────────────── */}
      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Email address
        </label>

        {/* Premium input row */}
        <div
          className={`flex items-center rounded-full overflow-hidden transition-all duration-200
            ${hasError 
              ? "border-2 border-red-400 bg-red-50/10 ring-2 ring-red-400/20" 
              : "border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
            }
            ${!hasError && "hover:border-[#8350D9] hover:shadow-md hover:shadow-[#8350D9]/5"}
            focus-within:ring-2 focus-within:ring-[#8350D9]/30 focus-within:border-[#8350D9] focus-within:shadow-lg focus-within:shadow-[#8350D9]/10
            shadow-sm
          `}
        >
          <div className="bg-gray-100 dark:bg-gray-800 size-10 sm:size-11 flex justify-center items-center transition-colors duration-200 group-hover:bg-[#8350D9]/10">
            <Mail size={14} className="text-gray-500 transition-colors duration-200 group-hover:text-[#8350D9]" />
          </div>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="you@example.com"
            className="bg-transparent w-full h-10 sm:h-11 px-3 outline-none text-sm text-gray-900 dark:text-white placeholder:text-gray-400"
          />
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500">
          We&apos;ll send a one-time password to this address.
        </p>
      </div>

      {/* ── Submit ── */}
      <MyButton 
        type="submit" 
        disabled={isLoading} 
        className="w-full rounded-full h-10 sm:h-11 md:h-12 text-sm sm:text-base bg-gradient-to-r from-[#8350D9] to-[#6B3BA8] hover:from-[#6B3BA8] hover:to-[#8350D9] transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-[#8350D9]/25"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            Sending OTP <SpinnerCustom />
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            Send OTP <ArrowRight className="w-4 h-4" />
          </span>
        )}
      </MyButton>
    </form>
  );
}