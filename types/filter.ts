export interface FilterState {
  search: string;
  category: string;
  level: string;
  priceRange: string;
  rating: number | null;
  sortBy: "popular" | "newest" | "price-low" | "price-high" | "rating";
}

export interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  categories: string[];
  levels: string[];
  priceRanges: { label: string; value: string }[];
  ratings: number[];
  activeFilterCount: number;
  onClearFilters: () => void;
}