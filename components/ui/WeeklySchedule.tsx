"use client";
import React, { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import { convertUtcScheduleToLocal } from "@/src/utils/timezone";

interface BatchSchedule {
  id: number;
  batch_id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
}

interface WeeklyScheduleProps {
  schedules: BatchSchedule[] | undefined;
  teacherTimezone?: string;
}

const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({ schedules }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!schedules || schedules.length === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500 bg-primary/5 p-3 rounded-xl">
        <Calendar className="w-4 h-4 text-primary" />
        <span>No weekly schedule available.</span>
      </div>
    );
  }

  // Convert each schedule from UTC to local user timezone
  const formattedSchedules = schedules.map((schedule) => {
    const parts = convertUtcScheduleToLocal(
      schedule.day_of_week,
      schedule.start_time,
      schedule.end_time,
    );

    return {
      id: schedule.id,
      day: parts.day,
      day_of_week: parts.dayOfWeek,
      timeRange: parts.timeString,
    };
  });

  // Sort by local day of week (Sunday = 0 to Saturday = 6)
  formattedSchedules.sort((a, b) => a.day_of_week - b.day_of_week);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center">
          <Calendar className="w-3.5 h-3.5 text-primary" />
        </div>
        <span>Weekly Schedule</span>
      </div>

      {/* Schedule Cards */}
      <div className="grid grid-cols-3 gap-2">
        {formattedSchedules.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-primary/20 rounded-lg overflow-hidden shadow-xs"
          >
            {/* Day Header */}
            <div className="bg-linear-to-r from-primary/10 to-primary/20 px-2 py-1.5 text-center">
              <span className="text-xs font-semibold text-primary">
                {item.day}
              </span>
            </div>

            {/* Time Display */}
            <div className="p-1 text-center">
              <span className="text-[10px] xl:text-xs font-medium text-gray-700 whitespace-nowrap">
                {item.timeRange}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklySchedule;
