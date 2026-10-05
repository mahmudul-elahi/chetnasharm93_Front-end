"use client";

import React from "react";

const BatchDetailSkeleton = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 sm:pt-28 sm:pb-16 bg-linear-to-br from-gray-50 to-gray-100">
      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Side - Batch Details Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            {/* Back Button Skeleton */}
            <div className="w-24 h-10 bg-gray-200 rounded-lg animate-pulse lg:hidden"></div>

            {/* Batch Info Card Skeleton */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden p-4">
              <div className="py-4 border-b border-gray-200">
                <div className="h-8 bg-gray-200 rounded-lg w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-1/2 mt-2 animate-pulse"></div>
              </div>

              <div className="space-y-6 py-4">
                {/* Description Skeleton */}
                <div>
                  <div className="h-6 bg-gray-200 rounded-lg w-1/3 animate-pulse mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded-lg w-full animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded-lg w-5/6 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded-lg w-4/6 animate-pulse"></div>
                  </div>
                </div>

                {/* Schedule Skeleton */}
                <div>
                  <div className="h-6 bg-gray-200 rounded-lg w-1/4 animate-pulse mb-3"></div>
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Teacher Skeleton */}
                <div>
                  <div className="h-6 bg-gray-200 rounded-lg w-1/4 animate-pulse mb-3"></div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-32 animate-pulse mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                    </div>
                  </div>
                </div>

                {/* Stats Skeleton */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i}>
                      <div className="h-3 bg-gray-200 rounded w-16 animate-pulse mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
                    </div>
                  ))}
                </div>

                {/* Progress Bar Skeleton */}
                <div>
                  <div className="flex justify-between mb-2">
                    <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gray-300 h-2 rounded-full w-1/2 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Payment Options Skeleton */}
          <div className="lg:col-span-1">
             <div className="h-10 bg-gray-200 rounded-full animate-pulse hidden lg:block w-full mb-6"></div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 sticky top-24">
              <div className="p-6 border-b border-gray-200">
                <div className="h-6 bg-gray-200 rounded w-32 animate-pulse mb-4"></div>
                <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                  <div className="h-3 bg-gray-200 rounded w-24 animate-pulse mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="h-5 bg-gray-200 rounded w-40 animate-pulse mb-4"></div>

                {/* Payment Methods Skeleton */}
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-start p-4 border-2 border-gray-200 rounded-xl"
                    >
                      <div className="w-4 h-4 bg-gray-200 rounded-full mt-1 mr-3 animate-pulse"></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                        </div>
                        <div className="h-3 bg-gray-200 rounded w-48 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Security Note Skeleton */}
                <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                  <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-48 animate-pulse"></div>
                </div>

                {/* Button Skeleton */}
                <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>

                {/* Terms Skeleton */}
                <div className="h-3 bg-gray-200 rounded w-64 mx-auto animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchDetailSkeleton;