"use client";
import React, { useState, useCallback } from "react";
import { useRevenueState } from "./useRevenueState";
import CustomTable from "@/components/ui/Table";
import { Column } from "@/types/table";
import {
  DollarSign,
  BookOpen,
  TrendingUp,
  GraduationCap,
  User,
} from "lucide-react";
import Loader from "@/components/ui/Loader";
import TableSkeleton from "@/components/skeleton/TableSkeleton";

interface TopEarningBatch {
  id: number;
  name: string;
  teacher_name: string;
  revenue: number;
}

const TopEarningBatches = () => {
  const { top_earning_batches, isLoading } = useRevenueState();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    document.getElementById("top-batches-table")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  // Paginate data
  const paginatedData = top_earning_batches?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const pagination = {
    current_page: currentPage,
    last_page: Math.ceil((top_earning_batches?.length || 0) / itemsPerPage),
    total: top_earning_batches?.length || 0,
    per_page: itemsPerPage,
  };

  // Define table columns
  const columns: Column<TopEarningBatch>[] = [
    {
      header: "Batch Information",
      headerClassName: "text-left",
      cellClassName: "px-4 py-3",
      render: (_, row) => (
        <div className="flex items-center gap-3">
          {/* Batch Icon */}
          <div className="bg-linear-to-r from-primary/10 to-secondary/10 p-2 rounded-lg">
            <BookOpen className="w-4 h-4 text-primary" />
          </div>

          {/* Batch Details */}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 whitespace-nowrap">
                {row.name}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <User className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500">
                Teacher: {row.teacher_name || "—"}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Revenue",
      headerClassName: "text-left",
      cellClassName: "px-4 py-3",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <div className="bg-green-50 p-2 rounded-lg">
            <DollarSign className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p className="font-bold text-green-600">
              ${row.revenue?.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">Total Revenue</p>
          </div>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (!top_earning_batches || top_earning_batches.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Top Earning Batches</h2>
        <div className="text-center py-12 text-gray-500">
          No batch data available
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md"
      id="top-batches-table"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white">
        <div className="flex flex-col gap-2 sm:flex-row items-start xl:items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Top Earning Batches
            </h2>
            
          </div>
          <div className="bg-primary/10 px-3 py-1 rounded-full">
            <span className="text-sm font-medium text-primary">
              Total: {top_earning_batches.length} Batches
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

export default TopEarningBatches;
