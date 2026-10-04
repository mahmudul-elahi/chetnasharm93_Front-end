"use client";
import { useSearchParams } from "next/navigation";
import { XCircle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import MyButton from "@/components/ui/MyButton";
import { Button } from "@/components/ui/button";

export default function FailedContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary/5  to-secondary/5  p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center border border-red-200 dark:border-red-800">
          {/* Error Icon */}
          <div className="w-24 h-24 bg-linear-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-in zoom-in duration-500">
            <XCircle className="w-12 h-12 text-white" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Payment Failed ❌
          </h1>

          {/* Status Message */}
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {status === "failed"
              ? "Your payment could not be processed. Please try again."
              : "Something went wrong with your payment."}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Link href="/classes">
              <MyButton className="w-full ">
                <RefreshCw className="w-4 h-4" />
                Try Again
              </MyButton>
            </Link>

            <Link href="/dashboard">
              <Button variant="outline" className="w-full">
                <Home className="w-4 h-4" />
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
