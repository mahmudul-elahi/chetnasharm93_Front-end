"use client";
import { useGetWishListQuery } from "@/src/redux/api/student/wishlistApi";
import React, { useCallback, useState } from "react";
import Loader from "@/components/ui/Loader";
import CustomTable from "@/components/ui/Table";
import SearchBar from "@/components/ui/SearchBar";
import { Column } from "@/types/table";
import { Heart, User, Clock, BookOpen, Download, Eye } from "lucide-react";
import Link from "next/link";
import MyButton from "@/components/ui/MyButton";
import ActionButton from "@/components/ui/ActionButton";
import { format } from "date-fns";

interface WishlistItem {
  id: number;
  user_id: number;
  batch_id: number;
  created_at: string;
  updated_at: string;
  batch: {
    id: number;
    name: string;
    teacher_id: number;
    teacher: {
      id: number;
      name: string;
      image_url: string | null;
      intro_video_url: string | null;
    };
  };
}

const MyWishListPage = () => {
  const [filters, setFilters] = useState({
    currentPage: 1,
    perPageItem: 10,
    search: "",
  });

  const { data, isLoading, refetch } = useGetWishListQuery({
    page: filters.currentPage,
    per_page: filters.perPageItem,
    search: filters.search,
  });

  const wishlistData = data?.data || [];
  const pagination = data?.pagination;

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

    document.getElementById("wishlist-table-container")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  const columns: Column<WishlistItem>[] = [
    {
      header: "Batch Name",
      headerClassName: "text-left",
      cellClassName: "px-4 py-3 text-left font-medium",
      render: (_, row) => (
        <div className="flex items-center gap-3 hover:text-primary transition-colors">
          <div className="p-2 bg-primary/10 rounded-lg">
            <BookOpen className="w-4 h-4 text-primary" />
          </div>
          <span className="font-semibold text-gray-900 dark:text-white">
            {row.batch.name}
          </span>
        </div>
      ),
    },
    {
      header: "Teacher",
      headerClassName: "text-left",
      cellClassName: "px-4 py-3 text-left",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400" />
          <span className="text-gray-700 dark:text-gray-300">
            {row.batch.teacher?.name || "Not assigned"}
          </span>
        </div>
      ),
    },
    {
      header: "Batch ID",
      headerClassName: "text-center",
      accessor: "batch_id",
      cellClassName: "px-4 py-3 text-center font-mono",
      render: (value) => (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          #{value}
        </span>
      ),
    },
    {
      header: "Added Date",
      headerClassName: "text-center",
      cellClassName: "px-4 py-3 text-center",
      render: (_, row) => (
        <div className="flex items-center justify-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {format(row.created_at, "dd MMM yyyy")}
          </span>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-155px)] w-full flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6" id="wishlist-table-container">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div>
              <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                My Wishlist{" "}
                <p className="relative p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                  <Heart className="w-5 h-5 z-10 absolute top-1/2 left-1/2 -translate-1/2 animate-ping text-red-500 fill-red-500" />
                </p>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {wishlistData.length}{" "}
                {wishlistData.length === 1 ? "batch" : "batches"} saved in your
                wishlist
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex flex-col-reverse md:flex-row gap-4 items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing {wishlistData?.length || 0} of {pagination?.total || 0} items
          {filters.search && (
            <span className="ml-2">
              matching <span className="font-medium">"{filters.search}"</span>
            </span>
          )}
        </p>
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search by batch name or teacher..."
          initialValue={filters.search}
          className="w-5/6 md:w-2/4 xl:w-2/6 max-w-92"
          debounceDelay={500}
          size="md"
          variant="default"
          showClearButton={true}
        />
      </div>

      {/* Table */}
      <div className="relative overflow-visible">
        <CustomTable
          data={wishlistData}
          columns={columns}
          showIndex={true}
          indexLabel="SN"
          isLoading={isLoading}
          emptyMessage={
            filters.search
              ? `No items found matching "${filters.search}"`
              : "Your wishlist is empty"
          }
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default MyWishListPage;
