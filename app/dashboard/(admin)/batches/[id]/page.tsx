"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  Video,
  AlertCircle,
  ChevronsLeft,
  CheckCircle,
  XCircle,
  BookOpen,
  Info,
  Power,
  PowerOff,
  FileText,
  Ban as BanIcon,
  CircleCheckBig,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  Award,
  Briefcase,
  GraduationCap,
  Star,
  Trash,
  Pen,
  BookUser,
  UsersRound,
  UserRound,
} from "lucide-react";
import {
  useDeleteBatchForAdminMutation,
  useGetBatchesForAdminByIdQuery,
  useUpdateActiveStatusBatchForAdminMutation,
} from "@/src/redux/api/admin/adminBatchesApi";
import Loader from "@/components/ui/Loader";
import MyButton from "@/components/ui/MyButton";
import ActionButton from "@/components/ui/ActionButton";
import { toast } from "sonner";
import { useGetAdminTeacherByIdQuery } from "@/src/redux/api/admin/teachersApi";
import { useGetClassForAdminByIdQuery } from "@/src/redux/api/admin/adminClassApi";
import Link from "next/link";
import ActionConfirmationModal, {
  ActionType,
} from "@/components/modals/ActionConfirmationModal";

export default function BatchDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const batchId = Number(params.id);
  const [actionModal, setActionModal] = useState<{
    isOpen: boolean;
    actionType: ActionType;
    id: number | null;
    mutation: any;
    name: string;
  }>({
    isOpen: false,
    actionType: "delete",
    id: null,
    mutation: null,
    name: "",
  });

  // Get today's date for attendance
  const today = format(new Date(), "yyyy-MM-dd");

  const {
    data: batchData,
    isLoading,
    isError,
    refetch,
  } = useGetBatchesForAdminByIdQuery(batchId);
  const batch = batchData?.data;

  const { data: teacherData, isLoading: isTeacherLoading } =
    useGetAdminTeacherByIdQuery(batch?.teacher_id, {
      skip: !batch?.teacher_id,
    });

  const { data: classData, isLoading: isClassLoading } =
    useGetClassForAdminByIdQuery(batch?.class_id, {
      skip: !batch?.class_id,
    });
  const teacher = teacherData?.data;
  const classInfo = classData?.data;

  // Modal states
  const [showTeacherDetails, setShowTeacherDetails] = useState(false);
  const [showClassDetails, setShowClassDetails] = useState(false);

  const [deleteBatch] = useDeleteBatchForAdminMutation();
  const [updateBatchActiveStatus] =
    useUpdateActiveStatusBatchForAdminMutation();

  // Loading state
  if (isLoading || isClassLoading || isTeacherLoading) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  // Error state
  if (isError || !batch) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="text-red-500 text-lg">Failed to load batch details</p>
        <MyButton onClick={() => router.push("/dashboard/batches")}>
          Go Back
        </MyButton>
      </div>
    );
  }

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format time helper
  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5);
  };

  // Status configuration
  const statusConfig = {
    upcoming: {
      label: "Upcoming",
      color: "text-blue-600 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/30",
      icon: Clock,
    },
    ongoing: {
      label: "Ongoing",
      color:
        "text-green-600 bg-green-100 dark:text-green-300 dark:bg-green-900/30",
      icon: CheckCircle,
    },
    completed: {
      label: "Completed",
      color: "text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-gray-900/30",
      icon: CheckCircle,
    },
    cancelled: {
      label: "Cancelled",
      color: "text-red-600 bg-red-100 dark:text-red-300 dark:bg-red-900/30",
      icon: XCircle,
    },
  };

  const status =
    statusConfig[batch.status as keyof typeof statusConfig] ||
    statusConfig.upcoming;
  const StatusIcon = status.icon;

  // Days mapping
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
      >
        <ChevronsLeft className="w-4 h-4" />
        <span>Back to Batches</span>
      </button>

      {/* Batch Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Left Section */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {batch.name}
              </h1>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}
                >
                  <StatusIcon className="w-3 h-3" />
                  {status.label}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                    batch.active_status === 1
                      ? "text-green-600 bg-green-100 dark:text-green-300 dark:bg-green-900/30"
                      : "text-red-600 bg-red-100 dark:text-red-300 dark:bg-red-900/30"
                  }`}
                >
                  {batch.active_status === 1 ? (
                    <Power className="w-3 h-3" />
                  ) : (
                    <PowerOff className="w-3 h-3" />
                  )}
                  {batch.active_status === 1 ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Batch ID: #{batch.id}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <BookOpen className="w-4 h-4" />
                <span className="text-sm">
                  Class: {classInfo?.title || batch.class?.title || "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <UserRound className="w-4 h-4" />
                <span className="text-sm">
                  Teacher: {teacher?.name || batch.teacher?.name || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Actions Section */}
          <div className="flex gap-2">
            <Link href={`/dashboard/attendance/${batchId}/update?date=${today}`}>
              <ActionButton
                variant="view"
                icon={BookUser}
                label="Take Attendance"
                showText={true}
              />
            </Link>
            {/* Edit Button */}
            <Link href={`/dashboard/batches/update/${batchId}`}>
              <ActionButton variant="edit" icon={Pen} label="Edit Batch" />
            </Link>
            <ActionButton
              variant="delete"
              icon={Trash}
              onClick={() => {
                setActionModal({
                  isOpen: true,
                  actionType: "delete",
                  mutation: deleteBatch,
                  id: Number(batchId),
                  name: batch?.name,
                });
              }}
              label="Delete This Batch"
            />
            {batch?.active_status === 0 ? (
              <ActionButton
                variant="success"
                icon={CircleCheckBig}
                onClick={() => {
                  setActionModal({
                    isOpen: true,
                    actionType: "activate",
                    id: Number(batchId),
                    mutation: updateBatchActiveStatus,
                    name: batch?.name,
                  });
                }}
                label="Activate Batch"
              />
            ) : (
              <ActionButton
                variant="delete"
                icon={BanIcon}
                onClick={() => {
                  setActionModal({
                    isOpen: true,
                    actionType: "deactivate",
                    id: Number(batchId),
                    mutation: updateBatchActiveStatus,
                    name: batch?.name,
                  });
                }}
                label="Deactivate Batch"
              />
            )}
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          {/* Date Information */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Date Information
            </h2>
            <div className="space-y-4">
              <InfoItem
                icon={Calendar}
                label="Start Date"
                value={formatDate(batch.start_date)}
              />
              <InfoItem
                icon={Calendar}
                label="End Date"
                value={formatDate(batch.end_date)}
              />
              <InfoItem
                icon={Clock}
                label="Duration"
                value={`${Math.ceil(
                  (new Date(batch.end_date).getTime() -
                    new Date(batch.start_date).getTime()) /
                    (1000 * 60 * 60 * 24),
                )} days`}
              />
            </div>
          </div>

          {/* Seat Information */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <UsersRound className="w-5 h-5 text-primary" />
              Seat Availability
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">
                    Filled Seats
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {batch.filled_seat} / {batch.total_seat}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(batch.filled_seat / batch.total_seat) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div className="text-center pt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {batch.total_seat - batch.filled_seat} seats remaining
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Fill Rate:{" "}
                  {((batch.filled_seat / batch.total_seat) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              Additional Information
            </h2>
            <div className="space-y-4">
              <InfoItem
                icon={Info}
                label="Created At"
                value={new Date(batch.created_at).toLocaleString()}
              />
              <InfoItem
                icon={Info}
                label="Last Updated"
                value={new Date(batch.updated_at).toLocaleString()}
              />
              <InfoItem
                icon={batch.active_status === 1 ? Power : PowerOff}
                label="Status"
                value={batch.active_status === 1 ? "Active" : "Inactive"}
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* Class Information - Enhanced */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <button
              onClick={() => setShowClassDetails(!showClassDetails)}
              className="w-full flex items-center justify-between"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Class Information
              </h2>
              {showClassDetails ? (
                <ChevronUp className="w-4 h-4 text-gray-500 cursor-pointer" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500 cursor-pointer" />
              )}
            </button>

            {showClassDetails && classInfo && (
              <div className="mt-4 space-y-4">
                {/* Class Image */}
                {classInfo.image_url && (
                  <div className="flex justify-center mb-4">
                    <img
                      src={classInfo.image_url}
                      alt={classInfo.title}
                      className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoItem
                    icon={BookOpen}
                    label="Class Title"
                    value={classInfo.title || "N/A"}
                  />
                  <InfoItem
                    icon={FileText}
                    label="Class ID"
                    value={`#${classInfo.id}`}
                  />
                  <InfoItem
                    icon={GraduationCap}
                    label="Description"
                    value={classInfo.description || "N/A"}
                  />
                  <InfoItem
                    icon={Clock}
                    label="Duration"
                    value={`${classInfo.duration_in_days || 0} days`}
                  />
                  <InfoItem
                    icon={UsersRound}
                    label="Total Classes"
                    value={classInfo.total_classes || "N/A"}
                  />
                  <InfoItem
                    icon={Award}
                    label="Price"
                    value={`$${parseFloat(classInfo.price || 0).toFixed(2)}`}
                  />
                  <InfoItem
                    icon={CircleCheckBig}
                    label="Status"
                    value={classInfo.is_active === 1 ? "Active" : "Inactive"}
                    valueClassName={
                      classInfo.is_active === 1
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  />
                </div>
              </div>
            )}

            {showClassDetails && !classInfo && (
              <div className="mt-4 text-center py-4 text-gray-500">
                No class information available
              </div>
            )}

            {!showClassDetails && (
              <div className="mt-2 text-sm text-gray-500">
                Click to view class details including description, duration, and
                pricing
              </div>
            )}
          </div>

          {/* Teacher Information - Enhanced */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <button
              onClick={() => setShowTeacherDetails(!showTeacherDetails)}
              className="w-full flex items-center justify-between"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <UserRound className="w-5 h-5 text-primary" />
                Teacher Information
              </h2>
              {showTeacherDetails ? (
                <ChevronUp className="w-4 h-4 text-gray-500 cursor-pointer " />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500 cursor-pointer" />
              )}
            </button>

            {showTeacherDetails && teacher && (
              <div className="mt-4 space-y-4">
                {/* Teacher Image */}
                {teacher.image_url && (
                  <div className="flex justify-center mb-4">
                    <img
                      src={teacher.image_url}
                      alt={teacher.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoItem
                    icon={UserRound}
                    label="Teacher Name"
                    value={teacher.name || "N/A"}
                  />
                  <InfoItem
                    icon={Mail}
                    label="Email"
                    value={teacher.email || "N/A"}
                  />
                  <InfoItem
                    icon={Phone}
                    label="Mobile"
                    value={teacher.mobile || "N/A"}
                  />
                  <InfoItem
                    icon={Award}
                    label="Qualification"
                    value={teacher.qualification || "N/A"}
                  />
                  <InfoItem
                    icon={Briefcase}
                    label="Expertise"
                    value={teacher.expertise || "N/A"}
                  />
                  <InfoItem
                    icon={Star}
                    label="Years of Experience"
                    value={`${teacher.years_of_exp || 0} years`}
                  />
                  <InfoItem
                    icon={FileText}
                    label="Bio"
                    value={teacher.bio || "N/A"}
                  />
                  <InfoItem
                    icon={BanIcon}
                    label="Status"
                    value={
                      teacher.suspend_status === 0 ? "Active" : "Suspended"
                    }
                    valueClassName={
                      teacher.suspend_status === 0
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  />
                </div>
              </div>
            )}

            {showTeacherDetails && !teacher && (
              <div className="mt-4 text-center py-4 text-gray-500">
                No teacher information available
              </div>
            )}

            {!showTeacherDetails && (
              <div className="mt-2 text-sm text-gray-500">
                Click to view teacher details including qualifications,
                expertise, and introduction video
              </div>
            )}
          </div>

          {/* Schedule Information */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Class Schedule
            </h2>
            {batch.schedules && batch.schedules.length > 0 ? (
              <div className="space-y-3">
                {batch.schedules.map((schedule: any) => (
                  <div
                    key={schedule.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-24 font-medium text-gray-900 dark:text-white">
                        {daysOfWeek[schedule.day_of_week]}
                      </div>
                      <div className="text-gray-600 dark:text-gray-300">
                        {formatTime(schedule.start_time)} -{" "}
                        {formatTime(schedule.end_time)}
                      </div>
                    </div>
                    {schedule.reminder_sent_date && (
                      <span className="text-xs text-green-600 dark:text-green-400">
                        Reminder sent:{" "}
                        {new Date(
                          schedule.reminder_sent_date,
                        ).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No schedule available for this batch</p>
              </div>
            )}
          </div>

          {/* Zoom Meeting Link */}
          {batch.zoom_link && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Video className="w-5 h-5 text-primary" />
                Meeting Link
              </h2>
              <a
                href={batch.zoom_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Video className="w-4 h-4" />
                Join Zoom Meeting
              </a>
            </div>
          )}
        </div>
      </div>
      <ActionConfirmationModal
        isOpen={actionModal.isOpen}
        onClose={() =>
          setActionModal({
            isOpen: false,
            actionType: "delete",
            mutation: null,
            id: null,
            name: "",
          })
        }
        id={actionModal.id}
        name={actionModal.name}
        mutation={actionModal.mutation}
        actionType={actionModal.actionType}
        entityName="Batch"
        onSuccess={() => refetch()}
      />
    </div>
  );
}

// Helper component
function InfoItem({
  icon: Icon,
  label,
  value,
  valueClassName = "",
}: {
  icon: any;
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 bg-primary/10 rounded-lg shrink-0">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p
          className={`text-sm font-medium text-gray-900 dark:text-white truncate ${valueClassName}`}
        >
          {value || "N/A"}
        </p>
      </div>
    </div>
  );
}
