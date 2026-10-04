"use client";
import {
  useAddTeacherAvailabilityMutation,
  useDeleteSingleSlotMutation,
  useGetClassTimeDurationQuery,
  useGetTeacherAvailabilityByIdQuery,
} from "@/src/redux/api/admin+teacher/teacherAvailabilityApi";
import { AlertCircle, Clock, Edit2, Plus, Trash2 } from "lucide-react";
import Loader from "@/components/ui/Loader";
import { useState } from "react";
import TeacherAvailabilityStateCard from "./TeacherAvailabilityStateCard";
import AddTimeSlotModal from "./AddTimeSlotModal";
import UpdateTimeSlotModal from "./UpdateTimeSlotModal";
import { toast } from "sonner";
import { DaySchedule, TimeSlot } from "@/types/dashboard";

const TeacherAvailabilityContent = ({ teacherId }: { teacherId?: number }) => {
  const { data, refetch, isLoading, error } =
    useGetTeacherAvailabilityByIdQuery(teacherId);
  const {
    data: classTimeDuration,
    isLoading: classTimeDurationLoading,
    isError: classTimeDurationError,
  } = useGetClassTimeDurationQuery(null);
  const [deleteSingleSlot, { isLoading: isDeleting }] =
    useDeleteSingleSlotMutation();
  const weeklySchedule: DaySchedule[] = data?.data || [];
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedDayForSlot, setSelectedDayForSlot] = useState<number | null>(
    null,
  );
  const [selectedDayForUpdate, setSelectedDayForUpdate] = useState<
    number | null
  >(null);

  const classTime = classTimeDuration?.class_time;

  // get day
  const getDayName = (dayNumber: number): string => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[dayNumber] || "Unknown";
  };

  // Get slots for a specific day
  const getSlotsForDay = (dayValue: number): TimeSlot[] => {
    const day = weeklySchedule.find((d) => d.day_of_week === dayValue);
    return day?.slots || [];
  };

  // Calculate daily total hours
  const getDailyTotalHours = (slots: TimeSlot[]) => {
    if (!slots || !Array.isArray(slots))
      return { hours: 0, minutes: 0, totalMinutes: 0 };

    let totalMinutes = 0;
    slots.forEach((slot) => {
      if (slot.start_time && slot.end_time) {
        const start = new Date(`2000-01-01 ${slot.start_time}`);
        const end = new Date(`2000-01-01 ${slot.end_time}`);
        totalMinutes += (end.getTime() - start.getTime()) / (1000 * 60);
      }
    });
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return { hours, minutes, totalMinutes };
  };

  // Calculate total hours for display
  const getDayTotalHours = (slots: TimeSlot[]): string => {
    const { hours, minutes, totalMinutes } = getDailyTotalHours(slots);
    return totalMinutes > 0 ? `${hours}h ${minutes}m` : "0h";
  };

  //   slot delete handler
  const handleDeleteSlot = async (slotId: number, dayName: string) => {
    try {
      const result = await deleteSingleSlot(slotId).unwrap();

      if (result.success) {
        toast.success(`Time slot deleted successfully from ${dayName}`);
        refetch();
      } else {
        toast.error(result.message || "Failed to delete time slot");
      }
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || error?.message || "Failed to delete time slot";
      toast.error(errorMessage);
    }
  };

  if (isLoading || classTimeDurationLoading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader />
      </div>
    );

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-red-700 dark:text-red-400">
              Error Loading Data
            </h3>
            <p className="text-red-600 dark:text-red-300 mt-1">
              Failed to load teacher availability
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* state cards */}
      <div>
        <TeacherAvailabilityStateCard weeklySchedule={weeklySchedule} />
      </div>

      {/* weekly schedule */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mt-6">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Weekly Schedule
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage time slots for each day of the week
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
          {/* cards */}
          {weeklySchedule?.map((day: DaySchedule) => {
            const hasSlots = day?.slots && day.slots.length > 0;
            const totalHours = getDayTotalHours(day?.slots || []);

            return (
              <div
                key={day?.day_of_week}
                className={`rounded-lg border transition-all duration-200 ${
                  hasSlots
                    ? "border-primary/30 bg-linear-to-br from-primary/5 to-transparent"
                    : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                }`}
              >
                {/* Day Header */}
                <div className="p-4 border-b border-gray-200 ">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                        {getDayName(day?.day_of_week)}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {day?.slots?.length || 0}{" "}
                        {(day?.slots?.length || 0) === 1 ? "slot" : "slots"}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {/* Edit button for the full day */}
                      <button
                        onClick={() => {
                          setSelectedDayForUpdate(day?.day_of_week);
                          setIsUpdateModalOpen(true);
                        }}
                        className="cursor-pointer p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Edit all slots for this day"
                      >
                        <Edit2 size={16} />
                      </button>
                      {/* Add button for new slot */}
                      <button
                        onClick={() => {
                          setSelectedDayForSlot(day?.day_of_week);
                          setIsAddModalOpen(true);
                        }}
                        className="cursor-pointer p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="Add time slot"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Daily Summary */}
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      Total: {totalHours}
                    </span>
                  </div>
                </div>

                {/* Time Slots - View only */}
                <div className="p-3 space-y-2 min-h-50 max-h-75 overflow-y-auto">
                  {hasSlots ? (
                    day?.slots?.map((slot: TimeSlot) => (
                      <div
                        key={slot.id}
                        className="bg-white  rounded-lg p-2 border border-gray-200 hover:border-primary/30 transition-all duration-100"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm  w-full">
                            <div className="w-1 h-8 bg-primary/30 rounded-full"></div>
                            <div className="flex justify-between items-center flex-1 ">
                              <div>
                                <span className="text-gray-700 dark:text-gray-300 font-medium">
                                  {slot.start_time}
                                </span>
                                <span className="text-gray-400 mx-1">→</span>
                                <span className="text-gray-700 dark:text-gray-300 font-medium">
                                  {slot.end_time}
                                </span>
                              </div>

                              <button
                                onClick={() => {
                                  handleDeleteSlot(
                                    slot.id,
                                    getDayName(day?.day_of_week),
                                  );
                                }}
                                className="cursor-pointer p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                                title="Edit all slots for this day"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">No time slots</p>
                      <button
                        onClick={() => {
                          setSelectedDayForSlot(day?.day_of_week);
                          setIsAddModalOpen(true);
                        }}
                        className="mt-3 text-xs text-primary hover:underline font-medium cursor-pointer"
                      >
                        + Add your first slot
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Modal */}
        {isAddModalOpen && selectedDayForSlot !== null && (
          <AddTimeSlotModal
            isOpen={isAddModalOpen}
            onClose={() => {
              setIsAddModalOpen(false);
              setSelectedDayForSlot(null);
            }}
            teacherId={teacherId || 1}
            dayName={getDayName(selectedDayForSlot)}
            dayValue={selectedDayForSlot}
            classTimeDuration={classTime}
            onSuccess={() => {
              refetch();
            }}
          />
        )}

        {/* Update Modal */}
        {isUpdateModalOpen && selectedDayForUpdate !== null && (
          <UpdateTimeSlotModal
            isOpen={isUpdateModalOpen}
            onClose={() => {
              setIsUpdateModalOpen(false);
              setSelectedDayForUpdate(null);
            }}
            teacherId={teacherId || 1}
            dayName={getDayName(selectedDayForUpdate)}
            dayValue={selectedDayForUpdate}
            classTimeDuration={classTime}
            existingSlots={getSlotsForDay(selectedDayForUpdate)}
            onSuccess={() => {
              refetch();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default TeacherAvailabilityContent;
