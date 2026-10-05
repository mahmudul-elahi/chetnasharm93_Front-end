"use client";

import React, { useState, useEffect } from "react";
import Loader from "@/components/ui/Loader";
import { useAuth } from "@/hooks/useAuth";
import AdminDashboardHome from "./components/admin/AdminDashboardHome";
import StudentDashboardHome from "./components/student/StudentDashboardHome";
import TeacherDashboardHome from "./components/teacher/TeacherDashboardHome";

const DashboardHome = () => {
  const [mounted, setMounted] = useState(false);
  const { isAdmin, isTeacher, isLoading } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  if (isAdmin) return <AdminDashboardHome />;
  if (isTeacher) return <TeacherDashboardHome />;
  return <StudentDashboardHome />;
};

export default DashboardHome;
