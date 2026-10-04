// components/attendance/MonthYearSelector.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronsLeft, ChevronRight, Calendar, ChevronsRight } from "lucide-react";
import { ActionButton } from "@/components/ui/ActionButton";

interface MonthYearSelectorProps {
  currentDate: Date;
  onMonthYearChange: (year: number, month: number) => void;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onCurrentMonth: () => void;
}

const MonthYearSelector: React.FC<MonthYearSelectorProps> = ({
  currentDate,
  onMonthYearChange,
  onPreviousMonth,
  onNextMonth,
  onCurrentMonth,
}) => {
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const yearDropdownRef = useRef<HTMLDivElement>(null);
  const monthDropdownRef = useRef<HTMLDivElement>(null);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  // Generate years from 2000 to current year + 5
  const currentYearNum = new Date().getFullYear();
  const years = Array.from(
    { length: currentYearNum + 5 - 2000 + 1 },
    (_, i) => 2000 + i,
  );

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        yearDropdownRef.current &&
        !yearDropdownRef.current.contains(event.target as Node)
      ) {
        setShowYearDropdown(false);
      }
      if (
        monthDropdownRef.current &&
        !monthDropdownRef.current.contains(event.target as Node)
      ) {
        setShowMonthDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleYearSelect = (year: number) => {
    onMonthYearChange(year, currentMonth);
    setShowYearDropdown(false);
  };

  const handleMonthSelect = (month: number) => {
    onMonthYearChange(currentYear, month);
    setShowMonthDropdown(false);
  };

  return (
    <div className="w-full">
      {/* Mobile Layout (stacked) */}
      <div className="block lg:hidden space-y-3">
        {/* Navigation Row */}
        <div className="flex justify-between items-center gap-2">
          <div className="flex-1 flex gap-2">
            {/* Year Dropdown - Mobile */}
            <div className="relative flex-1" ref={yearDropdownRef}>
              <button
                onClick={() => {
                  setShowYearDropdown(!showYearDropdown);
                  setShowMonthDropdown(false);
                }}
                className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 
                           rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 
                           transition-colors duration-200 text-sm"
              >
                <span className="font-semibold text-gray-900 dark:text-white">
                  {currentYear}
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${showYearDropdown ? "rotate-180" : ""}`}
                />
              </button>

              {showYearDropdown && (
                <div
                  className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-gray-800 
                                rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 
                                z-20 max-h-48 overflow-y-auto"
                >
                  <div className="p-1">
                    {years.map((year) => (
                      <button
                        key={year}
                        onClick={() => handleYearSelect(year)}
                        className={`w-full px-3 py-2 rounded-md text-sm transition-colors text-left
                          ${
                            year === currentYear
                              ? "bg-primary text-white"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Month Dropdown - Mobile */}
            <div className="relative flex-1" ref={monthDropdownRef}>
              <button
                onClick={() => {
                  setShowMonthDropdown(!showMonthDropdown);
                  setShowYearDropdown(false);
                }}
                className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 
                           rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 
                           transition-colors duration-200 text-sm"
              >
                <span className="font-semibold text-gray-900 dark:text-white">
                  {months[currentMonth - 1]}
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${showMonthDropdown ? "rotate-180" : ""}`}
                />
              </button>

              {showMonthDropdown && (
                <div
                  className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-gray-800 
                                rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 
                                z-20"
                >
                  <div className="grid grid-cols-3 gap-1 p-2">
                    {months.map((month, index) => (
                      <button
                        key={index}
                        onClick={() => handleMonthSelect(index + 1)}
                        className={`px-2 py-2 rounded-md text-sm transition-colors text-center
                          ${
                            index + 1 === currentMonth
                              ? "bg-primary text-white"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                      >
                        {month.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Current Month Button - Mobile */}
        <div className="flex justify-center gap-4">
          <ActionButton
            variant="primary"
            icon={ChevronsLeft}
            onClick={onPreviousMonth}
            label="Previous"
            showText={false}
            size="sm"
          />

          <ActionButton
            variant="view"
            icon={Calendar}
            onClick={onCurrentMonth}
            label="Current Month"
            showText={true}
            size="sm"
          />
          <ActionButton
            variant="primary"
            icon={ChevronRight}
            onClick={onNextMonth}
            label="Next"
            showText={false}
            size="sm"
          />
        </div>
      </div>

      {/* Desktop Layout (horizontal) */}
      <div className="hidden lg:flex items-center justify-between flex-wrap">
        <div className="flex items-center gap-4">
          {/* Year Dropdown - Desktop */}
          <div className="relative" ref={yearDropdownRef}>
            <button
              onClick={() => {
                setShowYearDropdown(!showYearDropdown);
                setShowMonthDropdown(false);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 
                       rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 
                       transition-colors duration-200 min-w-25 justify-between"
            >
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {currentYear}
              </span>
              <ChevronDown
                size={18}
                className={`transition-transform duration-200 ${showYearDropdown ? "rotate-180" : ""}`}
              />
            </button>

            {showYearDropdown && (
              <div
                className="absolute top-full left-0 mt-2 w-32 bg-white dark:bg-gray-800 
                            rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 
                            z-20 max-h-64 overflow-y-auto"
              >
                <div className="p-1">
                  {years.map((year) => (
                    <button
                      key={year}
                      onClick={() => handleYearSelect(year)}
                      className={`w-full px-3 py-2 rounded-md text-sm transition-colors text-left
                      ${
                        year === currentYear
                          ? "bg-primary text-white"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Month Dropdown - Desktop */}
          <div className="relative" ref={monthDropdownRef}>
            <button
              onClick={() => {
                setShowMonthDropdown(!showMonthDropdown);
                setShowYearDropdown(false);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 
                       rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 
                       transition-colors duration-200 min-w-[140px] justify-between"
            >
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {months[currentMonth - 1]}
              </span>
              <ChevronDown
                size={18}
                className={`transition-transform duration-200 ${showMonthDropdown ? "rotate-180" : ""}`}
              />
            </button>

            {showMonthDropdown && (
              <div
                className="absolute top-full left-0 mt-2 w-40 bg-white dark:bg-gray-800 
                            rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 
                            z-20"
              >
                <div className="grid grid-cols-2 gap-1 p-2">
                  {months.map((month, index) => (
                    <button
                      key={index}
                      onClick={() => handleMonthSelect(index + 1)}
                      className={`px-2 py-2 rounded-md text-sm transition-colors text-left
                      ${
                        index + 1 === currentMonth
                          ? "bg-primary text-white"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      {month.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ActionButton
            variant="primary"
            icon={ChevronsLeft}
            onClick={onPreviousMonth}
            label="Previous Month"
            showText={false}
            size="md"
          />
          <ActionButton
            variant="view"
            icon={Calendar}
            onClick={onCurrentMonth}
            label="Current Month"
            showText={true}
            size="md"
          />{" "}
          <ActionButton
            variant="primary"
            icon={ChevronsRight}
            onClick={onNextMonth}
            label="Next Month"
            showText={false}
            size="md"
          />
        </div>
      </div>
    </div>
  );
};

export default MonthYearSelector;
