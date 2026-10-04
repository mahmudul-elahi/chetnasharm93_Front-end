"use client";
import Loader from "@/components/ui/Loader";
import { useAuth } from "@/hooks/useAuth";
import React from "react";
import AdminDashboardHome from "./components/admin/AdminDashboardHome";
import StudentDashboardHome from "./components/student/StudentDashboardHome";
import TeacherDashboardHome from "./components/teacher/TeacherDashboardHome";


const DashboardHome = () => {
  const { isAdmin, isStudent, isTeacher, isLoading } = useAuth();
  if (isLoading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  if (isAdmin) return <AdminDashboardHome />;
  if (isStudent) return <StudentDashboardHome />;
  if (isTeacher) return <TeacherDashboardHome />;
};

export default DashboardHome;
