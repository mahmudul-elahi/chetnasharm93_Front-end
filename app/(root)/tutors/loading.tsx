import React from "react";
import TutorCardSkeleton from "@/components/skeleton/TutorCardSkeleton";

export default function TutorsLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Skeleton */}
      <div className="text-center space-y-3 max-w-2xl mx-auto animate-pulse">
        <div className="h-9 w-60 bg-gray-200 dark:bg-gray-700 rounded-xl mx-auto" />
        <div className="h-4 w-80 max-w-full bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
      </div>

      {/* Filter Skeleton */}
      <div className="flex justify-center animate-pulse">
        <div className="h-11 w-full max-w-md bg-gray-200 dark:bg-gray-700 rounded-xl" />
      </div>

      {/* Tutors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <TutorCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
