"use client";
import React, { useEffect, useState } from "react";
import {
  useAddNoteMutation,
  useGetSingleNoteQuery,
  useUpdateNoteMutation,
} from "@/src/redux/api/teacher/classNotesApi";
import Loader from "@/components/ui/Loader";
import { toast } from "sonner";
import MyButton from "@/components/ui/MyButton";
import { X, Upload, Link2, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClassNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  batchId: string;
  noteId?: number | null;
  onSuccess: () => void;
}

interface FormData {
  batch_id: string;
  title: string;
  note: string;
  note_link: string;
  note_file: File | null;
}

const ClassNotesModal = ({
  isOpen,
  onClose,
  batchId,
  noteId,
  onSuccess,
}: ClassNotesModalProps) => {
  const [formData, setFormData] = useState<FormData>({
    batch_id: batchId,
    title: "",
    note: "",
    note_link: "",
    note_file: null,
  });
  const [existingFileUrl, setExistingFileUrl] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const [addNote, { isLoading: isAdding }] = useAddNoteMutation();
  const [updateNote, { isLoading: isUpdating }] = useUpdateNoteMutation();

  const { data: singleNoteData, isLoading: isLoadingSingle } =
    useGetSingleNoteQuery(noteId as number, {
      skip: !noteId || !isOpen,
    });

  const isEditMode = !!noteId;
  const isLoading = isAdding || isUpdating || isLoadingSingle;

  useEffect(() => {
    if (isEditMode && singleNoteData?.data) {
      const note = singleNoteData.data;
      setFormData({
        batch_id: note.batch_id,
        title: note.title || "",
        note: note.note || "",
        note_link: note.note_link || "",
        note_file: null,
      });
      setExistingFileUrl(note.note_file);
    } else if (!isEditMode && isOpen) {
      setFormData({
        batch_id: batchId,
        title: "",
        note: "",
        note_link: "",
        note_file: null,
      });
      setExistingFileUrl(null);
    }
  }, [isEditMode, singleNoteData, isOpen, batchId]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size should be less than 10MB");
        return;
      }

      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/gif",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload PDF, Image, or DOC file");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        note_file: file,
      }));
    }
  };

  const handleRemoveFile = () => {
    setFormData((prev) => ({
      ...prev,
      note_file: null,
    }));
    setExistingFileUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    const hasNote = formData.note.trim();
    const hasLink = formData.note_link.trim();
    const hasFile = formData.note_file || existingFileUrl;

    if (!hasNote && !hasLink && !hasFile) {
      toast.error("Please provide at least one: text note, link, or file");
      return;
    }

    try {
      if (isEditMode) {
        const updateData: any = {
          id: noteId,
          batch_id: parseInt(formData.batch_id),
          title: formData.title,
        };

        if (formData.note) updateData.note = formData.note;
        if (formData.note_link) updateData.note_link = formData.note_link;

        if (formData.note_file) {
          const formDataToSend = new FormData();
          formDataToSend.append("id", String(noteId));
          formDataToSend.append("batch_id", formData.batch_id);
          formDataToSend.append("title", formData.title);
          if (formData.note) formDataToSend.append("note", formData.note);
          if (formData.note_link)
            formDataToSend.append("note_link", formData.note_link);
          if (formData.note_file)
            formDataToSend.append("note_file", formData.note_file);

          await updateNote(formDataToSend).unwrap();
        } else {
          await updateNote(updateData).unwrap();
        }
        toast.success("Note updated successfully");
      } else {
        const submitData = new FormData();
        submitData.append("batch_id", formData.batch_id);
        submitData.append("title", formData.title);
        if (formData.note) submitData.append("note", formData.note);
        if (formData.note_link)
          submitData.append("note_link", formData.note_link);
        if (formData.note_file)
          submitData.append("note_file", formData.note_file);

        await addNote(submitData).unwrap();
        toast.success("Note added successfully");
      }

      onSuccess();
      handleClose();
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          `Failed to ${isEditMode ? "update" : "add"} note`,
      );
    }
  };

  if (!isOpen) return null;

  if (isEditMode && isLoadingSingle) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md mx-4 p-8">
          <div className="flex flex-col items-center justify-center gap-4">
            <Loader />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" />

      {/* Modal */}
      <div className="relative bg-white  rounded-2xl shadow-xl w-full max-w-md mx-4  overflow-hidden transition-all duration-300 animate-in fade-in zoom-in">
        {/* Header */}
        <div className="overflow-y-auto max-h-[90vh]">
          <div className="sticky top-0 bg-white  flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 z-10 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {isEditMode ? "Edit Note" : "Add New Note"}
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
              aria-label="Close modal"
              type="button"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Batch ID Display (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Batch ID
              </label>
              <input
                type="text"
                value={formData.batch_id}
                disabled
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter note title"
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Note Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Note Text{" "}
                <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                rows={4}
                placeholder="Enter your note content here..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
              />
            </div>

            {/* Note Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                External Link{" "}
                <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="url"
                  name="note_link"
                  value={formData.note_link}
                  onChange={handleChange}
                  placeholder="https://example.com/resource"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Google Drive, YouTube, or any external resource link
              </p>
            </div>

            {/* Note File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Upload File{" "}
                <span className="text-gray-400 text-xs">
                  (Optional - PDF, Image, DOC)
                </span>
              </label>

              {/* Show existing file in edit mode */}
              {isEditMode && existingFileUrl && !formData.note_file && (
                <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1">
                      Current file
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-1 text-red-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Show selected new file */}
              {formData.note_file && (
                <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl flex items-center gap-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <FileText className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                      {formData.note_file.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-1 text-red-500 hover:text-red-600 transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              <label className="cursor-pointer">
                <div className="border-2 border-dashed rounded-xl p-4 text-center hover:border-primary transition-colors duration-200 border-gray-300 dark:border-gray-600">
                  <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Click to{" "}
                    {existingFileUrl || formData.note_file
                      ? "replace"
                      : "upload"}{" "}
                    file
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PDF, Images, DOC (Max 10MB)
                  </p>
                </div>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Info Message */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3">
              <p className="text-xs text-blue-700 dark:text-blue-400">
                <span className="font-medium">Note:</span> You can provide text
                note, a link, and/or a file. At least one is required.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <MyButton type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{isEditMode ? "Updating..." : "Adding..."}</span>
                  </div>
                ) : (
                  <span>{isEditMode ? "Update Note" : "Add Note"}</span>
                )}
              </MyButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClassNotesModal;
