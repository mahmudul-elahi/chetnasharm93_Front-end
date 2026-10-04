"use client";
import React from "react";
import { X } from "lucide-react";
import { FilterState } from "@/types/filter";

interface ActiveFiltersProps {
  filters: FilterState;
  onRemoveFilter: (key: keyof FilterState, value?: any) => void;
  priceRanges: { label: string; value: string }[];
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  filters,
  onRemoveFilter,
  priceRanges,
}) => {
  const activeFilters = [];

  if (filters.search) {
    activeFilters.push({
      key: "search",
      label: `Search: ${filters.search}`,
      onRemove: () => onRemoveFilter("search", ""),
    });
  }

  if (filters.category && filters.category !== "All") {
    activeFilters.push({
      key: "category",
      label: `Category: ${filters.category}`,
      onRemove: () => onRemoveFilter("category", ""),
    });
  }

  if (filters.level && filters.level !== "All") {
    activeFilters.push({
      key: "level",
      label: `Level: ${filters.level}`,
      onRemove: () => onRemoveFilter("level", ""),
    });
  }

  if (filters.priceRange) {
    const priceLabel = priceRanges.find((r) => r.value === filters.priceRange)
      ?.label;
    activeFilters.push({
      key: "priceRange",
      label: `Price: ${priceLabel}`,
      onRemove: () => onRemoveFilter("priceRange", ""),
    });
  }

  if (filters.rating) {
    activeFilters.push({
      key: "rating",
      label: `${filters.rating}+ Stars`,
      onRemove: () => onRemoveFilter("rating", null),
    });
  }

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {activeFilters.map((filter) => (
        <span
          key={filter.key}
          className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
        >
          {filter.label}
          <button
            onClick={filter.onRemove}
            className="hover:text-primary-dark"
            aria-label={`Remove ${filter.label} filter`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
    </div>
  );
};

export default ActiveFilters;