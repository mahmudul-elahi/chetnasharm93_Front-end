import { eachDayOfInterval } from "date-fns";

export const getDatesInRange = (start: Date, end: Date): Date[] => {
  return eachDayOfInterval({ start, end });
};

export const weekdayLabels: Record<number, string> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

export const formatTime = (time: string): string => {
  return time.slice(0, 5);
};