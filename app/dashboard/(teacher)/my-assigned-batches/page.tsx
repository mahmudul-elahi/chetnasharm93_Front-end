"use client";
import ActionButton from "@/components/ui/ActionButton";
import SearchBar from "@/components/ui/SearchBar";
import CustomTable from "@/components/ui/Table";
import { useGetBatchesForTeacherQuery } from "@/src/redux/api/teacher/teacherBatchesApi";
import { Column } from "@/types/table";
import {
  Calendar,
  Eye,
  NotebookPen,
  NotepadText,
  Users,
  UsersRound,
  Video,
} from "lucide-react";
import { FaArrowRightLong } from "react-icons/fa6";
import Link from "next/link";
import React, { useCallback, useState } from "react";
import Loader from "@/components/ui/Loader";
import TeacherBatchesStateCard from "./components/TeacherBatchesStateCard";
import { format } from "date-fns";

const MyAssignedBatchesPage = () => {
  const [filters, setFilters] = useState({
    currentPage: 1,
    perPageItem: 6,
    search: "",
  });

  const { data: apiResponse, isLoading } = useGetBatchesForTeacherQuery({
    page: filters.currentPage,
    per_page: filters.perPageItem,
    search: filters.search,
  });

  const batches = apiResponse?.data;
  const pagination = apiResponse?.pagination;

  const handleSearch = (term: string) => {
    setFilters((prev) => ({
      ...prev,
      search: term,
      currentPage: 1,
    }));
  };

  const handleClearSearch = () => {
    setFilters((prev) => ({
      ...prev,
      search: "",
      currentPage: 1,
    }));
  };

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({
      ...prev,
      currentPage: page,
    }));

    document.getElementById("batches-table-container")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  const columns: Column<any>[] = [
    {
      header: "Batch Name",
      headerClassName: "text-left",
      accessor: "name",
      cellClassName: "px-4 py-3 text-left font-medium whitespace-nowrap",
    },
    {
      header: "Class",
      cellClassName: "px-4 py-3 whitespace-nowrap text-center font-medium",
      render: (_, row) => (
        <div className="flex items-center justify-center gap-2">
          <span className="text-primary">{row.class?.title || "—"}</span>
        </div>
      ),
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
      header: "Seats",
      cellClassName: "px-4 py-3 text-center",
      render: (_, row) => (
        <div className="flex items-center justify-center gap-2 whitespace-nowrap">
          <UsersRound className="w-4 h-4 text-gray-400" />
          <span>
            <span className="font-semibold text-green-600">
              {row.filled_seat || 0}
            </span>
            <span className="text-gray-400"> / </span>
            <span className="font-medium">{row.total_seat || 0}</span>
          </span>
        </div>
      ),
    },
    {
      header: "Status",
      cellClassName: "px-4 py-3 text-center",
      render: (_, row) => {
        const statusColors = {
          upcoming: "text-blue-600 bg-blue-100",
          ongoing: "text-green-600 bg-green-100",
          completed: "text-gray-600 bg-gray-100",
          cancelled: "text-red-600 bg-red-100",
        };
        const colorClass =
          statusColors[row.status as keyof typeof statusColors] ||
          "text-gray-600 bg-gray-100";

        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}
          >
            {row.status || "—"}
          </span>
        );
      },
    },
    {
      header: "Active Status",
      cellClassName: "px-4 py-3 text-center",
      render: (_, row) => {
        const statusColors = {
          1: "text-green-600 bg-green-100",
          0: "text-red-600 bg-red-100",
        };
        const colorClass =
          statusColors[row.active_status as keyof typeof statusColors] ||
          "text-gray-600 bg-gray-100";

        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}
          >
            {row.active_status === 1
              ? "Active"
              : row.active_status === 0
                ? "Deactivated"
                : "—"}
          </span>
        );
      },
    },
    {
      header: "Actions",
      render: (_, row) => (
        <div className="flex justify-center gap-2 overflow-visible py-2">
          <Link href={`/dashboard/my-assigned-batches/${row.id}`}>
            <ActionButton
              variant="view"
              icon={Eye}
              label="View Batch Details"
            />
          </Link>
          <Link href={`/dashboard/my-assigned-batches/${row.id}/students`}>
            <ActionButton
              variant="edit"
              icon={UsersRound}
              label="Take Attendance"
            />
          </Link>
          <Link href={`/dashboard/assignments/${row.id}`}>
            <ActionButton
              variant="view"
              icon={NotebookPen}
              label="Manage Assignments"
            />
          </Link>
          <Link
            href={`/dashboard/my-assigned-batches/${row.id}/class-recordings`}
          >
            <ActionButton variant="edit" icon={Video} label="View Recordings" />
          </Link>
          <Link href={`/dashboard/my-assigned-batches/${row.id}/notes`}>
            <ActionButton
              variant="edit"
              icon={NotepadText}
              label="View Notes"
            />
          </Link>
        </div>
      ),
      cellClassName: "px-4 py-3 text-center overflow-visible relative",
    },
  ];

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-155px)] w-full flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6" id="batches-table-container">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            My Assigned Batches
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            View and manage all batches assigned to you
          </p>
        </div>
      </div>

      <div>
        <TeacherBatchesStateCard batches={batches} total={pagination?.total} />
      </div>

      {/* Results Summary */}
      <div className="flex flex-col-reverse md:flex-row gap-4 items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing {batches?.length || 0} of {pagination?.total || 0} batches
          {filters.search && (
            <span className="ml-2">
              matching <span className="font-medium">"{filters.search}"</span>
            </span>
          )}
        </p>
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search by batch name or class..."
          initialValue={filters.search}
          className="w-5/6 md:w-2/4 xl:w-2/6 max-w-92"
          debounceDelay={500}
          size="md"
          variant="default"
          showClearButton={true}
        />
      </div>

      {/* Table */}
      <div className="relative overflow-visible">
        <CustomTable
          data={batches}
          columns={columns}
          showIndex={true}
          indexLabel="SN"
          isLoading={isLoading}
          emptyMessage={
            filters.search
              ? `No batches found matching "${filters.search}"`
              : "No batches assigned to you yet"
          }
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default MyAssignedBatchesPage;
