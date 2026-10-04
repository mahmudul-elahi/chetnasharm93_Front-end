"use client";
import React, { useEffect, useRef } from "react";
import {
  ChevronsLeft,
  ChevronRight,
  ChevronsRight,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
  className?: string;
  scrollOnChange?: boolean; // Enable/disable auto-scroll (default: false)
  scrollTargetId?: string; // Custom target element ID (default: "filters-section")
  scrollBehavior?: "smooth" | "auto"; // Scroll behavior (default: "smooth")
  scrollOffset?: number; // Offset in pixels (default: 0)
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage = 9,
  onPageChange,
  className = "",
  scrollOnChange = false, // Changed to false by default for flexibility
  scrollTargetId = "filters-section",
  scrollBehavior = "smooth",
  scrollOffset = 0,
}) => {
  const prevPageRef = useRef(currentPage);

  // Scroll function - only runs if scrollOnChange is true
  const scrollToTarget = () => {
    if (!scrollOnChange) return;
    
    // Use requestAnimationFrame to ensure DOM is updated
    requestAnimationFrame(() => {
      const targetElement = document.getElementById(scrollTargetId);
      
      if (targetElement) {
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - scrollOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: scrollBehavior,
        });
      } else {
        // Fallback to top of page
        window.scrollTo({
          top: scrollOffset,
          behavior: scrollBehavior,
        });
      }
    });
  };

  // Trigger scroll when page changes (only if enabled)
  useEffect(() => {
    if (prevPageRef.current !== currentPage && scrollOnChange) {
      scrollToTarget();
    }
    prevPageRef.current = currentPage;
  }, [currentPage, scrollOnChange]);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
      // Scroll happens in useEffect
    }
  };

  // Calculate showing range
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) return null;

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-3 items-center justify-between gap-4 ${className}`}
    >
      {/* Showing items info */}
      <div className="text-sm text-gray-600 dark:text-gray-400 flex justify-center sm:justify-start gap-1">
        Showing{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {startItem}
        </span>{" "}
        to{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {endItem}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {totalItems}
        </span>{" "}
        items
      </div>

      {/* Page numbers */}
      <div className="flex items-center justify-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className="h-9 w-9 p-0"
          aria-label="First page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-9 w-9 p-0"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {getPageNumbers().map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => handlePageChange(page)}
            className={`h-9 min-w-9 ${
              currentPage === page
                ? "bg-primary text-white hover:bg-primary-dark"
                : ""
            }`}
          >
            {page}
          </Button>
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-9 w-9 p-0"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="h-9 w-9 p-0"
          aria-label="Last page"
        >
          <ChevronsRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Page info */}
      <div className="text-sm flex justify-center sm:justify-end text-gray-600 dark:text-gray-400">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
};

export default Pagination;