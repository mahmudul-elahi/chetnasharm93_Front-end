"use client";
import Loader from "@/components/ui/Loader";
import CustomTable from "@/components/ui/Table";
import SearchBar from "@/components/ui/SearchBar";
import ActionButton from "@/components/ui/ActionButton";
import { useGetAllClassesForBatchQuery } from "@/src/redux/api/admin/adminBatchesApi";
import {
  useLazyGetBatchesByClassForAdminQuery,
  useLazyGetEnrollmentsForAdminQuery,
  useChangeBatchOfAStudentForAdminMutation,
} from "@/src/redux/api/admin/enrollmentsApi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronsUpDown,
  UserRound,
  Calendar,
  Package,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback } from "react";
import { Column } from "@/types/table";
import ChangeBatchModal from "./components/ChangeBatchModal";
import { toast } from "sonner";
import { format } from "date-fns";

// Define types
interface ClassOption {
  value: number;
  label: string;
}

interface BatchOption {
  value: number;
  label: string;
}

interface Enrollment {
  id: number;
  user_id: number;
  batch_id: number;
  class_id: number;
  status: string;
  enrolled_at: string;
  expiry_date: string;
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
  };
  class: {
    id: number;
    title: string;
    image_url: string | null;
  };
}

interface SelectedEnrollment {
  id: number;
  user_id: number;
  user_name: string;
  current_batch_id: number;
  current_batch_name: string;
  class_id?: number;
  class_name?: string;
}

