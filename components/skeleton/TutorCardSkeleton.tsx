"use client";

import React from "react";

const TutorCardSkeleton: React.FC = () => {
  return (
    <div className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 animate-pulse flex flex-col h-full">
      <div className="flex-1 flex flex-col">
        {/* Top Section: Image + Name & Expertise */}
        <div className="p-5">
          <div className="flex items-start gap-4">
            {/* Profile Image Skeleton */}
            <div className="relative shrink-0">
              <div className="w-25 h-25 rounded-full bg-gray-200 dark:bg-gray-700 ring-4 ring-white dark:ring-gray-800" />
            </div>

            {/* Right Side Info Skeleton */}
            <div className="flex-1 min-w-0 pt-1 space-y-2">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2" />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 dark:border-gray-700 mx-5"></div>

        {/* Center Section Skeleton */}
        <div className="p-5 space-y-3 flex-1 flex flex-col">
          {/* Bio Skeleton - 2 lines */}
          <div className="space-y-2 min-h-[2.6rem]">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-full" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4" />
          </div>

          {/* Expertise Skeleton */}
          <div className="flex items-start gap-2.5">
            <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded mt-0.5" />
            <div className="flex-1 space-y-1">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
            </div>
          </div>

          {/* Qualification Skeleton */}
          <div className="flex items-start gap-2.5">
            <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded mt-0.5" />
            <div className="flex-1 space-y-1">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            </div>
          </div>

          {/* Experience Skeleton */}
          <div className="flex items-start gap-2.5">
            <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded mt-0.5" />
            <div className="flex-1 space-y-1">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 dark:border-gray-700 mx-5"></div>

      {/* Bottom Section: Button Skeleton */}
      <div className="p-5 mt-auto">
        <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded-xl" />
      </div>
    </div>
  );
};

export default TutorCardSkeleton;
