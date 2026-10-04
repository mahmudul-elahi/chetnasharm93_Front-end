import React from "react";
import { LucideIcon } from "lucide-react";
export type StateCardColor = "blue" | "green" | "orange" | "red" | "purple" | "pink" | "indigo" | "teal" | "gray";
export interface StateCardConfig {
  title: string;
  value: number | string;
  icon?: LucideIcon;
  color?: "blue" | "green" | "orange" | "red" | "purple" | "pink" | "indigo" | "teal" | "gray";
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  prefix?: string;
  suffix?: string;
}

interface StateCardProps {
  config: StateCardConfig;
  className?: string;
}

const colorVariants = {
  blue: {
    bg: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
    border: "border-blue-200 dark:border-blue-800",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-600",
    textColor: "text-blue-700",
  },
  green: {
    bg: "from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20",
    border: "border-green-200 dark:border-green-800",
    iconBg: "bg-green-500/10",
    iconColor: "text-green-600",
    textColor: "text-green-700",
  },
  orange: {
    bg: "from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20",
    border: "border-orange-200 dark:border-orange-800",
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-600",
    textColor: "text-orange-700",
  },
  red: {
    bg: "from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20",
    border: "border-red-200 dark:border-red-800",
    iconBg: "bg-red-500/10",
    iconColor: "text-red-600",
    textColor: "text-red-700",
  },
  purple: {
    bg: "from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20",
    border: "border-purple-200 dark:border-purple-800",
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-600",
    textColor: "text-purple-700",
  },
  pink: {
    bg: "from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20",
    border: "border-pink-200 dark:border-pink-800",
    iconBg: "bg-pink-500/10",
    iconColor: "text-pink-600",
    textColor: "text-pink-700",
  },
  indigo: {
    bg: "from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20",
    border: "border-indigo-200 dark:border-indigo-800",
    iconBg: "bg-indigo-500/10",
    iconColor: "text-indigo-600",
    textColor: "text-indigo-700",
  },
  teal: {
    bg: "from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20",
    border: "border-teal-200 dark:border-teal-800",
    iconBg: "bg-teal-500/10",
    iconColor: "text-teal-600",
    textColor: "text-teal-700",
  },
  gray: {
    bg: "from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20",
    border: "border-gray-200 dark:border-gray-800",
    iconBg: "bg-gray-500/10",
    iconColor: "text-gray-600",
    textColor: "text-gray-700",
  },
};

// Default colors when no color is provided
const defaultColors = {
  bg: "from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20",
  border: "border-gray-200 dark:border-gray-800",
  iconBg: "bg-gray-500/10",
  iconColor: "text-gray-600",
  textColor: "text-gray-700",
};

const StateCard: React.FC<StateCardProps> = ({ config, className = "" }) => {
  const colors = config.color ? colorVariants[config.color] : defaultColors;
  const Icon = config.icon;

  // Format value with prefix and suffix
  const formattedValue = () => {
    if (typeof config.value === "number") {
      let formatted = config.value.toLocaleString();
      if (config.prefix) formatted = `${config.prefix}${formatted}`;
      if (config.suffix) formatted = `${formatted}${config.suffix}`;
      return formatted;
    }
    return config.value;
  };

  return (
    <div
      className={`bg-linear-to-br ${colors.bg} rounded-xl p-4 border ${colors.border} transition-all duration-200 hover:shadow-md ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 ">
            {config.title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {formattedValue()}
          </p>
          {config.subtitle && (
            <p className="text-xs text-gray-500  mt-1">
              {config.subtitle}
            </p>
          )}
          {config.trend && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={`text-xs font-medium ${
                  config.trend.isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {config.trend.isPositive ? "+" : "-"}
                {config.trend.value}%
              </span>
              <span className="text-xs text-gray-500">from last month</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-2 rounded-lg ${colors.iconBg}`}>
            <Icon className={`w-5 h-5 ${colors.iconColor}`} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StateCard;