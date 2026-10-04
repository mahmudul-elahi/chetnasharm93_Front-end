"use client";

import { useAuth } from "@/hooks/useAuth";
import { useGetMeQuery } from "@/src/redux/api/auth/authApi";
import AdminSettings from "./_components/AdminSettings";
import TeacherSettings from "./_components/TeacherSettings";
import StudentSettings from "./_components/StudentSettings";
import Loader from "@/components/ui/Loader";

export default function SettingsPage() {
  const { isAuthenticated } = useAuth();
  const { data, isLoading } = useGetMeQuery({ skip: !isAuthenticated });

  const userRole = data?.user?.role || "student";

  const roleComponents = {
    admin: <AdminSettings />,
    teacher: <TeacherSettings />,
    student: <StudentSettings />,
  };

  if (isLoading)
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
