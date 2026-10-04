import React, { useState, useEffect } from "react";
import { format } from "date-fns";

import { AvailabilityItem, Slot } from "@/types/batches";

// Utils & Components
import { useConsistencyCheck } from "../hooks/useConsistencyCheck";
import { ConsistencyOverview } from "./ConsistencyOverview";
import { WeekdayScheduleGrid } from "./WeekdayScheduleGrid";
import { SelectedSchedulesSummary } from "./SelectedSchedulesSummary";
import {
  ScheduleReferenceTimezone,
  getCountryShortCode,
} from "./ScheduleReferenceTimezone";
import { weekdayLabels } from "@/utils/batchUtils";
import { getCountryForTimezone } from "countries-and-timezones";

interface ScheduleSelectionProps {
  availability: AvailabilityItem[];
  selectedSchedules: { day_of_week: string; start_time: string }[];
  startDate: Date;
  endDate: Date;
  onToggleSchedule: (day: number, startTime: string) => void;
  teacherTimezone?: string;
  teacherCountry?: string;
  teacherName?: string;
}

export const ScheduleSelection: React.FC<ScheduleSelectionProps> = ({
  availability,
  selectedSchedules,
  startDate,
  endDate,
  onToggleSchedule,
  teacherTimezone,
  teacherCountry,
  teacherName,
}) => {
  // Reference country & timezone preview state
  const [selectedCountry, setSelectedCountry] = useState("IN");
  const [selectedTimezone, setSelectedTimezone] = useState("Asia/Kolkata");
  const [userLocalCountryCode, setUserLocalCountryCode] = useState("BD");
  const [userLocalTz, setUserLocalTz] = useState("Asia/Dhaka");

  // Detect user local timezone on mount
  useEffect(() => {
    try {
      const local = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
      setUserLocalTz(local);
      const country = getCountryForTimezone(local);
      if (country) {
        setUserLocalCountryCode(country.id);
        // If no teacher timezone is specified, default to visitor's local
        if (!teacherTimezone) {
          setSelectedCountry(country.id);
          setSelectedTimezone(local);
        }
      }
    } catch {
      // Keep defaults
    }
  }, [teacherTimezone]);

  // When teacher is selected or changes, auto-select teacher's timezone
  useEffect(() => {
    if (teacherTimezone) {
      setSelectedTimezone(teacherTimezone);
      const resolvedCountry =
        teacherCountry || getCountryForTimezone(teacherTimezone)?.id;
      if (resolvedCountry) {
        setSelectedCountry(resolvedCountry);
      }
    }
  }, [teacherTimezone, teacherCountry]);

  const handleCountryChange = (countryCode: string, primaryTz: string) => {
    setSelectedCountry(countryCode);
    setSelectedTimezone(primaryTz);
  };

  const handleTimezoneChange = (timezone: string) => {
    setSelectedTimezone(timezone);
  };

  const handleResetToLocal = () => {
    const country = getCountryForTimezone(userLocalTz);
    setSelectedCountry(country?.id || "IN");
    setSelectedTimezone(userLocalTz);
  };

  const handleResetToTeacher = () => {
    if (teacherTimezone) {
      setSelectedTimezone(teacherTimezone);
      const resolvedCountry =
        teacherCountry || getCountryForTimezone(teacherTimezone)?.id;
      if (resolvedCountry) {
        setSelectedCountry(resolvedCountry);
      }
    }
  };

  const teacherCountryCode =
    teacherCountry ||
    (teacherTimezone ? getCountryForTimezone(teacherTimezone)?.id : undefined);

  const referenceLabel = getCountryShortCode(selectedCountry);

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
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 sm:p-6 space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Select Schedules
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Choose a weekday and a start time. The teacher must be available
          on <strong>every</strong> occurrence of that weekday within the date range.
          {startDate && endDate && (
            <span className="block mt-1 text-xs text-primary font-medium">
              Date range: {format(startDate, "PPP")} – {format(endDate, "PPP")}
            </span>
          )}
        </p>
      </div>

      {/* UTC Schedule Notice & Reference Timezone Selector */}
      <ScheduleReferenceTimezone
        selectedCountry={selectedCountry}
        selectedTimezone={selectedTimezone}
        onCountryChange={handleCountryChange}
        onTimezoneChange={handleTimezoneChange}
        onResetToLocal={handleResetToLocal}
        onResetToTeacher={teacherTimezone ? handleResetToTeacher : undefined}
        userLocalCountryCode={userLocalCountryCode}
        teacherTimezone={teacherTimezone}
        teacherCountryCode={teacherCountryCode}
        teacherName={teacherName}
      />

      <ConsistencyOverview consistencyDetails={consistencyDetails} />

      <WeekdayScheduleGrid
        availabilityByWeekday={availabilityByWeekday}
        selectedSchedules={selectedSchedules}
        consistencyDetails={consistencyDetails}
        isConsistentAcrossWeeks={isConsistentAcrossWeeks}
        findConsistentDateRange={findConsistentDateRange}
        onToggleSchedule={onToggleSchedule}
        referenceTimezone={selectedTimezone}
        referenceLabel={referenceLabel}
      />

      <SelectedSchedulesSummary
        selectedSchedules={selectedSchedules}
        weekdayLabels={weekdayLabels}
        referenceTimezone={selectedTimezone}
        referenceLabel={referenceLabel}
      />
    </div>
  );
};
