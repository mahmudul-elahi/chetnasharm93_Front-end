"use client";

// ========== BATCH SKELETON - HIGHLIGHT START ==========
// Batch Card Skeleton - Replace with your existing batch skeleton
const BatchCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
    <div className="p-5 space-y-4">
      {/* Batch Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1">
          <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
        </div>
        <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse" />
      </div>

      {/* Schedule Info */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="h-10 w-10 rounded-full bg-gray-200 shrink-0 animate-pulse" />
          <div className="h-10 w-full bg-gray-200 rounded  animate-pulse" />
        </div>
        <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
        <div className="h-10 w-full bg-gray-200 rounded  animate-pulse" />
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100" />

      {/* Footer with price and button */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <div className="h-3 bg-gray-200 rounded w-16 animate-pulse" />
          <div className="h-5 bg-gray-200 rounded w-20 animate-pulse" />
        </div>
        <div className="w-24 h-5 bg-gray-200 rounded-lg animate-pulse" />
      </div>
       <div className="h-10 w-full bg-gray-200 rounded-full animate-pulse" />
    </div>
  </div>
);
// ========== BATCH SKELETON - HIGHLIGHT END ==========

// Skeleton for the hero section (image + details)
const HeroSkeleton = () => (
  <div className="grid lg:grid-cols-2 gap-8 py-6 lg:py-8">
    {/* Image Skeleton */}
    <div className="relative">
      <div className="w-full aspect-[5/3] rounded-2xl bg-gradient-to-r from-gray-200 to-gray-100 animate-pulse" />
    </div>

    {/* Details Skeleton */}
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg w-3/4 animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-11/12 animate-pulse" />
        </div>
      </div>

      {/* Price Skeleton */}
      <div className="h-8 bg-gray-200 rounded w-32 animate-pulse" />

      {/* CTA Buttons Skeleton */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="h-12 w-full sm:flex-1 bg-gray-200 rounded-xl animate-pulse" />
        <div className="h-12 w-full sm:flex-1 bg-gray-200 rounded-xl animate-pulse" />
      </div>

      {/* Feature Pills Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-10 rounded-full bg-gray-200 animate-pulse"
          />
        ))}
      </div>
    </div>
  </div>
);

// Skeleton for the full description section
const DescriptionSkeleton = () => (
  <div className="py-4 lg:py-8 ">
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
      <div className="h-4 bg-gray-200 rounded w-11/12 animate-pulse" />
      <div className="h-4 bg-gray-200 rounded w-10/12 animate-pulse" />
      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
    </div>
    <div className="h-4 bg-gray-200 rounded w-24 mt-3 animate-pulse" />
  </div>
);

// Section Header Skeleton
const SectionHeaderSkeleton = () => (
  <div className="mb-8 space-y-2">
    <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
    <div className="h-4 bg-gray-200 rounded w-96 animate-pulse" />
  </div>
);

// Skeleton for "Who Is This Course For?" section
const AudienceSkeleton = () => (
  <div className="border-t border-gray-100 py-6 lg:py-8">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
      <div className="h-8 bg-gray-200 rounded w-56 animate-pulse" />
    </div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-16 bg-gray-200 rounded-xl animate-pulse" />
      ))}
    </div>
  </div>
);

// Skeleton for "What You'll Learn" accordion section
const CurriculumSkeleton = () => (
  <div className="border-t border-gray-100 py-6 lg:py-8">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
      <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
    </div>
    <div className="space-y-3">
      {[1, 2].map((i) => (
        <div key={i} className="h-12 bg-gray-200 rounded-xl animate-pulse" />
      ))}
    </div>
  </div>
);

// Skeleton for "Your Instructors" section
const InstructorsSkeleton = () => (
  <div className="border-t border-gray-100 py-6 lg:py-8">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
      <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
    </div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl">
          <div className="w-14 h-14 rounded-full bg-gray-200 animate-pulse shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Main Class Details Page Skeleton
const ClassDetailsSkeleton = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-purple-50">
      {/* Back Button Skeleton */}
      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 pt-25">
        <div className="w-36 h-10 bg-gray-200 rounded-full animate-pulse" />
      </div>

      {/* Single Card Skeleton */}
      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div>
          <HeroSkeleton />
          <DescriptionSkeleton />
          <AudienceSkeleton />
          <CurriculumSkeleton />
          <InstructorsSkeleton />
        </div>
      </div>

      {/* Batches Section Skeleton */}
      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <SectionHeaderSkeleton />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <BatchCardSkeleton />
          <BatchCardSkeleton />
          <BatchCardSkeleton />
        </div>
      </div>
    </div>
  );
};

export default ClassDetailsSkeleton;