"use client";
import React, { useEffect, useState } from "react";
import {
  useAddClassRecordingMutation,
  useGetSingleClassRecordingQuery,
  useUpdateClassRecordingMutation,
} from "@/src/redux/api/teacher/classRecordingsApi";
import Loader from "@/components/ui/Loader";
import { toast } from "sonner";
import MyButton from "@/components/ui/MyButton";
import { X } from "lucide-react";
import { CustomCalendar } from "@/components/ui/CustomCalendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

interface ClassRecordingModalProps {
  isOpen: boolean;
  onClose: () => void;
  batchId: string;
  recordingId?: number | null;
  onSuccess: () => void;
}

const ClassRecordingModal = ({
  isOpen,
  onClose,
  batchId,
  recordingId,
  onSuccess,
}: ClassRecordingModalProps) => {
  const [formData, setFormData] = useState({
    batch_id: batchId,
    class_date: "",
    recording_url: "",
  });

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isClosing, setIsClosing] = useState(false);

  const [addClassRecording, { isLoading: isAdding }] =
    useAddClassRecordingMutation();
  const [updateClassRecording, { isLoading: isUpdating }] =
    useUpdateClassRecordingMutation();

  const { data: singleRecordingData, isLoading: isLoadingSingle } =
    useGetSingleClassRecordingQuery(recordingId as number, {
      skip: !recordingId || !isOpen,
    });

  const isEditMode = !!recordingId;
  const isLoading = isAdding || isUpdating || isLoadingSingle;

  useEffect(() => {
    if (isEditMode && singleRecordingData?.data) {
      const recording = singleRecordingData.data;
      const date = new Date(recording.class_date);
      setFormData({
        batch_id: recording.batch_id,
        class_date: recording.class_date,
        recording_url: recording.recording_url,
      });
      setSelectedDate(date);
    } else if (!isEditMode && isOpen) {
      // Reset form when adding new recording
      setFormData({
        batch_id: batchId,
        class_date: "",
        recording_url: "",
      });
      setSelectedDate(undefined);
    }
  }, [isEditMode, singleRecordingData, isOpen, batchId]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd");
      setSelectedDate(date);
      setFormData((prev) => ({
        ...prev,
        class_date: formattedDate,
      }));
      setIsDatePickerOpen(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.class_date) {
      toast.error("Please select a class date");
      return;
    }
    if (!formData.recording_url) {
      toast.error("Please enter a recording URL");
      return;
    }

    try {
      if (isEditMode) {
        await updateClassRecording({
          id: recordingId,
          ...formData,
        }).unwrap();
        toast.success("Recording updated successfully");
      } else {
        await addClassRecording(formData).unwrap();
        toast.success("Recording added successfully");
      }
      onSuccess();
      handleClose();
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          `Failed to ${isEditMode ? "update" : "add"} recording`
      );
    }
  };

  if (!isOpen) return null;

  const buttonClassName =
    "w-full justify-between px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 hover:bg-gray-50 transition-all duration-200";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className={`bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md mx-4 ${
          isClosing ? "zoom-out duration-200" : "zoom-in duration-300"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {isEditMode ? "Edit Recording" : "Add New Recording"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Batch ID Display (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Batch ID
            </label>
            <input
              type="text"
              value={formData.batch_id}
              disabled
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            />
          </div>

          {/* Class Date with Custom Calendar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Class Date <span className="text-red-500">*</span>
            </label>
            <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button type="button" variant="outline" className={buttonClassName}>
                  <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                  <span className="flex-1 text-left truncate">
                    {selectedDate ? format(selectedDate, "PPP") : "Select class date"}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start" sideOffset={5}>
                <CustomCalendar
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={(date) => {
                    // Optional: Disable future dates if needed
                    // return date > new Date();
                    return false;
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Recording URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Recording URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              name="recording_url"
              value={formData.recording_url}
              onChange={handleChange}
              placeholder="https://example.com/recording.mp4"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Enter the full URL of the class recording (YouTube, Google Drive,
              etc.)
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
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
                <span>{isEditMode ? "Update Recording" : "Add Recording"}</span>
              )}
            </MyButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassRecordingModal;