"use client";

import React from "react";
import {
  FileQuestion,
  Home,
  ArrowLeft,
  Search,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MyButton from "@/components/ui/MyButton";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-linear-to-br from-white via-gray-50 to-primary/5 flex items-center justify-center px-4">
      <div className="max-w-md w-full mx-auto">
        {/* Error Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Gradient Top Bar */}
          <div className="h-1 w-full bg-linear-to-r from-primary via-primary/70 to-secondary" />

          <div className="p-8 flex flex-col gap-6">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                <div className="relative w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileQuestion className="w-10 h-10 text-primary" />
                </div>
              </div>
            </div>

            {/* Error Code */}
            <div className="text-center">
              <p className="text-sm font-mono text-primary bg-primary/10 inline-block px-3 py-1 rounded-full mb-3">
                404 Error
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Page Not Found
              </h1>
              <p className="text-gray-600 text-sm">
                The page you're looking for doesn't exist or has been moved.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/" className="flex-1">
                <MyButton className="w-full gap-2">
                  <Home className="w-4 h-4" />
                  Go Home
                </MyButton>
              </Link>
              <Button
                onClick={() => router.back()}
               className="flex-1"
               variant="outline"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </Button>
            </div>

            {/* Search Suggestion */}
            <div className="text-center pt-2">
              <p className="text-xs text-gray-500">
                Need help?{" "}
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
