import { DateTime } from "luxon";

/**
 * Get the viewer's local timezone dynamically from browser.
 */
export const getLocalTimezone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
};

export const getStudentTimezone = getLocalTimezone;

/**
 * Convert a UTC weekly schedule (day 0-6, HH:mm:ss) into the user's local timezone.
 *
 * @param utcDayOfWeek - 0 (Sunday) to 6 (Saturday) in UTC
 * @param utcStartTime - "HH:mm" or "HH:mm:ss" in UTC
 * @param utcEndTime - "HH:mm" or "HH:mm:ss" in UTC (optional)
 * @param targetTimezone - Target IANA timezone string (optional, defaults to local browser timezone)
 */
export const convertUtcScheduleToLocal = (
  utcDayOfWeek: number,
  utcStartTime: string,
  utcEndTime?: string,
  targetTimezone?: string,
): {
  day: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  timeString: string;
} => {
  const localTz = targetTimezone || getLocalTimezone();
  const [startH, startM, startS = 0] = (utcStartTime || "00:00").split(":").map(Number);

  // 2026-01-04 is a Sunday in UTC
  const safeDay = ((utcDayOfWeek % 7) + 7) % 7;
  const startDate = new Date(Date.UTC(2026, 0, 4 + safeDay, startH, startM, startS));

  const getParts = (date: Date) => {
    try {
      const parts = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
        timeZone: localTz,
      }).formatToParts(date);
      const map: Record<string, string> = {};
      for (const p of parts) map[p.type] = p.value;
      return map;
    } catch {
      const parts = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
        timeZone: "UTC",
      }).formatToParts(date);
      const map: Record<string, string> = {};
      for (const p of parts) map[p.type] = p.value;
      return map;
    }
  };

  const startParts = getParts(startDate);
  const startHourStr = startParts.hour || "12";
  const startMinuteStr = (startParts.minute || "00").padStart(2, "0");
  const startPeriod = startParts.dayPeriod || (parseInt(startHourStr) >= 12 ? "PM" : "AM");
  const startTime = `${startHourStr}:${startMinuteStr} ${startPeriod}`;

  let endTime = "";
  let timeString = startTime;

  if (utcEndTime) {
    const [endH, endM, endS = 0] = utcEndTime.split(":").map(Number);
    const endDate = new Date(Date.UTC(2026, 0, 4 + safeDay, endH, endM, endS));
    const endParts = getParts(endDate);
    const endHourStr = endParts.hour || "12";
    const endMinuteStr = (endParts.minute || "00").padStart(2, "0");
    const endPeriod = endParts.dayPeriod || (parseInt(endHourStr) >= 12 ? "PM" : "AM");
    endTime = `${endHourStr}:${endMinuteStr} ${endPeriod}`;

    if (startPeriod === endPeriod) {
      timeString = `${startHourStr}:${startMinuteStr} - ${endHourStr}:${endMinuteStr} ${startPeriod}`;
    } else {
      timeString = `${startHourStr}:${startMinuteStr} ${startPeriod} - ${endHourStr}:${endMinuteStr} ${endPeriod}`;
    }
  }

  const DAYS = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const localDayName = startParts.weekday || "Sunday";
  const localDayIndex =
    DAYS.indexOf(localDayName) >= 0 ? DAYS.indexOf(localDayName) : safeDay;

  return {
    day: localDayName,
    dayOfWeek: localDayIndex,
    startTime,
    endTime,
    timeString,
  };
};

/**
 * Convert user's local weekly schedule (day 0-6, HH:mm) into UTC for backend saving.
 */
export const convertLocalScheduleToUtc = (
  localDayOfWeek: number,
  localTime: string,
  sourceTimezone?: string,
): {
  day_of_week: number;
  time: string;
  timeWithSeconds: string;
} => {
  const localTz = sourceTimezone || getLocalTimezone();
  const [h, m, s = 0] = (localTime || "00:00").split(":").map(Number);

  try {
    const localDt = DateTime.fromObject(
      { year: 2026, month: 1, day: 4 + (((localDayOfWeek % 7) + 7) % 7), hour: h, minute: m, second: s },
      { zone: localTz },
    );
    const utcDt = localDt.toUTC();
    return {
      day_of_week: utcDt.weekday % 7,
      time: utcDt.toFormat("HH:mm"),
      timeWithSeconds: utcDt.toFormat("HH:mm:ss"),
    };
  } catch {
    return {
      day_of_week: localDayOfWeek,
      time: `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`,
      timeWithSeconds: `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:00`,
    };
  }
};

/**
 * Backward compatible helper for formatting a schedule to local time.
 */
export const formatLocalSchedule = (
  _teacherTimezoneOrDay: any,
  dayOfWeek?: any,
  startTime?: any,
  endTime?: any,
): string => {
  if (typeof dayOfWeek === "number" && startTime) {
    const res = convertUtcScheduleToLocal(dayOfWeek, startTime, endTime);
    return `${res.day} ${res.timeString}`;
  }
  if (typeof _teacherTimezoneOrDay === "number" && dayOfWeek) {
    const res = convertUtcScheduleToLocal(_teacherTimezoneOrDay, dayOfWeek, startTime);
    return `${res.day} ${res.timeString}`;
  }
  return "";
};

/**
 * Backward compatible helper for getting schedule parts in local time.
 */
export const getLocalScheduleParts = (
  _teacherTimezoneOrDay: any,
  dayOfWeek?: any,
  startTime?: any,
  endTime?: any,
): { day: string; startTime: string; endTime: string } => {
  if (typeof dayOfWeek === "number" && startTime) {
    return convertUtcScheduleToLocal(dayOfWeek, startTime, endTime);
  }
  if (typeof _teacherTimezoneOrDay === "number" && dayOfWeek) {
    return convertUtcScheduleToLocal(_teacherTimezoneOrDay, dayOfWeek, startTime);
  }
  return { day: "Sunday", startTime: "", endTime: "" };
};

/**
 * Backward compatible helper for converting a schedule.
 */
export const convertScheduleToLocal = (
  _teacherTimezone: string,
  dayOfWeek: number,
  startTime: string,
  endTime: string,
) => {
  return convertUtcScheduleToLocal(dayOfWeek, startTime, endTime);
};
