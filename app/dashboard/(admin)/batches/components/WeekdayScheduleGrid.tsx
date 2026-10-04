import React from "react";
import { format } from "date-fns";
import { Slot } from "@/types/batches";
import { ConsistencyDetail } from "../hooks/useConsistencyCheck";
import { weekdayLabels } from "@/utils/batchUtils";

interface WeekdayScheduleGridProps {
  availabilityByWeekday: Record<number, { date: string; slots: Slot[] }[]>;
  selectedSchedules: { day_of_week: string; start_time: string }[];
  consistencyDetails: Map<number, ConsistencyDetail>;
  isConsistentAcrossWeeks: (day: number, startTime: string) => boolean;
  findConsistentDateRange: (day: number, startTime: string) => { start: Date | null; end: Date | null };
  onToggleSchedule: (day: number, startTime: string) => void;
}

export const WeekdayScheduleGrid: React.FC<WeekdayScheduleGridProps> = ({
  availabilityByWeekday,
  selectedSchedules,
  consistencyDetails,
  isConsistentAcrossWeeks,
  findConsistentDateRange,
  onToggleSchedule,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[0, 1, 2, 3, 4, 5, 6].map((day) => {
        const occurrences = availabilityByWeekday[day];
        const hasNoSlots =
          !occurrences ||
          occurrences.length === 0 ||
          occurrences.every((occ) => occ.slots.length === 0);

        if (hasNoSlots) {
          return (
            <div key={day} className="border rounded-lg p-3 bg-gray-50">
              <h3 className="font-medium text-gray-700">{weekdayLabels[day]}</h3>
              <div className="mt-3 text-center py-4">
                <p className="text-sm text-gray-400">No available slots</p>
              </div>
            </div>
          );
        }

        const allStartTimes = new Set<string>();
        occurrences.forEach((occ) => {
          occ.slots.forEach((slot) => {
            allStartTimes.add(slot.start_time.slice(0, 5));
          });
        });
        const startTimes = Array.from(allStartTimes).sort();
        const selected = selectedSchedules.find((s) => s.day_of_week === day.toString());
        const dayConsistency = consistencyDetails.get(day);

        return (
          <div key={day} className="border rounded-lg p-3">
            <h3 className="font-semibold text-gray-800 mb-2">
              {weekdayLabels[day]}
              {!dayConsistency?.isConsistent && (
                <span className="ml-2 text-xs text-yellow-600">⚠ Partial</span>
              )}
            </h3>
            <div className="space-y-2">
              {startTimes.map((time) => {
                const isSelected = selected?.start_time === time;
                const consistent = isConsistentAcrossWeeks(day, time + ":00");
                const consistentRange = findConsistentDateRange(day, time + ":00");

                return (
                  <button
                    key={time}
                    type="button"
                    onClick={() => onToggleSchedule(day, time + ":00")}
                    disabled={!consistent && !isSelected}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 relative group ${
                      isSelected
                        ? "bg-primary text-white hover:bg-primary/90"
                        : consistent
                        ? "bg-green-50 hover:bg-green-100 text-gray-800 border border-green-200"
                        : consistentRange.start
                        ? "bg-yellow-50 hover:bg-yellow-100 text-gray-800 border border-yellow-200 cursor-pointer"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{time}</span>
                      {!consistent && consistentRange.start && (
                        <span className="text-xs text-yellow-600">partial</span>
                      )}
                    </div>

                    {!consistent && consistentRange.start && (
                      <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-10">
                        <div className="bg-gray-900 text-white text-xs rounded-lg py-1 px-2 whitespace-nowrap">
                          Available from {format(consistentRange.start, "MMM d")} to{" "}
                          {format(consistentRange.end!, "MMM d")}
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};