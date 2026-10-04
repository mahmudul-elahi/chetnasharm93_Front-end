"use client";
import { useGetStudentNotesQuery } from "@/src/redux/api/teacher/teacherBatchesApi";
import {
  useAddStudentNoteMutation,
  useUpdateStudentNoteMutation,
  useDeleteStudentNoteMutation,
} from "@/src/redux/api/teacher/studentNotesApi";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import {
  ChevronLeft,
  Calendar,
  MessageSquare,
  Plus,
} from "lucide-react";
import Link from "next/link";
import Loader from "@/components/ui/Loader";
import { Column } from "@/types/table";
import CustomTable from "@/components/ui/Table";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ActionButton from "@/components/ui/ActionButton";
import { Edit2, Trash2 } from "lucide-react";
import AddFeedbackModal from "@/components/modals/AddFeedbackModal";

const StudentNotesPage = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const studentId = params.id as string;
  const batchIdFromUrl = searchParams.get("batch_id") || "";

  const { data, isLoading, error, refetch } = useGetStudentNotesQuery(
    { student_id: parseInt(studentId), batch_id: parseInt(batchIdFromUrl) },
    { skip: !studentId || !batchIdFromUrl },
  );

  const notes = data?.data || [];
  const studentName = notes[0]?.student_name || "Student";

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState<any>(null);
  const [deletingFeedback, setDeletingFeedback] = useState<any>(null);

  const [addStudentNote] = useAddStudentNoteMutation();
  const [updateStudentNote] = useUpdateStudentNoteMutation();
  const [deleteStudentNote] = useDeleteStudentNoteMutation();

  const getStatusColor = (status: string) => {
    const colors = {
      excellent:
        "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-300",
      good: "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300",
      average:
        "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300",
      bad: "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-300",
    };
    return colors[status as keyof typeof colors] || "text-gray-600 bg-gray-100";
  };

  const handleAddNote = async (data: any) => {
    try {
      await addStudentNote({
        batch_id: parseInt(batchIdFromUrl),
        student_user_id: parseInt(studentId),
        ...data,
      }).unwrap();
      toast.success("Note added successfully!");
      setIsAddModalOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to add note");
    }
  };

  const handleUpdateNote = async (data: any) => {
    if (!editingFeedback) return;
    try {
      await updateStudentNote({
        id: editingFeedback.id,
        ...data,
      }).unwrap();
      toast.success("Feedback updated successfully!");
      setEditingFeedback(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update feedback");
    }
  };

  const handleDeleteNote = async () => {
    if (!deletingFeedback) return;
    try {
      await deleteStudentNote(deletingFeedback.id).unwrap();
      toast.success("Feedback deleted successfully!");
      setDeletingFeedback(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete feedback");
    }
  };

  const columns: Column<any>[] = [
    {
      header: "Date",
      accessor: "created_at",
      headerClassName: "text-center",
      cellClassName: "px-4 py-3 text-center",
      render: (_, row) => (
        <div className="flex items-center justify-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm">
            {format(new Date(row.created_at), "dd MMM yyyy")}
          </span>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      headerClassName: "text-center",
      cellClassName: "px-4 py-3 text-center",
      render: (_, row) => (
        <span
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(row.status)}`}
        >
          {row.status.replace(/_/g, " ").toUpperCase()}
        </span>
      ),
    },
    {
      header: "Comment",
      accessor: "comment",
      headerClassName: "text-left",
      cellClassName: "px-4 py-3 text-left",
      render: (_, row) => (
        <div className="flex items-start gap-2">
          <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5" />
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {row.comment}
          </p>
        </div>
      ),
    },
    {
      header: "Actions",
      headerClassName: "text-center",
      cellClassName: "px-4 py-3 text-center",
      render: (_, row) => (
        <div className="flex justify-center gap-2">
          <ActionButton
            variant="edit"
            icon={Edit2}
            size="sm"
            onClick={() => setEditingFeedback(row)}
          />
          <ActionButton
            variant="delete"
            icon={Trash2}
            size="sm"
            onClick={() => setDeletingFeedback(row)}
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

  if (error) {
    return (
      <div className="h-[calc(100vh-155px)] w-full flex justify-center items-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading student feedback</p>
          <button
            onClick={() => router.back()}
            className="text-primary hover:underline"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Students</span>
        </button>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 ">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Student Feedback
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              View all feedback for {studentName}
            </p>
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="cursor-pointer w-full md:w-fit px-4"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Feedback
          </Button>
        </div>
      </div>

      {/* Feedback Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Feedback History
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Total feedback: {notes.length}
            </p>
          </div>
        </div>

        <CustomTable
          data={notes}
          columns={columns}
          showIndex={true}
          indexLabel="SN"
          isLoading={isLoading}
          emptyMessage="No feedback found for this student"
        />
      </div>

      {/* Add Feedback Modal */}
      {isAddModalOpen && (
        <AddFeedbackModal
          student={{
            user_id: parseInt(studentId),
            batch_id: parseInt(batchIdFromUrl),
            name: studentName,
          }}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddNote}
          mode="add"
        />
      )}

      {/* Update Feedback Modal */}
      {editingFeedback && (
        <AddFeedbackModal
          student={{
            user_id: parseInt(studentId),
            batch_id: parseInt(batchIdFromUrl),
            name: studentName,
          }}
          onClose={() => setEditingFeedback(null)}
          onSubmit={handleUpdateNote}
          mode="update"
          initialData={{
            comment: editingFeedback.comment,
            status: editingFeedback.status,
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deletingFeedback && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Delete Feedback
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete this feedback? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setDeletingFeedback(null)}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteNote}
                className="cursor-pointer"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentNotesPage;
