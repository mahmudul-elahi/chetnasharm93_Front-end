import { Suspense } from "react";
import ForgotPasswordForm from "./_components/ForgotPasswordForm";
import { KeyRound, ShieldCheck, Mail, Clock } from "lucide-react";
import Link from "next/link";

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

function FormSkeleton() {
  return (
    <div className="flex flex-col gap-5 animate-pulse">
      <div className="flex flex-col gap-1.5">
        <div className="h-4 w-28 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-11 rounded-full bg-gray-200 dark:bg-gray-700" />
        <div className="h-3 w-52 rounded bg-gray-200 dark:bg-gray-700" />
      </div>
      <div className="h-11 rounded-full bg-gray-200 dark:bg-gray-700" />
    </div>
  );
}

const steps = [
  { step: 1, label: "Enter email", active: true },
  { step: 2, label: "Verify OTP", active: false },
  { step: 3, label: "New password", active: false },
];

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="p-4 sm:p-6 md:p-8">
          {/* card header */}
          <div className="flex flex-col items-center gap-1 text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 flex items-center justify-center mb-2">
              <KeyRound className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Forgot your password?
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              No worries — enter your email and we&apos;ll send you a
              verification code.
            </p>
          </div>

          {/* ── Step indicator ── */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center">
              {steps.map((s, i) => (
                <div key={s.label} className="flex items-center">
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                        s.active
                          ? "border-blue-500 bg-blue-500 text-white"
                          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-400"
                      }`}
                    >
                      {s.step}
                    </div>
                    <span
                      className={`text-[10px] font-medium whitespace-nowrap ${
                        s.active ? "text-blue-600" : "text-gray-400"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-6 sm:w-12 h-px bg-gray-200 dark:bg-gray-700 mx-2" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* form */}
          <Suspense fallback={<FormSkeleton />}>
            <ForgotPasswordForm />
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