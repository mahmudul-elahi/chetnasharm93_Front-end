"use client";
import ActionButton from "@/components/ui/ActionButton";
import SearchBar from "@/components/ui/SearchBar";
import CustomTable from "@/components/ui/Table";
import { Column } from "@/types/table";
import { Calendar, ChevronsLeft, TvMinimalPlay } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import Loader from "@/components/ui/Loader";
import { format } from "date-fns";
import { useGetClassRecordingsByBatchForStudentQuery } from "@/src/redux/api/student/studentBatchApi";

const StudentClassRecordingsPage = () => {
  const [filters, setFilters] = useState({
    currentPage: 1,
    perPageItem: 10,
    search: "",
  });

  const params = useParams();
  const batchId = params.id as string;
  const router = useRouter();

  const { data: apiResponse, isLoading } =
    useGetClassRecordingsByBatchForStudentQuery(Number(batchId));

  const recordings = apiResponse?.data;
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

    document.getElementById("recordings-table-container")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  // Filter recordings based on search term
  const filteredRecordings = recordings?.filter((recording: any) => {
    if (!filters.search) return true;
    const searchLower = filters.search.toLowerCase();
    return (
      recording.batch?.name?.toLowerCase().includes(searchLower) ||
      recording.class_date?.includes(searchLower)
    );
  });

  // Apply pagination on client-side since API doesn't support search/pagination params
  const paginatedRecordings = filteredRecordings?.slice(
    (filters.currentPage - 1) * filters.perPageItem,
    filters.currentPage * filters.perPageItem,
  );

  const totalItems = filteredRecordings?.length || 0;
  const totalPages = Math.ceil(totalItems / filters.perPageItem);

  const customPagination = {
    current_page: filters.currentPage,
    per_page: filters.perPageItem,
    total: totalItems,
    last_page: totalPages,
  };

  const columns: Column<any>[] = [
    {
      header: "Class Date",
      headerClassName: "text-left",
      accessor: "class_date",
      cellClassName: "px-4 py-3 text-left font-medium whitespace-nowrap",
      render: (value) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{format(value, "dd MMM yyyy")}</span>
        </div>
      ),
    },
    {
      header: "Batch Name",
      cellClassName: "px-4 py-3 text-center ",
      render: (_, row) => (
        <span className="font-medium text-primary ">
          {row.batch?.name || "—"}
        </span>
      ),
    },

    {
      header: "Uploaded On",
      cellClassName: "px-4 py-3 text-center whitespace-nowrap",
      render: (_, row) => <span> {format(row.created_at, "dd MMM yyyy")}</span>,
    },
    {
      header: "Actions",
      render: (_, row) => (
        <div className="flex justify-center gap-2 overflow-visible py-2">
          <ActionButton
            variant="view"
            icon={TvMinimalPlay}
            label="Watch Recording"
            showText={true}
            onClick={() =>
              window.open(row.recording_url, "_blank", "noopener,noreferrer")
            }
          />
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
    <div className="space-y-6" id="recordings-table-container">
      {/* Header Section */}
      <div className="flex flex-col  gap-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
        >
          <ChevronsLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Class Recordings
          </h1>
          <p className="text-sm text-textGray dark:text-gray-400 mt-1">
            {recordings?.[0]?.batch?.name
              ? `Recordings for ${recordings[0].batch.name}`
              : "Access your class recordings"}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search by batch name or date..."
          initialValue={filters.search}
          debounceDelay={500}
          size="md"
          variant="default"
          showClearButton={true}
        />
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-textGray dark:text-gray-400">
          Showing {paginatedRecordings?.length || 0} of {totalItems} recordings
          {filters.search && (
            <span className="ml-2">
              matching <span className="font-medium">"{filters.search}"</span>
            </span>
          )}
        </p>
        {filters.search && (
          <button
            onClick={handleClearSearch}
            className="text-sm text-primary hover:text-primary/80 transition-colors duration-200"
          >
            Clear search
          </button>
        )}
      </div>

      {/* Table */}
      <div className="relative overflow-visible">
        <CustomTable
          data={paginatedRecordings}
          columns={columns}
          showIndex={true}
          indexLabel="SN"
          isLoading={isLoading}
          emptyMessage={
            filters.search
              ? `No recordings found matching "${filters.search}"`
              : "No class recordings available for this batch yet"
          }
          pagination={customPagination}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default StudentClassRecordingsPage;
