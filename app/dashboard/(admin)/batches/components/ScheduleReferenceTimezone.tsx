"use client";

import React, { useMemo } from "react";
import { Globe, Clock, RotateCcw, GraduationCap } from "lucide-react";
import {
  getAllCountries,
  getCountry,
  getTimezonesForCountry,
  getTimezone,
} from "countries-and-timezones";
import SearchableSelect from "@/components/ui/SearchableSelect";

export const getCountryFlag = (countryCode: string): string => {
  if (!countryCode || countryCode.length !== 2) return "🌐";
  try {
    const codePoints = countryCode
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  } catch {
    return "🌐";
  }
};

export const getCountryShortCode = (countryId: string): string => {
  const map: Record<string, string> = {
    IN: "IND",
    BD: "BD",
    US: "USA",
    GB: "UK",
    AE: "UAE",
    CA: "CAN",
    AU: "AUS",
    SA: "KSA",
    PK: "PAK",
    SG: "SGP",
    MY: "MYS",
    DE: "DEU",
    FR: "FRA",
    NP: "NPL",
    LK: "LKA",
    KW: "KWT",
    QA: "QAT",
    OM: "OMN",
  };
  return map[countryId] || countryId;
};

const POPULAR_COUNTRY_CODES = [
  "IN", // India
  "BD", // Bangladesh
  "US", // USA
  "GB", // UK
  "AE", // UAE
  "CA", // Canada
  "SA", // Saudi Arabia
  "AU", // Australia
  "PK", // Pakistan
  "SG", // Singapore
];

const DEFAULT_PRIMARY_TIMEZONES: Record<string, string> = {
  US: "America/New_York",
  CA: "America/Toronto",
  AU: "Australia/Sydney",
  RU: "Europe/Moscow",
  BR: "America/Sao_Paulo",
  ID: "Asia/Jakarta",
  MX: "America/Mexico_City",
};

export interface ScheduleReferenceTimezoneProps {
  selectedCountry: string;
  selectedTimezone: string;
  onCountryChange: (countryCode: string, primaryTimezone: string) => void;
  onTimezoneChange: (timezone: string) => void;
  onResetToLocal: () => void;
  onResetToTeacher?: () => void;
  userLocalCountryCode?: string;
  teacherTimezone?: string;
  teacherCountryCode?: string;
  teacherName?: string;
}

