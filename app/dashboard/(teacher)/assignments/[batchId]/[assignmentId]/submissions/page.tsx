"use client";

import { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ChevronsLeft, Eye, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomTable from "@/components/ui/Table";
import GradeSubmissionModal from "@/components/modals/GradeSubmissionModal";
import { useGetAssignmentSubmissionsQuery, useGradeSubmissionMutation } from "@/src/redux/api/teacher/teacherAssignmentsApi";
import { Column } from "@/types/table";
import { format } from "date-fns";
import { toast } from "sonner";
import Loader from "@/components/ui/Loader";
import Link from "next/link";
import ActionButton from "@/components/ui/ActionButton";
import { AssignmentSubmission } from "@/types/assignments";
import ViewSubmissionModal from "@/components/modals/ViewSubmissionModal";

const AssignmentSubmissionsPage = () => {
  const params = useParams();
  const batchId = parseInt(params.batchId as string);
  const assignmentId = parseInt(params.assignmentId as string);
  const router = useRouter();

  const [filters, setFilters] = useState({
    currentPage: 1,
    perPageItem: 10,
  });

  const [gradeModalOpen, setGradeModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<AssignmentSubmission | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewingSubmission, setViewingSubmission] = useState<AssignmentSubmission | null>(null);

  const { data: submissionsData, isLoading } = useGetAssignmentSubmissionsQuery({
    assignmentId,
    page: filters.currentPage,
    per_page: filters.perPageItem,
  });

  const [gradeSubmission, { isLoading: isGrading }] = useGradeSubmissionMutation();

  const submissions = submissionsData?.data || [];
  const pagination = submissionsData?.pagination || {
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

  const handleGradeSubmission = (submission: AssignmentSubmission) => {
    setSelectedSubmission(submission);
    setGradeModalOpen(true);
  };

  const handleGradeSubmit = async (data: { obtained_marks: number; feedback: string }) => {
    if (!selectedSubmission) return;

    try {
      await gradeSubmission({
        submissionId: selectedSubmission.id,
        data,
      }).unwrap();
      toast.success("Grade saved successfully");
      setGradeModalOpen(false);
      setSelectedSubmission(null);
    } catch (error) {
      toast.error("Failed to save grade");
    }
  };

  const handleGradeModalClose = () => {
    setGradeModalOpen(false);
    setSelectedSubmission(null);
  };

  const handleViewSubmission = (submission: AssignmentSubmission) => {
    setViewingSubmission(submission);
    setViewModalOpen(true);
  };

  const handleViewModalClose = () => {
    setViewModalOpen(false);
    setViewingSubmission(null);
  };

  const columns: Column<AssignmentSubmission>[] = [
    {
      header: "Student",
      accessor: "student_name",
      cellClassName: "px-4 py-3 text-left",
      render: (_, row) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{row.student_name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{row.student_email}</p>
        </div>
      ),
    },
    {
      header: "Submission Date",
      cellClassName: "px-4 py-3 text-center whitespace-nowrap",
      render: (_, row) => format(new Date(row.submitted_at), "dd MMM yyyy HH:mm"),
    },
    {
      header: "Total Marks",
      cellClassName: "px-4 py-3 text-center font-semibold",
      render: (_, row) => <span>{parseFloat(row.total_marks)}</span>,
    },
    {
      header: "Obtained Marks",
      cellClassName: "px-4 py-3 text-center",
      render: (_, row) => (
        <span className={row.obtained_marks ? "text-green-600 font-medium" : "text-gray-400"}>
          {row.obtained_marks || "Not graded"}
        </span>
      ),
    },
    {
      header: "Status",
      cellClassName: "px-4 py-3 text-center",
      render: (_, row) => (
        <span className={row.obtained_marks ? "text-green-600 font-medium" : "text-yellow-600 font-medium"}>
          {row.obtained_marks ? "Graded" : "Pending"}
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
            onClick={() => handleViewSubmission(row)}
            showText={true}
            size="sm"
          />
          <ActionButton
            variant="edit"
            icon={Pencil}
            label={row.obtained_marks ? "Update" : "Grade"}
            onClick={() => handleGradeSubmission(row)}
            showText={true}
            size="sm"
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
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
              <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer mb-6"
        >
          <ChevronsLeft className="w-4 h-4" />
          <span>Back </span>
        </button>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Assignment Submissions
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Grade and review student submissions
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="relative overflow-visible">
        <CustomTable
          data={submissions}
          columns={columns}
          showIndex={true}
          indexLabel="SN"
          isLoading={isLoading}
          emptyMessage="No submissions found for this assignment."
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Grade Submission Modal */}
      <GradeSubmissionModal
        open={gradeModalOpen}
        onClose={handleGradeModalClose}
        onSubmit={handleGradeSubmit}
        submission={selectedSubmission}
        isSubmitting={isGrading}
      />

      {/* View Submission Modal */}
      <ViewSubmissionModal
        open={viewModalOpen}
        onClose={handleViewModalClose}
        submission={viewingSubmission}
      />
    </div>
  );
};

export default AssignmentSubmissionsPage;