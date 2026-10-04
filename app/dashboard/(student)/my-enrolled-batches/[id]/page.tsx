"use client";

import { useGetSingleBatchForStudentQuery } from "@/src/redux/api/student/studentBatchApi";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import {
  Calendar,
  Clock,
  Users,
  User,
  Video,
  BookOpen,
  ChevronLeft,
  ZoomIn,
  CalendarDays,
  GraduationCap,
  BadgeCheck,
  Info,
  CheckCircle,
  ExternalLink,
  Award,
  UserRound,
  ChevronsLeft,
  NotebookText,
  TvMinimalPlay,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { ApiResponse, Schedule } from "@/types/batchesForStudent";
import Loader from "@/components/ui/Loader";
import MyButton from "@/components/ui/MyButton";
import Link from "next/link";
import ActionButton from "@/components/ui/ActionButton";
import { convertUtcScheduleToLocal } from "@/src/utils/timezone";

// Define TypeScript interfaces

const BatchDetailsPageForStudent = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  // Convert string to number for API call
  const batchId = id ? parseInt(id, 10) : 0;

  const { data, isLoading, isError } = useGetSingleBatchForStudentQuery(
    batchId,
    {
      skip: !batchId,
    },
  );

  const batchData = (data as ApiResponse)?.data;
  const classData = batchData?.class;
  const teacherData = batchData?.teacher;
  const schedules = batchData?.schedules;

  // Student is already enrolled (since this is the student batch view)
  const isEnrolled = true;

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
      <div className="min-h-screen flex items-center justify-center ">
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

        {/* Hero Section with Image */}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6 ">
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg mb-8">
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

              {/* Status Badge & Enrollment Status */}
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(batchData.status)}`}
                  >
                    {batchData.status}
                  </span>
                  {isEnrolled && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Enrolled
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
                    <span>Your Status</span>
                  </div>
                  <span className="font-semibold text-green-600 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Enrolled
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Award className="w-4 h-4" />
                    <span>Course Duration</span>
                  </div>
                  <span className="font-semibold text-gray-800">
                    {Math.ceil(
                      (new Date(batchData.end_date).getTime() -
                        new Date(batchData.start_date).getTime()) /
                        (1000 * 60 * 60 * 24),
                    )}{" "}
                    days
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Right Side */}
          <div className="space-y-6 sticky top-11 right-0  h-fit">
            {/* Zoom Link Card - Show for enrolled students */}
            {batchData.zoom_link && isEnrolled && (
              <div className="bg-linear-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                <div className="flex items-center gap-3 mb-4">
                  <Video className="w-6 h-6 text-purple-600" />
                  <h2 className="text-xl font-bold text-gray-800">
                    Join Live Class
                  </h2>
                </div>
                <p className="text-gray-600 mb-4">
                  Click the button below to join your live class session
                </p>
                <a
                  href={batchData.zoom_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MyButton>
                    Join Zoom Class
                    <ExternalLink className="w-4 h-4" />
                  </MyButton>
                </a>
              </div>
            )}
            {/* Next Class Info */}
            {schedules && schedules.length > 0 && (() => {
              const firstLocal = convertUtcScheduleToLocal(
                schedules[0].day_of_week,
                schedules[0].start_time,
                schedules[0].end_time
              );
              return (
                <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                  <h3 className="font-semibold text-gray-800 mb-3">Next Class</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {firstLocal.day}
                      </p>
                      <p className="text-sm text-gray-500">
                        {firstLocal.timeString}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* actions */}
            <div className="bg-linear-to-r from-orange-50 to-yellow-50 rounded-2xl p-6 border border-orange-100">
              <h3 className="font-semibold text-gray-800 mb-3">Actions</h3>
              <div className="flex items-center gap-3">
                <Link
                  href={`/dashboard/my-enrolled-batches/${batchData.id}/class-notes`}
                >
                  <ActionButton
                    variant="view"
                    icon={NotebookText}
                    label="View Notes"
                  />
                </Link>
                <Link
                  href={`/dashboard/my-enrolled-batches/${batchData.id}/recordings`}
                >
                  <ActionButton
                    variant="view"
                    icon={TvMinimalPlay}
                    label="Watch Recordings"
                  />
                </Link>
              </div>
            </div>
            {/* Teacher Info Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <UserRound className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-bold text-gray-800">
                  Your Instructor
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
  );
};

export default BatchDetailsPageForStudent;
