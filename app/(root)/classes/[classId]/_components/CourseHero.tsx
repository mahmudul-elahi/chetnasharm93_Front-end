"use client";

import { useState } from "react";
import {
  BookOpen,
  UsersRound,
  Share2,
  Video,
  CalendarDays,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClassDetails } from "@/types/classes";

interface CourseHeroProps {
  classData: ClassDetails;
  onBrowseBatches: () => void;
}

const CourseHero = ({ classData, onBrowseBatches }: CourseHeroProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasRecordings = classData?.is_class_recording === 1;
  const originalPrice = classData?.price ? `$${classData.price}` : "$0";
  const description = classData?.description || "";
  const shouldTruncate = description.length > 200;
  const displayedDescription =
    shouldTruncate && !isExpanded
      ? `${description.slice(0, 450)}...`
      : description;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: classData.title,
          text: classData.short_description || classData.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <section className="animate-fade-in">
      <div className="grid lg:grid-cols-2 gap-8 ">
        {/* Class Image */}
        <div className="relative">
          {classData?.image_url ? (
            <img
              className="w-full h-auto object-cover rounded-2xl shadow-lg"
              src={classData.image_url}
              alt={classData.title}
            />
          ) : (
            <div className="w-full h-80 object-cover rounded-2xl shadow-lg bg-linear-to-r from-primary/50 to-secondary/50 flex justify-center items-center">
              <BookOpen className="size-18 text-primary/60" />
            </div>
          )}
        </div>

        {/* Class Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-4">
              {classData.title}
            </h1>

            {/* Short Description */}
            {classData.short_description && (
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                {classData.short_description}
              </p>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-gray-900">
              {originalPrice}
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={onBrowseBatches}
              className="w-full min-w-0 sm:flex-1 h-12! bg-linear-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 whitespace-nowrap"
            >
              Browse Batches
            </Button>
            <Button
              onClick={handleShare}
              variant="outline"
              className="w-full min-w-0 sm:flex-1 h-12! whitespace-nowrap"
            >
              <Share2 className="w-4 h-4 shrink-0 mr-2" />
              Share Course
            </Button>
          </div>

          {/* Feature Pills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-purple-50 to-primary/5 border border-purple-100 rounded-full">
              <BookOpen className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">
                {classData.total_classes || 0} Classes
              </span>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-50 to-blue-50 border border-blue-100 rounded-full">
              <CalendarDays className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                {classData.duration_in_days || 0} Days
              </span>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-green-50 to-green-50 border border-green-100 rounded-full">
              <Video className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700">
                Live on Zoom
              </span>
            </div>

            {hasRecordings && (
              <div className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-orange-50 to-orange-50 border border-orange-100 rounded-full">
                <UsersRound className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-gray-700">
                  Class Recordings Included
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full Description with See More/See Less */}
      <div className="py-4 lg:py-8">
        <p className="text-gray-600 text-sm md:text-base leading-relaxed whitespace-pre-line text-justify">
          {displayedDescription}
        </p>
        {shouldTruncate && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer"
          >
            {isExpanded ? "See Less" : "See More"}
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </button>
        )}
      </div>
    </section>
  );
};

export default CourseHero;