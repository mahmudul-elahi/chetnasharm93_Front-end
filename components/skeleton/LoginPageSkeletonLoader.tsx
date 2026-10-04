"use client";

import React from "react";
import { Shield, Zap, Users, UsersRound } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Secure Learning",
    desc: "Your data is protected with enterprise-grade security",
    bgClass: "bg-blue-100 dark:bg-blue-900/30",
    iconClass: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: Zap,
    title: "Instant Access",
    desc: "Get immediate access to all your purchased courses",
    bgClass: "bg-purple-100 dark:bg-purple-900/30",
    iconClass: "text-purple-600 dark:text-purple-400",
  },
  {
    icon: UsersRound,
    title: "Community Support",
    desc: "Join 10,000+ learners and get support from experts",
    bgClass: "bg-green-100 dark:bg-green-900/30",
    iconClass: "text-green-600 dark:text-green-400",
  },
];

export default function LoginPageSkeletonLoader() {
  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center lg:p-4">
        {/* ── Left info panel skeleton ─────────────────────────── */}
        <div className="hidden lg:flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            {/* Title skeleton */}
            <div className="h-9 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
            {/* Subtitle skeleton */}
            <div className="h-5 w-80 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
          </div>

          {/* feature list skeleton */}
          <div className="flex flex-col gap-6">
            {features.map(({ icon: Icon, title, desc, bgClass, iconClass }) => (
              <div key={title} className="flex items-start gap-3">
                {/* Icon skeleton */}
                <div
                  className={`w-10 h-10 ${bgClass} rounded-lg flex items-center justify-center shrink-0`}
                >
                  <Icon className={`w-5 h-5 ${iconClass}`} />
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  {/* Title skeleton */}
                  <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
                  {/* Description skeleton */}
                  <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
                </div>
              </div>
            ))}
          </div>

          {/* stats skeleton */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                <div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* ── Right form card skeleton ──────────────────────────── */}
        <div className="w-full lg:flex lg:justify-end">
          <div className="max-w-md mx-auto lg:mx-0 lg:max-w-lg w-full">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
              <div className="p-4 sm:p-6 md:p-8">
                {/* Header skeleton */}
                <div className="flex flex-col items-center gap-2 text-center mb-6">
                  <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                  <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
                </div>

                <div className="space-y-4 sm:space-y-5">
                  {/* Email field skeleton */}
                  <div className="space-y-1.5">
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
                    <div className="flex items-center rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
                      <div className="bg-gray-100 dark:bg-gray-800 size-10 sm:size-11 flex justify-center items-center">
                        <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
                      </div>
                      <div className="w-full h-10 sm:h-11 px-3 bg-gray-50 dark:bg-gray-800 animate-pulse" />
                    </div>
                  </div>

                  {/* Password field skeleton */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
                      <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
                    </div>
                    <div className="flex items-center rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
                      <div className="bg-gray-100 dark:bg-gray-800 size-10 sm:size-11 flex justify-center items-center">
                        <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
                      </div>
                      <div className="w-full h-10 sm:h-11 px-3 bg-gray-50 dark:bg-gray-800 animate-pulse" />
                      <div className="bg-gray-100 dark:bg-gray-800 size-10 sm:size-11 flex justify-center items-center">
                        <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
                      </div>
                    </div>
                  </div>

                  {/* Remember me skeleton */}
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
                  </div>

                  {/* Submit button skeleton */}
                  <div className="w-full h-10 sm:h-11 md:h-12 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse" />
                </div>

                {/* Divider skeleton */}
                <div className="relative flex items-center gap-3 my-6">
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                  <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                </div>

                {/* Google button skeleton */}
                <div className="w-full h-10 sm:h-11 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />

                {/* Sign up link skeleton */}
                <div className="flex items-center justify-center gap-1 mt-6">
                  <div className="h-4 w-36 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
                  <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
