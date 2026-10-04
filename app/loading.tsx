import React from "react";

export default function RootLoading() {
  return (
    <div className="w-full min-h-[70vh] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      {/* Top Banner / Hero Skeleton */}
      <div className="h-64 sm:h-80 w-full rounded-3xl bg-linear-to-r from-gray-100 via-gray-200 to-gray-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 mb-10" />

      {/* Title & subtitle skeleton */}
      <div className="space-y-3 mb-8">
        <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        <div className="h-4 w-96 max-w-full bg-gray-200 dark:bg-gray-700 rounded-md" />
      </div>

      {/* Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/60 p-5 space-y-4"
          >
            <div className="h-48 rounded-xl bg-gray-200 dark:bg-gray-700 w-full" />
            <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="space-y-2">
              <div className="h-3.5 w-full bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-3.5 w-5/6 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
            <div className="flex justify-between items-center pt-2">
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
