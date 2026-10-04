"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { X, FileText, User } from "lucide-react";
import MyButton from "@/components/ui/MyButton";
import { AssignmentSubmission } from "@/types/assignments";

interface GradeSubmissionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { obtained_marks: number; feedback: string }) => void;
  submission: AssignmentSubmission | null;
  isSubmitting?: boolean;
}

const GradeSubmissionModal = ({
  open,
  onClose,
  onSubmit,
  submission,
  isSubmitting = false,
}: GradeSubmissionModalProps) => {
  const [obtainedMarks, setObtainedMarks] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (submission) {
      setObtainedMarks(submission.obtained_marks || "");
      setFeedback(submission.feedback || "");
    }
  }, [submission]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!obtainedMarks || parseFloat(obtainedMarks) < 0 || parseFloat(obtainedMarks) > parseFloat(submission?.total_marks || "100")) {
      toast.error(`Please enter valid marks (0-${submission?.total_marks || 100})`);
      return;
    }

    await onSubmit({
      obtained_marks: parseFloat(obtainedMarks),
      feedback: feedback.trim(),
    });
  };

  if (!open || !submission) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Grade Submission
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6 space-y-3">
          <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <User className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {submission.student_name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {submission.student_email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <FileText className="w-5 h-5 text-gray-400" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Assignment File
              </p>
              <a
                href={submission.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline"
              >
                View Submission
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Marks</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {submission.total_marks}
              </p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400">Submitted</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {new Date(submission.submitted_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-left">
              Obtained Marks <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={obtainedMarks}
              onChange={(e) => setObtainedMarks(e.target.value)}
              min="0"
              max={submission.total_marks}
              step="0.01"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
              placeholder="Enter obtained marks"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-left">
              Feedback
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white resize-vertical"
              placeholder="Enter feedback for the student..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <MyButton
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </MyButton>
            <MyButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Grade"}
            </MyButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GradeSubmissionModal;