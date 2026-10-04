"use client";
import LogOutButton from "@/components/auth/LogOutButton";
import { NavItem } from "@/types/dashboard";
import { User } from "@/types/user";
import {
  LayoutGrid,
  Settings,
  ChevronsLeft,
  GraduationCap,
  BookOpen,
  Calendar,
  Clock,
  Video,
  Layers,
  UsersRound,
  CreditCard,
  BadgeDollarSign,
  BookUser,
  Heart,
  Bell,
  Box,
  NotebookPen,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

interface DashboardSidebarProps {
  open: boolean | null;
  setOpen?: (open: boolean) => void;
  user: User;
}

const DashboardSidebar = ({ open, setOpen, user }: DashboardSidebarProps) => {
  const pathname = usePathname();

  // Navigation items based on roles
  const navItems: NavItem[] = [
    // Admin Routes
    {
      name: "Overview",
      href: "/dashboard",
      icon: LayoutGrid,
      roles: ["admin", "teacher", "student"],
    },
    {
      name: "Teachers",
      href: "/dashboard/teachers",
      icon: GraduationCap,
      roles: ["admin"],
    },
    {
      name: "Classes",
      href: "/dashboard/classes",
      icon: BookOpen,
      roles: ["admin"],
    },
    {
      name: "Batches",
      href: "/dashboard/batches",
      icon: Layers,
      roles: ["admin"],
    },
    {
      name: "Students",
      href: "/dashboard/students",
      icon: BookUser,
      roles: ["admin"],
    },
    {
      name: "Waiting List",
      href: "/dashboard/waiting-list",
      icon: Clock,
      roles: ["admin"],
    },
    {
      name: "All Payments",
      href: "/dashboard/payments",
      icon: CreditCard,
      roles: ["admin"],
    },
    {
      name: "Free Resources",
      href: "/dashboard/free-resources",
      icon: Box,
      roles: ["admin"],
    },
    {
      name: "Notification Log",
      href: "/dashboard/notifications",
      icon: Bell,
      roles: ["admin"],
    },
    {
      name: "User Management",
      href: "/dashboard/users",
      icon: UsersRound,
      roles: ["admin"],
    },

    // Teacher Routes
    {
      name: "My Batches",
      href: "/dashboard/my-assigned-batches",
      icon: Video,
      roles: ["teacher"],
    },
    {
      name: "Students",
      href: "/dashboard/my-students",
      icon: BookUser,
      roles: ["teacher"],
    },
    {
      name: "My Schedule",
      href: "/dashboard/availability",
      icon: Calendar,
      roles: ["teacher"],
    },
    {
      name: "Assignments",
      href: "/dashboard/assignments",
      icon: NotebookPen,
      roles: ["teacher"],
    },

    // Student Routes
    {
      name: "My Batches",
      href: "/dashboard/my-enrolled-batches",
      icon: BookOpen,
      roles: ["student"],
    },
    {
      name: "My Wishlist",
      href: "/dashboard/my-wishlist",
      icon: Heart,
      roles: ["student"],
    },
    {
      name: "My Assignments",
      href: "/dashboard/my-assignments",
      icon: FileText,
      roles: ["student"],
    },

    {
      name: "Transactions",
      href: "/dashboard/transactions",
      icon: BadgeDollarSign,
      roles: ["student"],
    },

    // Common Routes
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
      roles: ["admin", "teacher", "student"],
    },
  ];

  // Filter navigation items based on user role
  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(user?.role),
  );

  const isActive = (href: string) => {
    if (href === "/dashboard" && pathname === "/dashboard") return true;
    if (href !== "/dashboard" && pathname.startsWith(href)) return true;
    return false;
  };

  // Close sidebar on mobile when route changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && setOpen) {
        setOpen(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setOpen]);

  // Single primary color - no role-based colors
  const getRoleBadge = () => {
    switch (user?.role) {
      case "admin":
        return "bg-primary text-blue-200";
      case "teacher":
        return "bg-primary text-blue-200";
      case "student":
        return "bg-primary text-blue-200";
      default:
        return "bg-primary text-blue-200";
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setOpen?.(false)}
        />
      )}

      {/* Sidebar - Using primary blue color */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-40
          bg-linear-to-r from-primary to-secondary 
          w-72 h-screen
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          flex flex-col justify-between
          shadow-xl
        `}
      >
        {/* Header / Logo */}
        <div className="px-4 py-6 border-b border-blue-400/30">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="ListenAct Logo"
                className="w-38 px-4 py-2  object-cover bg-white rounded"
              />
            </Link>
            {/* Close button for mobile */}
            <button
              onClick={() => setOpen?.(false)}
              className="lg:hidden text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronsLeft className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto text-white">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 1024) setOpen?.(false);
                }}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl
                  transition-all duration-200 group
                  ${
                    active
                      ? "bg-white/20 text-white shadow-lg"
                      : "text-blue-100 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                <Icon
                  className={`w-5 h-5 ${
                    active
                      ? "text-white"
                      : "text-blue-200 group-hover:text-white"
                  }`}
                />
                <span className="font-medium">{item.name}</span>
                {item.badge && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
                {active && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}

        {/* Logout Button */}
        <div className="w-3/4 mx-auto">
          <LogOutButton />
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
