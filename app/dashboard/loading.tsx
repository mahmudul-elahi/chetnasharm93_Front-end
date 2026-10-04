import React from "react";
import TableSkeleton from "@/components/skeleton/TableSkeleton";

export default function DashboardLoading() {
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 animate-pulse w-full max-w-350 mx-auto">
      {/* Page Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-56 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          <div className="h-4 w-72 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        <div className="h-10 w-36 bg-gray-200 dark:bg-gray-700 rounded-xl" />
      </div>

      {/* Metric Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 space-y-3"
          >
            <div className="flex justify-between items-start">
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700" />
            </div>
            <div className="h-7 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-3 w-36 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        ))}
      </div>

      {/* Main Content / Table Area Skeleton */}
      <div className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 space-y-4">
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 w-44 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-9 w-28 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        </div>
        <TableSkeleton rows={5} columns={4} showHeader={true} showIndex={true} />
      </div>
    </div>
  );
}
