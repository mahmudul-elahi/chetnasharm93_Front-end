"use client";

import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

// Dynamically import with proper typing
const ReactApexChart = dynamic(
  () => import("react-apexcharts").then((mod) => mod.default),
  {
    ssr: false,
  }
);

type ApexChartProps = {
  type:
    | "line"
    | "area"
    | "bar"
    | "pie"
    | "donut"
    | "radar"
    | "heatmap"
    | "radialBar"
    | "scatter"
    | "bubble"
    | "candlestick";

  height?: number | string;
  width?: string | number;

  series: any; // More flexible type for series
  options?: ApexOptions;

  className?: string;
};

export default function ApexChart({
  type = "line",
  height = 350,
  width = "100%",
  series,
  options = {},
  className,
}: ApexChartProps) {
  // Ensure series is always provided
  if (!series || series.length === 0) {
    console.warn("No series data provided to ApexChart");
    return null;
  }

  return (
    <div className={className}>
      <ReactApexChart
        options={options}
        series={series}
        type={type}
        height={height}
        width={width}
      />
    </div>
  );
}