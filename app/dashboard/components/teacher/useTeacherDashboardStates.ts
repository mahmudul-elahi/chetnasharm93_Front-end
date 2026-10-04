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
  CheckCircle,
  Calendar,
} from "lucide-react";
import { StateCardConfig } from "@/components/ui/StateCard";
import { useGetDashboardStatesForTeacherQuery } from "@/src/redux/api/teacher/teacherDashboardApi";

export const useTeacherDashboardStates = () => {
  const { data: apiResponse, isLoading } =
    useGetDashboardStatesForTeacherQuery(null);

  const statistics = apiResponse?.data?.statistics;
  const top_batches = apiResponse?.data?.top_batches;
  const upcoming_batches = apiResponse?.data?.upcoming_batches;

  // Parse seat occupancy rate
  const seatOccupancyRate = statistics?.seat_occupancy_rate
    ? parseFloat(statistics.seat_occupancy_rate)
    : 0;

  const totalStudents = parseInt(statistics?.total_students || "0");
  const totalSeats = parseInt(statistics?.total_seats || "0");
  const totalRevenue = statistics?.total_revenue_generated || 0;

  const teacherDashboardStates: StateCardConfig[] = [
    {
      title: "Total Batches",
      value: statistics?.total_batches || 0,
      icon: Layers,
      color: "pink",
    },
    {
      title: "Active Batches",
      value: statistics?.active_batches || 0,
      icon: CheckCircle,
      color: "green",
    },
    {
      title: "Completed Batches",
      value: statistics?.completed_batches || 0,
      icon: Calendar,
      color: "indigo",
    },
    {
      title: "Total Students",
      value: totalStudents,
      icon: UsersRound,
      color: "teal",
    },
    {
      title: "Total Seats",
      value: totalSeats,
      icon: Sofa,
      color: "gray",
    },
    {
      title: "Seat Occupancy Rate",
      value: seatOccupancyRate,
      icon: Percent,
      color: "orange",
      suffix: "%",
    },
    {
      title: "Lost Revenue",
      value: totalRevenue,
      icon: TrendingDown,
      color: "red",
      prefix: "$",
    },
    {
      title: "Avg Revenue Per Student",
      value: totalStudents > 0 ? totalRevenue / totalStudents : 0,
      icon: BarChart3,
      color: "purple",
      prefix: "$",
    },
  ];

  return {
    top_batches: top_batches || [],
    upcoming_batches: upcoming_batches || [],
    teacherDashboardStates,
    isLoading,
  };
};
