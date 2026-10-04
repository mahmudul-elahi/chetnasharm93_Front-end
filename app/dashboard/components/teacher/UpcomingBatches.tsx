"use client";
import CustomTable from "@/components/ui/Table";
import { Column } from "@/types/table";
import { BookOpen, Calendar } from "lucide-react";
import { useTeacherDashboardStates } from "./useTeacherDashboardStates";
import { FaArrowRightLong } from "react-icons/fa6";
import { format } from "date-fns";
import TableSkeleton from "@/components/skeleton/TableSkeleton";

interface UpcomingBatches {
  id: number;
  batch_name: string;
  class_title: string;
  start_date: string;
  end_date: string;
  total_seat: number;
  filled_seat: number;
}

const UpcomingBatches = () => {
  const { upcoming_batches, isLoading } = useTeacherDashboardStates();

  // Define table columns
  const columns: Column<UpcomingBatches>[] = [
    {
      header: "Batch Name",
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
                {row.batch_name}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Class Name",
      headerClassName: "text-center",
      cellClassName: "px-4 py-3 text-center",
      render: (_, row) => <span> {row.class_title}</span>,
    },
    {
      header: "Duration",
      cellClassName: "px-4 py-3 text-center",
      render: (_, row) => (
        <div className="flex items-center justify-center gap-1 whitespace-nowrap">
          <Calendar className="w-3 h-3 text-gray-400" />
          {format(row.start_date, "dd MMM yyyy")}
          <FaArrowRightLong className="text-gray-400 w-3 h-3" />{" "}
          {format(row.end_date, "dd MMM yyyy")}
        </div>
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

  if (!upcoming_batches || upcoming_batches.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Upcoming Batches</h2>
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
              Upcoming Batches
            </h2>
          </div>
          <div className="bg-primary/10 px-3 py-1 rounded-full">
            <span className="text-sm font-medium text-primary">
              Total: {upcoming_batches.length} Batches
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <CustomTable
          data={upcoming_batches}
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

export default UpcomingBatches;
