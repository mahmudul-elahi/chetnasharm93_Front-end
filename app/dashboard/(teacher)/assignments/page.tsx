"use client";
import ActionButton from "@/components/ui/ActionButton";
import SearchBar from "@/components/ui/SearchBar";
import CustomTable from "@/components/ui/Table";
import { useGetBatchesForTeacherQuery } from "@/src/redux/api/teacher/teacherBatchesApi";
import { Column } from "@/types/table";
import { Calendar, NotebookPen } from "lucide-react";
import { FaArrowRightLong } from "react-icons/fa6";
import Link from "next/link";
import React, { useCallback, useState } from "react";
import Loader from "@/components/ui/Loader";
import { format } from "date-fns";

const TeacherAssignmentsPage = () => {
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

    document.getElementById("assignments-table-container")?.scrollIntoView({
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
      header: "Class Name",
      cellClassName: "px-4 py-3 whitespace-nowrap text-center font-medium",
      render: (_, row) => (
        <div className="flex items-center justify-center gap-2">
          <span className="text-primary">{row.class?.title || "-"}</span>
        </div>
      ),
    },
    {
      header: "Duration",
      cellClassName: "px-4 py-3 text-center",
      render: (_, row) => (
        <div className=" gap-1 whitespace-nowrap flex justify-center items-center">
          <Calendar className="w-3 h-3 text-gray-400" />
          {format(row.start_date, "dd MMM yyyy")}
          <FaArrowRightLong className="text-gray-400 w-3 h-3" />{" "}
          {format(row.end_date, "dd MMM yyyy")}
        </div>
      ),
    },
    {
      header: "Actions",
      render: (_, row) => (
        <div className="flex justify-center gap-2 overflow-visible py-2">
          <Link href={`/dashboard/assignments/${row.id}`}>
            <ActionButton
              variant="primary"
              className="whitespace-nowrap"
              icon={NotebookPen}
              label="Manage Assignments"
              showText={true}
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
    <div className="space-y-6" id="assignments-table-container">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Assignments
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Select a batch to manage assignments
          </p>
        </div>
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

export default TeacherAssignmentsPage;