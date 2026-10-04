"use client";

import React, { useState, useEffect } from "react";
import { ModalPortal } from "@/components/ui/ModalPortal";
import { X, Clock, Plus, AlertCircle } from "lucide-react";
import MyButton from "@/components/ui/MyButton";
import { toast } from "sonner";
import { useAddTeacherAvailabilityMutation } from "@/src/redux/api/admin+teacher/teacherAvailabilityApi";
import { Button } from "@/components/ui/button";

interface TimeSlotInput {
  start_time: string;
}

interface AddTimeSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacherId?: number;
  dayName: string;
  dayValue: number;
  classTimeDuration: number;
  onSuccess?: () => void;
}

export default function AddTimeSlotModal({
  isOpen,
  onClose,
  teacherId,
  dayName,
  dayValue,
  classTimeDuration,
  onSuccess,
}: AddTimeSlotModalProps) {
  const [slots, setSlots] = useState<TimeSlotInput[]>([
    { start_time: "09:00" },
  ]);
  const [addTeacherAvailability, { isLoading }] =
    useAddTeacherAvailabilityMutation();

  // Convert 24-hour to 12-hour format with AM/PM
  const convertTo12Hour = (time24: string): string => {
    if (!time24) return "";

    const [hours, minutes] = time24.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) return "";

    const period = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  // Calculate end time based on start time and duration (24-hour format)
  const calculateEndTime = (startTime: string): string => {
    if (!classTimeDuration || !startTime) return "";

    const [hours, minutes] = startTime.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + classTimeDuration;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;

    // Ensure 24-hour format with leading zeros
    return `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")}`;
  };

  // Validate if time is in 24-hour format
  const isValidTimeFormat = (time: string): boolean => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  };

  // Get next available time slot suggestion
  const getNextStartTime = (currentStartTime: string): string => {
    if (!classTimeDuration) return "09:00";

    const [hours, minutes] = currentStartTime.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + classTimeDuration;
    const newHours = Math.floor(totalMinutes / 60);
    const newMinutes = totalMinutes % 60;

    // Don't go beyond 23:59
    if (newHours >= 24) {
      return "23:59";
    }

    return `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}`;
  };

  // Add a new slot
  const addSlot = () => {
    const lastSlot = slots[slots.length - 1];
    let newStartTime = "09:00";

    // If there's a last slot, add duration to its start time
    if (lastSlot && classTimeDuration) {
      newStartTime = getNextStartTime(lastSlot.start_time);
    }

    setSlots([...slots, { start_time: newStartTime }]);
  };

  // Remove a slot
  const removeSlot = (index: number) => {
    if (slots.length === 1) {
      toast.error("At least one time slot is required");
      return;
    }
    const newSlots = slots.filter((_, i) => i !== index);
    setSlots(newSlots);
  };

  // Update slot start time
  const updateSlotStartTime = (index: number, startTime: string) => {
    if (!isValidTimeFormat(startTime)) {
      toast.error("Please enter a valid time in 24-hour format (HH:MM)");
      return;
    }

    const newSlots = [...slots];
    newSlots[index].start_time = startTime;
    setSlots(newSlots);
  };

  const handleAddSlots = async () => {
    // Validate all slots
    for (let i = 0; i < slots.length; i++) {
      if (!slots[i].start_time) {
        toast.error(`Please select start time for slot ${i + 1}`);
        return;
      }

      if (!isValidTimeFormat(slots[i].start_time)) {
        toast.error(
          `Invalid time format for slot ${i + 1}. Please use HH:MM format (24-hour)`,
        );
        return;
      }
    }

    // Validate slots don't overlap
    const sortedSlots = [...slots].sort((a, b) =>
      a.start_time.localeCompare(b.start_time),
    );

    for (let i = 0; i < sortedSlots.length - 1; i++) {
      const currentEnd = calculateEndTime(sortedSlots[i].start_time);
      const nextStart = sortedSlots[i + 1].start_time;

      if (currentEnd > nextStart) {
        toast.error(
          `Slot ${i + 1} (${sortedSlots[i].start_time} - ${currentEnd}) overlaps with slot ${i + 2} (${nextStart})`,
        );
        return;
      }
    }

    // Check if any slot exceeds 24-hour limit
    for (let i = 0; i < slots.length; i++) {
      const endTime = calculateEndTime(slots[i].start_time);
      const [endHours] = endTime.split(":").map(Number);

      if (endHours >= 24) {
        toast.error(
          `Slot ${i + 1} would end after 11:59 PM (ends at ${endTime}). Please choose an earlier start time.`,
        );
        return;
      }
    }

    try {
      const result = await addTeacherAvailability({
        teacher_id: teacherId,
        day_of_week: dayValue,
        slots: slots,
      }).unwrap();

      // Handle the response structure
      if (result.success) {
        const { created, failed, summary } = result;

        if (summary.created > 0) {
          toast.success(
            `Successfully added ${summary.created} time slot${summary.created > 1 ? "s" : ""} for ${dayName}`,
          );
        }

        if (summary.failed > 0) {
          // Show details of failed slots
          const failedMessages = failed
            .map(
              (f: any, idx: number) =>
                `Slot ${idx + 1} (${convertTo12Hour(f.start_time)}): ${f.message}`,
            )
            .join("\n");

          toast.error(
            `Failed to add ${summary.failed} slot${summary.failed > 1 ? "s" : ""}:\n${failedMessages}`,
            {
              duration: 5000,
            },
          );
        }

        // Close modal if at least one slot was created
        if (summary.created > 0) {
          onSuccess?.();
          onClose();
          // Reset form
          setSlots([{ start_time: "09:00" }]);
        }
      } else {
        toast.error(result.message || "Failed to add time slots");
      }
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Failed to add time slots. Please try again.";
      toast.error(errorMessage);
    }
  };

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setSlots([{ start_time: "09:00" }]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />

        {/* Modal Content */}
        <div className="rounded-2xl overflow-hidden w-full max-w-2xl">
          <div className="relative bg-white dark:bg-gray-800 shadow-2xl w-full transition-all duration-300 animate-in fade-in zoom-in">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-full">
                  <Plus className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Add Time Slots -{" "}
                    <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                      {dayName}
                    </span>{" "}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Each slot duration: {classTimeDuration} minutes
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
                aria-label="Close modal"
                disabled={isLoading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="space-y-4">
                {slots.map((slot, index) => {
                  const endTime = calculateEndTime(slot.start_time);
                  const [endHours] = endTime.split(":").map(Number);
                  const isValidSlot = endHours < 24;

                  return (
                    <div
                      key={index}
                      className={`border rounded-lg p-4 space-y-3 relative group ${
                        !isValidSlot && slot.start_time
                          ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10"
                          : "border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      {/* Slot number and remove button */}
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Time Slot {index + 1}
                        </h3>
                        {slots.length > 1 && (
                          <button
                            onClick={() => removeSlot(index)}
                            className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors cursor-pointer"
                            disabled={isLoading}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Start Time */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Start Time ({convertTo12Hour(slot.start_time)})
                        </label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="time"
                            value={slot.start_time}
                            onChange={(e) =>
                              updateSlotStartTime(index, e.target.value)
                            }
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                            disabled={isLoading}
                            step="60"
                          />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Format: HH:MM (e.g., 09:00, 14:30, 23:00)
                        </p>
                      </div>

                      {/* End Time (Read Only) */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          End Time ({convertTo12Hour(endTime)})
                        </label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 " />
                          <input
                            type="time"
                            value={endTime}
                            readOnly
                            className={`w-full pl-10 pr-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 cursor-not-allowed ${
                              !isValidSlot && slot.start_time
                                ? "border-red-300 dark:border-red-700 text-red-600 dark:text-red-400"
                                : "border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400"
                            }`}
                          />
                        </div>
                        {!isValidSlot && slot.start_time && (
                          <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                            This slot would end after 11:59 PM. Please choose an
                            earlier start time.
                          </p>
                        )}
                      </div>

                      {/* Duration info */}
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Duration: {classTimeDuration} minutes
                      </div>
                    </div>
                  );
                })}

                {/* Add another slot button */}
                <button
                  type="button"
                  onClick={addSlot}
                  className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  disabled={isLoading}
                >
                  <Plus className="w-4 h-4" />
                  Add Another Time Slot
                </button>

                {/* Time Info Note */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-blue-700 dark:text-blue-300">
                      <p className="font-medium mb-1">Important Notes:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>
                          All times are in <strong>24-hour format</strong>{" "}
                          (e.g., 09:00 for 9 AM, 14:00 for 2 PM)
                        </li>
                        <li>
                          Each time slot has a fixed duration of{" "}
                          {classTimeDuration} minutes
                        </li>
                        <li>
                          Class time duration can be updated from admin settings.
                        </li>

                        <li>
                          End time is automatically calculated based on start
                          time
                        </li>
                        <li>Time slots cannot overlap with each other</li>
                        <li>Time slots cannot end after 11:59 PM (23:59)</li>
                        <li>You can add multiple time slots for this day</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  className="flex-1"
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <MyButton
                  type="button"
                  onClick={handleAddSlots}
                  isLoading={isLoading}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white"
                >
                  Add {slots.length} Slot{slots.length > 1 ? "s" : ""}
                </MyButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
