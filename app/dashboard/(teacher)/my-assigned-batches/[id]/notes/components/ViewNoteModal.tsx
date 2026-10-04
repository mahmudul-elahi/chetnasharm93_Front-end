"use client";
import React, { useState } from "react";
import { useGetSingleNoteQuery } from "@/src/redux/api/teacher/classNotesApi";
import Loader from "@/components/ui/Loader";
import { X, Link2, FileText, Eye, Calendar, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface ViewNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  noteId: number | null;
}

interface NoteData {
  id: number;
  title: string;
  user_id: number;
  batch_id: number;
  note: string | null;
  note_link: string | null;
  note_file: string | null;
  created_at: string;
  updated_at?: string;
  batch: {
    id: number;
    name: string;
    teacher_id: number;
  };
}

const ViewNoteModal = ({ isOpen, onClose, noteId }: ViewNoteModalProps) => {
  const [isClosing, setIsClosing] = useState(false);

  const { data: singleNoteData, isLoading: isLoadingSingle } =
    useGetSingleNoteQuery(noteId as number, {
      skip: !noteId || !isOpen,
    });

  const note: NoteData | undefined = singleNoteData?.data;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  };

  // Helper to get file icon and preview
  const getFileInfo = (fileUrl: string) => {
    const extension = fileUrl.split(".").pop()?.toLowerCase();
    const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(
      extension || "",
    );
    const isPdf = extension === "pdf";
    const isDoc = ["doc", "docx"].includes(extension || "");
    const fileName = fileUrl.split("/").pop() || "View File";

    return { isImage, isPdf, isDoc, extension, fileName };
  };

  // Render file preview
  const renderFilePreview = () => {
    if (!note?.note_file) return null;

    const { isImage, isPdf, isDoc, fileName } = getFileInfo(note.note_file);

    if (isImage) {
      return (
        <div className="mt-3">
          <img
            src={note.note_file}
            alt="File preview"
            className="max-w-full h-auto max-h-96 rounded-xl border border-gray-200 dark:border-gray-700 mx-auto"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      );
    }

    if (isPdf) {
      return (
        <div className="mt-3">
          <iframe
            src={note.note_file}
            className="w-full h-96 rounded-xl border border-gray-200 dark:border-gray-700"
            title="PDF Preview"
          />
        </div>
      );
    }

    if (isDoc) {
      return (
        <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Document preview not available in browser
          </p>
          <a
            href={note.note_file}
            download
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Download Document
          </a>
        </div>
      );
    }

    // For other file types, show download link
    return (
      <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl text-center">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          File preview not available
        </p>
        <a
          href={note.note_file}
          download
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Download File
        </a>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 ">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" />

      {/* Modal */}
      <div
        className={`relative bg-white  rounded-2xl shadow-xl w-full max-w-2xl mx-4 overflow-hidden ${
          isClosing ? "zoom-out duration-200" : "zoom-in duration-300"
        }`}
      >
        <div className="max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white  flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 z-10 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Eye className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                View Note
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

          {/* Content */}
          <div className="p-6">
            {isLoadingSingle ? (
              <div className="flex flex-col items-center justify-center gap-4 py-12">
                <Loader />
                <p className="text-gray-600 dark:text-gray-400">
                  Loading note details...
                </p>
              </div>
            ) : note ? (
              <div className="space-y-5">
                {/* Batch Info */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <BookOpen className="w-4 h-4" />
                    <span>Batch Information</span>
                  </div>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {note.batch?.name || "N/A"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Batch ID: {note.batch_id}
                  </p>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title
                  </label>
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <p className="text-gray-900 dark:text-white font-medium">
                      {note.title}
                    </p>
                  </div>
                </div>

                {/* Note Text */}
                {note.note && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Note Content
                    </label>
                    <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {note.note}
                      </p>
                    </div>
                  </div>
                )}

                {/* External Link */}
                {note.note_link && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      External Link
                    </label>
                    <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                      <a
                        href={note.note_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:underline break-all"
                      >
                        <Link2 className="w-4 h-4 flex-shrink-0" />
                        <span className="break-all">{note.note_link}</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* File Attachment */}
                {note.note_file && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      File Attachment
                    </label>
                    <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                        <a
                          href={note.note_file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm break-all"
                        >
                          {note.note_file.split("/").pop() || "View File"}
                        </a>
                      </div>
                      {renderFilePreview()}
                    </div>
                  </div>
                )}

                {/* Metadata */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        Created:{" "}
                        {format(note.created_at, "dd MMM yyyy, hh:mm a")}
                      </span>
                    </div>
                    {note.updated_at && note.updated_at !== note.created_at && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>
                          Updated:{" "}
                          {format(note.updated_at, "dd MMM yyyy, hh:mm a")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  Note not found
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white  p-6 border-t border-gray-200 dark:border-gray-700">
            <Button onClick={handleClose} className="w-full">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewNoteModal;
