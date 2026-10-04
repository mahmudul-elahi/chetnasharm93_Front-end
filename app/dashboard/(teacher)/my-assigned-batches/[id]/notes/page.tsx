"use client";
import React, { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useGetAllNotesByBatchQuery,
  useDeleteNoteMutation,
} from "@/src/redux/api/teacher/classNotesApi";
import {
  ChevronsLeft,
  FileText,
  Plus,
  Pen,
  Trash,
  Link2,
  File,
  Image,
  FileType,
  Calendar,
  Search,
  Eye,
} from "lucide-react";
import MyButton from "@/components/ui/MyButton";
import SearchBar from "@/components/ui/SearchBar";
import CustomTable from "@/components/ui/Table";
import Loader from "@/components/ui/Loader";
import ActionButton from "@/components/ui/ActionButton";
import { Column } from "@/types/table";
import { format } from "date-fns";
import ActionConfirmationModal, {
  ActionType,
} from "@/components/modals/ActionConfirmationModal";
import ClassNotesModal from "./components/ClassNotesModal";
import ViewNoteModal from "./components/ViewNoteModal";

interface Note {
  id: number;
  title: string;
  batch_id: number;
  note: string | null;
  note_link: string | null;
  note_file: string | null;
  created_at: string;
  batch: {
    id: number;
    name: string;
    teacher_id: number;
  };
}

const ClassNotesPage = () => {
  const [filters, setFilters] = useState({
    currentPage: 1,
    perPageItem: 10,
    search: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
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
  } = useGetAllNotesByBatchQuery({
    page: filters.currentPage,
    per_page: filters.perPageItem,
    search: filters.search,
    batch_id: batchId,
  });

  const [deleteNote] = useDeleteNoteMutation();

  const notes = apiResponse?.data;
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

    document.getElementById("notes-table-container")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  const handleAddNote = () => {
    setSelectedNoteId(null);
    setIsModalOpen(true);
  };

  const handleEditNote = (id: number) => {
    setSelectedNoteId(id);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedNoteId(null);
  };

  const handleModalSuccess = () => {
    refetch();
  };

  // Helper to get file icon based on file extension
  const getFileIcon = (fileUrl: string | null) => {
    if (!fileUrl) return <FileText className="w-4 h-4" />;

    const extension = fileUrl.split(".").pop()?.toLowerCase();

    if (extension === "pdf") {
      return <FileType className="w-4 h-4 text-red-500" />;
    } else if (
      ["jpg", "jpeg", "png", "gif", "webp"].includes(extension || "")
    ) {
      return <Image className="w-4 h-4 text-blue-500" />;
    } else if (["doc", "docx"].includes(extension || "")) {
      return <FileText className="w-4 h-4 text-blue-600" />;
    }
    return <File className="w-4 h-4 text-gray-500" />;
  };

  const columns: Column<Note>[] = [
    {
      header: "Title",
      headerClassName: "text-left",
      accessor: "title",
      cellClassName: "px-4 py-3 text-left font-medium",
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          <span className="font-medium text-gray-900 dark:text-white">
            {value}
          </span>
        </div>
      ),
    },
    {
      header: "Batch",
      headerClassName: "text-left",
      cellClassName: "px-4 py-3 text-left",
      render: (_: any, row: Note) => (
        <span className="text-primary font-medium">
          {row.batch?.name || "-"}
        </span>
      ),
    },
    {
      header: "Content Type",
      headerClassName: "text-center",
      cellClassName: "px-4 py-3 text-center",
      render: (_: any, row: Note) => {
        const hasNote = row.note && row.note.trim();
        const hasLink = row.note_link;
        const hasFile = row.note_file;

        const types = [];
        if (hasNote)
          types.push({ label: "Text", color: "bg-green-100 text-green-700" });
        if (hasLink)
          types.push({ label: "Link", color: "bg-blue-100 text-blue-700" });
        if (hasFile)
          types.push({ label: "File", color: "bg-purple-100 text-purple-700" });

        return (
          <div className="flex flex-wrap gap-1 justify-center">
            {types.map((type, idx) => (
              <span
                key={idx}
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${type.color}`}
              >
                {type.label}
              </span>
            ))}
            {types.length === 0 && (
              <span className="text-gray-400 text-xs">-</span>
            )}
          </div>
        );
      },
    },
    {
      header: "Preview",
      headerClassName: "text-left",
      cellClassName: "px-4 py-3 text-left",
      render: (_: any, row: Note) => {
        if (row.note) {
          return (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 max-w-xs">
              {row.note.length > 100
                ? `${row.note.substring(0, 100)}...`
                : row.note}
            </p>
          );
        }
        if (row.note_link) {
          return (
            <a
              href={row.note_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              <Link2 className="w-3 h-3" />
              {row.note_link.length > 50
                ? `${row.note_link.substring(0, 50)}...`
                : row.note_link}
            </a>
          );
        }
        if (row.note_file) {
          return (
            <a
              href={row.note_file}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {getFileIcon(row.note_file)}
              View File
            </a>
          );
        }
        return <span className="text-gray-400 text-sm">-</span>;
      },
    },
    {
      header: "Created At",
      headerClassName: "text-center",
      cellClassName: "px-4 py-3 text-center whitespace-nowrap",
      render: (_: any, row: Note) => (
        <div className="flex items-center justify-center gap-1">
          <Calendar className="w-3 h-3 text-gray-400" />
          <span className="text-sm">
            {format(row.created_at, "dd MMM yyyy")}
          </span>
        </div>
      ),
    },
    {
      header: "Actions",
      render: (_: any, row: Note) => (
        <div className="flex justify-center gap-2 overflow-visible py-2">
          <ActionButton
            variant="view"
            icon={Eye}
            onClick={() => {
              setSelectedNoteId(row.id);
              setIsViewModalOpen(true);
            }}
            label="View Note"
          />

          <ActionButton
            variant="edit"
            icon={Pen}
            onClick={() => handleEditNote(row.id)}
            label="Edit Note"
          />
          <ActionButton
            variant="delete"
            icon={Trash}
            onClick={() => {
              setActionModal({
                isOpen: true,
                actionType: "delete",
                mutation: deleteNote,
                id: Number(row.id),
                name: `Note: ${row.title}`,
              });
            }}
            label="Delete This Note"
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
    <div className="space-y-6" id="notes-table-container">
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
            Class Notes
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {notes?.[0]?.batch?.name
              ? `Notes for ${notes[0].batch.name}`
              : "Manage all class notes and materials"}
          </p>
        </div>
        <MyButton onClick={handleAddNote}>
          <Plus className="w-4 h-4" />
          <span>Add New Note</span>
        </MyButton>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search notes by title..."
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
          Showing {notes?.length || 0} of {pagination?.total || 0} notes
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
          data={notes}
          columns={columns}
          showIndex={true}
          indexLabel="SN"
          isLoading={isLoading}
          emptyMessage={
            filters.search
              ? `No notes found matching "${filters.search}"`
              : "No notes found for this batch"
          }
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Modals */}
      <ClassNotesModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        batchId={batchId}
        noteId={selectedNoteId}
        onSuccess={handleModalSuccess}
      />
      <ViewNoteModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedNoteId(null);
        }}
        noteId={selectedNoteId}
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
        entityName="Note"
        onSuccess={() => refetch()}
      />
    </div>
  );
};

export default ClassNotesPage;