export const ScheduleReferenceTimezone: React.FC<ScheduleReferenceTimezoneProps> = ({
  selectedCountry,
  selectedTimezone,
  onCountryChange,
  onTimezoneChange,
  onResetToLocal,
  onResetToTeacher,
  userLocalCountryCode,
  teacherTimezone,
  teacherCountryCode,
  teacherName,
}) => {
  const allCountriesList = useMemo(() => {
    return Object.values(getAllCountries());
  }, []);

  // Prepare country options with popular ones pinned at top
  const countryOptions = useMemo(() => {
    const popular = POPULAR_COUNTRY_CODES.map((code) => getCountry(code)).filter(
      (c): c is NonNullable<typeof c> => Boolean(c)
    );
    const others = allCountriesList
      .filter((c) => !POPULAR_COUNTRY_CODES.includes(c.id))
      .sort((a, b) => a.name.localeCompare(b.name));

    const combined = [...popular, ...others];
    return combined.map((c) => ({
      value: c.id,
      label: `${getCountryFlag(c.id)} ${c.name} (${getCountryShortCode(c.id)})`,
    }));
  }, [allCountriesList]);

  // Available timezones for the selected country
  const availableTimezones = useMemo(() => {
    if (!selectedCountry) return [];
    const list = getTimezonesForCountry(selectedCountry) || [];
    return list.map((tz) => ({
      value: tz.name,
      label: `${tz.name.replace(/_/g, " ")} (${tz.utcOffsetStr})`,
    }));
  }, [selectedCountry]);

  // Current timezone offset string
  const currentOffset = useMemo(() => {
    try {
      const tzObj = getTimezone(selectedTimezone);
      return tzObj?.utcOffsetStr ? `UTC${tzObj.utcOffsetStr}` : "";
    } catch {
      return "";
    }
  }, [selectedTimezone]);

  const selectedCountryData = getCountry(selectedCountry);
  const selectedShortCode = getCountryShortCode(selectedCountry);
  const selectedFlag = getCountryFlag(selectedCountry);

  const isTeacherTimezone = teacherTimezone && selectedTimezone === teacherTimezone;

  const handleSelectCountry = (code: string) => {
    const country = getCountry(code);
    const tzs = getTimezonesForCountry(code) || [];
    const preferred = DEFAULT_PRIMARY_TIMEZONES[code];
    const preferredExists = tzs.some((t) => t.name === preferred);
    const primaryTz = preferredExists ? preferred : tzs[0]?.name || country?.timezones[0] || "UTC";
    onCountryChange(code, primaryTz);
  };

  return (
    <div className="bg-gradient-to-r from-blue-50/90 via-sky-50/60 to-indigo-50/80 dark:from-blue-950/30 dark:via-sky-950/20 dark:to-indigo-950/25 border border-blue-200/80 dark:border-blue-800/60 rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
      {/* Notice Header */}
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 shrink-0 mt-0.5">
          <Globe className="w-5 h-5" />
        </div>
        <div className="space-y-0.5 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-sm sm:text-base text-blue-950 dark:text-blue-100">
              All schedule slots are stored in UTC (Universal Time)
            </h4>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-200/70 dark:bg-blue-800 text-blue-800 dark:text-blue-200">
              UTC Standard
            </span>
          </div>
          <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
            Please select the slot corresponding to UTC time. The platform will automatically convert and display these times into each student&apos;s local timezone.
          </p>
        </div>
      </div>

      {/* Reference Country & Timezone Preview Controls */}
      <div className="pt-3.5 border-t border-blue-200/70 dark:border-blue-800/40 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-950 dark:text-blue-200 uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Reference Time Preview</span>
            </div>
            <p className="text-xs text-blue-700/90 dark:text-blue-300/90 mt-0.5">
              Compare UTC slots against the assigned teacher&apos;s or any country&apos;s local time:
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Country Selector */}
            <div className="w-60 sm:w-64">
              <SearchableSelect
                options={countryOptions}
                value={selectedCountry}
                onChange={handleSelectCountry}
                placeholder="Select country"
                searchPlaceholder="Search country (e.g. India, USA)..."
              />
            </div>

            {/* Timezone Selector (if multiple timezones for selected country) */}
            {availableTimezones.length > 1 && (
              <div className="w-56 sm:w-60">
                <SearchableSelect
                  options={availableTimezones}
                  value={selectedTimezone}
                  onChange={onTimezoneChange}
                  placeholder="Select timezone"
                  searchPlaceholder="Search timezone..."
                />
              </div>
            )}

            {/* Quick Switch: Teacher's Time (if available) */}
            {teacherTimezone && onResetToTeacher && (
              <button
                type="button"
                onClick={onResetToTeacher}
                className={`h-[42px] px-4 inline-flex items-center justify-center gap-2 text-sm font-medium rounded-xl border transition-all cursor-pointer shadow-2xs shrink-0 ${
                  isTeacherTimezone
                    ? "border-primary bg-primary text-white hover:bg-primary/95"
                    : "border-primary/40 dark:border-primary/50 bg-primary/5 dark:bg-primary/10 text-primary hover:bg-primary/10 dark:hover:bg-primary/20"
                }`}
                title={`Set reference preview to ${teacherName || "Teacher"}&apos;s local timezone (${teacherTimezone})`}
              >
                <GraduationCap className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">
                  Teacher&apos;s Time {teacherCountryCode ? `(${getCountryShortCode(teacherCountryCode)})` : ""}
                </span>
              </button>
            )}

            {/* Quick Switch: User Local Time */}
            <button
              type="button"
              onClick={onResetToLocal}
              className="h-[42px] px-4 inline-flex items-center justify-center gap-2 text-sm font-medium rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 transition-all cursor-pointer shadow-2xs shrink-0"
              title="Reset reference preview to your current browser timezone"
            >
              <RotateCcw className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span className="whitespace-nowrap">My Time {userLocalCountryCode ? `(${userLocalCountryCode})` : ""}</span>
            </button>
          </div>
        </div>

        {/* Active Reference Preview Badge */}
        <div className="flex items-center gap-2 text-xs text-blue-900 dark:text-blue-200 bg-blue-100/70 dark:bg-blue-900/40 px-3 py-1.5 rounded-lg border border-blue-200/50 dark:border-blue-800/50 w-fit flex-wrap">
          <span className="opacity-75">Slot buttons preview:</span>
          <span className="font-semibold flex items-center gap-1 text-blue-950 dark:text-white">
            <span>{selectedFlag}</span>
            <span>{selectedCountryData?.name || selectedCountry} ({selectedShortCode})</span>
          </span>
          <span className="text-blue-600 dark:text-blue-400 font-mono text-[11px]">
            {selectedTimezone} {currentOffset ? `· ${currentOffset}` : ""}
          </span>
          {isTeacherTimezone && (
            <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-primary/20 text-primary">
              Teacher&apos;s Local Time
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
