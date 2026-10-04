"use client";

import { useGetDashboardTotalStudentForAdminQuery } from "@/src/redux/api/admin/adminDashboardApi";
import ApexChart from "@/components/charts/ApexChart";
import { ApexOptions } from "apexcharts";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, ChevronDown } from "lucide-react";
import StudentChartSkeleton from "./StudentChartSkeleton";

const StudentsState = () => {
  const currentYear = new Date().getFullYear();

  const [selectedYear, setSelectedYear] = useState(currentYear);

  const { data, isLoading } = useGetDashboardTotalStudentForAdminQuery({
    year: selectedYear,
  });

  if (isLoading) return <StudentChartSkeleton />;

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const studentCounts = data?.data?.map((item: any) => item.count) || [];

  const months =
    data?.data?.map((item: any) => monthNames[item.month - 1]) || [];

  const options: ApexOptions = {
    chart: {
      type: "area",
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },

    dataLabels: {
      enabled: false,
    },

    stroke: {
      curve: "smooth",
      width: 3,
    },

    xaxis: {
      categories: months,
    },

    yaxis: {
      min: 0,
    },

    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      },
    },
    colors: ["#9b35e3"],
    tooltip: {
      theme: "dark",
      y: {
        formatter: (value: number) => `${value} students`,
      },
    },

    grid: {
      borderColor: "#e5e7eb",
      strokeDashArray: 4,
    },
  };

  const series = [
    {
      name: "Total Student",
      data: studentCounts,
    },
  ];

  // Generate year list
  const years = Array.from({ length: 10 }, (_, index) => currentYear - index);

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Total Student by Year</h2>

        {/* Year Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white hover:bg-gray-50 transition-colors cursor-pointer">
            {selectedYear}
            <ChevronDown className="h-4 w-4" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="bg-white rounded-xl max-h-60 overflow-y-auto w-30"
            align="end"
          >
            {years.map((year) => (
              <DropdownMenuItem
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`
              cursor-pointer px-4 py-2.5 text-sm
              ${
                year === selectedYear
                  ? "bg-linear-to-r from-primary to-secondary text-white focus:bg-linear-to-r focus:from-primary focus:to-secondary focus:text-white"
                  : "hover:bg-gray-50"
              }
              rounded-lg m-1
            `}
              >
                {year}
                {year === selectedYear && (
                  <Check className="h-4 w-4 ml-auto text-white!" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="min-h-50">
        <ApexChart type="area" height={200} options={options} series={series} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">Total Students</p>

          <p className="text-2xl font-bold">
            {studentCounts.reduce((a: number, b: number) => a + b, 0)}
          </p>
        </div>

        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">Peak Month</p>

          <p className="text-2xl font-bold">
            {studentCounts.length ? Math.max(...studentCounts) : 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentsState;
