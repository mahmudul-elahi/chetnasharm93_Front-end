"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import MyButton from "../ui/MyButton";
import { Button } from "../ui/button";
import { User } from "@/types/user";
import { usePathname } from "next/navigation";
import LogOutButton from "../auth/LogOutButton";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  logout: () => void;
  userLoading?: boolean;
  user?: User;
  isAuthenticated?: boolean;
}

const Sidebar = ({
  isOpen,
  onClose,
  user,
  isAuthenticated,
}: SidebarProps) => {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === href;
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const baseNavItems = [
    { name: "Home", href: "/" },
    { name: "Classes", href: "/classes" },
    { name: "Tutors", href: "/tutors" },
    { name: "Assignments", href: "/assignments" },
    { name: "Free Resources", href: "/free-resources" },
    { name: "Contact Us", href: "/contact" },
  ];

  const isLoggedIn = mounted && !!user && isAuthenticated;

  const navItems = isLoggedIn
    ? [...baseNavItems, { name: "Dashboard", href: "/dashboard" }]
    : baseNavItems;

  return (
    <aside>
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-all duration-300
          ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div
        className={`
          fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-50
          transform transition-transform duration-300 ease-out
          border-l border-gray-100 flex flex-col justify-between
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0" onClick={onClose}>
              <img
                src="/logo.webp"
                alt="ListenAct Logo"
                className="w-36"
              />
            </Link>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col p-5 gap-1.5">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`block px-4 py-3 rounded-xl transition-all duration-200 text-base font-medium text-center ${
                    active
                      ? "bg-purple-50 text-primary font-semibold border border-purple-100/80 shadow-2xs"
                      : "text-gray-700 hover:text-primary hover:bg-gray-50"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          {/* Divider */}
          <div className="mx-5 h-px bg-gray-100" />

          {/* Auth Buttons */}
          <div className="p-5 flex flex-col gap-3">
            {!isLoggedIn ? (
              <>
                <Link href="/login" onClick={onClose}>
                  <MyButton className="w-full">Log in</MyButton>
                </Link>
                <Link href="/register" onClick={onClose}>
                  <Button
                    variant="outline"
                    className="w-full rounded-full border-gray-200 text-gray-800 hover:bg-gray-50"
                  >
                    Get started
                  </Button>
                </Link>
              </>
            ) : (
              <LogOutButton />
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
