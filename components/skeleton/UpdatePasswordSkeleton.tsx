"use client";

import { Lock, Eye, EyeOff, X } from "lucide-react";
import MyButton from "@/components/ui/MyButton";
import { ModalPortal } from "@/components/ui/ModalPortal";
import { Button } from "@/components/ui/button";

interface UpdatePasswordSkeletonProps {
  onClose: () => void;
}

export default function UpdatePasswordSkeleton({ onClose }: UpdatePasswordSkeletonProps) {
  return (
    <ModalPortal>
      {/* Overlay Skeleton */}
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
        {/* Modal Container */}
        <div className="flex items-center justify-center min-h-full p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse">
                  <Lock className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                </div>
                <div className="h-7 w-40 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Form Skeleton */}
            <div className="p-6 space-y-5">
              {/* Current Password Field Skeleton */}
              <div>
                <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse" />
                <div className="relative">
                  <div className="w-full h-10 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Eye className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* New Password Field Skeleton */}
              <div>
                <div className="h-5 w-28 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse" />
                <div className="relative">
                  <div className="w-full h-10 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Eye className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
                <div className="h-3 w-36 bg-gray-200 dark:bg-gray-700 rounded mt-1 animate-pulse" />
              </div>

              {/* Confirm Password Field Skeleton */}
              <div>
                <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse" />
                <div className="relative">
                  <div className="w-full h-10 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Eye className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Actions Skeleton */}
              <div className="flex items-center gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  type="button"
                  onClick={onClose}
                  disabled
                >
                  Cancel
                </Button>
                <MyButton
                  type="button"
                  disabled
                  className="flex-1"
                >
                  Update Password
                </MyButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}