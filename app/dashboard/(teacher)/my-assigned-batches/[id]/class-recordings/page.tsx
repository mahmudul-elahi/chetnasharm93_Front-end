"use client";
import ActionButton from "@/components/ui/ActionButton";
import MyButton from "@/components/ui/MyButton";
import SearchBar from "@/components/ui/SearchBar";
import CustomTable from "@/components/ui/Table";
import { useGetClassRecordingByBatchQuery } from "@/src/redux/api/teacher/classRecordingsApi";
import { Column } from "@/types/table";
import React, { useCallback, useState } from "react";
import Loader from "@/components/ui/Loader";
import ActionConfirmationModal, {
  ActionType,
} from "@/components/modals/ActionConfirmationModal";
import ClassRecordingModal from "./components/ClassRecordingModal";
import { useDeleteClassRecordingMutation } from "@/src/redux/api/teacher/classRecordingsApi";
import { useParams, useRouter } from "next/navigation";
import {
  Calendar,
  ChevronsLeft,
  Eye,
  Link2,
  Pen,
  Trash,
  TvMinimalPlay,
} from "lucide-react";
import { format } from "date-fns";

const ClassRecordingsPage = () => {
  const [filters, setFilters] = useState({
    currentPage: 1,
    perPageItem: 10,
    search: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecordingId, setSelectedRecordingId] = useState<number | null>(
    null,
  );

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

  const params = useParams();
  const batchId = params.id as string;
  const router = useRouter();

  const {
    data: apiResponse,
    isLoading,
    refetch,
  } = useGetClassRecordingByBatchQuery({
    page: filters.currentPage,
    per_page: filters.perPageItem,
    search: filters.search,
    batch_id: batchId,
  });

  const [deleteRecording] = useDeleteClassRecordingMutation(); // Add this mutation

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

  const handleAddRecording = () => {
    setSelectedRecordingId(null);
    setIsModalOpen(true);
  };

  const handleEditRecording = (id: number) => {
    setSelectedRecordingId(id);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedRecordingId(null);
  };

  const handleModalSuccess = () => {
    refetch();
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
      cellClassName: "px-4 py-3 text-center",
      render: (_, row) => (
        <span className="font-medium text-primary">
          {row.batch?.name || "—"}
        </span>
      ),
    },
    {
      header: "Recording URL",
      cellClassName: "px-4 py-3 text-center",
      render: (_, row) => (
        <ActionButton
          variant="view"
          icon={TvMinimalPlay}
          label="Watch Recording"
          showText={true}
          onClick={() =>
            window.open(row.recording_url, "_blank", "noopener,noreferrer")
          }
        />
      ),
    },
    {
      header: "Created At",
      cellClassName: "px-4 py-3 text-center whitespace-nowrap",
      render: (_, row) => <span>{format(row.created_at, "dd MMM yyyy")}</span>,
    },
    {
      header: "Actions",
      render: (_, row) => (
        <div className="flex justify-center gap-2 overflow-visible py-2">
          <ActionButton
            variant="edit"
            icon={Pen}
            onClick={() => handleEditRecording(row.id)}
            label="Edit Recording"
          />
          <ActionButton
            variant="delete"
            icon={Trash}
            onClick={() => {
              setActionModal({
                isOpen: true,
                actionType: "delete",
                mutation: deleteRecording,
                id: Number(row.id),
                name: `Recording for ${new Date(row.class_date).toLocaleDateString()}`,
              });
            }}
            label="Delete This Recording"
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer mb-6"
          >
            <ChevronsLeft className="w-4 h-4" />
            <span>Back to Batches</span>
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Class Recordings
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {recordings?.[0]?.batch?.name
              ? `Recordings for ${recordings[0].batch.name}`
              : "Manage all class recordings"}
          </p>
        </div>
        <MyButton onClick={handleAddRecording}>
          <Link2 className="w-4 h-4" />
          <span>Add New Recording</span>
        </MyButton>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search by batch name..."
            initialValue={filters.search}
            debounceDelay={500}
            size="md"
            variant="default"
            showClearButton={true}
          />
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing {recordings?.length || 0} of {pagination?.total || 0}{" "}
          recordings
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
          data={recordings}
          columns={columns}
          showIndex={true}
          indexLabel="SN"
          isLoading={isLoading}
          emptyMessage={
            filters.search
              ? `No recordings found matching "${filters.search}"`
              : "No recordings found for this batch"
          }
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Modals */}
      <ClassRecordingModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        batchId={batchId}
        recordingId={selectedRecordingId}
        onSuccess={handleModalSuccess}
      />

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
        entityName="Recording"
        onSuccess={() => refetch()}
      />
    </div>
  );
};

export default ClassRecordingsPage;
