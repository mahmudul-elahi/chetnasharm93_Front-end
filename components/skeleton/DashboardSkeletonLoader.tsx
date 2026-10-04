import React from "react";
import Loader from "../ui/Loader";

const DashboardSkeletonLoader = () => {
  return (
    <div
      data-html2canvas-ignore="true"
      suppressHydrationWarning
      className="min-h-screen flex bg-gray-50 dark:bg-gray-900"
    >
      {/* Sidebar Skeleton - Hidden on Mobile */}
      <div className="hidden lg:block  w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="p-6 space-y-8 animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-12 flex-1 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full">
        {/* Navbar */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between px-4 py-3 lg:px-6 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="lg:hidden w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              <div className="hidden md:block">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-3 ml-2">
                <div className="size-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="max-w-350 mx-auto">
            {/* Header */}
            <div className="mb-8 animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96"></div>
            </div>

            <div className="flex justify-center items-center min-h-[calc(100vh-212px)]">
              {" "}
            <Loader />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardSkeletonLoader;
