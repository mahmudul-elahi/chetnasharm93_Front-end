"use client";

import { useGetSingleBatchForTeacherQuery } from "@/src/redux/api/teacher/teacherBatchesApi";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Users,
  Video,
  BookOpen,
  ChevronsLeft,
  CalendarDays,
  GraduationCap,
  BadgeCheck,
  Info,
  ExternalLink,
  Award,
  UserRound,
  NotebookPen,
  Edit3,
  CheckCircle,
  Pen,
  NotepadText,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import Loader from "@/components/ui/Loader";
import ActionButton from "@/components/ui/ActionButton";
import UpdateZoomLinkModal from "./components/UpdateZoomLinkModal";
import { convertUtcScheduleToLocal, getNextUpcomingClass } from "@/src/utils/timezone";
import { ApiResponse, Schedule } from "@/types/batchesForTeacher";

const BatchDetailsPageForTeacher = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const batchId = id ? parseInt(id, 10) : 0;

  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);

  const { data, isLoading, isError, refetch } =
    useGetSingleBatchForTeacherQuery(batchId, {
      skip: !batchId,
    });

  const batchData = (data as ApiResponse)?.data;
  const classData = batchData?.class;
  const teacherData = batchData?.teacher;
  const schedules = batchData?.schedules;

  // Day mapping
  const getDayName = (dayNumber: number): string => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[dayNumber];
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get status color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-700";
      case "ongoing":
        return "bg-green-100 text-green-700";
      case "completed":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader />
        </div>
      </div>
    );
  }

  if (isError || !batchData) {
    toast.error("Failed to load batch details");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">Failed to load batch details</div>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div>
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer mb-6"
        >
          <ChevronsLeft className="w-4 h-4" />
          <span>Back to Batches</span>
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
              <div className="relative h-48 md:h-64 bg-linear-to-r from-purple-600 to-pink-600">
                {classData?.image_url && (
                  <Image
                    src={classData.image_url}
                    alt={classData.title}
                    fill
                    className="object-cover opacity-30"
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center px-4">
                    {batchData.name}
                  </h1>
                </div>
              </div>

              {/* Status Badge */}
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(batchData.status)}`}
                  >
                    {batchData.status}
                  </span>
                  {batchData.active_status === 1 && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Active
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {formatDate(batchData.start_date)} -{" "}
                    {formatDate(batchData.end_date)}
                  </span>
                </div>
              </div>
            </div>

            {/* Class Info Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-bold text-gray-800">
                  About This Course
                </h2>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {classData?.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {classData?.description}
              </p>
            </div>

            {/* Schedule Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <CalendarDays className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-bold text-gray-800">
                  Class Schedule
                </h2>
              </div>
              <div className="space-y-3">
                {schedules?.map((schedule: Schedule) => {
                  const local = convertUtcScheduleToLocal(
                    schedule.day_of_week,
                    schedule.start_time,
                    schedule.end_time
                  );
                  return (
                    <div
                      key={schedule.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <span className="text-purple-600 font-semibold">
                            {local.day.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {local.day}
                          </p>
                          <p className="text-sm text-gray-500">
                            {local.timeString}
                          </p>
                        </div>
                      </div>
                      <Clock className="w-4 h-4 text-gray-400" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Batch Stats Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <Info className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-bold text-gray-800">
                  Batch Details
                </h2>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>Total Students</span>
                  </div>
                  <span className="font-semibold text-gray-800">
                    {batchData.total_seat}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-gray-600">
                    <GraduationCap className="w-4 h-4" />
                    <span>Enrolled Students</span>
                  </div>
                  <span className="font-semibold text-green-600">
                    {batchData.filled_seat}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Award className="w-4 h-4" />
                    <span>Available Seats</span>
                  </div>
                  <span className="font-semibold text-orange-600">
                    {batchData.total_seat - batchData.filled_seat}
                  </span>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{
                        width: `${(batchData.filled_seat / batchData.total_seat) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    {Math.round(
                      (batchData.filled_seat / batchData.total_seat) * 100,
                    )}
                    % filled
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Right Side */}
          <div className="lg:col-span-1">
            <div className="space-y-6 lg:sticky lg:top-11">
              {/* Zoom Link Card */}
              <div className="bg-linear-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Video className="w-6 h-6 text-purple-600" />
                    <h2 className="text-xl font-bold text-gray-800">
                      Zoom Link
                    </h2>
                  </div>
                  <ActionButton
                    variant="edit"
                    icon={Pen}
                    label="Update zoom link"
                    onClick={() => setIsZoomModalOpen(true)}
                  />
                </div>
                {batchData.zoom_link ? (
                  <a
                    href={batchData.zoom_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-700 break-all text-sm"
                  >
                    {batchData.zoom_link}
                  </a>
                ) : (
                  <p className="text-gray-500 text-sm">
                    No zoom link added yet. Click edit to add.
                  </p>
                )}
              </div>

              {/* Next Class Info */}
              {schedules && schedules.length > 0 && (() => {
                const nextSchedule = getNextUpcomingClass(schedules);
                if (!nextSchedule) return null;
                const nextLocal = convertUtcScheduleToLocal(
                  nextSchedule.day_of_week,
                  nextSchedule.start_time,
                  nextSchedule.end_time
                );
                return (
                  <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                    <h3 className="font-semibold text-gray-800 mb-3">
                      Next Class
                    </h3>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {nextLocal.day}
                        </p>
                        <p className="text-sm text-gray-500">
                          {nextLocal.timeString}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Actions Card */}
              <div className="bg-linear-to-r from-orange-50 to-yellow-50 rounded-2xl p-6 border border-orange-100">
                <h3 className="font-semibold text-gray-800 mb-3">Actions</h3>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/dashboard/my-assigned-batches/${batchData.id}/students`}
                  >
                    <ActionButton
                      variant="view"
                      icon={Users}
                      label="View Students"
                    />
                  </Link>
                  <Link href={`/dashboard/assignments/${batchData.id}`}>
                    <ActionButton
                      variant="view"
                      icon={NotebookPen}
                      label="Manage Assignments"
                    />
                  </Link>
                  <Link
                    href={`/dashboard/my-assigned-batches/${batchData.id}/class-recordings`}
                  >
                    <ActionButton
                      variant="view"
                      icon={Video}
                      label="Recordings"
                    />
                  </Link>
                  <Link
                    href={`/dashboard/my-assigned-batches/${batchData.id}/notes`}
                  >
                    <ActionButton
                      variant="view"
                      icon={NotepadText}
                      label="Notes"
                    />
                  </Link>
                </div>
              </div>

              {/* Teacher Info Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <UserRound className="w-6 h-6 text-purple-600" />
                  <h2 className="text-xl font-bold text-gray-800">
                    Your Profile
                  </h2>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto rounded-full bg-linear-to-br from-purple-100 to-pink-100 flex items-center justify-center mb-4">
                    {teacherData?.image_url ? (
                      <Image
                        src={teacherData.image_url}
                        alt={teacherData.name}
                        width={96}
                        height={96}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl font-bold text-purple-600">
                        {teacherData?.name?.charAt(0)}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {teacherData?.name}
                  </h3>
                  <p className="text-sm text-purple-600 mt-1">Expert Teacher</p>
                  <div className="flex items-center justify-center gap-1 mt-3">
                    <BadgeCheck className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-gray-500">
                      Verified Instructor
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Zoom Link Update Modal */}
      <UpdateZoomLinkModal
        isOpen={isZoomModalOpen}
        onClose={() => setIsZoomModalOpen(false)}
        batchId={batchId}
        currentZoomLink={batchData.zoom_link}
        onSuccess={refetch}
      />
    </div>
  );
};

export default BatchDetailsPageForTeacher;
