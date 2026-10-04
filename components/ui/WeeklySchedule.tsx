"use client";
import React from "react";
import { Calendar } from "lucide-react";
import { getLocalScheduleParts } from "@/src/utils/timezone";

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

const DAY_ABBREVIATIONS: { [key: string]: string } = {
  Sunday: "Sun",
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
};

const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({
  schedules,
  teacherTimezone,
}) => {
  if (!schedules || schedules.length === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500 bg-primary/5 p-3 rounded-xl">
        <Calendar className="w-4 h-4 text-primary" />
        <span>No weekly schedule available.</span>
      </div>
    );
  }

  // Sort schedules by day of week (Sunday to Saturday)
  const sortedSchedules = [...schedules].sort(
    (a, b) => a.day_of_week - b.day_of_week,
  );

  const timezone = teacherTimezone || "UTC";

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
        {sortedSchedules.map((schedule) => {
          const scheduleParts = getLocalScheduleParts(
            timezone,
            schedule.day_of_week,
            schedule.start_time,
            schedule.end_time,
          );

          const day = scheduleParts.day;

          // Remove AM/PM from times
          const startTimeClean = scheduleParts.startTime.replace(
            / (AM|PM)/,
            "",
          );
          const endTimeClean = scheduleParts.endTime.replace(/ (AM|PM)/, "");

          // Get AM/PM for start and end times
          const startHour = parseInt(scheduleParts.startTime.split(":")[0]);
          const endHour = parseInt(scheduleParts.endTime.split(":")[0]);
          const startAMPM = startHour >= 12 ? "PM" : "AM";
          const endAMPM = endHour >= 12 ? "PM" : "AM";

          // Format time with smart AM/PM display
          const timeRange =
            startAMPM === endAMPM
              ? `${startTimeClean} - ${endTimeClean} ${startAMPM}`
              : `${startTimeClean} ${startAMPM} - ${endTimeClean} ${endAMPM}`;

          return (
            <div
              key={schedule.id}
              className=" bg-white border border-primary/20 rounded-lg overflow-hidden"
            >
              {/* Day Header */}
              <div className="bg-linear-to-r from-primary/10 to-primary/20 px-2 py-1.5 text-center">
                <span className="text-xs font-semibold text-primary">
                  {day}
                </span>
              </div>

              {/* Time Display */}
              <div className="p-1 text-center">
                <span className="text-[10px] xl:text-xs font-medium text-gray-700 whitespace-nowrap">
                  {timeRange}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklySchedule;
