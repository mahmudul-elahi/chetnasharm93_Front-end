"use client";

import { useState, useEffect, useRef } from "react";
import {
  X,
  HelpCircle,
  Edit,
} from "lucide-react";
import MyButton from "@/components/ui/MyButton";
import { toast } from "sonner";
import { ModalPortal } from "@/components/ui/ModalPortal";
import Loader from "@/components/ui/Loader";
import { Button } from "@/components/ui/button";
import {
  useGetSingleBasicQuestionForAdminByIdQuery,
  useUpdateBasicQuestionForAdminMutation,
} from "@/src/redux/api/admin/basicQuestionsApi";

interface UpdateBasicQuestionModalProps {
  id: number;
  onClose: () => void;
  onUpdate?: () => void;
}

export default function UpdateBasicQuestionModal({
  id,
  onClose,
  onUpdate,
}: UpdateBasicQuestionModalProps) {
  // Form state
  const [question, setQuestion] = useState("");
  const [level, setLevel] = useState("");
  const [status, setStatus] = useState<number>(1);

  // Ref for textarea to manage height
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Fetch question data
  const {
    data: questionData,
    isLoading: isLoadingQuestion,
    isError: isQuestionError,
  } = useGetSingleBasicQuestionForAdminByIdQuery(id);

  const [updateQuestion, { isLoading: isUpdating, isSuccess, isError, error }] =
    useUpdateBasicQuestionForAdminMutation();

  // Set question data when fetched
  useEffect(() => {
    if (questionData?.data) {
      const basicQuestion = questionData.data;
      setQuestion(basicQuestion.question || "");
      setLevel(basicQuestion.level || "");
      setStatus(basicQuestion.status ?? 1);
    }
  }, [questionData]);

  // Auto-expand textarea when question value changes
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [question]);

  // Handle success
  useEffect(() => {
    if (isSuccess) {
      toast.success("Basic question updated successfully!");
      onUpdate?.();
      onClose();
    }
  }, [isSuccess, onUpdate, onClose]);

  // Handle error
  useEffect(() => {
    if (isError && error) {
      const errorMessage =
        (error as any)?.data?.message || "Failed to update basic question";
      toast.error(errorMessage);
    }
  }, [isError, error]);

  // Auto-expand textarea function
  const autoExpandTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  // Handle question change with auto-expand
  const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(e.target.value);
    autoExpandTextarea(e);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.trim()) {
      toast.error("Question is required");
      return;
    }

    if (!level.trim()) {
      toast.error("Proficiency level is required");
      return;
    }

    // Prepare data
    const submitData = {
      question: question,
      level: level,
      status: status,
    };

    await updateQuestion({ id: String(id), data: submitData });
  };

  // Show loading state
  if (isLoadingQuestion) {
    return (
      <ModalPortal>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="rounded-2xl overflow-hidden">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md mx-4 p-8 animate-in fade-in zoom-in">
              <div className="flex flex-col items-center justify-center gap-4">
                <Loader />
                <p className="text-gray-600 dark:text-gray-400">
                  Loading basic question data...
                </p>
              </div>
            </div>
          </div>
        </div>
      </ModalPortal>
    );
  }

  // Show error state
  if (isQuestionError) {
    return (
      <ModalPortal>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="rounded-2xl overflow-hidden">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md mx-4 p-8 animate-in fade-in zoom-in">
              <div className="flex flex-col items-center justify-center gap-4">
                <p className="text-red-500">Failed to load basic question data</p>
                <MyButton onClick={onClose}>Close</MyButton>
              </div>
            </div>
          </div>
        </div>
      </ModalPortal>
    );
  }

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" />

        {/* Modal */}
        <div className="rounded-2xl overflow-hidden w-full md:w-3/4 lg:w-1/2 xl:w-2/5">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full overflow-y-auto max-h-[90vh] transition-all duration-300 animate-in fade-in zoom-in">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Edit className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Edit Basic Question
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Question - Required with Auto-expanding */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Question <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <HelpCircle className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <textarea
                    ref={textareaRef}
                    value={question}
                    onChange={handleQuestionChange}
                    rows={1}
                    placeholder="Enter basic question"
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent overflow-hidden resize-none"
                    style={{ height: "auto", minHeight: "42px" }}
                    required
                  />
                </div>
              </div>

              {/* Level - Required with Normal Text Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Level <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    placeholder="e.g., A1, A2, B1, B2, C1, C2, or custom level"
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value={1}
                      checked={status === 1}
                      onChange={() => setStatus(1)}
                      className="w-4 h-4 text-green-500 border-gray-300 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Active
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value={0}
                      checked={status === 0}
                      onChange={() => setStatus(0)}
                      className="w-4 h-4 text-red-500 border-gray-300 focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Inactive
                    </span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  className="flex-1"
                  type="button"
                  onClick={onClose}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  {isUpdating ? "Updating..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}