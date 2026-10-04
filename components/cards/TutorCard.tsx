"use client";

import React, { useState } from "react";
import Image from "next/image";
import { BookOpen, GraduationCap, Briefcase, Star, Eye } from "lucide-react";
import Link from "next/link";
import MyButton from "../ui/MyButton";

export interface TutorCardProps {
  tutor: {
    id: number;
    name: string;
    bio: string | null;
    expertise: string;
    qualification: string;
    years_of_exp: number;
    image: string;
    intro_video: string;
    image_url: string;
    intro_video_url: string;
    is_top: number;
  };
}

const TutorCard: React.FC<TutorCardProps> = ({ tutor }) => {
  const [imageError, setImageError] = useState(false);

  const isTopTutor = tutor.is_top === 1;

  return (
    <>
      <div className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700 relative">
        {/* Top Tutor Badge - positioned at top-right of card */}
        {isTopTutor && (
          <div className="absolute top-0 right-0 z-10">
            <div className="relative">
              {/* Ribbon banner */}
              <div className="bg-linear-to-r from-amber-400 to-amber-500 text-white text-[10px] font-bold uppercase tracking-wider px-4 py-1 shadow-md">
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-white" />
                  Top Tutor
                </span>
              </div>
              {/* Ribbon fold effect */}
              <div className="absolute -bottom-2 right-0 border-r-8 border-r-amber-600 border-t-8 border-t-transparent"></div>
            </div>
          </div>
        )}
        <div>
          {/* Top Section: Image with verified badge + Name & Expertise */}
          <div className="p-5">
            <div className="flex items-start gap-4">
              {/* Profile Image - Circle with Verified Badge */}
              <div className="relative shrink-0">
                <div className="w-25 h-25 rounded-full overflow-hidden bg-linear-to-br from-purple-100 to-pink-100 ring-4 ring-white dark:ring-gray-800 shadow-md">
                  {tutor.image_url && !imageError ? (
                    <Image
                      src={tutor.image_url}
                      alt={tutor.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-purple-400">
                        {tutor.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                {/* Verified Badge */}
                <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1.5 shadow-md ring-2 ring-white dark:ring-gray-800">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>

              {/* Right Side Info - Name & Expertise */}
              <div className="flex-1 min-w-0 pt-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                    {tutor.name}
                  </h3>
                  {/* Optional small badge next to name (alternative placement) */}
                  {/* {isTopTutor && (
                  <span className="inline-flex items-center gap-0.5 text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    Top
                  </span>
                )} */}
                </div>
                <p className="text-sm text-purple-600 dark:text-purple-400 font-medium mt-1">
                  {tutor.expertise} Specialist
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 dark:border-gray-700 mx-5"></div>

          {/* Center Section: Bio, Expertise, Qualification */}
          <div className="p-5 space-y-3">
            {/* Bio - 2 lines only */}
            {tutor.bio ? (
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
                {tutor.bio}
              </p>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
                No Bio Available
              </p>
            )}

            {/* Expertise */}
            <div className="flex items-start gap-2.5">
              <BookOpen className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Expertise
                </p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {tutor.expertise}
                </p>
              </div>
            </div>

            {/* Qualification */}
            <div className="flex items-start gap-2.5">
              <GraduationCap className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Qualification
                </p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {tutor.qualification}
                </p>
              </div>
            </div>
            {/* Experience */}
            <div className="flex items-start gap-2.5">
              <Briefcase className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Experience
                </p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {tutor.years_of_exp}+ years experience
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Divider */}
        <div className="border-t border-gray-100 dark:border-gray-700 mx-5"></div>

        {/* Bottom Section: View Details Button */}
        <div className="p-5">
          <Link href={`/tutors/${tutor.id}`} className="block w-full">
            <MyButton className="w-full" variant="outline">
              <Eye className="w-4 h-4" />
              View Details
            </MyButton>
          </Link>
        </div>
      </div>
    </>
  );
};

export default TutorCard;
