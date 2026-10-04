"use client";

import { useRouter } from "next/navigation";
import { ShieldAlert, Home, LogIn, ArrowLeft, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Animated Icon */}
        <div className="mb-6 flex justify-center animate-pulse">
          <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <ShieldAlert className="w-12 h-12 text-red-600 dark:text-red-400" />
          </div>
        </div>

        <h1 className="text-6xl font-bold text-red-600 dark:text-red-400 mb-4">
          403
        </h1>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Access Denied
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          You don't have permission to access this page.
        </p>

        <div className="space-y-3">
          <Button onClick={() => router.push("/dashboard")} className="w-full">
            <Home className="w-4 h-4 mr-2" />
            Go to Dashboard
          </Button>

          <Button
            onClick={() => router.back()}
            variant="outline"
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center gap-2 justify-center mb-2">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Need Help?
            </p>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Contact your administrator to request access or upgrade your
            permissions.
          </p>
        </div>
      </div>
    </div>
  );
}
