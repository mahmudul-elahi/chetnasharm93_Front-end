"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Settings, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useGetMeQuery } from "@/src/redux/api/auth/authApi";
import { toast } from "sonner";

interface ProfileIconProps {
  size?: "sm" | "md" | "lg";
  showDropdown?: boolean;
  className?: string;
}

const sizeMap = {
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-12 h-12 text-lg",
};

export const ProfileIcon = ({
  size = "md",
  showDropdown = true,
  className = "",
}: ProfileIconProps) => {
  // ✅ ALL hooks at the top — no early returns before this point
  const { logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: fetchedUser, isLoading } = useGetMeQuery(undefined, {
    skip: !isAuthenticated,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ early return AFTER all hooks
  const user = fetchedUser?.user;
  if (isLoading || !user) return null;

  const getInitials = (name: string) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = () => {
    switch (user?.role) {
      case "admin":
        return "bg-gradient-to-r from-purple-500 to-pink-500";
      case "teacher":
        return "bg-gradient-to-r from-blue-500 to-cyan-500";
      case "student":
        return "bg-gradient-to-r from-green-500 to-emerald-500";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600";
    }
  };

  const sizeClass = sizeMap[size];

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    toast.success("Sign out successfully!");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`cursor-pointer flex items-center gap-2 hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-full ${className}`}
      >
        <div
          className={`relative flex items-center justify-center rounded-full ${sizeClass} ${getAvatarColor()} text-white font-semibold overflow-hidden`}
        >
          {user?.image && !imageError ? (
            <Image
              src={user.image_url}
              alt={user.name || "User avatar"}
              fill
              sizes="100%"
              className="rounded-full object-cover"
              onError={() => setImageError(true)}
              priority={false}
            />
          ) : (
            <span>{getInitials(user.name)}</span>
          )}
        </div>
      </button>

      {showDropdown && isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-100">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user.email}
            </p>
            <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium capitalize bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
              {user?.role}
            </span>
          </div>

          <div className="py-1">
            <button
              onClick={() => {
                router.push(`/dashboard/settings`);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4" />
              Profile Settings
            </button>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
