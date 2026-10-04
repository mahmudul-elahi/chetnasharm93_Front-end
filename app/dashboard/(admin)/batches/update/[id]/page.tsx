"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, ChevronsLeft } from "lucide-react";
import Link from "next/link";

// Components
import LoaderComponent from "@/components/ui/Loader";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import MyButton from "@/components/ui/MyButton";

// Hooks
import {
  useGetBatchesForAdminByIdQuery,
  useUpdateBatchForAdminMutation,
} from "@/src/redux/api/admin/adminBatchesApi";
import {
  useGetAllClassesForBatchQuery,
  useGetAllTeachersForBatchQuery,
} from "@/src/redux/api/admin/adminBatchesApi";
import { useLazyGetTeacherAvailabilityForBatchQuery } from "@/src/redux/api/admin/adminBatchesApi";

// Types
import { ClassItem, TeacherItem, AvailabilityItem } from "@/types/batches";

// Utils
import { weekdayLabels } from "@/utils/batchUtils";
import { BatchDetailsForm } from "../components/BatchDetailsForm";
import { ClassTeacherSelection } from "../components/ClassTeacherSelection";
import { ScheduleSelection } from "../components/ScheduleSelection";

interface Schedule {
  id?: number;
  day_of_week: number;
  start_time: string;
  end_time?: string;
}

