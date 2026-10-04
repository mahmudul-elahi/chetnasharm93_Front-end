"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CustomCalendar } from "@/components/ui/CustomCalendar";
import { Assignment } from "@/types/assignments";
import {
  useGetAssignmentQuery,
  useCreateAssignmentMutation,
  useUpdateAssignmentMutation,
} from "@/src/redux/api/teacher/teacherAssignmentsApi";
import { X, Upload, FileText, Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";
import MyButton from "@/components/ui/MyButton";
import { ModalPortal } from "@/components/ui/ModalPortal";

interface AssignmentModalProps {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit" | "view";
  assignment?: Assignment;
  batchId: number;
}

const AssignmentModal = ({
  open,
  onClose,
  mode,
  assignment,
  batchId,
}: AssignmentModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startsAt, setStartsAt] = useState<Date | undefined>();
  const [dueAt, setDueAt] = useState<Date | undefined>();
  const [totalMarks, setTotalMarks] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [existingAttachment, setExistingAttachment] = useState<string | null>(
    null,
  );
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showDueCalendar, setShowDueCalendar] = useState(false);
  const [removedAttachment, setRemovedAttachment] = useState(false);
  const startInputRef = useRef<HTMLInputElement>(null);
  const dueInputRef = useRef<HTMLInputElement>(null);

  const { data: assignmentData, isLoading: isLoadingAssignment } =
    useGetAssignmentQuery(
      mode === "edit" && assignment?.id ? assignment.id : 0,
      { skip: mode !== "edit" || !assignment?.id },
    );

  const [createAssignment, { isLoading: isCreating }] =
    useCreateAssignmentMutation();
  const [updateAssignment, { isLoading: isUpdating }] =
    useUpdateAssignmentMutation();

  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (mode === "edit" && assignmentData) {
      setTitle(assignmentData.title);
      setDescription(assignmentData.description || "");
      setStartsAt(new Date(assignmentData.starts_at));
      setDueAt(new Date(assignmentData.due_at));
      setTotalMarks(assignmentData.total_marks.toString());
      setExistingAttachment(assignmentData.attachment_url);
    } else if (mode === "create" || mode === "view") {
      resetForm();
      if (mode === "view" && assignment) {
        setTitle(assignment.title);
        setDescription(assignment.description || "");
        setStartsAt(new Date(assignment.starts_at));
        setDueAt(new Date(assignment.due_at));
        setTotalMarks(assignment.total_marks.toString());
        setExistingAttachment(assignment.attachment_url);
      }
    }
  }, [mode, assignmentData, assignment]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStartsAt(undefined);
    setDueAt(undefined);
    setTotalMarks("");
    setAttachment(null);
    setExistingAttachment(null);
    setShowStartCalendar(false);
    setShowDueCalendar(false);
    setRemovedAttachment(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment(file);
      setExistingAttachment(null);
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
    setExistingAttachment(null);
    setRemovedAttachment(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!startsAt) {
      toast.error("Please select a start date");
      return;
    }

    if (!dueAt) {
      toast.error("Please select a due date");
      return;
    }

    if (dueAt < startsAt) {
      toast.error("Due date cannot be before start date");
      return;
    }

    if (!totalMarks || parseFloat(totalMarks) <= 0) {
      toast.error("Please enter valid total marks");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("starts_at", startsAt.toISOString());
    formData.append("due_at", dueAt.toISOString());
    formData.append("total_marks", totalMarks);

    if (attachment) {
      formData.append("attachment", attachment);
    }

    try {
      if (mode === "create") {
        await createAssignment({ batchId, data: formData }).unwrap();
        toast.success("Assignment created successfully");
      } else if (mode === "edit" && assignment?.id) {
        await updateAssignment({ id: assignment.id, data: formData }).unwrap();
        toast.success("Assignment updated successfully");
      }
      onClose();
    } catch (error) {
      toast.error(
        mode === "create"
          ? "Failed to create assignment"
          : "Failed to update assignment",
      );
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    if (!isViewMode) {
      handleSubmit(e);
    }
  };

  const isViewMode = mode === "view";

  // Close calendars when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.calendar-popup') && !target.closest('input[readonly]')) {
        setShowStartCalendar(false);
        setShowDueCalendar(false);
      }
    };

    if (showStartCalendar || showDueCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showStartCalendar, showDueCalendar]);

  // Update calendar position on scroll
  useEffect(() => {
    const handleScroll = () => {
      // Force re-render by toggling state
      if (showStartCalendar || showDueCalendar) {
        setShowStartCalendar(prev => prev);
        setShowDueCalendar(prev => prev);
      }
    };

    const modalContent = document.querySelector('.overflow-y-auto');
    if (modalContent && (showStartCalendar || showDueCalendar)) {
      modalContent.addEventListener('scroll', handleScroll);
      return () => modalContent.removeEventListener('scroll', handleScroll);
    }
  }, [showStartCalendar, showDueCalendar]);

  const getInputPosition = useCallback((inputRef: React.RefObject<HTMLInputElement | null>) => {
    if (!inputRef.current) return { top: 0, left: 0 };
    const rect = inputRef.current.getBoundingClientRect();
    return {
      top: rect.top + rect.height / 2 - 150, // Offset to center input in calendar
      left: rect.left 
    };
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {mode === "create"
              ? "Add Assignment"
              : mode === "edit"
                ? "Edit Assignment"
                : "View Assignment"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isLoadingAssignment && mode === "edit" ? (
          <div className="p-6 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-left">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isViewMode}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                placeholder="Enter assignment title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-left">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isViewMode}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white resize-vertical disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                placeholder="Enter assignment description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-left">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    ref={startInputRef}
                    type="text"
                    value={startsAt ? format(startsAt, "dd MMM yyyy") : ""}
                    disabled={isViewMode}
                    readOnly
                    onClick={() => {
                      if (!isViewMode) {
                        setShowDueCalendar(false);
                        setShowStartCalendar(!showStartCalendar);
                      }
                    }}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed cursor-pointer"
                    placeholder="Select start date"
                    required
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  {showStartCalendar && (
                    <ModalPortal>
                      <div
                        className="calendar-popup fixed z-[60] animate-in zoom-in duration-200"
                        style={{
                          top: `${getInputPosition(startInputRef).top}px`,
                          left: `${getInputPosition(startInputRef).left}px`,
                          transform: 'translate(-50%, -50%)'
                        }}
                      >
                        <CustomCalendar
                          selected={startsAt}
                          onSelect={(date) => {
                            setStartsAt(date);
                            setShowStartCalendar(false);
                          }}
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        />
                      </div>
                    </ModalPortal>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-left">
                  Due Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    ref={dueInputRef}
                    type="text"
                    value={dueAt ? format(dueAt, "dd MMM yyyy") : ""}
                    disabled={isViewMode}
                    readOnly
                    onClick={() => {
                      if (!isViewMode) {
                        setShowStartCalendar(false);
                        setShowDueCalendar(!showDueCalendar);
                      }
                    }}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed cursor-pointer"
                    placeholder="Select due date"
                    required
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  {showDueCalendar && (
                    <ModalPortal>
                      <div
                        className="calendar-popup fixed z-[60] animate-in zoom-in duration-200"
                        style={{
                          top: `${getInputPosition(dueInputRef).top}px`,
                          left: `${getInputPosition(dueInputRef).left}px`,
                          transform: 'translate(-50%, -50%)'
                        }}
                      >
                        <CustomCalendar
                          selected={dueAt}
                          onSelect={(date) => {
                            setDueAt(date);
                            setShowDueCalendar(false);
                          }}
                          disabled={(date) => startsAt ? date < startsAt : false}
                        />
                      </div>
                    </ModalPortal>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-left">
                Total Marks <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={totalMarks}
                onChange={(e) => setTotalMarks(e.target.value)}
                onWheel={(e) => e.currentTarget.blur()}
                disabled={isViewMode}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                placeholder="Enter total marks"
                min="0"
                step="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-left">
                Attachment
              </label>
              {!isViewMode && (
                <div className="mt-1">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="attachment-upload"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  />
                  <label
                    htmlFor="attachment-upload"
                    className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary transition-colors"
                  >
                    <Upload className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {attachment ? attachment.name : "Click to upload file"}
                    </span>
                  </label>
                </div>
              )}

              {(existingAttachment || attachment) && (
                <div className="mt-2">
                  <a
                    href={
                      existingAttachment ||
                      (attachment ? URL.createObjectURL(attachment) : "")
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                      {attachment ? attachment.name : "Current attachment"}
                    </span>
                    {!isViewMode && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          removeAttachment();
                        }}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </a>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <MyButton
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                {isViewMode ? "Close" : "Cancel"}
              </MyButton>
              {!isViewMode && (
                <MyButton type="submit" disabled={isLoading}>
                  {isLoading
                    ? mode === "create"
                      ? "Creating..."
                      : "Updating..."
                    : mode === "create"
                      ? "Create Assignment"
                      : "Update Assignment"}
                </MyButton>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AssignmentModal;
