"use client";
import React from "react";

import StateCard, { StateCardConfig } from "@/components/ui/StateCard";
import { useTeacherDashboardStates } from "./useTeacherDashboardStates";

const TeacherDashboardStateCards = () => {
  const { teacherDashboardStates, isLoading } = useTeacherDashboardStates();


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 col-span-full gap-6">
      {isLoading
        ? [...Array(8)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-100 p-4 rounded-lg animate-pulse flex justify-between items-center"
            >
              <div className="flex-1">
                <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>

                <div className="h-8 w-20 bg-gray-200 rounded"></div>
              </div>

              <div className="h-9 w-9 bg-gray-200 rounded-lg"></div>
            </div>
          ))
        : teacherDashboardStates.map((item: StateCardConfig, index: number) => (
            <StateCard key={index} config={item} />
          ))}
    </div>
  );
};

export default TeacherDashboardStateCards;
