"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { toast } from "sonner";

// Components
import Loader from "@/components/ui/Loader";
import ConfirmationModal from "@/components/modals/ConfirmationModal";

// Types
import { ClassItem, TeacherItem } from "@/types/batches";

// API Hooks
import {
  useGetAllClassesForBatchQuery,
  useGetAllTeachersForBatchQuery,
} from "@/src/redux/api/admin/adminBatchesApi";
import MyButton from "@/components/ui/MyButton";
import { useBatchForm } from "../hooks/useBatchForm";
import { useTeacherAvailability } from "../hooks/useTeacherAvailability";
import { useBatchSubmission } from "../hooks/useBatchSubmission";
import { BatchDetailsForm } from "../components/BatchDetailsForm";
import { ClassTeacherSelection } from "../components/ClassTeacherSelection";
import { ScheduleSelection } from "../components/ScheduleSelection";
import { weekdayLabels } from "@/utils/batchUtils";
import { useRouter } from "next/navigation";
import { ChevronsLeft } from "lucide-react";

const CreateBatch = () => {
  const router = useRouter();
  const { data: classApiResponse, isLoading: isClassLoading } =
    useGetAllClassesForBatchQuery(null);
  const { data: teachersApiResponse, isLoading: isTeacherLoading } =
    useGetAllTeachersForBatchQuery(null);

  const classList: ClassItem[] = classApiResponse?.data || [];
  const teachersList: TeacherItem[] = teachersApiResponse?.data || [];

  // Custom hooks
  const {
    formState,
    updateFormState,
    selectedSchedules,
    setSelectedSchedules,
    resetForm,
  } = useBatchForm();

  const {
    availability,
    isLoading: isAvailabilityLoading,
    getAvailability,
    resetAvailability,
  } = useTeacherAvailability();

  const { isSubmitting, submitBatch } = useBatchSubmission();

  // Local state
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Handlers
  const handleGetAvailability = () => {
    if (!formState.selectedTeacher) {
      toast.error("Please select a teacher");
      return;
    }
    if (!formState.startDate || !formState.endDate) {
      toast.error("Please select start and end date");
      return;
    }
    if (formState.startDate > formState.endDate) {
      toast.error("Start date cannot be after end date");
      return;
    }

    getAvailability({
      teacher_id: formState.selectedTeacher.id,
      start_date: format(formState.startDate, "yyyy-MM-dd"),
      end_date: format(formState.endDate, "yyyy-MM-dd"),
    });
  };

  const handleToggleSchedule = (day: number, startTime: string) => {
    const dayStr = day.toString();
    const timeOnly = startTime.slice(0, 5);

    const existingIndex = selectedSchedules.findIndex(
      (s) => s.day_of_week === dayStr && s.start_time === timeOnly,
    );

    if (existingIndex !== -1) {
      setSelectedSchedules((prev) =>
        prev.filter((_, i) => i !== existingIndex),
      );
      toast.success(
        `Removed schedule for ${weekdayLabels[day]} at ${timeOnly}`,
      );
    } else {
      if (selectedSchedules.some((s) => s.day_of_week === dayStr)) {
        toast.error(
          `You already selected a schedule for ${weekdayLabels[day]}`,
        );
        return;
      }

      setSelectedSchedules((prev) => [
        ...prev,
        { day_of_week: dayStr, start_time: timeOnly },
      ]);
      toast.success(`Added ${weekdayLabels[day]} at ${timeOnly} to schedule`);
    }
  };

  const prepareSubmit = () => {
    if (
      !formState.selectedClass ||
      !formState.selectedTeacher ||
      !formState.batchName ||
      !formState.totalSeat ||
      !formState.startDate ||
      !formState.endDate
    ) {
      toast.error("Please fill all required fields");
      return;
    }
    if (selectedSchedules.length === 0) {
      toast.error("Please select at least one schedule");
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    if (!formState.startDate || !formState.endDate) return;

    const success = await submitBatch({
      class_id: formState.selectedClass!.id,
      teacher_id: formState.selectedTeacher!.id,
      name: formState.batchName,
      total_seat: Number(formState.totalSeat),
      start_date: format(formState.startDate, "yyyy-MM-dd"),
      end_date: format(formState.endDate, "yyyy-MM-dd"),
      zoom_link: formState.zoomLink,
      status: formState.status,
      schedules: selectedSchedules,
    });

    if (success) {
      resetForm();
      resetAvailability();
      setSelectedSchedules([]);
      setShowConfirmModal(false);
      router.push("/dashboard/batches");
    }
  };

  if (isClassLoading || isTeacherLoading)
    return (
      <div className="h-[calc(100vh-155px)] w-full flex justify-center items-center">
        <Loader />
      </div>
    );

  return (
    <div className="max-w-350 mx-auto  space-y-6 sm:space-y-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
      >
        <ChevronsLeft className="w-4 h-4" />
        <span>Back to Batches</span>
      </button>
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
        Create New Batch
      </h1>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        <BatchDetailsForm
          batchName={formState.batchName}
          totalSeat={formState.totalSeat}
          startDate={formState.startDate}
          endDate={formState.endDate}
          zoomLink={formState.zoomLink}
          status={formState.status}
          onBatchNameChange={(value) => updateFormState({ batchName: value })}
          onTotalSeatChange={(value) => updateFormState({ totalSeat: value })}
          onStartDateChange={(date) => updateFormState({ startDate: date })}
          onEndDateChange={(date) => updateFormState({ endDate: date })}
          onZoomLinkChange={(value) => updateFormState({ zoomLink: value })}
          onStatusChange={(value) => updateFormState({ status: value })}
        />

        <ClassTeacherSelection
          selectedClass={formState.selectedClass}
          selectedTeacher={formState.selectedTeacher}
          classList={classList}
          teachersList={teachersList}
          onClassSelect={(cls) => updateFormState({ selectedClass: cls })}
          onTeacherSelect={(teacher) =>
            updateFormState({ selectedTeacher: teacher })
          }
          onGetAvailability={handleGetAvailability}
          isLoading={isAvailabilityLoading}
          isDisabled={
            !formState.selectedTeacher ||
            !formState.startDate ||
            !formState.endDate
          }
        />

        {availability.length > 0 && (
          <ScheduleSelection
            availability={availability}
            selectedSchedules={selectedSchedules}
            startDate={formState.startDate!}
            endDate={formState.endDate!}
            onToggleSchedule={handleToggleSchedule}
          />
        )}

        <div className="flex justify-end">
          <MyButton
            type="button"
            onClick={prepareSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Batch"}
          </MyButton>
        </div>
      </form>

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        type="info"
        title="Create Batch"
        message={`Are you sure you want to create batch "${formState.batchName}" with ${selectedSchedules.length} schedule(s)?`}
        onConfirm={handleConfirmSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default CreateBatch;
