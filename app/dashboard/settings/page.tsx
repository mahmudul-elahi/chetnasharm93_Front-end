"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useGetMeQuery } from "@/src/redux/api/auth/authApi";
import AdminSettings from "./_components/AdminSettings";
import TeacherSettings from "./_components/TeacherSettings";
import StudentSettings from "./_components/StudentSettings";
import Loader from "@/components/ui/Loader";

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated } = useAuth();
  const { data, isLoading } = useGetMeQuery({ skip: !isAuthenticated });

  useEffect(() => {
    setMounted(true);
  }, []);

  const userRole = (data?.user?.role ? String(data.user.role).toLowerCase() : "student");

  const roleComponents = {
    admin: <AdminSettings />,
    teacher: <TeacherSettings />,
    student: <StudentSettings />,
  };

  if (!mounted || isLoading)
    return (
      <div className="h-[calc(100vh-155px)] w-full flex justify-center items-center">
        <Loader />
      </div>
    );

  return (
    roleComponents[userRole as keyof typeof roleComponents] || (
      <StudentSettings />
    )
  );
}
