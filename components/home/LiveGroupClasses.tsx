"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  Users,
  MessageCircle,
  Heart,
  Mic,
  Play,
  Pause,
  ArrowRight,
  CheckCircle2,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
} from "lucide-react";
import Link from "next/link";
import MyButton from "@/components/ui/MyButton";

export default function LiveGroupClasses() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const volumeBarRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Use refs for drag state to avoid stale closures in window event listeners
  const isDraggingRef = useRef(false);
  const isDraggingVolumeRef = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Format time (seconds → MM:SS)
  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const getProgressPercentage = () => {
    if (duration === 0) return 0;
    return (currentTime / duration) * 100;
  };

  // ─── Show/Hide Controls for Desktop (on mouse movement) ────────────────────
  const showControlsWithTimeout = useCallback(() => {
    setShowControls(true);
    
    // Clear existing timeout
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    // Hide controls after 3 seconds of inactivity (only when playing)
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  }, [isPlaying]);

  const handleMouseMove = useCallback(() => {
    if (!isMobile && !isDraggingRef.current && !isDraggingVolumeRef.current) {
      showControlsWithTimeout();
    }
  }, [isMobile, showControlsWithTimeout]);

  const handleMouseLeave = useCallback(() => {
    if (!isMobile && isPlaying) {
      setShowControls(false);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    }
  }, [isMobile, isPlaying]);

  // ─── Playback ────────────────────────────────────────────────────────────────

  const togglePlay = async () => {
    const video = videoRef.current;
    if (!video || videoError) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
      // On desktop, keep controls visible when paused
      if (!isMobile) {
        setShowControls(true);
      }
    } else {
      try {
        await video.play();
        setIsPlaying(true);
        // Hide controls after 3 seconds on desktop when playing
        if (!isMobile) {
          showControlsWithTimeout();
        }
      } catch (error) {
        console.error("Playback failed:", error);
        setVideoError(true);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && !isDraggingRef.current) {
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
    setCurrentTime(0);
    if (videoRef.current) videoRef.current.currentTime = 0;
    // Show controls when video ends
    setShowControls(true);
  };

  // ─── Pause video when not visible ────────────────────────────────────────────

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        const isVideoVisible = entry.isIntersecting;
        setIsVisible(isVideoVisible);

        // Pause video if it's playing and not visible
        if (!isVideoVisible && isPlaying) {
          video.pause();
          setIsPlaying(false);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, [isPlaying]);

  // ─── Progress bar drag ───────────────────────────────────────────────────────

  const seekTo = useCallback(
    (clientX: number) => {
      if (!progressBarRef.current || !videoRef.current || duration === 0)
        return;
      const rect = progressBarRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const seekTime = (x / rect.width) * duration;
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    },
    [duration],
  );

  const handleProgressDragMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      seekTo(clientX);
    },
    [seekTo],
  );

  const handleProgressDragEnd = useCallback(() => {
    isDraggingRef.current = false;
    window.removeEventListener("mousemove", handleProgressDragMove);
    window.removeEventListener("mouseup", handleProgressDragEnd);
    window.removeEventListener("touchmove", handleProgressDragMove);
    window.removeEventListener("touchend", handleProgressDragEnd);
  }, [handleProgressDragMove]);

  const handleProgressDragStart = useCallback(
    (
      e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
    ) => {
      isDraggingRef.current = true;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      seekTo(clientX);
      window.addEventListener("mousemove", handleProgressDragMove);
      window.addEventListener("mouseup", handleProgressDragEnd);
      window.addEventListener("touchmove", handleProgressDragMove);
      window.addEventListener("touchend", handleProgressDragEnd);
    },
    [seekTo, handleProgressDragMove, handleProgressDragEnd],
  );

  // ─── Volume bar drag ─────────────────────────────────────────────────────────

  const applyVolume = useCallback((clientX: number) => {
    if (!volumeBarRef.current || !videoRef.current) return;
    const rect = volumeBarRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const newVolume = x / rect.width;
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  }, []);

  const handleVolumeDragMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDraggingVolumeRef.current) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      applyVolume(clientX);
    },
    [applyVolume],
  );

  const handleVolumeDragEnd = useCallback(() => {
    isDraggingVolumeRef.current = false;
    window.removeEventListener("mousemove", handleVolumeDragMove);
    window.removeEventListener("mouseup", handleVolumeDragEnd);
    window.removeEventListener("touchmove", handleVolumeDragMove);
    window.removeEventListener("touchend", handleVolumeDragEnd);
  }, [handleVolumeDragMove]);

  const handleVolumeDragStart = useCallback(
    (
      e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
    ) => {
      e.preventDefault();
      isDraggingVolumeRef.current = true;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      applyVolume(clientX);
      window.addEventListener("mousemove", handleVolumeDragMove);
      window.addEventListener("mouseup", handleVolumeDragEnd);
      window.addEventListener("touchmove", handleVolumeDragMove);
      window.addEventListener("touchend", handleVolumeDragEnd);
    },
    [applyVolume, handleVolumeDragMove, handleVolumeDragEnd],
  );

  // ─── Mobile touch controls ────────────────────────────────────────────────────

  const handleVideoTap = () => {
    if (isMobile) {
      setShowControls(true);
      
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3000);
    }
  };

  const handleControlsTap = (e: React.MouseEvent | React.TouchEvent) => {
    if (isMobile) {
      e.stopPropagation();
      setShowControls(false);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    }
  };

  // Add touch event for mobile
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isMobile) return;

    const handleTap = () => {
      handleVideoTap();
    };

    video.addEventListener("touchstart", handleTap);

    return () => {
      video.removeEventListener("touchstart", handleTap);
    };
  }, [isPlaying, isMobile]);

  // ─── Mute ────────────────────────────────────────────────────────────────────

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isMuted) {
      const restored = volume || 0.5;
      video.volume = restored;
      setVolume(restored);
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  // ─── Fullscreen ──────────────────────────────────────────────────────────────

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      try {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } catch (error) {
        console.error("Fullscreen failed:", error);
      }
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () =>
      setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <section className="py-16 md:py-24 bg-white ">
      <div className="max-w-350 px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Users className="w-4 h-4" />
            Live Group Classes
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Practice English with{" "}
            <span className="bg-linear-to-r from-primary via-primary/90 to-secondary bg-clip-text text-transparent">
              expert teachers
            </span>
          </h2>
          <p className="text-gray-600 text-lg">
            Learn with classmates in real-time, interactive sessions
          </p>
        </div>

        {/* Benefit Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {[
            {
              icon: MessageCircle,
              title: "Real conversations",
              description:
                "Speak naturally with peers and teachers in guided discussions",
            },
            {
              icon: Heart,
              title: "Real confidence",
              description:
                "Build speaking confidence in a safe, supportive environment",
            },
            {
              icon: Mic,
              title: "No awkward silence",
              description: "Engaging activities that keep everyone talking",
            },
          ].map((benefit) => (
            <div
              key={benefit.title}
              className="text-center p-6 rounded-2xl bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <benefit.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Video Player */}
        <div
          ref={containerRef}
          className="relative rounded-2xl overflow-hidden mb-10 group"
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
                src="/assets/video.mp4"
                onClick={!isMobile ? togglePlay : undefined}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleVideoEnded}
                onError={() => setVideoError(true)}
                playsInline
                preload="metadata"
              />
            ) : (
              <img
                src="/assets/group-class-banner.svg"
                alt="Live group class in session"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://placehold.co/1200x500/3B82F6/FFFFFF?text=Live+Group+Class+in+Session&fontSize=32";
                }}
              />
            )}

            {/* Centered play overlay */}
            {!videoError && !isPlaying && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] transition-all cursor-pointer"
                onClick={togglePlay}
              >
                <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center hover:scale-110 transition-transform hover:bg-white">
                  <Play className="w-8 h-8 text-primary ml-1" />
                </div>
              </div>
            )}

            {/* Controls bar */}
            <div
              className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pt-10 pb-3 px-4 transition-all duration-300 ${
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

                <div
                  ref={progressBarRef}
                  className="relative flex-1 h-1.5 bg-white/30 rounded-full cursor-pointer group/progress"
                  onMouseDown={!isMobile ? handleProgressDragStart : undefined}
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

              {/* Bottom controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Play / Pause */}
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

                  {/* Volume */}
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

                    {/* Volume progress bar - hidden on mobile */}
                    <div className="hidden sm:block w-24 overflow-visible">
                      <div
                        ref={volumeBarRef}
                        className="relative w-24 h-1.5 bg-white/30 rounded-full cursor-pointer group/volbar"
                        onMouseDown={!isMobile ? handleVolumeDragStart : undefined}
                        onTouchStart={handleVolumeDragStart}
                      >
                        <div
                          className="absolute h-full bg-primary rounded-full pointer-events-none"
                          style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
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

                {/* Fullscreen */}
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

        {/* Features & CTA */}
        <div className="flex flex-wrap justify-between items-center gap-6">
          <div className="flex flex-wrap gap-6">
            {[
              "Max 8 students per class",
              "60-minute sessions",
              "All levels welcome",
            ].map((text) => (
              <div key={text} className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span className="text-gray-700">{text}</span>
              </div>
            ))}
          </div>

          <Link href="/classes">
            <MyButton className="gap-2">
              Try a Free Class
              <ArrowRight className="w-4 h-4" />
            </MyButton>
          </Link>
        </div>
      </div>
    </section>
  );
}