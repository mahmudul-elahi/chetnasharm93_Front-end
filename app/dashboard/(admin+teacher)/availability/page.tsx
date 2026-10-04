import React from "react";
import TeacherAvailabilityContent from "./_components/TeacherAvailabilityContent";

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

const TeacherAvailabilityPage = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-6">
      <div>
      {/* Header Section */}
      <div className="mb-8 px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          My Schedule
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage weekly schedule and time slots
        </p>
      </div>
      <TeacherAvailabilityContent /></div>
    </div>
  );
};

export default TeacherAvailabilityPage;
