import React from "react";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  showIndex?: boolean;
  className?: string;
  pagination?: boolean;
}

const TableSkeleton = ({
  rows = 5,
  columns = 4,
  showHeader = true,
  showIndex = true,
  pagination = false,
  className = "",
}: TableSkeletonProps) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm overflow-hidden ${className}`}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Table Header Skeleton */}
          {showHeader && (
            <thead className="bg-gray-50">
              <tr>
                {showIndex && (
                  <th className="px-4 py-3 w-16">
                    <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
                  </th>
                )}
                {Array.from({ length: columns }).map((_, index) => (
                  <th key={index} className="px-4 py-3">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </th>
                ))}
                <th className="px-4 py-3 w-20">
                  <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                </th>
              </tr>
            </thead>
          )}

          {/* Table Body Skeleton */}
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
                {showIndex && (
                  <td className="px-4 py-3">
                    <div className="h-4 w-6 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                )}
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} className="px-4 py-3">
                    <div
                      className={`h-4 bg-gray-200 rounded animate-pulse ${
                        colIndex === 0
                          ? "w-32"
                          : colIndex === 1
                            ? "w-24"
                            : "w-20"
                      }`}
                    ></div>
                  </td>
                ))}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse"></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Skeleton */}
      {pagination && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableSkeleton;
