"use client";

import React from "react";

const StudentChartSkeleton = () => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-4">
        <div className="h-7 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="h-10 w-28 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>

      {/* Chart Skeleton */}
      <div className="relative h-50 bg-gray-50 rounded-lg overflow-hidden">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/50 to-transparent animate-shimmer"></div>
        
        {/* Chart placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-full h-full" preserveAspectRatio="none">
            {/* Wavy line animation */}
            <path
              d="M 0 150 Q 50 100, 100 150 T 200 100 T 300 140 T 400 80 T 500 120 T 600 60 T 700 100 T 800 40"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <animate
                attributeName="d"
                dur="2s"
                repeatCount="indefinite"
                values="
                  M 0 150 Q 50 100, 100 150 T 200 100 T 300 140 T 400 80 T 500 120 T 600 60 T 700 100 T 800 40;
                  M 0 140 Q 50 160, 100 120 T 200 150 T 300 90 T 400 130 T 500 70 T 600 110 T 700 50 T 800 90;
                  M 0 150 Q 50 100, 100 150 T 200 100 T 300 140 T 400 80 T 500 120 T 600 60 T 700 100 T 800 40
                "
              />
            </path>
            
            {/* Area under the line */}
            <path
              d="M 0 150 Q 50 100, 100 150 T 200 100 T 300 140 T 400 80 T 500 120 T 600 60 T 700 100 T 800 40 L 800 200 L 0 200 Z"
              fill="#f3f4f6"
            >
              <animate
                attributeName="d"
                dur="2s"
                repeatCount="indefinite"
                values="
                  M 0 150 Q 50 100, 100 150 T 200 100 T 300 140 T 400 80 T 500 120 T 600 60 T 700 100 T 800 40 L 800 200 L 0 200 Z;
                  M 0 140 Q 50 160, 100 120 T 200 150 T 300 90 T 400 130 T 500 70 T 600 110 T 700 50 T 800 90 L 800 200 L 0 200 Z;
                  M 0 150 Q 50 100, 100 150 T 200 100 T 300 140 T 400 80 T 500 120 T 600 60 T 700 100 T 800 40 L 800 200 L 0 200 Z
                "
              />
            </path>
          </svg>
        </div>

        {/* Grid lines skeleton */}
        <div className="absolute inset-0 pointer-events-none">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="absolute w-full h-px bg-gray-200"
              style={{ top: `${i * 25}%` }}
            ></div>
          ))}
        </div>

        {/* X-axis labels skeleton */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-between px-2">
          {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((_, i) => (
            <div key={i} className="h-3 w-8 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>

      {/* Statistics Cards Skeleton */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="bg-blue-50 p-3 rounded-lg animate-pulse">
          <div className="h-4 w-24 bg-blue-200 rounded mb-2"></div>
          <div className="h-8 w-20 bg-blue-200 rounded"></div>
        </div>

        <div className="bg-green-50 p-3 rounded-lg animate-pulse">
          <div className="h-4 w-24 bg-green-200 rounded mb-2"></div>
          <div className="h-8 w-20 bg-green-200 rounded"></div>
        </div>

        <div className="bg-purple-50 p-3 rounded-lg animate-pulse">
          <div className="h-4 w-16 bg-purple-200 rounded mb-2"></div>
          <div className="h-8 w-16 bg-purple-200 rounded"></div>
        </div>
      </div>

      {/* Add custom animation for shimmer effect */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default StudentChartSkeleton;