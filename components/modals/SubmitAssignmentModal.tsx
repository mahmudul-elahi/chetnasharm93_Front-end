"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { X, Upload, FileText, Calendar, BookOpen } from "lucide-react";
import MyButton from "@/components/ui/MyButton";
import { StudentAssignment } from "@/types/assignments";

interface SubmitAssignmentModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (file: File) => void;
  assignment: StudentAssignment | null;
  isSubmitting?: boolean;
}

const SubmitAssignmentModal = ({
  open,
  onClose,
  onSubmit,
  assignment,
  isSubmitting = false,
}: SubmitAssignmentModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (assignment) {
      setSelectedFile(null);
    }
  }, [assignment]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error("Please select a file to submit");
      return;
    }

    await onSubmit(selectedFile);
  };

  if (!open || !assignment) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Submit Assignment
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6 space-y-3">
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
              {assignment.title}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
              {assignment.description}
            </p>
          </div>

          <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <BookOpen className="w-4 h-4 text-gray-400" />
            <div className="flex-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">Batch</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {assignment.batch_name}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
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
          </div>

          {assignment.attachment_url && (
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
              Upload Your Submission <span className="text-red-500">*</span>
            </label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                relative border-2 border-dashed rounded-lg p-6
                transition-colors cursor-pointer
                ${isDragging 
                  ? "border-primary bg-primary/5" 
                  : "border-gray-300 dark:border-gray-600 hover:border-primary"
                }
              `}
            >
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="submission-upload"
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              />
              <label
                htmlFor="submission-upload"
                className="flex flex-col items-center justify-center gap-2 cursor-pointer"
              >
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedFile ? selectedFile.name : "Click to upload or drag and drop"}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-500">
                  PDF, DOC, DOCX, TXT, JPG, PNG (Max 10MB)
                </span>
              </label>
            </div>
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
            <MyButton type="submit" disabled={isSubmitting || !selectedFile}>
              {isSubmitting ? "Submitting..." : "Submit Assignment"}
            </MyButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitAssignmentModal;