"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import MyButton from "../ui/MyButton";

interface AddFeedbackModalProps {
  student: {
    user_id: number;
    batch_id: number;
    name: string;
  };
  onClose: () => void;
  onSubmit: (data: { comment: string; status: string }) => void;
  isSubmitting?: boolean;
  mode?: "add" | "update";
  initialData?: {
    comment?: string;
    status?: string;
  };
}

const AddFeedbackModal = ({
  student,
  onClose,
  onSubmit,
  isSubmitting = false,
  mode = "add",
  initialData,
}: AddFeedbackModalProps) => {
  const [status, setStatus] = useState(initialData?.status || "good");
  const [comment, setComment] = useState(initialData?.comment || "");

  // Update form when initialData changes (for update mode)
  useEffect(() => {
    if (initialData && mode === "update") {
      setStatus(initialData.status || "good");
      setComment(initialData.comment || "");
    }
  }, [initialData, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    await onSubmit({ comment, status });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {mode === "add" ? `Add Feedback for ${student.name}` : `Update Feedback for ${student.name}`}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-left">
              Student
            </label>
            <input
              type="text"
              value={student.name}
              disabled
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-left">
              Status
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full rounded-lg h-11 justify-between cursor-pointer"
                >
                  {status === "excellent" && "Excellent"}
                  {status === "good" && "Good"}
                  {status === "average" && "Average"}
                  {status === "bad" && "Bad"}
                  {status === "needs_improvement" && "Needs Improvement"}
                  {status === "requires_support" && "Requires Support"}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                <DropdownMenuItem
                  onClick={() => setStatus("excellent")}
                  className="cursor-pointer"
                >
                  Excellent
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setStatus("good")}
                  className="cursor-pointer"
                >
                  Good
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setStatus("average")}
                  className="cursor-pointer"
                >
                  Average
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setStatus("needs_improvement")}
                  className="cursor-pointer"
                >
                  Needs Improvement
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setStatus("requires_support")}
                  className="cursor-pointer"
                >
                  Requires Support
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-left">
              Comment
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white resize-vertical"
              placeholder="Enter your feedback..."
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <MyButton type="button" variant="outline" onClick={onClose}>
              Cancel
            </MyButton>
            <MyButton type="submit" disabled={isSubmitting}>
              {isSubmitting 
                ? (mode === "add" ? "Saving..." : "Updating...") 
                : (mode === "add" ? "Save Feedback" : "Update Feedback")}
            </MyButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFeedbackModal;