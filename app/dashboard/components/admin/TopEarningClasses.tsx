"use client";
import React, { useState, useCallback } from "react";
import { useRevenueState } from "./useRevenueState";
import CustomTable from "@/components/ui/Table";
import { Column } from "@/types/table";
import {
  DollarSign,
  Users,
  BookOpen,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import Loader from "@/components/ui/Loader";
import TableSkeleton from "@/components/skeleton/TableSkeleton";

interface TopEarningClass {
  id: number;
  title: string;
  revenue: number;
  total_students: number;
  total_batches: number;
}

const TopEarningClasses = () => {
  const { top_earning_classes, isLoading } = useRevenueState();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    document.getElementById("top-classes-table")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  // Paginate data
  const paginatedData = top_earning_classes?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const pagination = {
    current_page: currentPage,
    last_page: Math.ceil((top_earning_classes?.length || 0) / itemsPerPage),
    total: top_earning_classes?.length || 0,
    per_page: itemsPerPage,
  };

  // Define table columns
  const columns: Column<TopEarningClass>[] = [
    {
      header: "Class Information",
      headerClassName: "text-left",
      cellClassName: "px-4 py-3",
      render: (_, row) => (
        <div className="space-y-2 flex items-center gap-2">
          {/* Class Title with Icon */}
          <div className="bg-linear-to-r my-auto from-primary/10 to-secondary/10 p-2 rounded-lg">
            <BookOpen className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <span className="font-semibold text-gray-900 whitespace-nowrap">
                {row.title}
              </span>
            </div>

            {/* Revenue and Student Stats in one row */}

            <div className="flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-green-600" />
              <span className="text-sm font-bold text-green-600">
                ${row.revenue?.toLocaleString()}
              </span>
            </div>
          </div>
          {/* Revenue per student (optional additional info) */}
        </div>
      ),
    },
    {
      header: "Student and Batch Information",
      headerClassName: "text-left",
      cellClassName: "px-4 py-3",
      render: (_, row) => (
        <div className="space-y-2">
          {/* Revenue and Student Stats in one row */}
          <div className="flex items-center gap-4 ml-11">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-gray-700 flex items-center gap-2">
                <UsersRound className="w-3.5 h-3.5 text-blue-500" />
                {row.total_students || 0}
              </span>
              <span className="text-sm text-gray-700">students</span>
            </div>{" "}
            <span className="text-gray-300 text-xs">•</span>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-gray-700 flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                {row.total_batches || 0}
              </span>
              <span className="text-sm text-gray-700">batches</span>
            </div>
          </div>

          {/* Revenue per student (optional additional info) */}
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (!top_earning_classes || top_earning_classes.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Top Earning Classes</h2>
        <div className="text-center py-12 text-gray-500">
          No class data available
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md"
      id="top-classes-table"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white ">
        <div className="flex flex-col gap-2 sm:flex-row items-start xl:items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Top Earning Classes
            </h2>
            
          </div>
          <div className="bg-primary/10 px-3 py-1 rounded-full">
            <span className="text-sm font-medium text-primary">
              Total: {top_earning_classes.length} Classes
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <CustomTable
          data={paginatedData}
          columns={columns}
          showIndex={true}
          indexLabel="Rank"
          rounded="rounded-none"
          theadClassName="rounded-t-none"
          isLoading={isLoading}
          emptyMessage="No earning data available"
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default TopEarningClasses;
