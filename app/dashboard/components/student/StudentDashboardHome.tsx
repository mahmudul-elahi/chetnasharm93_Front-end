import StudentDashboardStateCards from "./StudentDashboardStateCards";
import ActiveCourses from "./ActiveCourses";
import RecentEnrollments from "./RecentEnrollments";
import CompletedCourses from "./CompletedCourses";

const StudentDashboardHome = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Track your learning progress and manage your courses
        </p>
      </div>
      <StudentDashboardStateCards />
      <ActiveCourses />
      <RecentEnrollments />
      <CompletedCourses />
    </div>
  );
};

export default StudentDashboardHome;
