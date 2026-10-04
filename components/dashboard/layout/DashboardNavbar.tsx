"use client";
import {
  Menu,
  Bell,
  Search,
  ChevronDown,
  Calendar,
  BookOpen,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { User } from "@/types/user";
import { FaUser } from "react-icons/fa";
import { ProfileIcon } from "@/components/ui/ProfileIcon";

interface DashboardNavbarProps {
  setOpen: (open: boolean) => void;
  open: boolean | null;
  user: User;
  logout: () => void;
}

const DashboardNavbar = ({
  setOpen,
  open,
  user,
  logout,
}: DashboardNavbarProps) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifications = [
    {
      id: 1,
      title: "New assignment submitted",
      time: "2 min ago",
      unread: true,
      role: ["teacher"],
    },
    {
      id: 2,
      title: "Grade posted for Math quiz",
      time: "1 hour ago",
      unread: true,
      role: ["student"],
    },
    {
      id: 3,
      title: "New user registered",
      time: "5 hours ago",
      unread: false,
      role: ["admin"],
    },
    {
      id: 4,
      title: "Class meeting in 30 mins",
      time: "1 day ago",
      unread: false,
      role: ["teacher", "student"],
    },
  ];

  const filteredNotifications = notifications.filter((n) =>
    n.role.includes(user?.role),
  );
  const unreadCount = filteredNotifications.filter((n) => n.unread).length;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getRoleIcon = () => {
    switch (user?.role) {
      case "admin":
        return "🛡️";
      case "teacher":
        return "👨‍🏫";
      case "student":
        return "👨‍🎓";
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node) &&
        activeDropdown === "notifications"
      ) {
        setActiveDropdown(null);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node) &&
        activeDropdown === "userMenu"
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeDropdown]);

  const toggleDropdown = (dropdown: string) => {
    if (activeDropdown === dropdown) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(dropdown);
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden cursor-pointer"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>

          {/* Greeting */}
          <div className="hidden md:block">
            <p className="text-sm text-gray-500">{getGreeting()}</p>
            <p className="font-semibold text-gray-800">
              {user?.name} {getRoleIcon()}
            </p>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          

          <div>
            <ProfileIcon />
          </div>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            {/* <button
              onClick={() => toggleDropdown("userMenu")}
              className="flex items-center gap-2 ml-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="User menu"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-500">
                <FaUser className="w-4 h-4 text-white" />
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-medium text-gray-700">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.role}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500 hidden lg:block" />
            </button> */}

            {/* User Dropdown */}
            {activeDropdown === "userMenu" && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-100">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-800">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                  <p className="text-xs capitalize mt-1 px-2 py-0.5 bg-gray-100 rounded-full inline-block">
                    {user?.role}
                  </p>
                </div>
                <div className="py-2">
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    Profile
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    Settings
                  </button>
                  {user?.role === "student" && (
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      My Progress
                    </button>
                  )}
                  {user?.role === "teacher" && (
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      Class Management
                    </button>
                  )}
                  <div className="border-t border-gray-100 my-1"></div>
                  <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors">
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;
