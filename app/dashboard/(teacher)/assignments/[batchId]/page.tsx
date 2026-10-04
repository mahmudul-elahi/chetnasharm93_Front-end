"use client";
import { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import ActionButton from "@/components/ui/ActionButton";
import CustomTable from "@/components/ui/Table";
import AssignmentModal from "@/components/dashboard/teacher/assignments/AssignmentModal";
import DeleteAssignmentModal from "@/components/modals/DeleteAssignmentModal";
import { useGetAssignmentsByBatchQuery, useDeleteAssignmentMutation } from "@/src/redux/api/teacher/teacherAssignmentsApi";
import { Column } from "@/types/table";
import { Plus, Eye, Pencil, Trash2, FileText, ChevronsLeft } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import Loader from "@/components/ui/Loader";
import { Button } from "@/components/ui/button";
import { FaArrowRightLong } from "react-icons/fa6";
import Link from "next/link";
import MyButton from "@/components/ui/MyButton";

const BatchAssignmentsPage = () => {
  const params = useParams();
  const batchId = parseInt(params.batchId as string);
  const router = useRouter();
  
  const [filters, setFilters] = useState({
    currentPage: 1,
    perPageItem: 10,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create");
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<{ id: number; title: string } | null>(null);

  const { data: assignmentsData, isLoading } = useGetAssignmentsByBatchQuery({
    batchId,
    page: filters.currentPage,
    per_page: filters.perPageItem,
  });

  const [deleteAssignment] = useDeleteAssignmentMutation();

  const assignments = assignmentsData?.data || [];
  const pagination = assignmentsData?.pagination || {
    current_page: filters.currentPage,
    per_page: filters.perPageItem,
    total: 0,
    last_page: 1,
  };

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({
      ...prev,
      currentPage: page,
    }));
  }, []);

  const handleAddAssignment = () => {
    setModalMode("create");
    setSelectedAssignment(null);
    setModalOpen(true);
  };

  const handleViewAssignment = (assignment: any) => {
    setModalMode("view");
    setSelectedAssignment(assignment);
    setModalOpen(true);
  };

  const handleEditAssignment = (assignment: any) => {
    setModalMode("edit");
    setSelectedAssignment(assignment);
    setModalOpen(true);
  };

  const handleDeleteAssignment = (assignmentId: number, assignmentTitle: string) => {
    setAssignmentToDelete({ id: assignmentId, title: assignmentTitle });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!assignmentToDelete) return;

    try {
      await deleteAssignment(assignmentToDelete.id).unwrap();
      toast.success("Assignment deleted successfully");
      setDeleteModalOpen(false);
      setAssignmentToDelete(null);
    } catch (error) {
      toast.error("Failed to delete assignment");
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedAssignment(null);
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
    setAssignmentToDelete(null);
  };

  const columns: Column<any>[] = [
    {
      header: "Title",
      headerClassName:"text-left",
      accessor: "title",
      cellClassName: "px-4 py-3 text-left font-medium min-w-50",
    },
    {
      header: "Has Description",
      cellClassName: "px-4 py-3 text-center",
      render: (_, row) => (
        <span className={row.description ? "text-green-600 font-medium" : "text-gray-400"}>
          {row.description ? "Yes" : "No"}
        </span>
      ),
    },
    {
      header: "Has Attachment",
      cellClassName: "px-4 py-3 text-center",
      render: (_, row) => (
        <span className={row.attachment_url ? "text-green-600 font-medium" : "text-gray-400"}>
          {row.attachment_url ? "Yes" : "No"}
        </span>
      ),
    },
    {
      header: "Duration",
      cellClassName: "px-4 py-3 text-center whitespace-nowrap",
      render: (_, row) => {
        const startDate = new Date(row.starts_at);
        const dueDate = new Date(row.due_at);
        const startFormatted = format(startDate, "dd MMM");
        const dueFormatted = format(dueDate, "dd MMM yyyy");
        
        return (
          <div className="flex items-center gap-1">
            <span className="text-sm">{startFormatted}</span>
            <span className="text-xs text-gray-400"><FaArrowRightLong /></span>
            <span className="text-sm">{dueFormatted}</span>
          </div>
        );
      },
    },
    {
      header: "Total Marks",
      cellClassName: "px-4 py-3 text-center font-semibold",
      render: (_, row) => <span>{Math.round(row.total_marks)}</span>,
    },
    {
      header: "Submissions",
      cellClassName: "px-4 py-3 text-center",
      render: (_, row) => <span>{row.submissions_count || 0}</span>,
    },
    {
      header: "Created",
      cellClassName: "px-4 py-3 text-center whitespace-nowrap",
      render: (_, row) => format(new Date(row.created_at), "dd MMM yyyy"),
    },
    {
      header: "Updated",
      cellClassName: "px-4 py-3 text-center whitespace-nowrap",
      render: (_, row) => format(new Date(row.updated_at), "dd MMM yyyy"),
    },
    {
      header: "Actions",
      cellClassName: "px-4 py-3 text-center",
      render: (_, row) => (
        <div className="flex justify-center gap-2">
          <ActionButton
            variant="view"
            icon={Eye}
            label="View"
            onClick={() => handleViewAssignment(row)}
          />
          <ActionButton
            variant="edit"
            icon={Pencil}
            label="Edit"
            onClick={() => handleEditAssignment(row)}
          />
          <Link href={`/dashboard/assignments/${batchId}/${row.id}/submissions`}>
            <ActionButton
              variant="view"
              icon={FileText}
              label="Submissions"
            />
          </Link>
          <ActionButton
            variant="delete"
            icon={Trash2}
            label="Delete"
            onClick={() => handleDeleteAssignment(row.id, row.title)}
          />
        </div>
      ),
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
    <div className="space-y-6">
      <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer mb-6"
        >
          <ChevronsLeft className="w-4 h-4" />
          <span>Back </span>
        </button>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Batch Assignments
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage assignments for this batch
          </p>
        </div>
        <MyButton onClick={handleAddAssignment} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Assignment
        </MyButton>
      </div>

      {/* Table */}
      <div className="relative overflow-visible">
        <CustomTable
          data={assignments}
          columns={columns}
          showIndex={true}
          indexLabel="SN"
          isLoading={isLoading}
          emptyMessage="No assignments found. Create your first assignment when available."
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Assignment Modal */}
      <AssignmentModal
        open={modalOpen}
        onClose={handleModalClose}
        mode={modalMode}
        assignment={selectedAssignment}
        batchId={batchId}
      />

      {/* Delete Assignment Modal */}
      <DeleteAssignmentModal
        open={deleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={handleConfirmDelete}
        assignmentTitle={assignmentToDelete?.title || ""}
        isDeleting={false}
      />
    </div>
  );
};

export default BatchAssignmentsPage;