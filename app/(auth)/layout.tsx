import React from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-linear-to-br from-slate-50 via-white to-blue-50 min-h-screen">
      <div className="max-w-6xl mx-auto flex flex-col min-h-screen">
        {/* Top Navigation Bar: Logo on left, Back button on right */}
        <header className="w-full flex items-center justify-between py-4 sm:py-6 px-4 sm:px-6">
          <Link href="/" className="flex items-center shrink-0">
            <img src="/logo.webp" alt="ListenAct Logo" className="w-32 sm:w-38" />
          </Link>

          <Link href="/" className="shrink-0">
            <Button
              variant="outline"
              className="h-9 px-3.5 sm:h-10 sm:px-5 rounded-full gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900 border-gray-200 hover:border-gray-300 bg-white/90 hover:bg-white shadow-2xs transition-all group cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-gray-500 group-hover:text-gray-900 transition-transform group-hover:-translate-x-0.5" />
              <span className="hidden sm:inline">Back to </span>Home
            </Button>
          </Link>
        </header>

        <div className="flex-1 flex items-center justify-center px-4 xl:px-0 py-2 sm:py-6">
          {children}
        </div>
        <div className="h-10 sm:h-16 xl:h-0" />
      </div>
    </div>
  );
};

export default layout;
