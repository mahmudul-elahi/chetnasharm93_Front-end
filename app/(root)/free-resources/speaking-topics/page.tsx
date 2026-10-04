"use client";

import React, { useState } from "react";
import CustomTable from "@/components/ui/Table";
import { Mic, Sparkles } from "lucide-react";
import Loader from "@/components/ui/Loader";
import { useGetAllSpeakingTopicsPublicQuery } from "@/src/redux/api/home/freeResourcesPublicApi";
import { Column } from "@/types/table";

const SpeakingTopicsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const {
    data: apiResponse,
    isLoading,
    isError,
    refetch,
  } = useGetAllSpeakingTopicsPublicQuery({
    page: currentPage,
    per_page: itemsPerPage,
  });

  const topics = apiResponse?.data || [];
  const pagination = apiResponse?.pagination;
  const totalItems = pagination?.total || 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      "A1-A2": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
      "B1-B2": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      "C1-C2": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    };
    return colors[level] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  };

  const getLevelLabel = (level: string) => {
    const labels: Record<string, string> = {
      "A1-A2": "Beginner",
      "B1-B2": "Intermediate",
      "C1-C2": "Advanced",
    };
    return labels[level] || level;
  };

  const columns: Column<any>[] = [
    {
      header: "Topic",
      headerClassName: "text-left",
      accessor: "topic",
      cellClassName: "px-4 py-3 text-left",
      render: (value) => (
        <div className="flex items-center gap-2">
          <Mic className="w-4 h-4 text-purple-500 shrink-0" />
          <span className="text-gray-800 dark:text-gray-200">{value}</span>
        </div>
      ),
    },
    {
      header: "Level",
      headerClassName: "text-center hidden md:table-cell",
      accessor: "level",
      cellClassName: "px-4 py-3 text-center hidden md:table-cell",
      render: (value) => (
        <span
          className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getLevelColor(value)}`}
        >
          {getLevelLabel(value)}
        </span>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center min-h-[60vh]">
            <Loader />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <Mic className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Failed to load speaking topics
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Please try again later.
            </p>
            <button
              onClick={() => refetch()}
              className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-10 min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 py-10" id="speaking-topics-top">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 bg-linear-to-r from-purple-500 to-pink-500 rounded-2xl mb-4 shadow-lg">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Mic className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Speaking Practice Topics
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Improve your English speaking skills with our curated collection of
            conversation topics for all levels
          </p>
        </div>

        {/* Stats Bar */}
        {totalItems > 0 && (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {totalItems} speaking topics available
                </span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-500">
                Page {currentPage} of {pagination?.last_page || 1}
              </div>
            </div>
          </div>
        )}

        {/* Custom Table */}
        <div className="relative overflow-visible">
          <CustomTable
            data={topics}
            columns={columns}
            showIndex={true}
            indexLabel="SN"
            indexClassName="px-4 py-3 text-center font-semibold hidden md:table-cell"
            indexHeaderClassName="text-center hidden md:table-cell"
            isLoading={isLoading}
            emptyMessage={
              "No speaking topics found. Check back later for new topics!"
            }
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        </div>

        {/* Tips Section */}
        {topics.length > 0 && (
          <div className="mt-8 p-6 bg-linear-to-r from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-200 dark:border-purple-800">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-linear-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                  Speaking Practice Tips
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  • Read each topic aloud to practice pronunciation
                  <br />
                  • Record yourself to track your progress
                  <br />
                  • Try to answer each question in 2-3 minutes
                  <br />• Practice with a partner for better results
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeakingTopicsPage;