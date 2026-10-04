import React from "react";
import { convertUtcScheduleToLocal } from "@/src/utils/timezone";

interface SelectedSchedulesSummaryProps {
  selectedSchedules: { day_of_week: string; start_time: string }[];
  weekdayLabels: Record<number, string>;
  referenceTimezone?: string;
  referenceLabel?: string;
}

export const SelectedSchedulesSummary: React.FC<SelectedSchedulesSummaryProps> = ({
  selectedSchedules,
  weekdayLabels,
  referenceTimezone,
  referenceLabel,
}) => {
  if (selectedSchedules.length === 0) return null;

  return (
    <div className="mt-4 p-3.5 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/20">
      <h3 className="text-sm font-semibold mb-2 text-gray-800 dark:text-gray-200">
        Selected Schedules:
      </h3>
      <div className="flex flex-wrap gap-2">
        {selectedSchedules.map((sch) => {
          const dayNum = Number(sch.day_of_week);
          const converted = convertUtcScheduleToLocal(
            dayNum,
            sch.start_time,
            undefined,
            referenceTimezone
          );
          const isDifferentDay = converted.dayOfWeek !== dayNum;
          const dayPrefix = isDifferentDay ? `${converted.day.slice(0, 3)} ` : "";
          const refLabelStr = referenceLabel ? ` ${referenceLabel}` : "";

          return (
            <span
              key={sch.day_of_week}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 border border-primary/20 rounded-lg text-sm shadow-2xs"
            >
              <span className="font-medium text-gray-900 dark:text-white">
                {weekdayLabels[dayNum]} at {sch.start_time}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                UTC
              </span>
              <span className="text-xs text-primary font-medium">
                ({dayPrefix}{converted.timeString}{refLabelStr})
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
};
