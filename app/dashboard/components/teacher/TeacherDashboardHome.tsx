import React from "react";
import TeacherDashboardStateCards from "./TeacherDashboardStateCards";
import TopBatches from "./TopBatches";
import UpcomingBatches from "./UpcomingBatches";

const TeacherDashboardHome = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Teacher Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Welcome back! Here's an overview of your teaching performance
          </p>
        </div>
      </div>

      {/* State Cards */}
      <TeacherDashboardStateCards />
      <TopBatches />
      <UpcomingBatches />
    </div>
  );
};

export default TeacherDashboardHome;
