"use client";
import {
  useGetDailyAttendanceByBatchIdAndDateQuery,
  useUpdateStudentAttendanceStatusMutation,
} from "@/src/redux/api/admin+teacher/attendanceApi";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { ActionButton } from "@/components/ui/ActionButton";
import {
  ArrowLeft,
  BanIcon,
  ChevronsLeft,
  CircleCheckBig,
  Save,
  UserCheck,
  UserX,
  Users,
  Loader2,
  ChevronDown,
} from "lucide-react";
import CustomTable from "@/components/ui/Table";
import { Column } from "@/types/table";
import Loader from "@/components/ui/Loader";
import MyButton from "@/components/ui/MyButton";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface StudentAttendance {
  user_id: number;
  name: string;
  email: string;
  status: "present" | "absent";
}

const UpdateAttendancePage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const batch_id = params.id as string;
  const dateParam = searchParams.get("date") || "";

  // Parse initial date from URL or use today
  const getInitialDate = () => {
    if (dateParam) {
      const [year, month, day] = dateParam.split("-").map(Number);
      return { year, month, day };
    }
    const today = new Date();
    return {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate(),
    };
  };

  const [selectedDate, setSelectedDate] = useState(getInitialDate);

  // Convert date to YYYY-MM-DD format
  const isoDate = `${selectedDate.year}-${String(selectedDate.month).padStart(2, "0")}-${String(selectedDate.day).padStart(2, "0")}`;

  // State to manage attendance status changes
  const [attendanceList, setAttendanceList] = useState<StudentAttendance[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // API hooks
  const { data, isLoading, error, refetch } =
    useGetDailyAttendanceByBatchIdAndDateQuery(
      { batch_id, date: isoDate },
      { skip: !batch_id || !isoDate },
    );

  const [updateStudentAttendance] = useUpdateStudentAttendanceStatusMutation();

  // Update local state when data is received
  useEffect(() => {
    if (data?.data) {
      setAttendanceList(data.data);
    }
  }, [data]);

  const handleStatusChange = (
    userId: number,
    newStatus: "present" | "absent",
  ) => {
    setAttendanceList((prev) =>
      prev.map((student) =>
        student.user_id === userId
          ? { ...student, status: newStatus }
          : student,
      ),
    );
  };

  // Generate year options (current year ± 5 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  // Generate month options
  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  // Get days in selected month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(selectedDate.year, selectedDate.month);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleDateChange = (field: "year" | "month" | "day", value: number) => {
    setSelectedDate((prev) => {
      const newDate = { ...prev, [field]: value };
      // Adjust day if it exceeds days in new month
      const maxDay = getDaysInMonth(newDate.year, newDate.month);
      if (newDate.day > maxDay) {
        newDate.day = maxDay;
      }
      return newDate;
    });
  };

  const handleSaveAttendance = async () => {
    if (attendanceList.length === 0) {
      toast.error("No attendance data to save");
      return;
    }

    setIsSaving(true);

    // Show loading toast
    const loadingToast = toast.loading("Saving attendance...");

    try {
      // Prepare payload for API
      const payload = {
        batch_id: parseInt(batch_id),
        class_date: isoDate,
        attendances: attendanceList.map((student) => ({
          user_id: student.user_id,
          status: student.status,
        })),
      };

      // Call the API mutation
      const result = await updateStudentAttendance(payload).unwrap();

      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success(result?.message || "Attendance saved successfully!");

      // Refetch data to get updated attendance from server
      await refetch();
    } catch (error: any) {
      console.error("Error saving attendance:", error);

      // Dismiss loading toast and show error
      toast.dismiss(loadingToast);
      toast.error(
        error?.data?.message || "Failed to save attendance. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusStats = () => {
    const total = attendanceList.length;
    const present = attendanceList.filter((s) => s.status === "present").length;
    const absent = total - present;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : "0";
    return { total, present, absent, percentage };
  };

  const stats = getStatusStats();

  // Define columns for CustomTable
  const columns: Column<StudentAttendance>[] = [
    {
      header: "Student Name",
      accessor: "name",
      headerClassName: "text-left",
      cellClassName: "px-4 py-3 text-left font-medium whitespace-nowrap",
    },
    {
      header: "Email",
      accessor: "email",
      headerClassName: "text-left",
      cellClassName: "px-4 py-3 text-left",
    },
    {
      header: "Status",
      accessor: "status",
      headerClassName: "text-center",
      cellClassName: "px-4 py-3 text-center",
      render: (value, row) => (
        <span
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            row.status === "present"
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
          }`}
        >
          {row.status === "present" ? "Present" : "Absent"}
        </span>
      ),
    },
    {
      header: "Actions",
      headerClassName: "text-center",
      cellClassName: "px-4 py-3 text-center",
      render: (_, row) => (
        <div className="flex justify-center gap-2">
          {row.status === "absent" ? (
            <ActionButton
              variant="success"
              icon={CircleCheckBig}
              onClick={() => handleStatusChange(row.user_id, "present")}
              label="Mark Present"
              showText={true}
              size="sm"
            />
          ) : (
            <ActionButton
              variant="delete"
              icon={BanIcon}
              onClick={() => handleStatusChange(row.user_id, "absent")}
              label="Mark Absent"
              showText={true}
              size="sm"
            />
          )}
        </div>
      ),
    },
  ];

  if (!batch_id || !isoDate) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <p className="text-red-500 mb-4">Missing required parameters</p>
          <p className="text-gray-500 mb-4">
            Batch ID: {batch_id || "Not provided"}
          </p>
          <p className="text-gray-500 mb-4">
            Date: {dateParam || "Not provided"}
          </p>
          <ActionButton
            variant="primary"
            icon={ArrowLeft}
            onClick={() => router.push("/dashboard/attendance")}
            label="Go to Attendance"
            showText={true}
          />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading attendance data</p>
          <p className="text-gray-500 mb-4">
            Please check if the batch and date are valid
          </p>
          <ActionButton
            variant="primary"
            icon={ArrowLeft}
            onClick={() => router.push("/dashboard/attendance")}
            label="Go to Attendance"
            showText={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
        >
          <ChevronsLeft className="w-4 h-4" />
          <span>Back to Attendance Calendar</span>
        </button>

        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Update Attendance
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Batch #{batch_id} •{" "}
            {new Date(isoDate).toLocaleDateString("default", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Students
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.total}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Present
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                {stats.present}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Absent</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                {stats.absent}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <UserX className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Date Filter Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 flex items-start xl:items-center justify-between flex-col md:flex-row gap-4 xl:justify-between">
        <div className="flex flex-col md:flex-row w-full md:w-fit items-center gap-3">
          {/* Year Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full md:w-fit px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white flex items-center gap-2 min-w-[80px]">
                {selectedDate.year}
                <ChevronDown className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-60 overflow-y-auto">
              {years.map((year) => (
                <DropdownMenuItem
                  key={year}
                  onClick={() => handleDateChange("year", year)}
                  className={selectedDate.year === year ? "bg-accent" : ""}
                >
                  {year}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Month Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full md:w-fit px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white flex items-center gap-2 min-w-[140px]">
                {months.find((m) => m.value === selectedDate.month)?.label}
                <ChevronDown className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-60 overflow-y-auto">
              {months.map((month) => (
                <DropdownMenuItem
                  key={month.value}
                  onClick={() => handleDateChange("month", month.value)}
                  className={
                    selectedDate.month === month.value ? "bg-accent" : ""
                  }
                >
                  {month.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Day Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full md:w-fit px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white flex items-center gap-2 min-w-[60px]">
                {selectedDate.day}
                <ChevronDown className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-60 overflow-y-auto">
              {days.map((day) => (
                <DropdownMenuItem
                  key={day}
                  onClick={() => handleDateChange("day", day)}
                  className={selectedDate.day === day ? "bg-accent" : ""}
                >
                  {day}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* Save Button Bar */}
        <div className="flex w-full md:w-fit justify-end gap-3">
          <MyButton
            variant="primary"
            onClick={handleSaveAttendance}
            disabled={isSaving}
            className="gap-2 w-full"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Attendance
              </>
            )}
          </MyButton>
        </div>
      </div>

      {/* Attendance Table */}
      <div>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Student Attendance
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Update attendance status for each student
          </p>
        </div>

        <CustomTable
          data={attendanceList}
          columns={columns}
          showIndex={true}
          indexLabel="SL"
          isLoading={isLoading}
          emptyMessage="No students found in this batch"
        />
      </div>

      {/* Footer Stats */}
      {attendanceList.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Attendance Rate
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {stats.percentage}%
              </p>
            </div>
            <div className="w-full max-w-xs bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${stats.percentage}%` }}
              />
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {stats.present} out of {stats.total} students present
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateAttendancePage;
