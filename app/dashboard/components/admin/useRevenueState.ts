import { useGetRevenueStatesForAdminQuery } from "@/src/redux/api/admin/adminDashboardApi";
import React from "react";
import {
  DollarSign,
  TrendingDown,
  BarChart3,
  Sofa,
  Target,
  Percent,
  UsersRound,
  Layers,
} from "lucide-react";
import { StateCardConfig } from "@/components/ui/StateCard";

export const useRevenueState = () => {
  const { data: apiResponse, isLoading } =
    useGetRevenueStatesForAdminQuery(null);
  const data = apiResponse?.data;
  const top_earning_classes = apiResponse?.data?.top_earning_classes;
  const top_earning_batches = apiResponse?.data?.top_earning_batches;
  const revenueState: StateCardConfig[] = [
    {
      title: "Total Revenue",
      value: data?.total_revenue || 0,
      icon: DollarSign,
      color: "blue",
      prefix: "$",
    },
    {
      title: "Potential Revenue",
      value: data?.potential_revenue || 0,
      icon: Target,
      color: "green",
      prefix: "$",
    },
    {
      title: "Lost Revenue",
      value: data?.lost_revenue || 0,
      icon: TrendingDown,
      color: "red",
      prefix: "$",
    },
    {
      title: "Average Revenue Per Batch",
      value: data?.average_revenue_per_batch || 0,
      icon: BarChart3,
      color: "purple",
      prefix: "$",
    },

    {
      title: "Total Batch",
      value: data?.total_batches || 0,
      icon: Layers,
      color: "pink",
    },
    {
      title: "Total Seats",
      value: data?.total_seats || 0,
      icon: Sofa,
      color: "indigo",
    },
    {
      title: "Filled Seats",
      value: data?.filled_seats || 0,
      icon: UsersRound,
      color: "teal",
    },
    {
      title: "Seat Occupancy Rate",
      value: data?.seat_occupancy_rate || 0,
      icon: Percent,
      color: "orange",
      suffix: "%",
    },
  ];
  return {
    top_earning_batches,
    top_earning_classes,
    revenueState,
    isLoading,
  };
};
