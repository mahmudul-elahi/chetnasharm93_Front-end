"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import MyButton from "../ui/MyButton";
import { useAuth } from "@/hooks/useAuth";
import { ProfileIcon } from "../ui/ProfileIcon";
import { useGetMeQuery } from "@/src/redux/api/auth/authApi";
import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation";
import LoginButton from "../ui/LoginButton";

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { isLoading, isAuthenticated, logout } = useAuth();
  const { data: fetchedUser, isLoading: userLoading } = useGetMeQuery({
    skip: !isAuthenticated,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const user = fetchedUser?.user;
  const isLoggedIn = mounted && isAuthenticated && !!user;

  const baseNavItems = [
    { name: "Home", href: "/" },
    { name: "Classes", href: "/classes" },
    { name: "Tutors", href: "/tutors" },
    { name: "Assignments", href: "/assignments" },
    { name: "Free Resources", href: "/free-resources" },
    { name: "Contact Us", href: "/contact" },
  ];

  const navItems = isLoggedIn
    ? [...baseNavItems, { name: "Dashboard", href: "/dashboard" }]
    : baseNavItems;

  const isActive = (href: string) => {
    if (href === "/") return pathname === href;
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  // Don't render auth section on server, only on client after mount
  const renderAuthSection = () => {
    if (isLoading || userLoading) {
      return (
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 shrink-0">
        {user && isAuthenticated ? <ProfileIcon /> : <LoginButton />}
      </div>
    );
  };

  return (
    <>
      <nav className="text-gray-900 bg-white/95 backdrop-blur-md fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b border-gray-200/60 shadow-xs">
        <div className="max-w-350 px-4 sm:px-6 lg:px-8  mx-auto h-17 flex items-center justify-between gap-8">
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <img src="/logo.webp" alt="Logo" className="w-38" />
          </Link>

          <div className="flex items-center gap-4">
            <ul className="hidden lg:flex items-center gap-1 list-none m-0 p-0">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`block px-3 py-1.5 font-medium transition-all duration-200 ${
                        active
                          ? "border-b-2 border-primary"
                          : "hover:border-primary/50 border-b-2 border-b-[#00000000]"
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {renderAuthSection()}

            <button
              className="lg:hidden flex items-center justify-center p-2 rounded-lg border border-gray-200 text-gray-800 hover:bg-gray-100 transition-all duration-200"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <Sidebar
        user={user}
        userLoading={userLoading}
        isAuthenticated={isAuthenticated}
        logout={logout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
    </>
  );
};

export default Navbar;
