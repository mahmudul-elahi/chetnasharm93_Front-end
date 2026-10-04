"use client";
import React from "react";
import {
  Calendar,
  Clock,
  User,
  BookOpen,
  Eye,
  UsersRound,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { Batch } from "@/types/batches";
import WeeklySchedule from "@/components/ui/WeeklySchedule";
import { getLocalTimezone } from "@/src/utils/timezone";

interface BatchCardProps {
  batch: Batch;
}

const BatchCard: React.FC<BatchCardProps> = ({ batch }) => {
  const [localTz, setLocalTz] = React.useState<string>("");

  React.useEffect(() => {
    setLocalTz(getLocalTimezone());
  }, []);

  const availableSeats = batch.total_seat - batch.filled_seat;
  const bookedPercentage = (batch.filled_seat / batch.total_seat) * 100;

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getSeatStatus = () => {
    const percentageAvailable = (availableSeats / batch.total_seat) * 100;
    if (availableSeats === 0) {
      return { text: "Full", color: "text-red-700", bg: "bg-red-100" };
    } else if (percentageAvailable <= 20) {
      return {
        text: "Limited Seats",
        color: "text-orange-700",
        bg: "bg-orange-100",
      };
    } else {
      return {
        text: "Available",
        color: "text-emerald-700",
        bg: "bg-emerald-100",
      };
    }
  };

  const seatStatus = getSeatStatus();

  // Get teacher name - directly from batch.teacher (not nested in user)
  const teacherName = batch.teacher?.name || "Not Assigned";
  const teacherImage = batch.teacher?.image_url;

  // Get class title
  const classTitle = batch.class?.title || "Class";

  // Calculate duration in months
  const calculateDuration = () => {
    if (!batch.start_date || !batch.end_date) return "";
    const start = new Date(batch.start_date);
    const end = new Date(batch.end_date);
    const months = Math.floor(
      (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth())
    );
    if (months <= 0) return "";
    return `(${months} Month${months > 1 ? "s" : ""})`;
  };

  const durationText = calculateDuration();

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 border border-gray-100 hover:border-primary/50">
      {/* Content */}
      <div className="p-5 flex-1 flex flex-col space-y-4">
        {/* Header Section */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-2xl font-bold mb-1 text-primary transition-colors duration-300">
              {batch.name}
            </h3>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-sm font-medium text-gray-600 line-clamp-1">
                {classTitle}
              </span>
            </div>
          </div>
          <div className="w-fit bg-gradient-to-r from-primary to-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex-shrink-0">
            Batch #{batch.id}
          </div>
        </div>

        {/* Teacher Section */}
        <div className="flex items-center gap-3">
          <div className="relative">
            {teacherImage ? (
              <img
                src={teacherImage}
                alt={teacherName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/images/avatar-placeholder.jpg";
                }}
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-purple-100 flex items-center justify-center ring-2 ring-primary/20">
                <User className="w-5 h-5 text-primary" />
              </div>
            )}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 font-medium">Instructor</p>
            <p className="text-sm font-semibold text-gray-800 truncate">
              {teacherName}
            </p>
          </div>
        </div>

        {/* Weekly Schedule Section */}
        <WeeklySchedule
          schedules={batch.schedules}
        />

        {/* Timezone Notice */}
        <div className="flex items-center gap-2 text-xs text-gray-500 bg-primary/5 border border-primary/10 rounded-lg px-3 py-2">
          <Globe className="w-3.5 h-3.5 text-primary flex-shrink-0" />
          <span>Time shown in your local timezone{localTz ? ` (${localTz})` : ""}</span>
        </div>

        {/* Bottom Information Row */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200">
          {/* Duration */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-semibold text-gray-700">
                Duration
              </span>
            </div>
            <p className="text-sm font-semibold text-gray-900">
              {formatDate(batch.start_date)} – {formatDate(batch.end_date)}
            </p>
            {durationText && (
              <p className="text-xs text-gray-500">{durationText}</p>
            )}
          </div>

          {/* Seats Available */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <UsersRound className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-semibold text-gray-700">
                Seats Available
              </span>
            </div>
            <p
              className={`text-sm font-bold ${seatStatus.color}`}
            >
              {availableSeats === 0
                ? "Full"
                : `${availableSeats} of ${batch.total_seat} seats left`}
            </p>
            {seatStatus.text === "Limited Seats" && availableSeats > 0 && (
              <p className="text-xs text-orange-600 font-medium">
                ⚡ Only {availableSeats} left!
              </p>
            )}
          </div>
        </div>

        {/* CTA Button */}
        <Link
          href={`/classes/${batch.class_id}/batch/${batch.id}`}
          className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 transition-all duration-300 active:scale-98 shadow-md hover:shadow-xl flex items-center justify-center gap-2 font-semibold text-white rounded-full py-3 mt-auto"
        >
          <Eye className="w-4 h-4" />
          View Batch Details
        </Link>
      </div>
    </div>
  );
};

export default BatchCard;