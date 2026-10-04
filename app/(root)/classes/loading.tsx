import React from "react";
import LiveClassCardSkeleton from "@/components/skeleton/LiveClassCardSkeleton";

export default function ClassesLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Skeleton */}
      <div className="text-center space-y-3 max-w-2xl mx-auto animate-pulse">
        <div className="h-9 w-64 bg-gray-200 dark:bg-gray-700 rounded-xl mx-auto" />
        <div className="h-4 w-96 max-w-full bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
      </div>

      {/* Filter / Search Bar Skeleton */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between animate-pulse">
        <div className="h-11 w-full sm:w-80 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        <div className="flex gap-2 overflow-x-auto w-full sm:w-auto">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-9 w-20 bg-gray-200 dark:bg-gray-700 rounded-full shrink-0" />
          ))}
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <LiveClassCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
