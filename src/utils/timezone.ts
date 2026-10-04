import { DateTime } from "luxon";

/**
 * Get the student's local timezone
 */
export const getStudentTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

/**
 * Convert a schedule from teacher's timezone to student's local timezone
 * @param teacherTimezone - The teacher's timezone (e.g., "Asia/Kolkata")
 * @param dayOfWeek - Day of week (0-6, where 0 is Sunday)
 * @param startTime - Start time in HH:mm:ss format (e.g., "09:00:00")
 * @param endTime - End time in HH:mm:ss format (e.g., "09:30:00")
 * @returns Object with converted day, startTime, and endTime
 */
export const convertScheduleToLocal = (
  teacherTimezone: string,
  dayOfWeek: number,
  startTime: string,
  endTime: string
): { day: string; startTime: string; endTime: string; timeString: string } => {
  const studentTimezone = getStudentTimezone();

  // Get current date in teacher's timezone to establish the week
  const nowInTeacherTz = DateTime.now().setZone(teacherTimezone);
  
  // Find the Sunday of the current week in teacher's timezone
  const currentDayOfWeek = nowInTeacherTz.weekday % 7; // 0 = Sunday in our system
  const daysUntilSunday = currentDayOfWeek;
  const sundayInTeacherTz = nowInTeacherTz.minus({ days: daysUntilSunday });
  
  // Calculate the target date in teacher's timezone
  const targetDateInTeacherTz = sundayInTeacherTz.plus({ days: dayOfWeek });
  
  // Parse start and end times
  const [startHours, startMinutes, startSeconds] = startTime.split(":").map(Number);
  const [endHours, endMinutes, endSeconds] = endTime.split(":").map(Number);
  
  // Create DateTime objects for start and end times in teacher's timezone
  const startDateTimeInTeacherTz = targetDateInTeacherTz.set({
    hour: startHours,
    minute: startMinutes,
    second: startSeconds || 0,
  });
  
  const endDateTimeInTeacherTz = targetDateInTeacherTz.set({
    hour: endHours,
    minute: endMinutes,
    second: endSeconds || 0,
  });
  
  // Convert to student's timezone
  const startDateTimeInStudentTz = startDateTimeInTeacherTz.setZone(studentTimezone);
  const endDateTimeInStudentTz = endDateTimeInTeacherTz.setZone(studentTimezone);
  
  // Get day names
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  
  // Format times in 12-hour format with AM/PM
  const formatTime12Hour = (dateTime: DateTime): string => {
    const hour = dateTime.hour;
    const minute = dateTime.minute;
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`;
  };

  // formatTime12Hour already includes AM/PM, so just join with a dash
  const timeString = `${formatTime12Hour(startDateTimeInStudentTz)} - ${formatTime12Hour(endDateTimeInStudentTz)}`;
  
  return {
    day: days[startDateTimeInStudentTz.weekday % 7],
    startTime: formatTime12Hour(startDateTimeInStudentTz),
    endTime: formatTime12Hour(endDateTimeInStudentTz),
    timeString: timeString,
  };
};

/**
 * Format a schedule for display in the student's local timezone
 * @param teacherTimezone - The teacher's timezone
 * @param dayOfWeek - Day of week (0-6, where 0 is Sunday)
 * @param startTime - Start time in HH:mm:ss format
 * @param endTime - End time in HH:mm:ss format
 * @returns Formatted string like "Saturday 11:30 PM - 12:00 AM"
 */
export const formatLocalSchedule = (
  teacherTimezone: string,
  dayOfWeek: number,
  startTime: string,
  endTime: string
): string => {
  const converted = convertScheduleToLocal(
    teacherTimezone,
    dayOfWeek,
    startTime,
    endTime
  );
  
  return converted.timeString;
};

/**
 * Get day and time range for a schedule in student's local timezone
 * @param teacherTimezone - The teacher's timezone
 * @param dayOfWeek - Day of week (0-6, where 0 is Sunday)
 * @param startTime - Start time in HH:mm:ss format
 * @param endTime - End time in HH:mm:ss format
 * @returns Object with day, startTime, and endTime separately
 */
export const getLocalScheduleParts = (
  teacherTimezone: string,
  dayOfWeek: number,
  startTime: string,
  endTime: string
): { day: string; startTime: string; endTime: string } => {
  return convertScheduleToLocal(teacherTimezone, dayOfWeek, startTime, endTime);
};