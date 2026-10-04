"use client";
import ActionButton from "@/components/ui/ActionButton";
import SearchBar from "@/components/ui/SearchBar";
import CustomTable from "@/components/ui/Table";
import { Column } from "@/types/table";
import { Calendar, ChevronsLeft, FileText, Link2, Eye } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import Loader from "@/components/ui/Loader";
import { format } from "date-fns";
import { useGetClassNotesByBatchForStudentQuery } from "@/src/redux/api/student/studentBatchApi";
import ViewStudentNoteModal from "./components/ViewStudentNoteModal";

const StudentClassNotesPage = () => {
  const [filters, setFilters] = useState({
    currentPage: 1,
    perPageItem: 10,
    search: "",
  });
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const params = useParams();
  const batchId = params.id as string;
  const router = useRouter();

  const { data: apiResponse, isLoading } =
    useGetClassNotesByBatchForStudentQuery(Number(batchId));

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

  const handleViewNote = (noteId: number) => {
    setSelectedNoteId(noteId);
    setIsViewModalOpen(true);
  };

  // Helper to get file icon and type
  const getFileInfo = (fileUrl: string) => {
    const extension = fileUrl.split(".").pop()?.toLowerCase();
    const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(
      extension || "",
    );
    const isPdf = extension === "pdf";
    const isDoc = ["doc", "docx"].includes(extension || "");
    return { isImage, isPdf, isDoc, extension };
  };

  // Filter notes based on search term
  const filteredNotes = notes?.filter((note: any) => {
    if (!filters.search) return true;
    const searchLower = filters.search.toLowerCase();
    return (
      note.title?.toLowerCase().includes(searchLower) ||
      note.batch?.name?.toLowerCase().includes(searchLower) ||
      note.note?.toLowerCase().includes(searchLower)
    );
  });

  // Apply pagination on client-side since API doesn't support search/pagination params
  const paginatedNotes = filteredNotes?.slice(
    (filters.currentPage - 1) * filters.perPageItem,
    filters.currentPage * filters.perPageItem,
  );

  const totalItems = filteredNotes?.length || 0;
  const totalPages = Math.ceil(totalItems / filters.perPageItem);

  const customPagination = {
    current_page: filters.currentPage,
    per_page: filters.perPageItem,
    total: totalItems,
    last_page: totalPages,
  };

  const columns: Column<any>[] = [
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
      header: "Batch Name",
      headerClassName: "text-left",
      cellClassName: "px-4 py-3 text-left",
      render: (_, row) => (
        <span className="font-medium text-primary">
          {row.batch?.name || "-"}
        </span>
      ),
    },
    {
      header: "Content Type",
      headerClassName: "text-center",
      cellClassName: "px-4 py-3 text-center",
      render: (_, row) => {
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
      render: (_, row) => {
        if (row.note) {
          return (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 max-w-xs">
              {row.note.length > 80
                ? `${row.note.substring(0, 80)}...`
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
          const { isImage, isPdf } = getFileInfo(row.note_file);
          return (
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {isImage ? "Image file" : isPdf ? "PDF file" : "Document file"}
              </span>
            </div>
          );
        }
        return <span className="text-gray-400 text-sm">-</span>;
      },
    },
    {
      header: "Created At",
      headerClassName: "text-center",
      cellClassName: "px-4 py-3 text-center whitespace-nowrap",
      render: (_, row) => (
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
      render: (_, row) => (
        <div className="flex justify-center gap-2 overflow-visible py-2">
          <ActionButton
            variant="view"
            icon={Eye}
            label="View Note"
            showText={true}
            onClick={() => handleViewNote(row.id)}
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
    <>
      <div className="space-y-6" id="notes-table-container">
        {/* Header Section */}
        <div className="flex flex-col gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <ChevronsLeft className="w-4 h-4" />
            <span>Back </span>
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Class Notes
            </h1>
            <p className="text-sm text-textGray dark:text-gray-400 mt-1">
              {notes?.[0]?.batch?.name
                ? `Notes for ${notes[0].batch.name}`
                : "Access your class notes and materials"}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search notes by title, batch name or content..."
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
            Showing {paginatedNotes?.length || 0} of {totalItems} notes
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
            data={paginatedNotes}
            columns={columns}
            showIndex={true}
            indexLabel="SN"
            isLoading={isLoading}
            emptyMessage={
              filters.search
                ? `No notes found matching "${filters.search}"`
                : "No class notes available for this batch yet"
            }
            pagination={customPagination}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* View Note Modal */}
      <ViewStudentNoteModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedNoteId(null);
        }}
        noteId={selectedNoteId}
      />
    </>
  );
};

export default StudentClassNotesPage;
