"use client";
import ActionButton from "@/components/ui/ActionButton";
import MyButton from "@/components/ui/MyButton";
import SearchBar from "@/components/ui/SearchBar";
import CustomTable from "@/components/ui/Table";
import {
  useDeleteBatchForAdminMutation,
  useGetBatchesForAdminQuery,
  useUpdateActiveStatusBatchForAdminMutation,
} from "@/src/redux/api/admin/adminBatchesApi";
import { Column } from "@/types/table";
import {
  BanIcon,
  Calendar,
  CircleCheckBig,
  Download,
  Eye,
  Pen,
  Plus,
  Trash,
} from "lucide-react";
import { FaArrowRightLong } from "react-icons/fa6";
import Link from "next/link";
import React, { useCallback, useState } from "react";
import Loader from "@/components/ui/Loader";
import ActionConfirmationModal, {
  ActionType,
} from "@/components/modals/ActionConfirmationModal";
import { format } from "date-fns";

const BatchManagement = () => {
  const [filters, setFilters] = useState({
    currentPage: 1,
    perPageItem: 6,
    search: "",
    teacher: null,
    selectedClass: null,
  });

  const [actionModal, setActionModal] = useState<{
    isOpen: boolean;
    actionType: ActionType;
    id: number | null;
    mutation: any;
    name: string;
  }>({
    isOpen: false,
    actionType: "delete",
    id: null,
    mutation: null,
    name: "",
  });

  const {
    data: apiResponse,
    isLoading,
    refetch,
  } = useGetBatchesForAdminQuery({
    page: filters.currentPage,
    per_page: filters.perPageItem,
    search: filters.search,
    class_id: filters.selectedClass,
    teacher_id: filters.teacher,
  });

  const [deleteBatch] = useDeleteBatchForAdminMutation();
  const [updateBatchActiveStatus] =
    useUpdateActiveStatusBatchForAdminMutation();

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

    document.getElementById("class-table-container")?.scrollIntoView({
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
      cellClassName: "px-4 py-3 text-center font-medium",
      render: (_, row) => (
        <span className="text-primary">{row.class?.title || "-"}</span>
      ),
    },
    {
      header: "Teacher",
      cellClassName: "px-4 py-3 text-center whitespace-nowrap",
      render: (_, row) => <span>{row.teacher?.name || "-"}</span>,
    },
    {
      header: "Start Date - End Date",
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
      accessor: "total_seat",
      cellClassName: "px-4 py-3 text-center",
      render: (value) => <p className="truncate max-w-50">{value || "-"}</p>,
    },
    {
      header: "Filled Seat",
      cellClassName: "px-4 py-3 text-center",
      render: (_, row) => (
        <p className="truncate max-w-50">
          {row.filled_seat || 0} / {row.total_seat || 0}
        </p>
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
            {row.status || "-"}
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
                : "-"}
          </span>
        );
      },
    },
    {
      header: "Actions",
      render: (_, row) => (
        <div className="flex justify-center gap-2 overflow-visible py-2">
          <Link href={`/dashboard/batches/${row.id}`}>
            <ActionButton variant="view" icon={Eye} label="View Details" />
          </Link>
          <Link href={`/dashboard/batches/update/${row.id}`}>
            <ActionButton variant="edit" icon={Pen} label="Edit Batch" />
          </Link>
          <ActionButton
            variant="delete"
            icon={Trash}
            onClick={() => {
              setActionModal({
                isOpen: true,
                actionType: "delete",
                mutation: deleteBatch,
                id: Number(row.id),
                name: row.name,
              });
            }}
            label="Delete This Batch"
          />
          {row.active_status === 0 ? (
            <ActionButton
              variant="success"
              icon={CircleCheckBig}
              onClick={() => {
                setActionModal({
                  isOpen: true,
                  actionType: "activate",
                  id: Number(row.id),
                  mutation: updateBatchActiveStatus,
                  name: row.name,
                });
              }}
              label="Activate Batch"
            />
          ) : (
            <ActionButton
              variant="delete"
              icon={BanIcon}
              onClick={() => {
                setActionModal({
                  isOpen: true,
                  actionType: "deactivate",
                  id: Number(row.id),
                  mutation: updateBatchActiveStatus,
                  name: row.name,
                });
              }}
              label="Deactivate Batch"
            />
          )}
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
    <div className="space-y-6" id="class-table-container">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Batch Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage all batches, their schedules, and details
          </p>
        </div>
        <div className="flex justify-center items-center">
        <Link href="/dashboard/batches/create-batch">
          <MyButton>
            <Plus className="w-4 h-4" />
            <span>Add New Batch</span>
          </MyButton>
        </Link>
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
          placeholder="Search by batch name..."
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
              : "No batches found"
          }
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>
      <ActionConfirmationModal
        isOpen={actionModal.isOpen}
        onClose={() =>
          setActionModal({
            isOpen: false,
            actionType: "delete",
            mutation: null,
            id: null,
            name: "",
          })
        }
        id={actionModal.id}
        name={actionModal.name}
        mutation={actionModal.mutation}
        actionType={actionModal.actionType}
        entityName="Batch"
        onSuccess={() => refetch()}
      />
    </div>
  );
};

export default BatchManagement;