"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  X,
} from "lucide-react";

export interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  tutorName: string;
}

const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  videoUrl,
  tutorName,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const volumeBarRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const isDraggingRef = useRef(false);
  const isDraggingVolumeRef = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  let controlsTimeout: NodeJS.Timeout;

  // Check if mobile
  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  // Handle animation on mount/unmount and pause video when closing
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      // Pause video when modal closes
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Reset video state when modal opens
  useEffect(() => {
    if (isOpen && videoRef.current) {
      setVideoError(false);
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);
    }
  }, [isOpen]);

  // Video player functions
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
      setVideoError(false);
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

  // FIXED: Improved progress bar click handler
  const handleProgressClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (progressBarRef.current && videoRef.current && duration > 0) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      let percentage = (clientX - rect.left) / rect.width;
      percentage = Math.max(0, Math.min(1, percentage));
      
      const newTime = percentage * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // FIXED: Progress bar drag start
  const handleProgressDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);

    // Handle drag move
    const handleDrag = (moveEvent: MouseEvent | TouchEvent) => {
      if (progressBarRef.current && videoRef.current && duration > 0) {
        const rect = progressBarRef.current.getBoundingClientRect();
        const clientX = "touches" in moveEvent
          ? moveEvent.touches[0].clientX
          : moveEvent.clientX;
        let percentage = (clientX - rect.left) / rect.width;
        percentage = Math.max(0, Math.min(1, percentage));
        
        const newTime = percentage * duration;
        videoRef.current.currentTime = newTime;
        setCurrentTime(newTime);
      }
    };

    // Handle drag end
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
    e.stopPropagation();

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

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const handleClose = () => {
    // Pause video immediately
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!isOpen && !isAnimating) return null;

  return (
    <>
      {/* Backdrop with glass blur effect */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-500 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div
        ref={modalRef}
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-500 ${
          isOpen
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-8 scale-95 pointer-events-none"
        }`}
      >
        <div
          className="relative w-full max-w-5xl mx-auto transition-all duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button with animation */}
          <button
            onClick={handleClose}
            className="absolute -top-12 right-0 text-white/70 hover:text-white transition-all duration-300 hover:scale-110 z-10 group"
            aria-label="Close modal"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer" />
              <X className="w-6 h-6 relative z-10 cursor-pointer" />
            </div>
          </button>

          {/* Tutor name with fade in animation */}
          <div className="absolute -top-12 left-0 text-white/70 text-sm animate-in fade-in slide-in-from-left-5 duration-500">
            Watching: {tutorName}
          </div>

          {/* Video Player Container with scale animation */}
          <div
            ref={containerRef}
            className={`relative rounded-2xl overflow-hidden bg-black/90 shadow-2xl transition-all duration-500 ${
              isOpen
                ? "scale-100 opacity-100"
                : "scale-95 opacity-0"
            }`}
            style={{
              animation: isOpen ? "zoomIn 0.4s ease-out" : "none",
            }}
          >
            <div
              className="relative w-full aspect-video bg-black"
              onMouseMove={!isMobile ? handleMouseMove : undefined}
              onMouseLeave={!isMobile ? handleMouseLeave : undefined}
            >
              {!videoError && videoUrl ? (
                <video
                  ref={videoRef}
                  className="w-full h-full object-contain"
                  src={videoUrl}
                  onClick={!isMobile ? togglePlay : undefined}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onEnded={handleVideoEnded}
                  onError={() => setVideoError(true)}
                  playsInline
                  preload="metadata"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center">
                  <svg
                    className="w-16 h-16 text-gray-500 mb-4 opacity-50"
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
                  <p className="text-white/50 text-lg mb-2">Video unavailable</p>
                  <p className="text-white/30 text-sm">
                    The video could not be loaded
                  </p>
                </div>
              )}

              {/* Centered play overlay with pulse animation */}
              {!videoError && !isPlaying && (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] transition-all cursor-pointer group"
                  onClick={togglePlay}
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/90 flex items-center justify-center hover:scale-110 transition-all duration-300 hover:bg-white group-hover:shadow-xl animate-in fade-in zoom-in duration-300">
                    <Play className="w-7 h-7 md:w-8 md:h-8 text-purple-600 ml-1" />
                  </div>
                </div>
              )}

              {/* Controls bar */}
              <div
                className={`absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 via-black/50 to-transparent pt-10 pb-3 px-4 transition-all duration-300 ${
                  showControls || (!isPlaying && !videoError)
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-full pointer-events-none"
                }`}
                onClick={isMobile ? handleControlsTap : undefined}
              >
                {/* Progress bar */}
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-white text-xs font-mono">
                    {formatTime(currentTime)}
                  </span>

                  {/* FIXED: Progress bar with better click handling */}
                  <div
                    ref={progressBarRef}
                    className="relative flex-1 h-1.5 bg-white/30 rounded-full cursor-pointer group/progress"
                    onClick={handleProgressClick}
                    onMouseDown={!isMobile ? handleProgressDragStart : undefined}
                    onTouchStart={handleProgressDragStart}
                  >
                    <div
                      className="absolute h-full bg-linear-to-r from-primary to-secondary rounded-full pointer-events-none transition-all duration-100"
                      style={{ width: `${getProgressPercentage()}%` }}
                    />
                    <div
                      className="absolute top-1/2 w-3.5 h-3.5 bg-purple-500 rounded-full shadow-lg opacity-0 group-hover/progress:opacity-100 transition-opacity cursor-grab active:cursor-grabbing pointer-events-none"
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

                {/* Bottom controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlay();
                      }}
                      className="text-white hover:text-purple-400 transition-all duration-200 hover:scale-105 cursor-pointer"
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
                        className="text-white hover:text-purple-400 transition-all duration-200 hover:scale-105 shrink-0 cursor-pointer"
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
                          onClick={(e) => {
                            e.stopPropagation();
                            if (volumeBarRef.current) {
                              const rect = volumeBarRef.current.getBoundingClientRect();
                              const clientX = e.clientX;
                              const percentage = Math.max(
                                0,
                                Math.min(1, (clientX - rect.left) / rect.width),
                              );
                              handleVolumeChange(percentage);
                            }
                          }}
                          onMouseDown={!isMobile ? handleVolumeDragStart : undefined}
                          onTouchStart={handleVolumeDragStart}
                        >
                          <div
                            className="absolute h-full bg-linear-to-r from-primary to-secondary rounded-full pointer-events-none transition-all duration-100"
                            style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                          />
                          <div
                            className="absolute top-1/2 w-3 h-3 bg-purple-500 rounded-full shadow-lg opacity-0 group-hover/volbar:opacity-100 transition-opacity cursor-grab active:cursor-grabbing pointer-events-none"
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
                    className="text-white hover:text-purple-400 transition-all duration-200 hover:scale-105 cursor-pointer"
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
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
};

export default VideoModal;