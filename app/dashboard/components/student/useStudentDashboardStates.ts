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
import { useGetDashboardStatesForStudentQuery } from "@/src/redux/api/student/studentDashboardApi";

export const useStudentDashboardStates = () => {
  const { data: apiResponse, isLoading } =
    useGetDashboardStatesForStudentQuery(null);

  const statistics = apiResponse?.data?.statistics;
  const active_courses = apiResponse?.data?.active_courses;
  const recent_enrollments = apiResponse?.data?.recent_enrollments;
  const completed_courses = apiResponse?.data?.completed_courses;



  const studentDashboardStates: StateCardConfig[] = [
    {
      title: "Total Batches",
      value: statistics?.total_enrollments || 0,
      icon: Layers,
      color: "pink",
    },
    {
      title: "Active Batches",
      value: statistics?.active_courses || 0,
      icon: CheckCircle,
      color: "green",
    },
    {
      title: "Completed Batches",
      value: statistics?.completed_courses || 0,
      icon: Calendar,
      color: "indigo",
    },
    {
      title: "Total Spent",
      value: statistics?.total_spent || 0,
      icon: Calendar,
      color: "gray",
      prefix: "$",
    },
  ];

  return {
    active_courses: active_courses || [],
    recent_enrollments: recent_enrollments || [],
    completed_courses: completed_courses || [],
    studentDashboardStates,
    isLoading,
  };
};
