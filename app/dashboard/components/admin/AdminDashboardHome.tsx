import React from "react";
import StudentsState from "./StudentsState";
import TotalEnrollmentState from "./TotalEnrollmentState";
import StudentChartSkeleton from "./StudentChartSkeleton";
import RevenueState from "./RevenueState";
import TopEarningClasses from "./TopEarningClasses";
import TopEarningBatches from "./TopEarningBatches";

const AdminDashboardHome = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>

        <p className="text-muted-foreground mt-1">
          Monitor student analytics and enrollment statistics.
        </p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueState />
        <StudentsState />
        <TotalEnrollmentState />
        <TopEarningClasses />
        <TopEarningBatches />
      </div>
    </div>
  );
};

export default AdminDashboardHome;