const UpdateBatchPage = () => {
  const { id } = useParams();
  const router = useRouter();

  // Fetch batch data
  const { data: batchResponse, isLoading: isBatchLoading } =
    useGetBatchesForAdminByIdQuery(Number(id));
  const batchData = batchResponse?.data;

  // Fetch classes and teachers
  const { data: classApiResponse, isLoading: isClassLoading } =
    useGetAllClassesForBatchQuery(null);
  const { data: teachersApiResponse, isLoading: isTeacherLoading } =
    useGetAllTeachersForBatchQuery(null);

  const [updateBatch, { isLoading: isSubmitting }] =
    useUpdateBatchForAdminMutation();
  const [
    getAvailability,
    { data: availabilityData, isLoading: isAvailabilityLoading },
  ] = useLazyGetTeacherAvailabilityForBatchQuery();

  const classList: ClassItem[] = classApiResponse?.data || [];
  const teachersList: TeacherItem[] = teachersApiResponse?.data || [];

  // Form state
  const [formState, setFormState] = useState({
    selectedClass: null as ClassItem | null,
    selectedTeacher: null as TeacherItem | null,
    batchName: "",
    totalSeat: 0,
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    zoomLink: "",
    status: "",
    activeStatus: true,
  });

  const [selectedSchedules, setSelectedSchedules] = useState<
    { day_of_week: string; start_time: string }[]
  >([]);
  const [availability, setAvailability] = useState<AvailabilityItem[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Populate form with batch data when loaded
  useEffect(() => {
    if (batchData && classList.length > 0 && teachersList.length > 0) {
      const foundClass = classList.find((c) => c.id === batchData.class_id);
      const foundTeacher = teachersList.find(
        (t) => t.id === batchData.teacher_id,
      );

      setFormState({
        selectedClass: foundClass || null,
        selectedTeacher: foundTeacher || null,
        batchName: batchData.name,
        totalSeat: batchData.total_seat,
        startDate: batchData.start_date
          ? new Date(batchData.start_date)
          : undefined,
        endDate: batchData.end_date ? new Date(batchData.end_date) : undefined,
        zoomLink: batchData.zoom_link || "",
        status: batchData.status || "upcoming",
        activeStatus: batchData.active_status === 1,
      });

      // Transform schedules to the required format
      if (batchData.schedules && batchData.schedules.length > 0) {
        const transformedSchedules = batchData.schedules.map(
          (schedule: Schedule) => ({
            day_of_week: schedule.day_of_week.toString(),
            start_time: schedule.start_time.slice(0, 5),
          }),
        );
        setSelectedSchedules(transformedSchedules);
      }
    }
  }, [batchData, classList, teachersList]);

  // Fetch availability when teacher & dates are set
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

  // Update availability when API responds
  useEffect(() => {
    if (availabilityData?.data) {
      setAvailability(availabilityData.data);
    }
  }, [availabilityData]);

  // Update form state
  const updateFormState = (updates: Partial<typeof formState>) => {
    setFormState((prev) => ({ ...prev, ...updates }));
  };

  // Handle schedule toggle - this adds/removes schedules from the grid
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

  // Prepare submit
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

    const formattedSchedules = selectedSchedules.map((schedule) => ({
      day_of_week: parseInt(schedule.day_of_week),
      start_time: schedule.start_time,
    }));

    const payload = {
      id: Number(id),
      class_id: formState.selectedClass!.id,
      teacher_id: formState.selectedTeacher!.id,
      name: formState.batchName,
      total_seat: Number(formState.totalSeat),
      start_date: format(formState.startDate, "yyyy-MM-dd"),
      end_date: format(formState.endDate, "yyyy-MM-dd"),
      zoom_link: formState.zoomLink,
      status: formState.status,
      active_status: formState.activeStatus ? 1 : 0,
      schedules: formattedSchedules,
    };

    try {
      await updateBatch(payload).unwrap();
      setShowConfirmModal(false);
      toast.success("Batch updated successfully!");
      router.push("/dashboard/batches");
      router.refresh();
    } catch (error: any) {
      setShowConfirmModal(false);
      console.error("Update error:", error);
      toast.error(error?.data?.message || "Failed to update batch");
    }
  };

  if (isBatchLoading || isClassLoading || isTeacherLoading) {
    return (
      <div className="h-[calc(100vh-150px)] w-full flex justify-center items-center">
        <LoaderComponent />
      </div>
    );
  }

  if (!batchData) {
    return (
      <div className="h-[calc(100vh-150px)] w-full flex flex-col justify-center items-center gap-4">
        <p className="text-gray-500">Batch not found</p>
        <Link href="/dashboard/batches">
          <MyButton>Back to Batches</MyButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer mb-6"
        >
          <ChevronsLeft className="w-4 h-4" />
          <span>Back to Batches</span>
        </button>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Update Batch
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Edit batch details, schedules, and settings
          </p>
        </div>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        <BatchDetailsForm
          batchName={formState.batchName}
          totalSeat={formState.totalSeat}
          startDate={formState.startDate}
          endDate={formState.endDate}
          zoomLink={formState.zoomLink}
          status={formState.status}
          activeStatus={formState.activeStatus}
          onBatchNameChange={(value) => updateFormState({ batchName: value })}
          onTotalSeatChange={(value) => updateFormState({ totalSeat: value })}
          onStartDateChange={(date) => updateFormState({ startDate: date })}
          onEndDateChange={(date) => updateFormState({ endDate: date })}
          onZoomLinkChange={(value) => updateFormState({ zoomLink: value })}
          onStatusChange={(value) => updateFormState({ status: value })}
          onActiveStatusChange={(value) =>
            updateFormState({ activeStatus: value })
          }
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

        {/* Current Schedules - Always visible */}
        {selectedSchedules.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Current Schedules</h2>
              <MyButton
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedSchedules([]);
                  toast.success("All schedules cleared");
                }}
              >
                Clear All
              </MyButton>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedSchedules.map((sch, index) => (
                <div
                  key={index}
                  className="inline-flex items-center gap-2 bg-primary/10 rounded-md px-3 py-1"
                >
                  <span className="text-sm">
                    {weekdayLabels[Number(sch.day_of_week)]} at {sch.start_time}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSchedules((prev) =>
                        prev.filter((_, i) => i !== index),
                      );
                      toast.success(
                        `Removed schedule for ${weekdayLabels[Number(sch.day_of_week)]}`,
                      );
                    }}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-3">
              Click &quot;Get Teacher Availability&quot; to view available time
              slots and add new schedules
            </p>
          </div>
        )}

        {/* Schedule Selection - Shows available time slots when fetched */}
        {availability.length > 0 && (
          <ScheduleSelection
            availability={availability}
            selectedSchedules={selectedSchedules}
            startDate={formState.startDate!}
            endDate={formState.endDate!}
            onToggleSchedule={handleToggleSchedule}
          />
        )}

        {/* Empty state - Only show when no schedules and no availability */}
        {selectedSchedules.length === 0 && availability.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
            <div className="text-center py-6">
              <p className="text-gray-500">No schedules selected</p>
              <p className="text-sm text-gray-400 mt-2">
                Please select a teacher and date range, then click "Get Teacher
                Availability" to add schedules
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Link href="/dashboard/batches">
            <MyButton type="button" variant="secondary">
              Cancel
            </MyButton>
          </Link>
          <MyButton
            type="button"
            onClick={prepareSubmit}
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Batch"}
          </MyButton>
        </div>
      </form>

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        type="info"
        title="Update Batch"
        message={`Are you sure you want to update batch "${formState.batchName}"?`}
        onConfirm={handleConfirmSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default UpdateBatchPage;
