"use client";
import LiveClassCard from "@/components/cards/LiveClassCard";
import SearchBar from "@/components/ui/SearchBar";
import Pagination from "@/components/ui/Pagination";
import { useGetAllClassesQuery } from "@/src/redux/api/home/classesApi";
import { Video, BookOpen, X } from "lucide-react";
import React, { useCallback, useState } from "react";
import Loader from "@/components/ui/Loader";
import { ClassItem } from "@/types/classes";
import SkeletonWrapper from "@/components/skeleton/SkeletonWrapper";
import LiveClassCardSkeleton from "@/components/skeleton/LiveClassCardSkeleton";


const ClassesPage = () => {
  const [filters, setFilters] = useState({
    currentPage: 1,
    perPageItem: 6,
    search: "",
  });

  const { data, isLoading } = useGetAllClassesQuery({
    page: filters.currentPage,
    per_page: filters.perPageItem,
    search: filters.search,
  });

  const classes = data?.data || [];
  const pagination = data?.pagination;

  // Handle search
  const handleSearch = (term: string) => {
    setFilters((prev) => ({
      ...prev,
      search: term,
      currentPage: 1,
    }));
  };

  const handleClearSearch = () => {
    setFilters((prev) => ({
      ...prev,
      search: "",
      currentPage: 1,
    }));
  };

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({
      ...prev,
      currentPage: page,
    }));

    // Scroll to classes section
    document.getElementById("classes-section")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative bg-linear-to-r from-purple-500/10 via-indigo-500/5 to-purple-500/10 pt-8 lg:pt-16 xl:pt-20 pb-12">
        <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center pt-17">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 rounded-full mb-4">
              <Video className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-600">
                Live Interactive Classes
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Perfect{" "}
              <span className="bg-linear-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Live Class
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join real-time interactive classes with expert teachers. Learn,
              practice, and grow together.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mt-8">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search classes by title or description..."
              initialValue={filters.search}
              debounceDelay={500}
              size="md"
              variant="default"
              showClearButton={true}
          
            />
          </div>
        </div>
      </section>

      {/* Classes Section */}
      <div
        id="classes-section"
        className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 xl:py-25"
      >
        {/* Results Summary */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {classes.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {pagination?.total || 0}
              </span>{" "}
              classes
              {filters.search && (
                <span className="ml-2">
                  matching{" "}
                  <span className="font-medium">"{filters.search}"</span>
                </span>
              )}
            </p>
          </div>

          {filters.search && (
            <button
              onClick={handleClearSearch}
              className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
              Clear search
            </button>
          )}
        </div>

        {/* Classes Grid */}
        {isLoading ? (
       
            <SkeletonWrapper
              skeletonItem={<LiveClassCardSkeleton />}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              quantity={6}
            />
    
        ) : classes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {classes.map((classItem: ClassItem) => (
              <LiveClassCard key={classItem.id} classItem={classItem} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <BookOpen className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No classes found
            </h3>
            <p className="text-gray-600">
              {filters.search
                ? `No classes matching "${filters.search}"`
                : "No classes available at the moment"}
            </p>
            {filters.search && (
              <button
                onClick={handleClearSearch}
                className="mt-4 text-primary hover:text-primary/80 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.last_page > 1 && (
          <div className="mt-12">
            <Pagination
              currentPage={pagination.current_page}
              totalPages={pagination.last_page}
              totalItems={pagination.total}
              itemsPerPage={filters.perPageItem}
              onPageChange={handlePageChange}
              scrollOnChange={true}
              scrollTargetId="classes-section"
              scrollBehavior="smooth"
              scrollOffset={80}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassesPage;
