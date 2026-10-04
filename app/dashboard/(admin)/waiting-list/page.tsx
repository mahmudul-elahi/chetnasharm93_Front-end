"use client";
import { useGetWaitingListForAdminQuery } from "@/src/redux/api/admin/waitingList";
import { useGetAllClassesForBatchQuery } from "@/src/redux/api/admin/adminBatchesApi";
import { useLazyGetBatchesByClassForAdminQuery } from "@/src/redux/api/admin/enrollmentsApi";
import React, { useCallback, useState, useEffect } from "react";
import Loader from "@/components/ui/Loader";
import CustomTable from "@/components/ui/Table";
import SearchBar from "@/components/ui/SearchBar";
import { Column } from "@/types/table";
import {
  User,
  Clock,
  BookOpen,
  Mail,
  Users,
  Package,
  Download,
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface WaitingListItem {
  id: number;
  user_id: number;
  batch_id: number;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  batch: {
    id: number;
    name: string;
    teacher_id: number;
    teacher: {
      id: number;
      name: string;
      image_url: string | null;
      intro_video_url: string | null;
    };
  };
}

interface ClassOption {
  value: number;
  label: string;
}

interface BatchOption {
  value: number;
  label: string;
}

const WaitingListPage = () => {
  const [selectedClass, setSelectedClass] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [filters, setFilters] = useState({
    page: 1,
    per_page: 10,
    search: "",
  });

  const { data: classesData, isLoading: classesLoading } =
    useGetAllClassesForBatchQuery(null);
  const [getBatchesByClass, { data: batchesData, isLoading: batchesLoading }] =
    useLazyGetBatchesByClassForAdminQuery();
  const { data, isLoading, refetch } = useGetWaitingListForAdminQuery({
    page: filters.page,
    per_page: filters.per_page,
    search: filters.search,
    batch_id: selectedBatch?.id,
  });

  const waitingListData = data?.data || [];
  const pagination = data?.pagination;

  // Extract classes from API response
  const classes = classesData?.data || [];

  // Extract batches from API response
  const batches = batchesData?.data || [];

  // Map classes to options format
  const classOptions: ClassOption[] = classes.map((cls: any) => ({
    value: cls.id,
    label: cls.title || cls.name,
  }));

  // Map batches to options format
  const batchOptions: BatchOption[] = batches.map((batch: any) => ({
    value: batch.id,
    label: batch.name,
  }));

  // Fetch batches when class is selected
  useEffect(() => {
    if (selectedClass) {
      getBatchesByClass({ class_id: selectedClass.id });
      setSelectedBatch(null);
    } else {
      setSelectedBatch(null);
    }
  }, [selectedClass, getBatchesByClass]);

  const handleClassSelect = (classItem: ClassOption) => {
    setSelectedClass({
      id: classItem.value,
      name: classItem.label,
    });
    setSelectedBatch(null);
  };

  const handleClearClass = () => {
    setSelectedClass(null);
    setSelectedBatch(null);
  };

  const handleBatchSelect = (batchItem: BatchOption) => {
    setSelectedBatch({
      id: batchItem.value,
      name: batchItem.label,
    });
  };

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({
      ...prev,
      page: page,
    }));

    document.getElementById("waiting-list-table-container")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  const handleSearch = (term: string) => {
    setFilters((prev) => ({
      ...prev,
      search: term,
      page: 1,
    }));
  };

  const handleClearSearch = () => {
    setFilters((prev) => ({
      ...prev,
      search: "",
      page: 1,
    }));
  };

  const columns: Column<WaitingListItem>[] = [
    {
      header: "Student Name",
      headerClassName: "text-left",
      cellClassName: "px-4 py-3 text-left font-medium",
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              {row.user?.name || "-"}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <Mail className="w-3 h-3 text-gray-400" />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {row.user?.email || "-"}
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Student ID",
      headerClassName: "text-center",
      cellClassName: "px-4 py-3 text-center font-mono",
      render: (_, row) => (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          #{row.user_id}
        </span>
      ),
    },
    {
      header: "Batch Name",
      headerClassName: "text-left",
      cellClassName: "px-4 py-3 text-left",
      render: (_, row) => (
        <Link href={`/dashboard/batches/${row.batch_id}`}>
          <div className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
            <BookOpen className="w-4 h-4 text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300">
              {row.batch?.name || "-"}
            </span>
          </div>
        </Link>
      ),
    },
    {
      header: "Batch ID",
      headerClassName: "text-center",
      cellClassName: "px-4 py-3 text-center font-mono",
      render: (_, row) => (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          #{row.batch_id}
        </span>
      ),
    },
    {
      header: "Teacher",
      headerClassName: "text-left",
      cellClassName: "px-4 py-3 text-left",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-gray-700 dark:text-gray-300 whitespace-nowrap">
            {row.batch?.teacher?.name || "Not assigned"}
          </span>
        </div>
      ),
    },
    {
      header: "Added Date",
      headerClassName: "text-center",
      cellClassName: "px-4 py-3 text-center",
      render: (_, row) => (
        <div className="flex items-center justify-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
             {format(row.created_at, "dd MMM yyyy")}
          </span>
        </div>
      ),
    },
  ];

  if (classesLoading) {
    return (
      <div className="h-[calc(100vh-155px)] w-full flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6" id="waiting-list-table-container">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Waiting List
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {waitingListData?.length || 0} students waiting for enrollment
              </p>
            </div>
          </div>
        </div>
      </div>


      {/* Class and Batch Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Class Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filter by Class
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between px-4 py-2.5 h-auto"
                >
                  <span className="flex-1 text-left truncate">
                    {selectedClass ? selectedClass.name : "All Classes"}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-50 max-h-75 overflow-y-auto">
                <DropdownMenuLabel>Select Class</DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={handleClearClass}
                    className="cursor-pointer px-4 py-2"
                  >
                    <div className="flex-1">
                      <p className="font-medium">All Classes</p>
                    </div>
                  </DropdownMenuItem>
                  {classOptions.map((option: ClassOption) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => handleClassSelect(option)}
                      className="cursor-pointer px-4 py-2"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{option.label}</p>
                      </div>
                    </DropdownMenuItem>
                  ))}
                  {classOptions.length === 0 && (
                    <DropdownMenuItem disabled>
                      <div className="flex-1">
                        <p className="font-medium text-gray-400">
                          No classes found
                        </p>
                      </div>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Batch Dropdown - Disabled if no class selected */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filter by Batch
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between px-4 py-2.5 h-auto"
                  disabled={!selectedClass || batchesLoading}
                >
                  <span className="flex-1 text-left truncate">
                    {!selectedClass
                      ? "Select a class first"
                      : batchesLoading
                        ? "Loading batches..."
                        : selectedBatch
                          ? selectedBatch.name
                          : "All Batches"}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-[200px] max-h-[300px] overflow-y-auto">
                <DropdownMenuLabel>Select Batch</DropdownMenuLabel>
                <DropdownMenuGroup>
                  {batchOptions.map((option: BatchOption) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => handleBatchSelect(option)}
                      className="cursor-pointer px-4 py-2"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{option.label}</p>
                      </div>
                    </DropdownMenuItem>
                  ))}
                  {selectedClass &&
                    batchOptions.length === 0 &&
                    !batchesLoading && (
                      <DropdownMenuItem disabled>
                        <div className="flex-1">
                          <p className="font-medium text-gray-400">
                            No batches found for this class
                          </p>
                        </div>
                      </DropdownMenuItem>
                    )}
                  {batchesLoading && (
                    <DropdownMenuItem disabled>
                      <div className="flex-1">
                        <p className="font-medium text-gray-400">
                          Loading batches...
                        </p>
                      </div>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing {waitingListData?.length || 0} of {pagination?.total || 0}{" "}
          students
          {filters.search && (
            <span className="ml-2">
              matching <span className="font-medium">"{filters.search}"</span>
            </span>
          )}
          {selectedBatch && (
            <span className="ml-2">
              in <span className="font-medium">"{selectedBatch.name}"</span>
            </span>
          )}
          {selectedClass && !selectedBatch && (
            <span className="ml-2">
              in <span className="font-medium">"{selectedClass.name}"</span>{" "}
              class
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
          data={waitingListData}
          columns={columns}
          showIndex={true}
          indexLabel="SN"
          isLoading={isLoading}
          emptyMessage={
            filters.search
              ? `No students found matching "${filters.search}"`
              : selectedBatch
                ? "No students in waiting list for this batch"
                : "No students in waiting list"
          }
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default WaitingListPage;
