"use client";
import React, { useState, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import CustomTable from "@/components/ui/Table";
import SearchBar from "@/components/ui/SearchBar";
import Loader from "@/components/ui/Loader";
import { Column } from "@/types/table";
import {
  User,
  Mail,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  BookOpen,
  Users,
  ChevronsLeft,
  CircleCheckBig,
  BanIcon,
  Save,
  UserCheck,
  UserX,
  Loader2,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetStudentsForTeacherQuery } from "@/src/redux/api/teacher/teacherBatchesApi";
import {
  useGetDailyAttendanceByBatchIdAndDateQuery,
  useUpdateStudentAttendanceStatusMutation,
} from "@/src/redux/api/admin+teacher/attendanceApi";
import MyStudentsStateCards from "./components/MyStudentsStateCards";
import { Student } from "@/types/students";
import ActionButton from "@/components/ui/ActionButton";
import MyButton from "@/components/ui/MyButton";
import { format } from "date-fns";
import { toast } from "sonner";

interface StudentAttendance {
  user_id: number;
  name: string;
  email: string;
  status: "present" | "absent";
}

const MyStudentsPage = () => {
  const params = useParams();
  const batchId = params.id as string;
  const router = useRouter();

  const [filters, setFilters] = useState({
    currentPage: 1,
    perPageItem: 10,
    search: "",
  });

  const [selectedDate, setSelectedDate] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  });

  const [attendanceList, setAttendanceList] = useState<StudentAttendance[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const formatDateForAPI = () => {
    const { year, month, day } = selectedDate;
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  const isoDate = formatDateForAPI();

  const {
    data: apiResponse,
    isLoading,
    refetch,
  } = useGetStudentsForTeacherQuery({
    batch_id: batchId,
    page: filters.currentPage,
    per_page: filters.perPageItem,
    search: filters.search,
  });

  const students = apiResponse?.data;
  const pagination = apiResponse?.pagination;

  const {
    data: attendanceData,
    isLoading: attendanceLoading,
    refetch: refetchAttendance,
  } = useGetDailyAttendanceByBatchIdAndDateQuery(
    { batch_id: batchId, date: isoDate },
    { skip: !batchId || !isoDate },
  );

  const [updateStudentAttendance] = useUpdateStudentAttendanceStatusMutation();

  // Initialize attendance list when students data changes
  useEffect(() => {
    if (students && students.length > 0) {
      const existingAttendance = attendanceData?.data || [];
      const attendanceMap = new Map(
        existingAttendance.map((a: any) => [a.user_id, a.status]),
      );

      const initialAttendance: StudentAttendance[] = students.map(
        (student: any) => ({
          user_id: student.user_id,
          name: student.user?.name || "Unknown",
          email: student.user?.email || "",
          status: attendanceMap.get(student.user_id) || "present",
        }),
      );
      setAttendanceList(initialAttendance);
    }
  }, [students, attendanceData]);

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

  const handleSaveAttendance = async () => {
    if (attendanceList.length === 0) {
      toast.error("No attendance data to save");
      return;
    }

    setIsSaving(true);

    const loadingToast = toast.loading("Saving attendance...");

    try {
      const payload = {
        batch_id: Number(batchId),
        class_date: isoDate,
        attendances: attendanceList.map((student) => ({
          user_id: student.user_id,
          status: student.status,
        })),
      };

      const result = await updateStudentAttendance(payload).unwrap();

      toast.dismiss(loadingToast);
      toast.success(result?.message || "Attendance saved successfully!");

      await refetchAttendance();
    } catch (error: any) {
      console.error("Error saving attendance:", error);
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

  const handleSearch = (term: string) => {
    setFilters((prev) => ({
      ...prev,
      search: term,
      currentPage: 1,
    }));
  };

  const handleClearSearch = () => {
    setFilters((prev) => ({
      ...prev,
      search: "",
      currentPage: 1,
    }));
  };

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({
      ...prev,
      currentPage: page,
    }));

    document.getElementById("students-table-container")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  const isExpired = (expiryDate: string) => {
    return new Date(expiryDate) < new Date();
  };

  const getDaysRemaining = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const columns: Column<StudentAttendance>[] = [
    {
      header: "Student Name",
      accessor: "name",
      headerClassName: "text-left",
      cellClassName: "px-4 py-3 text-left",
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary/10 to-primary/20 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {row.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              ID: {row.user_id}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Email",
      accessor: "email",
      headerClassName: "text-left",
      cellClassName: "px-4 py-3 text-left",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {row.email}
          </span>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      headerClassName: "text-center",
      cellClassName: "px-4 py-3 text-center",
      render: (_, row) => (
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

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-150px)] w-full flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  // Get batch name from first student if available
  const batchName = students?.[0]?.batch?.name || "Batch";

  return (
    <div className="space-y-6" id="students-table-container">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
      >
        <ChevronsLeft className="w-4 h-4" />
        <span>Back to Batches</span>
      </button>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            My Students of {batchName}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
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

      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 flex items-start xl:items-center justify-between flex-col md:flex-row gap-4 xl:justify-between">
        <div className="flex flex-col md:flex-row w-full md:w-fit items-center gap-3">
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
        {/* save button */}
        <div className="w-full md:w-fit">
          <MyButton
            variant="primary"
            onClick={handleSaveAttendance}
            disabled={isSaving || attendanceList.length === 0}
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

      {/* Results Summary */}
      <div className="flex flex-col md:flex-row gap-4  items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing {students?.length || 0} of {pagination?.total || 0} students
          {filters.search && (
            <span className="ml-2">
              matching <span className="font-medium">"{filters.search}"</span>
            </span>
          )}
        </p>
        
        <SearchBar
          onSearch={handleSearch}
          className="w-full md:w-1/2 xl:w-fit"
          placeholder="Search by student name or email..."
          initialValue={filters.search}
          debounceDelay={500}
          size="md"
          variant="default"
          showClearButton={true}
        />
      </div>

      {/* Attendance Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
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
          isLoading={isLoading || attendanceLoading}
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

      {/* Sticky Save Button at Bottom */}
      {attendanceList.length > 10 && (
        <div className="flex justify-end sticky bottom-4 z-10">
          <MyButton
            variant="primary"
            onClick={handleSaveAttendance}
            disabled={isSaving}
            className="gap-2 shadow-lg"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving Attendance...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Attendance
              </>
            )}
          </MyButton>
        </div>
      )}
    </div>
  );
};

export default MyStudentsPage;
