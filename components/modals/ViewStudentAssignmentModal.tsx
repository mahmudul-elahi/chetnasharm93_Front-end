"use client";

import React from "react";
import { X, FileText, Calendar, BookOpen, CheckCircle, XCircle } from "lucide-react";
import MyButton from "@/components/ui/MyButton";
import { StudentAssignment } from "@/types/assignments";

interface ViewStudentAssignmentModalProps {
  open: boolean;
  onClose: () => void;
  assignment: StudentAssignment | null;
}

const ViewStudentAssignmentModal = ({ open, onClose, assignment }: ViewStudentAssignmentModalProps) => {
  if (!open || !assignment) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Assignment Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Title and Description */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {assignment.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
              {assignment.description}
            </p>
          </div>

          {/* Batch and Class Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <BookOpen className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Batch</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {assignment.batch_name}
                </p>
              </div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Class</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {assignment.class_title}
              </p>
            </div>
          </div>

          {/* Duration and Marks */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center gap-1 mb-1">
                <Calendar className="w-3 h-3 text-gray-400" />
                <p className="text-xs text-gray-500 dark:text-gray-400">Starts</p>
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {new Date(assignment.starts_at).toLocaleDateString()}
              </p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center gap-1 mb-1">
                <Calendar className="w-3 h-3 text-gray-400" />
                <p className="text-xs text-gray-500 dark:text-gray-400">Due</p>
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {new Date(assignment.due_at).toLocaleDateString()}
              </p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Marks</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {parseFloat(assignment.total_marks)}
              </p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Status</p>
              <div className="flex items-center gap-1">
                {assignment.is_open ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600" />
                )}
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {assignment.is_open ? "Open" : "Closed"}
                </span>
              </div>
            </div>
          </div>

          {/* Submission Status */}
          {assignment.has_submitted && assignment.my_submission && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-3">
                Your Submission
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Submitted on {new Date(assignment.my_submission.submitted_at).toLocaleDateString()}
                  </span>
                </div>
                {assignment.my_submission.obtained_marks && (
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Obtained Marks</span>
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">
                      {parseFloat(assignment.my_submission.obtained_marks)} / {parseFloat(assignment.total_marks)}
                    </span>
                  </div>
                )}
                {assignment.my_submission.feedback && (
                  <div className="p-2 bg-white dark:bg-gray-800 rounded">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Feedback</p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {assignment.my_submission.feedback}
                    </p>
                  </div>
                )}
                {assignment.my_submission.file_url && (
                  <div className="p-2 bg-white dark:bg-gray-800 rounded">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Submitted File</p>
                    <a
                      href={assignment.my_submission.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <FileText className="w-4 h-4" />
                      View Your Submission
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Assignment Attachment */}
          {assignment.attachment_url && (
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Assignment File</p>
              <a
                href={assignment.attachment_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <FileText className="w-4 h-4" />
                View Assignment Attachment
              </a>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <MyButton type="button" variant="outline" onClick={onClose}>
            Close
          </MyButton>
        </div>
      </div>
    </div>
  );
};

export default ViewStudentAssignmentModal;