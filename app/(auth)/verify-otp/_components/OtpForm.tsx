"use client";

import MyButton from "@/components/ui/MyButton";
import { SpinnerCustom } from "@/components/ui/spinner";
import { useVerifyOtpMutation } from "@/src/redux/api/auth/authApi";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ShieldCheck, RotateCcw, Mail } from "lucide-react";

const OTP_LENGTH = 4;

export default function OtpForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") ?? "";

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();

  const focusNext = (index: number) => inputRefs.current[index + 1]?.focus();
  const focusPrev = (index: number) => inputRefs.current[index - 1]?.focus();

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;
    const updated = [...digits];
    updated[index] = value;
    setDigits(updated);
    if (value) focusNext(index);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !digits[index]) focusPrev(index);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    const updated = [...digits];
    pasted.split("").forEach((ch, i) => (updated[i] = ch));
    setDigits(updated);
    const nextEmpty = updated.findIndex((d) => !d);
    inputRefs.current[nextEmpty === -1 ? OTP_LENGTH - 1 : nextEmpty]?.focus();
  };

  const filled = digits.filter(Boolean).length;
  const progress = (filled / OTP_LENGTH) * 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otp = digits.join("");
    if (otp.length < OTP_LENGTH) {
      toast.error("Please enter the complete OTP.");
      return;
    }
    try {
      await verifyOtp({ email, otp }).unwrap();
      toast.success("OTP verified!");
      router.push(
        `/reset-password?email=${encodeURIComponent(email)}&otp=${otp}`,
      );
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Invalid OTP. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
      {/* Email display - premium rounded-full style */}
      <div className="group flex items-center rounded-full overflow-hidden transition-all duration-200 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-[#8350D9] hover:shadow-md hover:shadow-[#8350D9]/5 shadow-sm">
        <div className="bg-gray-100 dark:bg-gray-800 size-10 sm:size-11 flex justify-center items-center transition-all duration-200 group-hover:bg-[#8350D9]/10">
          <Mail
            size={14}
            className="text-gray-500 transition-all duration-200 group-hover:text-[#8350D9] group-hover:scale-110"
          />
        </div>
        <div className="flex-1 px-3 py-2.5">
          {/* <p className="text-xs text-gray-500 dark:text-gray-400">
            Code sent to
          </p> */}
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            {email}
          </p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 size-10 sm:size-11 flex justify-center items-center transition-all duration-200 group-hover:bg-[#8350D9]/10">
          <ShieldCheck
            size={14}
            className="text-green-500 transition-all duration-200 group-hover:scale-110"
          />
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <span className="inline-block w-1 h-1 rounded-full bg-[#8350D9]/50" />
            {filled} of {OTP_LENGTH} digits entered
          </span>
          {filled === OTP_LENGTH && (
            <span className="text-green-500 font-medium animate-pulse">
              Ready to verify ✓
            </span>
          )}
        </div>
        <div className="h-1 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${progress}%`,
              background:
                filled === OTP_LENGTH
                  ? "linear-gradient(90deg, #22c55e, #16a34a)"
                  : `linear-gradient(90deg, #8350D9, #6B3BA8)`,
            }}
          />
        </div>
      </div>

      {/* OTP boxes - premium styling */}
      <div className="flex justify-center gap-3" onPaste={handlePaste}>
        {digits.map((digit, i) => (
          <div key={i} className="relative">
            <input
              ref={(el) => {
                inputRefs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className={`h-14 w-12 rounded-xl text-center text-xl font-bold outline-none transition-all duration-200
                ${
                  digit
                    ? "border-2 border-[#8350D9] bg-[#8350D9]/10 text-[#8350D9] shadow-md shadow-[#8350D9]/20"
                    : "border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white hover:border-[#8350D9]/50 focus:border-[#8350D9] focus:ring-2 focus:ring-[#8350D9]/30 focus:shadow-lg focus:shadow-[#8350D9]/10"
                }`}
            />
            {!digit && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 transition-all duration-200 group-hover:bg-[#8350D9]/50" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Premium Submit Button */}
      <MyButton
        disabled={isLoading || filled < OTP_LENGTH}
        type="submit"
        className="w-full rounded-full h-10 sm:h-11 md:h-12 text-sm sm:text-base bg-linear-to-r from-[#8350D9] to-[#6B3BA8] hover:from-[#6B3BA8] hover:to-[#8350D9] transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-[#8350D9]/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            Verifying <SpinnerCustom />
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            Verify OTP
          </span>
        )}
      </MyButton>

      {/* Resend link - premium styling */}
      <div className="flex items-center justify-center gap-1.5 text-sm text-gray-500">
        <span>Didn&apos;t receive a code?</span>
        <a
          href={`/forgot-password?email=${encodeURIComponent(email)}`}
          className="inline-flex items-center gap-1 text-[#8350D9] font-medium hover:text-[#6B3BA8] transition-all duration-200 hover:gap-2 group"
        >
          <RotateCcw className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" />
          <span>Resend</span>
        </a>
      </div>
    </form>
  );
}
