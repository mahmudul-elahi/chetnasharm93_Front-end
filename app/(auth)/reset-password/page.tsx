import { Suspense } from "react";
import { Shield, UserRoundKey } from "lucide-react";
import Link from "next/link";
import ResetPasswordForm from "./_components/Resetpasswordform";


function ResetSkeleton() {
  return (
    <div className="flex flex-col gap-5 animate-pulse">
      <div className="flex flex-col gap-1.5">
        <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-11 rounded-full bg-gray-200 dark:bg-gray-700" />
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-11 rounded-full bg-gray-200 dark:bg-gray-700" />
      </div>
      <div className="h-11 rounded-full bg-gray-200 dark:bg-gray-700" />
    </div>
  );
}

const steps = [
  { step: 1, label: "Enter email", status: "done" },
  { step: 2, label: "Verify OTP", status: "done" },
  { step: 3, label: "New password", status: "active" },
] as const;

export default function ResetPasswordPage() {
  return (
    <div className="w-full max-w-md mx-auto px-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="p-4 sm:p-6 md:p-8">
          {/* card header */}
          <div className="flex flex-col items-center gap-1 text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 flex items-center justify-center mb-2">
              <UserRoundKey className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Reset Password
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Enter your new password below
            </p>
          </div>

          {/* ── Step indicator ── */}
          <div className="flex items-center justify-center mb-6">
            {steps.map((s, i) => (
              <div key={s.label} className="flex items-center">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
                    ${
                      s.status === "done"
                        ? "border-green-500 bg-green-500 text-white"
                        : s.status === "active"
                          ? "border-blue-500 bg-blue-500 text-white"
                          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-400"
                    }`}
                  >
                    {s.status === "done" ? "✓" : s.step}
                  </div>
                  <span
                    className={`text-[10px] font-medium whitespace-nowrap
                    ${
                      s.status === "done"
                        ? "text-green-500"
                        : s.status === "active"
                          ? "text-blue-600"
                          : "text-gray-400"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`w-6 sm:w-12 h-px mx-2 transition-all ${
                      s.status === "done"
                        ? "bg-green-400"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* form */}
          <Suspense fallback={<ResetSkeleton />}>
            <ResetPasswordForm />
          </Suspense>

          <p className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-6">
            Remember your password?{" "}
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
  );
}