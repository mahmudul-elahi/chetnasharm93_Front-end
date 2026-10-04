"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  Mail,
  Phone,
  BookOpen,
  GraduationCap,
  Briefcase,
  FileText,
  ArrowLeft,
  Award,
  User,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  UserRoundPen,
  Ban as BanIcon,
  CircleCheckBig,
  Globe,
  Clock,
  Tag,
} from "lucide-react";
import {
  useGetAdminTeacherByIdQuery,
  useSuspendOrActivateTeacherMutation,
} from "@/src/redux/api/admin/teachersApi";
import Loader from "@/components/ui/Loader";
import MyButton from "@/components/ui/MyButton";
import ActionButton from "@/components/ui/ActionButton";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import UpdateTeacherModal from "../_components/UpdateTeacherModal";
import TeacherAvailabilityContent from "@/app/dashboard/(admin+teacher)/availability/_components/TeacherAvailabilityContent";
import { getAllCountries } from "countries-and-timezones";

export default function TeacherDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const teacherId = Number(params.id);

  const {
    data: teacherData,
    isLoading,
    isError,
    refetch,
  } = useGetAdminTeacherByIdQuery(teacherId);
  const teacher = teacherData?.data;

  const [suspendOrActivateTeacher] = useSuspendOrActivateTeacherMutation();

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    type: "suspend" | "activate";
    userId: number | null;
    userName: string;
  }>({
    isOpen: false,
    type: "suspend",
    userId: null,
    userName: "",
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const volumeBarRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  let controlsTimeout: NodeJS.Timeout;

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (value: number) => {
    if (videoRef.current) {
      const newVolume = Math.max(0, Math.min(1, value));
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && !isDragging) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const getProgressPercentage = () => {
    return duration > 0 ? (currentTime / duration) * 100 : 0;
  };

  const handleProgressDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);

    const handleDrag = (moveEvent: MouseEvent | TouchEvent) => {
      if (progressBarRef.current && videoRef.current) {
        const rect = progressBarRef.current.getBoundingClientRect();
        const clientX =
          "touches" in moveEvent
            ? moveEvent.touches[0].clientX
            : moveEvent.clientX;
        const percentage = Math.max(
          0,
          Math.min(1, (clientX - rect.left) / rect.width),
        );
        videoRef.current.currentTime = percentage * duration;
        setCurrentTime(percentage * duration);
      }
    };

    const handleDragEnd = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleDrag);
      document.removeEventListener("mouseup", handleDragEnd);
      document.removeEventListener("touchmove", handleDrag);
      document.removeEventListener("touchend", handleDragEnd);
    };

    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", handleDragEnd);
    document.addEventListener("touchmove", handleDrag);
    document.addEventListener("touchend", handleDragEnd);
  };

  const handleVolumeDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();

    const handleDrag = (moveEvent: MouseEvent | TouchEvent) => {
      if (volumeBarRef.current) {
        const rect = volumeBarRef.current.getBoundingClientRect();
        const clientX =
          "touches" in moveEvent
            ? moveEvent.touches[0].clientX
            : moveEvent.clientX;
        const percentage = Math.max(
          0,
          Math.min(1, (clientX - rect.left) / rect.width),
        );
        handleVolumeChange(percentage);
      }
    };

    const handleDragEnd = () => {
      document.removeEventListener("mousemove", handleDrag);
      document.removeEventListener("mouseup", handleDragEnd);
      document.removeEventListener("touchmove", handleDrag);
      document.removeEventListener("touchend", handleDragEnd);
    };

    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", handleDragEnd);
    document.addEventListener("touchmove", handleDrag);
    document.addEventListener("touchend", handleDragEnd);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimeout);
    controlsTimeout = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 2000);
  };

  const handleMouseLeave = () => {
    if (isPlaying) {
      setShowControls(false);
    }
    clearTimeout(controlsTimeout);
  };

  const handleControlsTap = () => {
    setShowControls(!showControls);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Helper to get country name from code
  const getCountryName = (code: string): string => {
    if (!code) return "Not specified";
    const allCountries = getAllCountries();
    const country = allCountries[code as keyof typeof allCountries];
    return country ? country.name : code;
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (isError || !teacher) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4">
        <p className="text-red-500 text-lg">Failed to load teacher details</p>
        <MyButton onClick={() => router.back()}>Go Back</MyButton>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Teachers</span>
      </button>

      {/* Teacher Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            {teacher.image_url ? (
              <img
                src={teacher.image_url}
                alt={teacher.name}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover ring-4 ring-primary/20"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://ui-avatars.com/api/?name=" + teacher.name;
                }}
              />
            ) : (
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-primary/10 flex items-center justify-center ring-4 ring-primary/20">
                <User className="w-12 h-12 md:w-16 md:h-16 text-primary" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {teacher.name}
              </h1>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold w-fit ${
                  teacher.suspend_status === 0
                    ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                {teacher.suspend_status === 0 ? "Active" : "Suspended"}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 mt-4">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{teacher.email}</span>
              </div>
              {teacher.mobile && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{teacher.mobile}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <ActionButton
              variant="edit"
              icon={UserRoundPen}
              onClick={() => setIsUpdateModalOpen(true)}
              label="Edit Teacher"
            />

            {teacher.suspend_status === 0 ? (
              <ActionButton
                variant="delete"
                icon={BanIcon}
                onClick={() => {
                  setConfirmationModal({
                    isOpen: true,
                    type: "suspend",
                    userId: teacher.id,
                    userName: teacher.name,
                  });
                }}
                label="Suspend Teacher"
              />
            ) : (
              <ActionButton
                variant="success"
                icon={CircleCheckBig}
                onClick={() => {
                  setConfirmationModal({
                    isOpen: true,
                    type: "activate",
                    userId: teacher.id,
                    userName: teacher.name,
                  });
                }}
                label="Activate Teacher"
              />
            )}
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          {/* Quick Info */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Professional Information
            </h2>
            <div className="space-y-4">
              <InfoItem
                icon={BookOpen}
                label="Expertise"
                value={teacher.expertise || "Not specified"}
              />
              <InfoItem
                icon={GraduationCap}
                label="Qualification"
                value={teacher.qualification || "Not specified"}
              />
              <InfoItem
                icon={Briefcase}
                label="Experience"
                value={
                  teacher.years_of_exp
                    ? `${teacher.years_of_exp} years`
                    : "Not specified"
                }
              />
              <InfoItem
                icon={Globe}
                label="Country"
                value={getCountryName(teacher.country || "")}
              />
              <InfoItem
                icon={Clock}
                label="Timezone"
                value={teacher.timezone || "Not specified"}
              />
              <InfoItem
                icon={Award}
                label="Teacher ID"
                value={`#${teacher.id}`}
              />
            </div>
          </div>
        </div>

        {/* Video Section */}
        <div className="lg:col-span-2">
          {teacher.intro_video_url ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Introduction Video
              </h2>

              <div
                ref={containerRef}
                className="relative rounded-2xl overflow-hidden group"
              >
                <div
                  className="relative w-full aspect-video bg-black"
                  onMouseMove={!isMobile ? handleMouseMove : undefined}
                  onMouseLeave={!isMobile ? handleMouseLeave : undefined}
                >
                  {!videoError ? (
                    <video
                      ref={videoRef}
                      className="w-full h-full object-contain"
                      src={teacher.intro_video_url}
                      poster={teacher.image_url || undefined}
                      onClick={!isMobile ? togglePlay : undefined}
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                      onEnded={handleVideoEnded}
                      onError={() => setVideoError(true)}
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-gray-900 to-gray-700 flex flex-col items-center justify-center">
                      <VideoIcon className="w-16 h-16 text-gray-400 mb-2" />
                      <p className="text-gray-300 text-sm">Video unavailable</p>
                      <p className="text-gray-500 text-xs mt-1">
                        Unable to load video
                      </p>
                    </div>
                  )}

                  {!videoError && !isPlaying && (
                    <div
                      className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] transition-all cursor-pointer"
                      onClick={togglePlay}
                    >
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/90 flex items-center justify-center hover:scale-110 transition-transform hover:bg-white">
                        <Play className="w-7 h-7 md:w-8 md:h-8 text-primary ml-1" />
                      </div>
                    </div>
                  )}

                  <div
                    className={`absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent pt-10 pb-3 px-4 transition-all duration-300 ${
                      showControls || (!isPlaying && !videoError)
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-full pointer-events-none"
                    }`}
                    onClick={isMobile ? handleControlsTap : undefined}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-white text-xs font-mono">
                        {formatTime(currentTime)}
                      </span>

                      <div
                        ref={progressBarRef}
                        className="relative flex-1 h-1.5 bg-white/30 rounded-full cursor-pointer group/progress"
                        onMouseDown={
                          !isMobile ? handleProgressDragStart : undefined
                        }
                        onTouchStart={handleProgressDragStart}
                      >
                        <div
                          className="absolute h-full bg-primary rounded-full pointer-events-none"
                          style={{ width: `${getProgressPercentage()}%` }}
                        />
                        <div
                          className="absolute top-1/2 w-3.5 h-3.5 bg-primary rounded-full shadow-lg opacity-0 group-hover/progress:opacity-100 transition-opacity cursor-grab active:cursor-grabbing pointer-events-none"
                          style={{
                            left: `${getProgressPercentage()}%`,
                            transform: "translate(-50%, -50%)",
                          }}
                        />
                      </div>

                      <span className="text-white text-xs font-mono">
                        {formatTime(duration)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePlay();
                          }}
                          className="text-white hover:text-primary transition-colors"
                        >
                          {isPlaying ? (
                            <Pause className="w-5 h-5" />
                          ) : (
                            <Play className="w-5 h-5" />
                          )}
                        </button>

                        <div className="flex items-center gap-2 group/volume">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleMute();
                            }}
                            className="text-white hover:text-primary transition-colors shrink-0"
                          >
                            {isMuted || volume === 0 ? (
                              <VolumeX className="w-5 h-5" />
                            ) : (
                              <Volume2 className="w-5 h-5" />
                            )}
                          </button>

                          <div className="hidden sm:block w-24 overflow-visible">
                            <div
                              ref={volumeBarRef}
                              className="relative w-24 h-1.5 bg-white/30 rounded-full cursor-pointer group/volbar"
                              onMouseDown={
                                !isMobile ? handleVolumeDragStart : undefined
                              }
                              onTouchStart={handleVolumeDragStart}
                            >
                              <div
                                className="absolute h-full bg-primary rounded-full pointer-events-none"
                                style={{
                                  width: `${(isMuted ? 0 : volume) * 100}%`,
                                }}
                              />
                              <div
                                className="absolute top-1/2 w-3 h-3 bg-primary rounded-full shadow-lg opacity-0 group-hover/volbar:opacity-100 transition-opacity cursor-grab active:cursor-grabbing pointer-events-none"
                                style={{
                                  left: `${(isMuted ? 0 : volume) * 100}%`,
                                  transform: "translate(-50%, -50%)",
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFullscreen();
                        }}
                        className="text-white hover:text-primary transition-colors"
                      >
                        {isFullscreen ? (
                          <Minimize className="w-5 h-5" />
                        ) : (
                          <Maximize className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Introduction Video
              </h2>
              <div className="w-full aspect-video bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-xl flex flex-col items-center justify-center">
                <VideoIcon className="w-12 h-12 text-gray-400 mb-2" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No introduction video available
                </p>
              </div>
            </div>
          )}
        </div>

        {/* teacher availability section */}
        <div className="col-span-full">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Teacher Availability
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage weekly schedule and time slots
            </p>
          </div>
          <TeacherAvailabilityContent teacherId={teacherId} />
        </div>
        <div className="col-span-full space-y-6">
          {/* Bio */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Biography
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              {teacher.bio || "No biography provided."}
            </p>
          </div>

          {/* About */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              About
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              {teacher.about || "No information provided."}
            </p>
          </div>

          {/* Specializations */}
          {teacher.specializations && teacher.specializations.length > 0 && (
            <TagListCard
              icon={BookOpen}
              title="Specializations"
              tags={teacher.specializations}
            />
          )}

          {/* Languages Spoken */}
          {teacher.languages_spoken && teacher.languages_spoken.length > 0 && (
            <TagListCard
              icon={Globe}
              title="Languages Spoken"
              tags={teacher.languages_spoken}
            />
          )}

          {/* Courses Can Teach */}
          {teacher.courses_can_teach &&
            teacher.courses_can_teach.length > 0 && (
              <TagListCard
                icon={Award}
                title="Courses Can Teach"
                tags={teacher.courses_can_teach}
              />
            )}

          {/* Interests */}
          {teacher.interests && teacher.interests.length > 0 && (
            <TagListCard
              icon={Tag}
              title="Interests"
              tags={teacher.interests}
            />
          )}
        </div>
      </div>

      {/* Update Teacher Modal */}
      {isUpdateModalOpen && (
        <UpdateTeacherModal
          id={teacherId}
          onClose={() => setIsUpdateModalOpen(false)}
          onUpdate={() => {
            refetch();
            setIsUpdateModalOpen(false);
          }}
        />
      )}

      {/* Confirmation Modal for Suspend/Activate */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() =>
          setConfirmationModal({
            isOpen: false,
            type: "suspend",
            userId: null,
            userName: "",
          })
        }
        type={confirmationModal.type}
        userId={confirmationModal.userId}
        userName={confirmationModal.userName}
        mutation={suspendOrActivateTeacher}
        entityType="teacher"
        onSuccess={() => {
          refetch();
        }}
      />
    </div>
  );
}

// Helper component
function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 bg-primary/10 rounded-lg">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
}

// Tag List Card component for array fields
function TagListCard({
  icon: Icon,
  title,
  tags,
}: {
  icon: any;
  title: string;
  tags: string[];
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Icon className="w-5 h-5 text-primary" />
        {title}
      </h2>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center px-3 py-1 text-sm font-medium text-primary bg-primary/5 border border-primary/10 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

// Video icon component
function VideoIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  );
}
