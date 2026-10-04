"use client";
import React from "react";
import { Video, Calendar, Box } from "lucide-react";
import LiveClassCard from "../cards/LiveClassCard";
import Link from "next/link";
import MyButton from "../ui/MyButton";
import { useGetAllClassesQuery } from "@/src/redux/api/home/classesApi";
import Loader from "../ui/Loader";
import { ClassItem } from "@/types/classes";
import SkeletonWrapper from "../skeleton/SkeletonWrapper";
import LiveClassCardSkeleton from "../skeleton/LiveClassCardSkeleton";

const LiveClassesSection = () => {
  const { data, isLoading, error } = useGetAllClassesQuery({
    page: 1,
    per_page: 6,
    search: "",
  });

  const classes = data?.data || [];

  if (error) {
    return null;
  }

  return (
    <section className="py-20 relative bg-white overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />

      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 rounded-full mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            <Video className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-600">
              Live Interactive Classes
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Join Live
            <span className="bg-linear-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
              {" "}
              Language Classes
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Learn in real-time with expert instructors. Get instant feedback,
            practice speaking, and connect with fellow learners.
          </p>

          {/* <div className="flex flex-wrap justify-center gap-4 mt-6">
            <Link href="/classes">
              <button className="px-6 py-2 rounded-full bg-linear-to-r from-primary to-secondary text-white hover:bg-blue-600 transition-all transform hover:scale-105 shadow-md hover:shadow-lg cursor-pointer">
                Upcoming Classes
              </button>
            </Link>
            <Link href="/classes">
              <button className="px-6 py-2 rounded-full bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 transition-all transform hover:scale-105 shadow-sm cursor-pointer">
                All Languages
              </button>
            </Link>
          </div> */}
        </div>

        {/* Live Classes Grid - 3 in a row */}
        {isLoading ? (
          <SkeletonWrapper
            skeletonItem={<LiveClassCardSkeleton />}
            quantity={3}
          />
        ) : classes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {classes.slice(0, 3).map((classItem: ClassItem) => (
              <LiveClassCard key={classItem.id} classItem={classItem} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No classes available at the moment.</p>
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12 flex flex-col lg:flex-row gap-4 justify-center items-center">
          {classes.length > 0 && (
            <Link href="/classes">
              <MyButton className="gap-3 relative group overflow-hidden">
                View All Live Classes
                <Calendar className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </MyButton>
            </Link>
          )}
          <Link href="/free-resources">
            <MyButton className="gap-3 relative group overflow-hidden">
              Get Free Resources
              <Box className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </MyButton>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LiveClassesSection;
