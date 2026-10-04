import { useState, useEffect } from "react";
import { format } from "date-fns";
import { AvailabilityItem } from "@/types/batches";
import { formatTime, getDatesInRange } from "@/utils/batchUtils";

export interface ConsistencyDetail {
  isConsistent: boolean;
  consistentStartDate?: Date;
  consistentEndDate?: Date;
  availableSlots?: string[];
  gapMessage?: string;
}

export const useConsistencyCheck = (
  availability: AvailabilityItem[],
  startDate: Date,
  endDate: Date
) => {
  const [consistencyDetails, setConsistencyDetails] = useState<
    Map<number, ConsistencyDetail>
  >(new Map());

  const isConsistentAcrossWeeks = (day: number, startTime: string): boolean => {
    if (!startDate || !endDate) return false;

    const targetTime = formatTime(startTime);
    const datesInRange = getDatesInRange(startDate, endDate);
    const weekdayDates = datesInRange.filter((d) => d.getDay() === day);

    if (weekdayDates.length === 0) return false;

    for (const date of weekdayDates) {
      const dateStr = format(date, "yyyy-MM-dd");
      const dayAvailability = availability.find((item) => item.date === dateStr);
      if (!dayAvailability) return false;
      const hasSlot = dayAvailability.slots.some(
        (slot) => formatTime(slot.start_time) === targetTime
      );
      if (!hasSlot) return false;
    }
    return true;
  };

  const findConsistentDateRange = (
    day: number,
    startTime: string
  ): { start: Date | null; end: Date | null } => {
    if (!startDate || !endDate) return { start: null, end: null };

    const targetTime = formatTime(startTime);
    const datesInRange = getDatesInRange(startDate, endDate);
    const weekdayDates = datesInRange.filter((d) => d.getDay() === day);

    if (weekdayDates.length === 0) return { start: null, end: null };

    let consistentStart: Date | null = null;
    let consistentEnd: Date | null = null;
    let currentStart: Date | null = null;
    let lastConsistentDate: Date | null = null;

    for (let i = 0; i < weekdayDates.length; i++) {
      const date = weekdayDates[i];
      const dateStr = format(date, "yyyy-MM-dd");
      const dayAvailability = availability.find((item) => item.date === dateStr);
      const hasSlot = dayAvailability?.slots.some(
        (slot) => formatTime(slot.start_time) === targetTime
      );

      if (hasSlot) {
        if (currentStart === null) currentStart = date;
        lastConsistentDate = date;
      } else {
        if (currentStart !== null && lastConsistentDate !== null) {
          if (!consistentStart || (lastConsistentDate > consistentEnd!)) {
            consistentStart = currentStart;
            consistentEnd = lastConsistentDate;
          }
        }
        currentStart = null;
        lastConsistentDate = null;
      }
    }

    if (currentStart !== null && lastConsistentDate !== null) {
      if (!consistentStart || (lastConsistentDate > consistentEnd!)) {
        consistentStart = currentStart;
        consistentEnd = lastConsistentDate;
      }
    }

    return { start: consistentStart, end: consistentEnd };
  };

  useEffect(() => {
    if (!availability.length || !startDate || !endDate) return;

    const newConsistencyDetails = new Map<number, ConsistencyDetail>();

    for (let day = 0; day <= 6; day++) {
      const datesInRange = getDatesInRange(startDate, endDate);
      const weekdayDates = datesInRange.filter((d) => d.getDay() === day);

      if (weekdayDates.length === 0) {
        newConsistencyDetails.set(day, {
          isConsistent: false,
          gapMessage: `No ${getWeekdayName(day)}s in the selected date range`,
        });
        continue;
      }

      let commonSlots: string[] | null = null;
      const availabilityByDate: Map<string, string[]> = new Map();

      for (const date of weekdayDates) {
        const dateStr = format(date, "yyyy-MM-dd");
        const dayAvail = availability.find((a) => a.date === dateStr);
        const slotsOnDate =
          dayAvail?.slots.map((s) => formatTime(s.start_time)) || [];
        availabilityByDate.set(dateStr, slotsOnDate);

        if (commonSlots === null) {
          commonSlots = slotsOnDate;
        } else {
          commonSlots = commonSlots.filter((t) => slotsOnDate.includes(t));
        }
      }

      const hasConsistentSlots = (commonSlots?.length || 0) > 0;

      // Find longest consistent streak
      let longestStreak = {
        start: null as Date | null,
        end: null as Date | null,
        length: 0,
      };

      for (const slot of commonSlots || []) {
        let currentStreakStart: Date | null = null;
        let lastDate: Date | null = null;

        for (let i = 0; i < weekdayDates.length; i++) {
          const date = weekdayDates[i];
          const dateStr = format(date, "yyyy-MM-dd");
          const slots = availabilityByDate.get(dateStr) || [];
          const hasSlot = slots.includes(slot);

          if (hasSlot) {
            if (currentStreakStart === null) currentStreakStart = date;
            lastDate = date;
          } else {
            if (currentStreakStart !== null && lastDate !== null) {
              const streakLength = Math.ceil(
                (lastDate.getTime() - currentStreakStart.getTime()) /
                  (1000 * 60 * 60 * 24 * 7)
              );
              if (streakLength > longestStreak.length) {
                longestStreak = {
                  start: currentStreakStart,
                  end: lastDate,
                  length: streakLength,
                };
              }
            }
            currentStreakStart = null;
            lastDate = null;
          }
        }

        if (currentStreakStart !== null && lastDate !== null) {
          const streakLength = Math.ceil(
            (lastDate.getTime() - currentStreakStart.getTime()) /
              (1000 * 60 * 60 * 24 * 7)
          );
          if (streakLength > longestStreak.length) {
            longestStreak = {
              start: currentStreakStart,
              end: lastDate,
              length: streakLength,
            };
          }
        }
      }

      let gapMessage = "";
      if (!hasConsistentSlots && commonSlots && commonSlots.length === 0) {
        gapMessage = `No consistent time slot available for all ${getWeekdayName(
          day
        )}s in the date range`;
      } else if (!hasConsistentSlots && longestStreak.start && longestStreak.end) {
        const totalWeeks = Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 7)
        );
        gapMessage = `Teacher is available for ${longestStreak.length} out of ${totalWeeks} weeks`;
      }

      newConsistencyDetails.set(day, {
        isConsistent: hasConsistentSlots,
        consistentStartDate: longestStreak.start || undefined,
        consistentEndDate: longestStreak.end || undefined,
        availableSlots: commonSlots || [],
        gapMessage: gapMessage || undefined,
      });
    }

    setConsistencyDetails(newConsistencyDetails);
  }, [availability, startDate, endDate]);

  return {
    consistencyDetails,
    isConsistentAcrossWeeks,
    findConsistentDateRange,
  };
};

const getWeekdayName = (day: number): string => {
  const labels = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return labels[day];
};