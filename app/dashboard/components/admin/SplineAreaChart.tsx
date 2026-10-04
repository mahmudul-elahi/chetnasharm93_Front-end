"use client";
import Loader from "@/components/ui/Loader";
import { useGetDashboardTotalStudentForAdminQuery } from "@/src/redux/api/admin/adminDashboardApi";
import ApexChart from "@/components/charts/ApexChart";
import { ApexOptions } from "apexcharts";
import React from "react";

const StudentsState = () => {
  const { data, isLoading } = useGetDashboardTotalStudentForAdminQuery({});
  
  if (isLoading) return <Loader />;
  

  // Transform API data for the chart
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  
  // Extract counts from API response
  const studentCounts = data?.data?.map((item: any) => item.count) || [];
  const months = data?.data?.map((item: any) => monthNames[item.month - 1]) || [];

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
      title: {
        text: `Year: ${data?.year || 2025}`,
      },
    },
    yaxis: {
      title: {
        text: "Number of Students",
      },
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
    title: {
      text: "Student Enrollment by Month",
      align: "center",
      style: {
        fontSize: "16px",
        fontWeight: "bold",
      },
    },
  };

  const series = [
    {
      name: "Students Enrolled",
      data: studentCounts,
    },
  ];

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
     <div>
       <h2 className="text-xl font-semibold mb-4">
        Student Enrollment Analytics
      </h2>
      {/* year dropdown */}
     </div>
      
      <ApexChart
        type="area"
        height={350}
        options={options}
        series={series}
      />
      
      {/* Optional: Show summary statistics */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">Total Students</p>
          <p className="text-2xl font-bold">
            {studentCounts.reduce((a: number, b: number) => a + b, 0)}
          </p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">Peak Month</p>
          <p className="text-2xl font-bold">
            {Math.max(...studentCounts)}
          </p>
        </div>
        <div className="bg-purple-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">Year</p>
          <p className="text-2xl font-bold">
            {data?.year || 2025}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentsState;