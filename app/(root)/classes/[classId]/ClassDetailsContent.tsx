"use client";
import Link from "next/link";
import { ChevronsLeft, BookOpen } from "lucide-react";
import MyButton from "@/components/ui/MyButton";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useGetSingleClassByIdQuery } from "@/src/redux/api/home/classesApi";
import { useState } from "react";
import Loader from "@/components/ui/Loader";
import BatchCard from "@/components/cards/BatchCard";
import Pagination from "@/components/ui/Pagination";
import { useGetAllBatchesByClassIdQuery } from "@/src/redux/api/home/batchesApi";
import { Batch } from "@/types/batches";
import ClassDetailsSkeleton from "./_components/ClassDetailsSkeleton";
import CourseHero from "./_components/CourseHero";
import CourseAudience from "./_components/CourseAudience";
import CurriculumAccordion from "./_components/CurriculumAccordion";
import Instructors from "./_components/Instructors";

export default function ClassDetailsContent({ classId: propClassId }: { classId?: string }) {
  const router = useRouter();
  const params = useParams();
  const classId = propClassId ?? (params?.classId as string);

  const [batchFilters, setBatchFilters] = useState({
    currentPage: 1,
    perPageItem: 6,
    search: "",
  });

  const { data: classDataRes, isLoading: classLoading } =
    useGetSingleClassByIdQuery(classId);
  const { data: batchesRes, isLoading: batchesLoading } =
    useGetAllBatchesByClassIdQuery({
      class_id: classId,
      page: batchFilters.currentPage,
      per_page: batchFilters.perPageItem,
      search: batchFilters.search,
    });

  const classData = classDataRes?.data;
  const batches = batchesRes?.data || [];
  const pagination = batchesRes?.pagination;

  if (classLoading) {
    return (
      <div className="min-h-screen bg-Linear-to-br from-slate-50 via-white to-purple-50">
        <ClassDetailsSkeleton />
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="min-h-screen  flex items-center justify-center bg-linear-to-br from-slate-50 via-white to-purple-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Class not found</h2>
          <p className="text-gray-600 mb-8">
            The class you're looking for doesn't exist.
          </p>
          <Link href="/classes">
            <MyButton>Browse All Classes</MyButton>
          </Link>
        </div>
      </div>
    );
  }

  const handlePageChange = (page: number) => {
    setBatchFilters((prev) => ({ ...prev, currentPage: page }));
    document.getElementById("batches-section")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleBrowseBatches = () => {
    document.getElementById("batches-section")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-purple-50">
      {/* Back Button */}
      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 pt-25">
        <Button
          variant="outline"
          className="px-6"
          onClick={() => router.back()}
        >
          <ChevronsLeft className="w-4 h-4 mr-2" />
          Back to Classes
        </Button>
      </div>

      {/* Single Card with All Class Information */}
      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div >
          <CourseHero classData={classData} onBrowseBatches={handleBrowseBatches} />
          <CourseAudience who_is_for={classData?.who_is_for} />
          <CurriculumAccordion curriculum={classData?.curriculum} />
          {/* <Instructors teachers={classData?.teachers} /> */}
        </div>
      </div>

      {/* Batches Section */}
      <div
        id="batches-section"
        className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 pb-12"
      >
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Available Batches
          </h2>
          <p className="text-gray-600">
            Choose a batch that fits your schedule and start learning today
          </p>
        </div>

        {batches.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {batches.map((batch: Batch) => (
                <BatchCard key={batch.id} batch={batch} />
              ))}
            </div>

            {pagination && pagination.last_page > 1 && (
              <div className="mt-12">
                <Pagination
                  currentPage={pagination.current_page}
                  totalPages={pagination.last_page}
                  totalItems={pagination.total}
                  itemsPerPage={batchFilters.perPageItem}
                  onPageChange={handlePageChange}
                  scrollOnChange={true}
                  scrollTargetId="batches-section"
                  scrollBehavior="smooth"
                  scrollOffset={80}
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <BookOpen className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Batches Available
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              There are currently no batches available for this class. Please
              check back later or contact support for more information.
            </p>
            <div className="mt-6">
              <Link href="/classes">
                <MyButton variant="outline">Browse Other Classes</MyButton>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
