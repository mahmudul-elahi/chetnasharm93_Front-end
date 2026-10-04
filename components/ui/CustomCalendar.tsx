"use client";

import React, { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  startOfWeek,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { ChevronRight, ChevronsUpDown, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface CustomCalendarProps {
  selected: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
  className?: string;
}

export function CustomCalendar({ selected, onSelect, disabled, className }: CustomCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(selected || new Date());
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  // Generate years from 1900 to 2100 (no limit)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 201 }, (_, i) => currentYear - 100 + i);
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });
  
  const days: Date[] = [];
  let day = startDate;
  while (day <= endDate) {
    days.push(day);
    day = new Date(day.getTime() + 24 * 60 * 60 * 1000);
  }

  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const handleDateClick = (date: Date) => {
    if (disabled && disabled(date)) return;
    onSelect(date);
  };

  const goToPreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  
  const handleMonthSelect = (monthIndex: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), monthIndex, 1));
    setIsMonthDropdownOpen(false);
  };
  
  const handleYearSelect = (year: number) => {
    setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
    setIsYearDropdownOpen(false);
  };

  return (
    <div className={cn("w-full shrink-0 bg-white rounded-lg shadow-lg border p-3 sm:p-4", className)}>
      {/* Header with Month/Year Dropdowns */}
      <div className="flex items-center justify-between mb-4 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={goToPreviousMonth}
          className="h-8 w-8 p-0 shrink-0 cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex gap-2 flex-1 justify-center">
          {/* Month Dropdown */}
          <DropdownMenu open={isMonthDropdownOpen} onOpenChange={setIsMonthDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1 text-sm cursor-pointer">
                {months[currentMonth.getMonth()]}
                <ChevronsUpDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-64 overflow-y-auto">
              {months.map((month, index) => (
                <DropdownMenuItem
                  key={month}
                  onClick={() => handleMonthSelect(index)}
                  className="cursor-pointer"
                >
                  {month}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Year Dropdown */}
          <DropdownMenu open={isYearDropdownOpen} onOpenChange={setIsYearDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1 text-sm cursor-pointer">
                {currentMonth.getFullYear()}
                <ChevronsUpDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-64 overflow-y-auto">
              {years.map((year) => (
                <DropdownMenuItem
                  key={year}
                  onClick={() => handleYearSelect(year)}
                  className="cursor-pointer"
                >
                  {year}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={goToNextMonth}
          className="h-8 w-8 p-0 shrink-0 cursor-pointer"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
        {days.map((date, index) => {
          const isCurrentMonth = isSameMonth(date, currentMonth);
          const isSelected = selected && isSameDay(date, selected);
          const isDisabled = disabled && disabled(date);
          const isToday = isSameDay(date, new Date());
          
          return (
            <button
              key={index}
              onClick={() => handleDateClick(date)}
              disabled={isDisabled}
              className={cn(
                "w-9 h-9 sm:w-10 sm:h-10 rounded-full text-xs sm:text-sm transition-all duration-200 cursor-pointer",
                !isCurrentMonth && "text-gray-400",
                isCurrentMonth && !isSelected && !isDisabled && "text-gray-700 hover:bg-gray-100",
                isSelected && "bg-primary text-white hover:bg-primary/90 font-semibold",
                isToday && !isSelected && "border-2 border-primary text-primary font-semibold",
                isDisabled && "text-gray-300 cursor-not-allowed bg-gray-50"
              )}
            >
              {format(date, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
}