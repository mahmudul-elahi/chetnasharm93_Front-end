import React, { useEffect } from "react";
import Link from "next/link";
import { LogOut, X } from "lucide-react";
import MyButton from "../ui/MyButton";
import { Button } from "../ui/button";
import { User } from "@/types/user";
import { SpinnerCustom } from "../ui/spinner";
import { usePathname } from "next/navigation";
import LogOutButton from "../auth/LogOutButton";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  logout: () => void;
  userLoading?: boolean;
  user?: User;
}

const Sidebar = ({
  isOpen,
  onClose,
  logout,
  userLoading,
  user,
}: SidebarProps) => {
  const pathname = usePathname();
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

  const navItems = [
    "Classes",
    "Tutors",
    "Assignments",
    "Free-Resources",
    "Dashboard",
  ].map((item) => ({
    name: item.split("-").join(" "),
    href: `/${item.toLowerCase()}`,
  }));

  return (
    <aside>
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-all duration-300
          ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div
        className={`
          fixed top-0 right-0 h-full w-full max-w-sm shadow-2xl z-50
          transform transition-transform duration-300 ease-out
          border-l border-white/10 flex flex-col justify-between
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/10">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 shrink-0 group bg-white rounded"
            >
              <img
                src="/logo.png"
                alt="ListenAct Logo"
                className="w-38 px-4 py-2  object-cover bg-white rounded"
              />
            </Link>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-all duration-200"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-[#dce6ff]/70" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col p-5 gap-1">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`px-4 py-3 text-[#dce6ff]/80 hover:text-white hover:bg-white/10 transition-all duration-200 text-base font-medium ${
                    active ? "bg-white/10 rounded-full" : "hover:bg-white/10"
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
          <div className="mx-5 h-px bg-white/10" />

          {/* Auth Buttons */}
          <div className="p-5 flex flex-col gap-4">
            {!user ? (
              <div className="p-5 flex flex-col gap-4">
                {" "}
                <Link href="/login" onClick={onClose}>
                  <MyButton className="w-full"> Log in</MyButton>
                </Link>
                <Link href="/register" onClick={onClose}>
                  <Button variant="outline" className="w-full">
                    {" "}
                    Get started
                  </Button>
                </Link>
              </div>
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
