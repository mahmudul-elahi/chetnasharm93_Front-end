"use client";

import React from "react";
import { X, User, FileText, Calendar, CheckCircle, XCircle } from "lucide-react";
import MyButton from "@/components/ui/MyButton";
import { AssignmentSubmission } from "@/types/assignments";

interface ViewSubmissionModalProps {
  open: boolean;
  onClose: () => void;
  submission: AssignmentSubmission | null;
}

const ViewSubmissionModal = ({ open, onClose, submission }: ViewSubmissionModalProps) => {
  if (!open || !submission) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Submission Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Student Information */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <User className="w-5 h-5 text-gray-400" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {submission.student_name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {submission.student_email}
              </p>
            </div>
          </div>

          {/* Submission Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-gray-400" />
                <p className="text-xs text-gray-500 dark:text-gray-400">Submitted</p>
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {new Date(submission.submitted_at).toLocaleDateString()}
              </p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Marks</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {submission.total_marks}
              </p>
            </div>
          </div>

          {/* Obtained Marks */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Obtained Marks</p>
            <div className="flex items-center gap-2">
              {submission.obtained_marks ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-lg font-semibold text-green-600">
                    {submission.obtained_marks}
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-yellow-600" />
                  <span className="text-lg font-semibold text-yellow-600">Not Graded</span>
                </>
              )}
            </div>
          </div>

          {/* Feedback */}
          {submission.feedback && (
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Feedback</p>
              <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                {submission.feedback}
              </p>
            </div>
          )}

          {/* Grading Status */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Grading Status</p>
            {submission.graded_at ? (
              <p className="text-sm text-gray-900 dark:text-white">
                Graded on {new Date(submission.graded_at).toLocaleDateString()}
              </p>
            ) : (
              <p className="text-sm text-yellow-600 font-medium">Pending grading</p>
            )}
          </div>

          {/* File Link */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Submission File
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Click to view or download
                  </p>
                </div>
              </div>
              <a
                href={submission.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-sm font-medium"
              >
                View File
              </a>
            </div>
          </div>
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

export default ViewSubmissionModal;