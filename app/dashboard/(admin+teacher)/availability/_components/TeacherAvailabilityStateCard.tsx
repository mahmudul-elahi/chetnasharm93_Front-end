import { DaySchedule } from "@/types/dashboard";
import { Calendar, Clock } from "lucide-react";
import React, { useMemo } from "react";

const TeacherAvailabilityStateCard = ({
  weeklySchedule,
}: {
  weeklySchedule: DaySchedule[];
}) => {
  // Calculate statistics from weeklySchedule
  const stats = useMemo(() => {
    let totalMinutes = 0;
    let totalSlots = 0;
    let activeDays = 0;

    weeklySchedule?.forEach((day) => {
      const slotsCount = day?.slots?.length || 0;
      if (slotsCount > 0) {
        activeDays++;
        totalSlots += slotsCount;
        
        // Calculate total minutes from slots
        day?.slots?.forEach((slot) => {
          if (slot.start_time && slot.end_time) {
            const [startHours, startMinutes] = slot.start_time.split(":").map(Number);
            const [endHours, endMinutes] = slot.end_time.split(":").map(Number);
            const startTotal = startHours * 60 + startMinutes;
            const endTotal = endHours * 60 + endMinutes;
            totalMinutes += endTotal - startTotal;
          }
        });
      }
    });

    const totalHours = (totalMinutes / 60).toFixed(1);
    const avgSlotsPerDay = (totalSlots / 7).toFixed(2);

    return {
      totalHours,
      totalSlots,
      activeDays,
      avgSlotsPerDay,
    };
  }, [weeklySchedule]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Hours/Week
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.totalHours}h
            </p>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
            <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Slots
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.totalSlots}
            </p>
          </div>
          <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
            <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Active Days
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.activeDays}/{7}
            </p>
          </div>
          <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
            <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Avg Slots/Day
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.avgSlotsPerDay}
            </p>
          </div>
          <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full">
            <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherAvailabilityStateCard;