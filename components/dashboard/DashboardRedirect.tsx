"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loader from "../ui/Loader";

export default function DashboardRedirect() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      switch (user?.role) {
        case "admin":
          router.push("/dashboard/admin");
          break;
        case "teacher":
          router.push("/dashboard/teacher");
          break;
        case "student":
          router.push("/dashboard/student");
          break;
        default:
          router.push("/dashboard/student");
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <Loader />
    );
  }

  return null;
}