"use client";
import React, { useState, useMemo, useCallback } from "react";
import {
  Users,
  Filter,
  ChevronLeft,
  ChevronRight,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import TutorCard from "@/components/cards/TutorCard";
import { toast } from "sonner";
import SearchBar from "@/components/ui/SearchBar";
import { useGetAllTeachersQuery } from "@/src/redux/api/home/teachersApi";
import Pagination from "@/components/ui/Pagination";
import TutorCardSkeleton from "@/components/skeleton/TutorCardSkeleton";
import SkeletonWrapper from "@/components/skeleton/SkeletonWrapper";

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
  is_top:number;
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

const TutorsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const {
    data: apiResponse,
    isLoading,
    isError,
  } = useGetAllTeachersQuery({
    page: currentPage,
    per_page: itemsPerPage,
    search: searchTerm,
  });

  const teachers = (apiResponse as ApiResponse)?.data || [];
  const pagination = (apiResponse as ApiResponse)?.pagination;

  // Extract all unique expertise areas
  const allExpertise = useMemo(() => {
    const expertise = new Set<string>();
    teachers.forEach((teacher) => {
      if (teacher.expertise) {
        expertise.add(teacher.expertise);
      }
    });
    return Array.from(expertise).sort();
  }, [teachers]);

  // Filter teachers by expertise
  const filteredTeachers = useMemo(() => {
    let filtered = [...teachers];
    if (selectedExpertise.length > 0) {
      filtered = filtered.filter((teacher) =>
        selectedExpertise.includes(teacher.expertise),
      );
    }
    return filtered;
  }, [teachers, selectedExpertise]);

  const clearFilters = () => {
    setSelectedExpertise([]);
    setSearchTerm("");
    setCurrentPage(1);
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchTerm) count++;
    if (selectedExpertise.length > 0) count++;
    return count;
  }, [searchTerm, selectedExpertise]);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isError) {
    toast.error("Failed to load teachers");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">Failed to load teachers</div>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50  pb-25">
      {/* Hero Section */}
      <section className="relative bg-linear-to-r from-purple-500/10 via-indigo-500/5 to-purple-500/10 pt-8 lg:pt-16 xl:pt-20 pb-12">
        <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center pt-17">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 rounded-full mb-4">
              <UsersRound className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-600">
                Expert Tutors
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Meet Our{" "}
              <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                Expert Tutors
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Learn from the best language instructors worldwide
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mt-8">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search classes by title or description..."
              initialValue={searchTerm}
              debounceDelay={500}
              size="md"
              variant="default"
              showClearButton={true}
            />
          </div>
        </div>
      </section>

      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Showing{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {filteredTeachers.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {pagination?.total || 0}
            </span>{" "}
            expert tutors
            {searchTerm && (
              <span className="ml-2">
                matching <span className="font-medium">"{searchTerm}"</span>
              </span>
            )}
          </p>
        </div>

        {/* Tutors Grid */}
        {isLoading ? (
          <SkeletonWrapper
            skeletonItem={<TutorCardSkeleton />}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            quantity={6}
          />
        ) : filteredTeachers.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTeachers.map((teacher) => (
                <TutorCard key={teacher.id} tutor={teacher} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.last_page > 1 && (
              <div className="mt-12">
                <Pagination
                  currentPage={pagination.current_page}
                  totalPages={pagination.last_page}
                  totalItems={pagination.total}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                  scrollOnChange={true}
                  scrollTargetId="classes-section"
                  scrollBehavior="smooth"
                  scrollOffset={80}
                />
              </div>
            )}
          </>
        ) : (
          // Empty State
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <Users className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No tutors found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or search term
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorsPage;
