// components/ui/TutorCardSkeleton.tsx
import React from "react";

const TeacherCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg h-125 flex flex-col animate-pulse">
      {/* Avatar Section Skeleton */}
      <div className="pt-8 px-6 pb-4 bg-linear-to-br from-primary/5 to-secondary/5">
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 border-4 border-white shadow-xl" />
            {/* Rating Badge Skeleton */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gray-200 dark:bg-gray-700 w-24 h-6 rounded-full" />
          </div>
        </div>
      </div>

      {/* Info Section Skeleton */}
      <div className="flex-1 p-6 pt-8">
        {/* Name and Title Skeleton */}
        <div className="text-center mb-4">
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-2" />
          <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
          {[1, 2, 3].map((i) => (
            <div key={i} className="text-center">
              <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-1" />
              <div className="h-3 w-10 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
            </div>
          ))}
        </div>

        {/* Expertise Tags Skeleton */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"
              />
            ))}
          </div>
        </div>

        {/* Languages and Availability Skeleton */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherCardSkeleton;