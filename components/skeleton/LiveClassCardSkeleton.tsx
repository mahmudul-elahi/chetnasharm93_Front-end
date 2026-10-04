// components/cards/LiveClassCardSkeleton.tsx
import React from "react";
import { Clock, Calendar, Video, BookOpen, Award } from "lucide-react";

const LiveClassCardSkeleton = () => {
  return (
    <div className="group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
      {/* Image Section Skeleton */}
      <div className="relative h-52 overflow-hidden bg-linear-to-br from-gray-200 to-gray-300">
        {/* Image placeholder */}
        <div className="w-full h-full bg-gray-200" />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/10 to-transparent" />

        {/* Class Meta Badges Skeleton */}
        <div className="absolute bottom-4 left-4 flex gap-2 z-10">
          <div className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-gray-300" />
            <div className="w-12 h-3 bg-gray-300 rounded"></div>
          </div>
          <div className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-gray-300" />
            <div className="w-10 h-3 bg-gray-300 rounded"></div>
          </div>
          <div className="bg-red-400/80 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1.5">
            <Video className="w-3 h-3 text-white/70" />
            <div className="w-8 h-3 bg-white/30 rounded"></div>
          </div>
        </div>
      </div>

      {/* Content Section Skeleton */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Title Skeleton */}
        <div className="h-7 bg-gray-200 rounded-lg w-3/4 mb-2"></div>

        {/* Description Skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>

        {/* Quick Info Skeletons */}
        <div className="space-y-2.5 mb-4">
          {/* Sessions Skeleton */}
          <div className="flex items-center gap-2.5 bg-primary/5 p-2.5 rounded-xl">
            <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5 text-gray-400" />
            </div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
          
          {/* Duration Skeleton */}
          <div className="flex items-center gap-2.5 bg-primary/5 p-2.5 rounded-xl">
            <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
            </div>
            <div className="h-4 bg-gray-200 rounded w-28"></div>
          </div>
        </div>

        {/* Certificate Badge Skeleton */}
        <div className="flex items-center gap-2 mb-4 p-2 bg-gray-100 rounded-lg">
          <Award className="w-4 h-4 text-gray-400" />
          <div className="h-3 bg-gray-200 rounded w-36"></div>
        </div>

        {/* Price Section Skeleton */}
        <div className="border-t border-gray-100 pt-4 mb-4">
          <div className="flex justify-between items-center">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-7 bg-gray-200 rounded w-20"></div>
          </div>
        </div>

        {/* Button Skeleton */}
        <div className="w-full bg-gray-200 rounded-full py-3 flex items-center justify-center gap-2">
          <BookOpen className="w-4 h-4 text-gray-400" />
          <div className="h-4 bg-gray-300 rounded w-24"></div>
        </div>
      </div>
    </div>
  );
};

export default LiveClassCardSkeleton;