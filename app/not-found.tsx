"use client";

import React from "react";
import { FileQuestion, Home, ArrowLeft, Search, Compass } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MyButton from "@/components/ui/MyButton";

export default function NotFound() {
  const router = useRouter();

  const suggestions = [
    { name: "Home Page", href: "/" },
    { name: "Live Classes", href: "/classes" },
    { name: "Our Tutors", href: "/tutors" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-white via-gray-50 to-primary/5 flex items-center justify-center px-4">
      <div className="max-w-md w-full mx-auto">
        {/* Not Found Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Gradient Top Bar */}
          <div className="h-1 w-full bg-linear-to-r from-primary via-primary/70 to-secondary" />

          <div className="p-8 flex flex-col gap-6">
            {/* Animated Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                <div className="relative w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileQuestion className="w-12 h-12 text-primary" />
                </div>
              </div>
            </div>

            {/* Error Code */}
            <div className="text-center">
              <p className="text-sm font-mono text-primary bg-primary/10 inline-block px-3 py-1 rounded-full mb-3">
                404 Error
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Page Not Found
              </h1>
              <p className="text-gray-500 text-sm">
                Oops! The page you're looking for doesn't exist or has been
                moved.
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
              <Link
                href="/dashboard"
                className="flex-1 rounded-full inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </Link>
            </div>

            {/* Divider */}
            <div className="relative flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">You might like</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Suggested Links */}
            <div className="grid grid-cols-2 gap-2">
              {suggestions.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 hover:bg-primary/5 transition-colors group"
                >
                  <Compass className="w-3 h-3 text-primary" />
                  <span className="text-sm text-gray-700 group-hover:text-primary transition-colors">
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-400">
            Need help?{" "}
            <Link href="/" className="text-primary hover:underline">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
