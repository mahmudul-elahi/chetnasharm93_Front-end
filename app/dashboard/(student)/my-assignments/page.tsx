"use client";

import { useState, useCallback } from "react";
import { Column } from "@/types/table";
import { format } from "date-fns";
import { toast } from "sonner";
import Loader from "@/components/ui/Loader";
import CustomTable from "@/components/ui/Table";
import ActionButton from "@/components/ui/ActionButton";
import SubmitAssignmentModal from "@/components/modals/SubmitAssignmentModal";
import ViewStudentAssignmentModal from "@/components/modals/ViewStudentAssignmentModal";
import { useGetStudentAssignmentsQuery, useSubmitAssignmentMutation } from "@/src/redux/api/student/studentAssignmentsApi";
import { StudentAssignment } from "@/types/assignments";
import { Eye, Upload } from "lucide-react";

const StudentAssignmentsPage = () => {
  const [filters, setFilters] = useState({
    currentPage: 1,
    perPageItem: 10,
  });

  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<StudentAssignment | null>(null);

  const { data: assignmentsData, isLoading } = useGetStudentAssignmentsQuery({
    page: filters.currentPage,
    per_page: filters.perPageItem,
  });

  const [submitAssignment, { isLoading: isSubmitting }] = useSubmitAssignmentMutation();

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

  const handleViewAssignment = (assignment: StudentAssignment) => {
    setSelectedAssignment(assignment);
    setViewModalOpen(true);
  };

  const handleSubmitAssignment = (assignment: StudentAssignment) => {
    setSelectedAssignment(assignment);
    setSubmitModalOpen(true);
  };

  const handleSubmit = async (file: File) => {
    if (!selectedAssignment) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      await submitAssignment({
        assignmentId: selectedAssignment.id,
        data: formData,
      }).unwrap();

      toast.success("Assignment submitted successfully");
      setSubmitModalOpen(false);
      setSelectedAssignment(null);
    } catch (error) {
      toast.error("Failed to submit assignment");
    }
  };

  const handleViewModalClose = () => {
    setViewModalOpen(false);
    setSelectedAssignment(null);
  };

  const handleSubmitModalClose = () => {
    setSubmitModalOpen(false);
    setSelectedAssignment(null);
  };

  const columns: Column<StudentAssignment>[] = [
    {
      header: "Title",
      accessor: "title",
      cellClassName: "px-4 py-3 min-w-80 text-left font-medium min-w-50",
      render: (_, row) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{row.title}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{row.description}</p>
        </div>
      ),
    },
    {
      header: "Batch & Class",
      cellClassName: "px-4 min-w-75 py-3 text-left",
      render: (_, row) => (
        <div>
          <p className="text-sm text-gray-900 dark:text-white">{row.batch_name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{row.class_title}</p>
        </div>
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
          <div className="flex items-center gap-1 justify-center">
            <span className="text-sm">{startFormatted}</span>
            <span className="text-xs text-gray-400">→</span>
            <span className="text-sm">{dueFormatted}</span>
          </div>
        );
      },
    },
    {
      header: "Total Marks",
      cellClassName: "px-4 py-3 text-center font-semibold",
      render: (_, row) => <span>{parseFloat(row.total_marks)}</span>,
    },
    {
      header: "Obtained Marks",
      cellClassName: "px-4 py-3 text-center font-semibold",
      render: (_, row) => {
        if (row.has_submitted && row.my_submission?.obtained_marks) {
          return (
            <span className="text-green-600 dark:text-green-400 font-semibold">
              {parseFloat(row.my_submission.obtained_marks)}
            </span>
          );
        }
        return <span className="text-gray-400">-</span>;
      },
    },
    {
      header: "Availability",
      cellClassName: "px-4 py-3 text-center",
      render: (_, row) => (
        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
          row.is_open 
            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
        }`}>
          {row.is_open ? "Open" : "Closed"}
        </span>
      ),
    },
    {
      header: "Submission",
      cellClassName: "px-4 py-3 text-center whitespace-nowrap",
      render: (_, row) => (
        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
          row.has_submitted 
            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" 
            : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
        }`}>
          {row.has_submitted ? "Submitted" : "Not Submitted"}
        </span>
      ),
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
            showText={true}
            size="sm"
          />
          {row.is_open && !row.has_submitted && (
            <ActionButton
              variant="primary"
              icon={Upload}
              label="Submit"
              onClick={() => handleSubmitAssignment(row)}
              showText={true}
              size="sm"
            />
          )}
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
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            My Assignments
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            View and submit your assignments
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="relative overflow-visible">
        <CustomTable
          data={assignments}
          columns={columns}
          showIndex={true}
          indexLabel="SN"
          isLoading={isLoading}
          emptyMessage="No assignments found."
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>

      {/* View Assignment Modal */}
      {selectedAssignment && (
        <ViewStudentAssignmentModal
          open={viewModalOpen}
          onClose={handleViewModalClose}
          assignment={selectedAssignment}
        />
      )}

      {/* Submit Assignment Modal */}
      <SubmitAssignmentModal
        open={submitModalOpen}
        onClose={handleSubmitModalClose}
        onSubmit={handleSubmit}
        assignment={selectedAssignment}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default StudentAssignmentsPage;