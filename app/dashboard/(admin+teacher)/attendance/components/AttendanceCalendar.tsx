"use client";
import React, { useState } from "react";
import { CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { ActionButton } from "@/components/ui/ActionButton";

interface AttendanceData {
  date: string;
  has_status: number;
}

interface AttendanceCalendarProps {
  attendanceData: AttendanceData[];
  currentDate: Date;
  onUpdateAttendance: (date: string) => void;
  isLoading: boolean;
}

const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({
  attendanceData,
  currentDate,
  onUpdateAttendance,
  isLoading,
}) => {
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const getAttendanceForDate = (date: string) => {
    return attendanceData.find((item) => item.date === date);
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const today = new Date().toISOString().split("T")[0];

    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 md:h-28 lg:h-32" />);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const attendance = getAttendanceForDate(dateStr);
      const hasStatus = attendance?.has_status === 1;
      const isToday = dateStr === today;
      const isHovered = hoveredDate === dateStr;

      days.push(
        <div
          key={dateStr}
          onMouseEnter={() => setHoveredDate(dateStr)}
          onMouseLeave={() => setHoveredDate(null)}
          className={`
            relative h-24 md:h-28 lg:h-32 
            border rounded-lg p-2 
            transition-all duration-200
            ${
              hasStatus
                ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                : "bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800"
            }
            ${isHovered && !isLoading ? "shadow-md scale-[1.02] z-10" : ""}
            ${isHovered && hasStatus ? "border-green-400" : ""}
            ${isHovered && !hasStatus ? "border-gray-400" : ""}
            ${isToday ? "ring-2 ring-primary" : ""}
            ${isLoading ? "cursor-wait" : "cursor-pointer"}
          `}
        >
          {/* Date Number */}
          <div className="flex justify-between items-start">
            <span
              className={`
                text-sm md:text-base lg:text-xl xl:text-2xl font-semibold
                ${isToday ? "text-primary text-base" : "text-gray-700 dark:text-gray-300"}
              `}
            >
              {day}
            </span>

            {/* Status Icon with Individual Tooltip */}
            <div className="relative">
              {hasStatus ? (
                <div
                  className="relative"
                  onMouseEnter={(e) => {
                    const tooltip = e.currentTarget.querySelector(".tooltip");
                    if (tooltip) tooltip.classList.add("opacity-100");
                  }}
                  onMouseLeave={(e) => {
                    const tooltip = e.currentTarget.querySelector(".tooltip");
                    if (tooltip) tooltip.classList.remove("opacity-100");
                  }}
                >
                  <CheckCircle
                    size={18}
                    className="text-green-600 dark:text-green-400 cursor-help"
                  />
                  <div className="tooltip absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    Attendance has been taken for this day
                  </div>
                </div>
              ) : (
                <div
                  className="relative"
                  onMouseEnter={(e) => {
                    const tooltip = e.currentTarget.querySelector(".tooltip");
                    if (tooltip) tooltip.classList.add("opacity-100");
                  }}
                  onMouseLeave={(e) => {
                    const tooltip = e.currentTarget.querySelector(".tooltip");
                    if (tooltip) tooltip.classList.remove("opacity-100");
                  }}
                >
                  <XCircle
                    size={18}
                    className="text-gray-500 dark:text-gray-400 cursor-help"
                  />
                  <div className="tooltip absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    No attendance taken for this day
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="absolute bottom-2 right-2">
            <ActionButton
              variant={hasStatus ? "edit" : "primary"}
              icon={RefreshCw}
              size="sm"
              onClick={() => onUpdateAttendance(dateStr)}
              label="Update Attendance"
              showText={false}
            />
          </div>

          {/* Hover hint text */}
          {!isHovered && !isLoading && (
            <div className="absolute bottom-2 left-2 opacity-0 transition-opacity">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Hover to update
              </span>
            </div>
          )}
        </div>,
      );
    }

    return days;
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-4 overflow-x-auto">
      <div className="min-w-162.5">
        {/* Week Days Header */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center font-semibold text-gray-700 dark:text-gray-300 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">{renderCalendar()}</div>
      </div>
    </div>
  );
};

export default AttendanceCalendar;
