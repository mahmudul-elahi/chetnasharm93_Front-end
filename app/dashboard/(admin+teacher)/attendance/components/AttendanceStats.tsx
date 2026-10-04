"use client";
import React from "react";
import { Calendar, CheckCircle, XCircle, TrendingUp } from "lucide-react";

interface AttendanceStatsProps {
  stats: {
    total: number;
    withStatus: number;
    withoutStatus: number;
    percentage: string;
  };
}

const AttendanceStats: React.FC<AttendanceStatsProps> = ({ stats }) => {
  const statCards = [
    {
      title: "Total Days",
      value: stats.total,
      icon: Calendar,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      borderColor: "border-blue-200 dark:border-blue-800"
    },
    {
      title: "With Status",
      value: stats.withStatus,
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950/20",
      borderColor: "border-green-200 dark:border-green-800"
    },
    {
      title: "Without Status",
      value: stats.withoutStatus,
      icon: XCircle,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-950/20",
      borderColor: "border-red-200 dark:border-red-800"
    },
    {
      title: "Completion Rate",
      value: `${stats.percentage}%`,
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/20"
    }
  ];
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards.map((card, index) => (
        <div
          key={index}
          className={`${card.bgColor} rounded-lg shadow-sm p-4 border ${card.borderColor} transition-all duration-200 hover:shadow-md`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {card.value}
              </p>
            </div>
            <card.icon size={32} className={card.color} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default AttendanceStats;