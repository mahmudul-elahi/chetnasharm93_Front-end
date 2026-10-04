"use client";
import CustomTable from "@/components/ui/Table";
import { Column } from "@/types/table";
import {
  BookOpen,
} from "lucide-react";
import { useTeacherDashboardStates } from "./useTeacherDashboardStates";
import TableSkeleton from "@/components/skeleton/TableSkeleton";

interface TopBatch {
  id: number;
  name: string;
  total_seat: number;
  revenue: number;
  filled_seat: number;
}

const TopBatches = () => {
  const { top_batches, isLoading } = useTeacherDashboardStates();

  // Define table columns
  const columns: Column<TopBatch>[] = [
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
          </div>
        </div>
      ),
    },
    {
      header: "Total Revenue",
      headerClassName: "text-center",
      cellClassName: "px-4 py-3 text-center",
      render: (_, row) => (
        <p>
          <span className="text-green-600">
            ${row.revenue?.toLocaleString()}
          </span>
        </p>
      ),
    },
    {
      header: "Total Seat",
      headerClassName: "text-center",
      cellClassName: "px-4 py-3 text-center",
      render: (_, row) => <p>{row.total_seat}</p>,
    },
    {
      header: "Filled Seat",
      headerClassName: "text-center",
      cellClassName: "px-4 py-3 text-center",
      render: (_, row) => <p>{row.filled_seat}</p>,
    },
  ];

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (!top_batches || top_batches.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Top Batches</h2>
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
            <h2 className="text-xl font-semibold text-gray-900">Top Batches</h2>
          </div>
          <div className="bg-primary/10 px-3 py-1 rounded-full">
            <span className="text-sm font-medium text-primary">
              Total: {top_batches.length} Batches
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <CustomTable
          data={top_batches}
          columns={columns}
          showIndex={true}
          indexLabel="Rank"
          rounded="rounded-none"
          theadClassName="rounded-t-none"
          isLoading={isLoading}
          emptyMessage="No earning data available"
        />
      </div>
    </div>
  );
};

export default TopBatches;
