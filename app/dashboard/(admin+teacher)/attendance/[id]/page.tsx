"use client";
import {
  useGetMonthlyAttendanceByBatchIdQuery,
  useLazyGetMonthlyAttendanceByBatchIdQuery,
} from "@/src/redux/api/admin+teacher/attendanceApi";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AttendanceStats from "../components/AttendanceStats";
import AttendanceCalendar from "../components/AttendanceCalendar";
import AttendanceLegend from "../components/AttendanceLegend";
import MonthYearSelector from "../components/MonthYearSelector";
import { ChevronsLeft } from "lucide-react";

interface AttendanceData {
  date: string;
  has_status: number;
}

const AttendancePage = () => {
  const router = useRouter();
  const params = useParams();
  const batch_id = params.id;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(
    `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`,
  );

  const [fetchAttendance, { data: lazyData, isLoading: lazyLoading }] =
    useLazyGetMonthlyAttendanceByBatchIdQuery();

  const {
    data: initialData,
    isLoading: initialLoading,
    refetch,
  } = useGetMonthlyAttendanceByBatchIdQuery(
    { batch_id, month: selectedMonth },
    { skip: false },
  );

  const attendanceData = lazyData?.data || initialData?.data || [];

  useEffect(() => {
    refetch();
  }, [selectedMonth, refetch]);

  const handleMonthYearChange = (year: number, month: number) => {
    const newDate = new Date(year, month - 1, 1);
    setCurrentDate(newDate);
    const newMonth = `${year}-${String(month).padStart(2, "0")}`;
    setSelectedMonth(newMonth);
  };

  const handlePreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(newDate);
    const newMonth = `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, "0")}`;
    setSelectedMonth(newMonth);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(newDate);
    const newMonth = `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, "0")}`;
    setSelectedMonth(newMonth);
  };

  const handleCurrentMonth = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedMonth(
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`,
    );
  };

  const handleUpdateAttendance = (date: string) => {
    router.push(`/dashboard/attendance/${batch_id}/update?date=${date}`);
  };

  const getStatusStats = () => {
    const total = attendanceData.length;
    const withStatus = attendanceData.filter(
      (item: AttendanceData) => item.has_status === 1,
    ).length;
    const withoutStatus = total - withStatus;
    const percentage =
      total > 0 ? ((withStatus / total) * 100).toFixed(1) : "0";

    return { total, withStatus, withoutStatus, percentage };
  };

  const stats = getStatusStats();
  const isLoading = initialLoading || lazyLoading;

  return (
    <div>
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer mb-6"
      >
        <ChevronsLeft className="w-4 h-4" />
        <span>Back to Batch details</span>
      </button>
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Attendance Overview
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Batch #{batch_id} - Track daily attendance status
        </p>
      </div>

      {/* Stats Cards */}
      <AttendanceStats stats={stats} />

      {/* Calendar with Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <MonthYearSelector
              currentDate={currentDate}
              onMonthYearChange={handleMonthYearChange}
              onPreviousMonth={handlePreviousMonth}
              onNextMonth={handleNextMonth}
              onCurrentMonth={handleCurrentMonth}
            />
          </div>
        </div>

        {/* Calendar Grid */}
        <AttendanceCalendar
          attendanceData={attendanceData}
          currentDate={currentDate}
          onUpdateAttendance={handleUpdateAttendance}
          isLoading={isLoading}
        />
      </div>

      {/* Legend */}
      <AttendanceLegend />
    </div>
  );
};

export default AttendancePage;
