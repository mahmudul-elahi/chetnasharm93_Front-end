"use client";
import React, { useState, useMemo } from "react";
import {
  Star,
  Award,
  ChevronRight,
  Sparkles,
  Globe,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import TutorCard from "@/components/cards/TutorCard";
import MyButton from "../ui/MyButton";
import { useGetAllTeachersQuery } from "@/src/redux/api/home/teachersApi";
import SkeletonWrapper from "../skeleton/SkeletonWrapper";
import TutorCardSkeleton from "../skeleton/TutorCardSkeleton";

interface Teacher {
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
}

interface ApiResponse {
  status: boolean;
  data: Teacher[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

const TeachersSection = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Fetch teachers from API
  const {
    data: apiResponse,
    isLoading,
    isError,
  } = useGetAllTeachersQuery({
    page: 1,
    per_page: 6,
    search: "",
    is_top: 1,
  });

  const teachers = (apiResponse as ApiResponse)?.data || [];
  const pagination = (apiResponse as ApiResponse)?.pagination;

  // Get unique categories from tutors
  const categories = useMemo(() => {
    const cats = new Set<string>();
    teachers.forEach((teacher) => {
      if (teacher.expertise) {
        cats.add(teacher.expertise);
      }
    });
    return ["all", ...Array.from(cats)];
  }, [teachers]);

  // Filter tutors based on category
  const filteredTutors = useMemo(() => {
    if (selectedCategory === "all") return teachers;
    return teachers.filter((teacher) =>
      teacher.expertise?.toLowerCase().includes(selectedCategory.toLowerCase()),
    );
  }, [selectedCategory, teachers]);

  // Get only first 3 tutors for display
  const displayedTutors = useMemo(() => {
    return filteredTutors.slice(0, 6);
  }, [filteredTutors]);

  console.log(displayedTutors);
  // Calculate stats
  const stats = useMemo(() => {
    const totalStudents = 12580; // Mock data since API doesn't provide student count
    const avgRating = 4.8; // Mock data since API doesn't provide rating
    const totalExperience = teachers.reduce(
      (sum, teacher) => sum + (teacher.years_of_exp || 0),
      0,
    );

    return {
      totalTutors: pagination?.total || teachers.length,
      totalStudents: totalStudents.toLocaleString(),
      avgRating: avgRating.toFixed(1),
      totalExperience,
    };
  }, [teachers, pagination]);

  if (isError) {
    return (
      <section className="py-20 relative bg-white overflow-hidden">
        <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-500 mb-4">Failed to load teachers</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 relative bg-white overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/5 to-secondary/5 rounded-full blur-3xl" />

      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">
              Expert Instructors
            </span>
          </div>

          <div className="text-center max-w-4xl mx-auto mb-12">
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
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-8">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="flex items-center justify-center mb-2">
                <UsersRound className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalTutors}+
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Expert Tutors
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="flex items-center justify-center mb-2">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.avgRating}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Average Rating
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="flex items-center justify-center mb-2">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalExperience}+
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Years Combined
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="flex items-center justify-center mb-2">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalStudents}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Students Taught
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter - Only show if not loading and categories exist */}
        {!isLoading && categories.length > 1 && (
          <div className="mb-10">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all transform hover:scale-105 ${
                    selectedCategory === category
                      ? "bg-primary text-white shadow-lg shadow-primary/30"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  {category === "all" ? "All Tutors" : category}
                  {category !== "all" && (
                    <span className="ml-2 text-xs opacity-70 ">
                      (
                      {
                        teachers.filter((t) =>
                          t.expertise
                            ?.toLowerCase()
                            .includes(category.toLowerCase()),
                        ).length
                      }
                      )
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tutors Grid with Loading State - Show 3 items */}
        {isLoading ? (
          <SkeletonWrapper
            skeletonItem={<TutorCardSkeleton />}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            quantity={3}
          />
        ) : displayedTutors.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedTutors.map((teacher) => (
                <TutorCard key={teacher.id} tutor={teacher} />
              ))}
            </div>

            {/* Show All Tutors Button - Only show if there are more than 3 teachers */}

            <div className="text-center mt-12">
              <Link href="/tutors">
                <MyButton>
                  Show All Tutors
                  <ChevronRight className="w-4 h-4" />
                </MyButton>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No tutors found in this category</p>
          </div>
        )}

        {/* Trust Badges */}
        <div className="mt-8 pt-8 ">
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-primary rounded-full" />
              <span>100% Verified Instructors</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-primary rounded-full" />
              <span>Live 1-on-1 Sessions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-primary rounded-full" />
              <span>Flexible Scheduling</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-primary rounded-full" />
              <span>Certificate of Completion</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeachersSection;
