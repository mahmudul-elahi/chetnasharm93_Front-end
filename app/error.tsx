"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";
import MyButton from "@/components/ui/MyButton";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service or console
    console.error("Application runtime error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-linear-to-br from-white via-gray-50 to-primary/5 flex items-center justify-center px-4">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Gradient Top Bar */}
          <div className="h-1 w-full bg-linear-to-r from-red-500 via-rose-500 to-amber-500" />

          <div className="p-8 flex flex-col gap-6">
            {/* Warning Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse" />
                <div className="relative w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
                  <AlertTriangle className="w-10 h-10 text-red-500" />
                </div>
              </div>
            </div>

            {/* Error Message */}
            <div className="text-center">
              <p className="text-xs font-mono text-red-600 bg-red-50 inline-block px-3 py-1 rounded-full mb-3">
                {error.digest ? `Error ID: ${error.digest}` : "Unexpected Error"}
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Something went wrong!
              </h1>
              <p className="text-gray-600 text-sm">
                An unexpected error occurred while loading this page. You can try refreshing or returning home.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <MyButton onClick={() => reset()} className="flex-1 gap-2">
                <RotateCcw className="w-4 h-4" />
                Try Again
              </MyButton>
              <Link href="/" className="flex-1">
                <Button className="w-full gap-2" variant="outline">
                  <Home className="w-4 h-4" />
                  Go Home
                </Button>
              </Link>
            </div>

            {/* Support Link */}
            <div className="text-center pt-2">
              <p className="text-xs text-gray-500">
                Persistent issue?{" "}
                <Link href="/contact" className="text-primary hover:underline">
                  Contact Support
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
