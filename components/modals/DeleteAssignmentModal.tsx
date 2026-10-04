"use client";

import React from "react";
import { toast } from "sonner";
import { X, Trash2 } from "lucide-react";
import MyButton from "@/components/ui/MyButton";

interface DeleteAssignmentModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  assignmentTitle: string;
  isDeleting?: boolean;
}

const DeleteAssignmentModal = ({
  open,
  onClose,
  onConfirm,
  assignmentTitle,
  isDeleting = false,
}: DeleteAssignmentModalProps) => {
  if (!open) return null;

  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Delete Assignment
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg mb-4">
            <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Are you sure you want to delete this assignment? This action cannot be undone.
            </p>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Assignment:</span> {assignmentTitle}
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <MyButton
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </MyButton>
          <MyButton
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? "Deleting..." : "Delete Assignment"}
          </MyButton>
        </div>
      </div>
    </div>
  );
};

export default DeleteAssignmentModal;