const EnrollmentsPage = () => {
  const [selectedClass, setSelectedClass] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [selectedEnrollment, setSelectedEnrollment] =
    useState<SelectedEnrollment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    page: 1,
    per_page: 10,
    search: "",
  });

  const { data, isLoading: classesLoading } =
    useGetAllClassesForBatchQuery(null);
  const [getBatchesByClass, { data: batchesData, isLoading: batchesLoading }] =
    useLazyGetBatchesByClassForAdminQuery();
  const [
    getEnrollments,
    { data: enrollmentsResponse, isLoading: enrollmentsLoading },
  ] = useLazyGetEnrollmentsForAdminQuery();
  const [changeBatch, { isLoading: changeBatchLoading }] =
    useChangeBatchOfAStudentForAdminMutation();

  // Extract classes from API response
  const classes = data?.data || [];

  // Extract batches from API response
  const batches = batchesData?.data || [];

  // Extract enrollments from API response
  const enrollments = enrollmentsResponse?.data || [];
  const pagination = enrollmentsResponse?.pagination;

  // Map classes to options format with proper typing
  const classOptions: ClassOption[] = classes.map((cls: any) => ({
    value: cls.id,
    label: cls.title || cls.name,
  }));

  // Map batches to options format with proper typing
  const batchOptions: BatchOption[] = batches.map((batch: any) => ({
    value: batch.id,
    label: batch.name,
  }));

  const handleClassSelect = (classItem: ClassOption) => {
    setSelectedClass({
      id: classItem.value,
      name: classItem.label,
    });
    setSelectedBatch(null);
    setFilters({ page: 1, per_page: 10, search: "" });
    getBatchesByClass({ class_id: classItem.value });
  };

  const handleBatchSelect = (batchItem: BatchOption) => {
    setSelectedBatch({
      id: batchItem.value,
      name: batchItem.label,
    });
    getEnrollments({
      batch_id: batchItem.value,
      page: filters.page,
      per_page: filters.per_page,
      search: filters.search,
    });
  };

  // Fetch enrollments when filters change
  useEffect(() => {
    if (selectedBatch) {
      getEnrollments({
        batch_id: selectedBatch.id,
        page: filters.page,
        per_page: filters.per_page,
        search: filters.search,
      });
    }
  }, [
    filters.page,
    filters.per_page,
    filters.search,
    selectedBatch,
    getEnrollments,
  ]);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({
      ...prev,
      page: page,
    }));
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

  const openChangeBatchModal = (enrollment: Enrollment) => {
    setSelectedEnrollment({
      id: enrollment.id,
      user_id: enrollment.user_id,
      user_name: enrollment.user.name,
      current_batch_id: enrollment.batch_id,
      current_batch_name: enrollment.batch.name,
      class_id: enrollment.class_id,
      class_name: enrollment.class?.title,
    });
    setIsModalOpen(true);
  };

  const handleChangeBatch = async (toBatchId: number) => {
    if (!selectedEnrollment) return;

    try {
      await changeBatch({
        user_id: selectedEnrollment.user_id,
        from_batch_id: selectedEnrollment.current_batch_id,
        to_batch_id: toBatchId,
      }).unwrap();

      // Refetch enrollments to update the table
      if (selectedBatch) {
        await getEnrollments({
          batch_id: selectedBatch.id,
          page: filters.page,
          per_page: filters.per_page,
          search: filters.search,
        });
      }
      toast.success("Batch changed successfully");
      setIsModalOpen(false);
      setSelectedEnrollment(null);
    } catch (error: any) {
      throw error;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; label: string }> = {
      active: {
        color: "text-green-600 bg-green-100",
        label: "Active",
      },
      inactive: {
        color: "text-red-600 bg-red-100",
        label: "Inactive",
      },
      completed: {
        color: "text-blue-600 bg-blue-100",
        label: "Completed",
      },
    };
    const config = statusConfig[status] || statusConfig.active;
    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const columns: Column<Enrollment>[] = [
    {
      header: "Student ID",
      headerClassName: "text-left",
      accessor: "user_id",
      cellClassName: "px-4 py-3 text-left font-mono whitespace-nowrap",
      render: (value: number) => (
        <p className="font-mono font-semibold text-gray-900">#{value}</p>
      ),
    },
    {
      header: "Student Name",
      headerClassName: "text-left",
      cellClassName: "px-4 py-3 text-left whitespace-nowrap",
      render: (_: any, row: Enrollment) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <UserRound className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{row.user?.name || "-"}</p>
            <p className="text-xs text-gray-500">{row.user?.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Batch",
      headerClassName: "text-left",
      cellClassName: "px-4 py-3 text-left",
      render: (_: any, row: Enrollment) => (
        <div>
          <p className="font-medium text-gray-900">{row.batch?.name || "-"}</p>
          <p className="text-xs text-gray-500">Batch ID: {row.batch_id}</p>
        </div>
      ),
    },
    {
      header: "Class",
      headerClassName: "text-left",
      cellClassName: "px-4 py-3 text-left",
      render: (_: any, row: Enrollment) => (
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-gray-400" />
          <span className="text-gray-700">{row.class?.title || "-"}</span>
        </div>
      ),
    },
    {
      header: "Status",
      headerClassName: "text-center",
      cellClassName: "px-4 py-3 text-center",
      render: (_: any, row: Enrollment) => getStatusBadge(row.status),
    },
    {
      header: "Enrolled Date",
      headerClassName: "text-center",
      cellClassName: "px-4 py-3 text-center whitespace-nowrap",
      render: (_: any, row: Enrollment) => (
        <div className="flex items-center justify-center gap-1">
          <Calendar className="w-3 h-3 text-gray-400" />
          <span className="text-sm">
            {format(row.enrolled_at, "dd MMM yyyy")}
          </span>
        </div>
      ),
    },
    {
      header: "Expiry Date",
      headerClassName: "text-center",
      cellClassName: "px-4 py-3 text-center whitespace-nowrap",
      render: (_: any, row: Enrollment) => (
        <div className="flex items-center justify-center gap-1">
          <Calendar className="w-3 h-3 text-gray-400" />
          <span className="text-sm">
            {format(row.expiry_date, "dd MMM yyyy")}
          </span>
        </div>
      ),
    },
    {
      header: "Actions",
      render: (_: any, row: Enrollment) => (
        <div className="flex justify-center gap-2 overflow-visible py-2">
          <ActionButton
            variant="primary"
            icon={RefreshCw}
            onClick={() => openChangeBatchModal(row)}
            label="Change Batch"
          />
        </div>
      ),
      cellClassName: "px-4 py-3 text-center overflow-visible relative",
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Student Management
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage student students and change batches
        </p>
      </div>

      {/* Filters Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Class Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Class *
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between px-4 py-2.5 h-auto"
                >
                  <span className="flex-1 text-left truncate">
                    {selectedClass ? selectedClass.name : "Select a class"}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-50 max-h-75 overflow-y-auto">
                <DropdownMenuLabel>Select Class</DropdownMenuLabel>
                <DropdownMenuGroup>
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

          {/* Batch Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Batch *
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between px-4 py-2.5 h-auto"
                  disabled={!selectedClass || batchesLoading}
                >
                  <span className="flex-1 text-left truncate">
                    {batchesLoading
                      ? "Loading batches..."
                      : selectedBatch
                        ? selectedBatch.name
                        : !selectedClass
                          ? "Select a class first"
                          : "Select a batch"}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-50 max-h-75 overflow-y-auto">
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
                  {!selectedClass && batchOptions.length === 0 && (
                    <DropdownMenuItem disabled>
                      <div className="flex-1">
                        <p className="font-medium text-gray-400">
                          Please select a class first
                        </p>
                      </div>
                    </DropdownMenuItem>
                  )}
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
      {selectedBatch && (
        <div className="flex flex-col-reverse md:flex-row gap-4 items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {enrollments?.length || 0} of {pagination?.total || 0}{" "}
            students
            {filters.search && (
              <span className="ml-2">
                matching <span className="font-medium">"{filters.search}"</span>
              </span>
            )}
          </p>
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search by student name or email..."
            initialValue={filters.search}
            className="w-5/6 md:w-2/4 xl:w-2/6 max-w-92"
            debounceDelay={500}
            size="md"
            variant="default"
            showClearButton={true}
          />
        </div>
      )}

      {/* Table */}
      {selectedBatch ? (
        <div className="relative overflow-visible">
          <CustomTable
            data={enrollments}
            columns={columns}
            showIndex={true}
            indexLabel="SN"
            isLoading={enrollmentsLoading}
            emptyMessage={
              filters.search
                ? `No students found matching "${filters.search}"`
                : "No students enrolled in this batch"
            }
            pagination={
              pagination
                ? {
                    current_page: pagination.current_page || filters.page,
                    per_page: pagination.per_page || filters.per_page,
                    total: pagination.total || 0,
                    last_page: pagination.last_page || 1,
                  }
                : undefined
            }
            onPageChange={handlePageChange}
          />
        </div>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-12 text-center border border-gray-200 dark:border-gray-700">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            Please select a class and batch to view enrollments
          </p>
        </div>
      )}

      {/* Change Batch Modal */}
      <ChangeBatchModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEnrollment(null);
        }}
        enrollmentData={selectedEnrollment || undefined}
        classes={classes}
        onSave={handleChangeBatch}
        isLoading={changeBatchLoading}
      />
    </div>
  );
};

export default EnrollmentsPage;
