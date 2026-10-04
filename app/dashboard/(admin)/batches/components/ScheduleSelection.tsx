import React from "react";
import { format } from "date-fns";

import { AvailabilityItem, Slot } from "@/types/batches";

// Utils
import { useConsistencyCheck } from "../hooks/useConsistencyCheck";
import { ConsistencyOverview } from "./ConsistencyOverview";
import { WeekdayScheduleGrid } from "./WeekdayScheduleGrid";
import { SelectedSchedulesSummary } from "./SelectedSchedulesSummary";
import { weekdayLabels } from "@/utils/batchUtils";

interface ScheduleSelectionProps {
  availability: AvailabilityItem[];
  selectedSchedules: { day_of_week: string; start_time: string }[];
  startDate: Date;
  endDate: Date;
  onToggleSchedule: (day: number, startTime: string) => void;
}

export const ScheduleSelection: React.FC<ScheduleSelectionProps> = ({
  availability,
  selectedSchedules,
  startDate,
  endDate,
  onToggleSchedule,
}) => {
  // Group availability by weekday
  const availabilityByWeekday: Record<number, { date: string; slots: Slot[] }[]> = {};
  availability.forEach((item) => {
    if (!availabilityByWeekday[item.day]) availabilityByWeekday[item.day] = [];
    availabilityByWeekday[item.day].push({
      date: item.date,
      slots: item.slots,
    });
  });

  const { consistencyDetails, isConsistentAcrossWeeks, findConsistentDateRange } =
    useConsistencyCheck(availability, startDate, endDate);

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 space-y-4">
      <h2 className="text-lg font-semibold">Select Schedules</h2>
      <p className="text-sm text-gray-500">
        Choose a weekday and a start time. The teacher must be available
        on <strong>every</strong> occurrence of that weekday within the date range.
        {startDate && endDate && (
          <span className="block mt-1 text-xs text-primary">
            Date range: {format(startDate, "PPP")} – {format(endDate, "PPP")}
          </span>
        )}
      </p>

      <ConsistencyOverview consistencyDetails={consistencyDetails} />

      <WeekdayScheduleGrid
        availabilityByWeekday={availabilityByWeekday}
        selectedSchedules={selectedSchedules}
        consistencyDetails={consistencyDetails}
        isConsistentAcrossWeeks={isConsistentAcrossWeeks}
        findConsistentDateRange={findConsistentDateRange}
        onToggleSchedule={onToggleSchedule}
      />

      <SelectedSchedulesSummary
        selectedSchedules={selectedSchedules}
        weekdayLabels={weekdayLabels}
      />
    </div>
  );
};