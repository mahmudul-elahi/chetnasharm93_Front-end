import React from "react";
import { ChevronsLeft, Shield, Star, Users, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Toaster } from "sonner";

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-linear-to-br from-slate-50 via-white to-blue-50 min-h-screen">
      <div className="max-w-6xl mx-auto flex flex-col min-h-screen">
        {/* Logo and Back Button */}
        <div className="w-full flex flex-col items-center gap-4 lg:flex-row lg:justify-between py-8 px-4">
          <Link href="/" className="flex items-center gap-2 group w-38">
            <img src="./logo.webp" alt="logo" className="w-full" />
          </Link>

          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <Button variant="outline">
              <ChevronsLeft /> Back to Home
            </Button>
          </Link>
        </div>

        <div className="flex-1 flex  items-center justify-center px-4 xl:px-0">
          {children}
        </div>
        <div className="h-20 xl:h-0 "></div>
      </div>
    </div>
  );
};

export default layout;
