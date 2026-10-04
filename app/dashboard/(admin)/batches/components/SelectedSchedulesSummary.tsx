import React from "react";

interface SelectedSchedulesSummaryProps {
  selectedSchedules: { day_of_week: string; start_time: string }[];
  weekdayLabels: Record<number, string>;
}

export const SelectedSchedulesSummary: React.FC<SelectedSchedulesSummaryProps> = ({
  selectedSchedules,
  weekdayLabels,
}) => {
  if (selectedSchedules.length === 0) return null;

  return (
    <div className="mt-4 p-3 bg-primary/5 rounded-lg">
      <h3 className="text-sm font-semibold mb-2">Selected Schedules:</h3>
      <div className="flex flex-wrap gap-2">
        {selectedSchedules.map((sch) => (
          <span
            key={sch.day_of_week}
            className="inline-flex px-3 py-1 bg-primary/10 rounded-md text-sm"
          >
            {weekdayLabels[Number(sch.day_of_week)]} at {sch.start_time}
          </span>
        ))}
      </div>
    </div>
  );
};