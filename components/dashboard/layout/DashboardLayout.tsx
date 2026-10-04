"use client";
import DashboardNavbar from "@/components/dashboard/layout/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/layout/DashboardSidebar";
import DashboardSkeletonLoader from "@/components/skeleton/DashboardSkeletonLoader";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const DashboardLayoutClient = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth >= 1024;
  });
  const { user, isLoading } = useAuth();

  useEffect(() => {
    const handleResize = () => setOpen(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Redirect to login when auth resolves to no user
  useEffect(() => {
    if (!isLoading && !user) {
      const currentPath = window.location.pathname;
      router.replace(`/login?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [user, isLoading, router]);

  // Show skeleton overlay while loading, but always keep {children} in the tree
  // so Next.js can validate child segments for instant navigation.
  if (isLoading || !user) {
    return (
      <>
        <DashboardSkeletonLoader />
        {/* Hidden but present in the React tree for instant-navigation validation */}
        <div style={{ display: "none" }}>{children}</div>
      </>
    );
  }

  return (
    <div className="flex bg-gray-50 h-screen">
      <DashboardSidebar open={open} setOpen={setOpen} user={user as User} />
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0 h-full">
        <DashboardNavbar
          setOpen={setOpen}
          open={open}
          user={user as User}
          logout={() => {
            const currentPath = window.location.pathname;
            router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
          }}
        />
        {/* Make main scrollable */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayoutClient;

