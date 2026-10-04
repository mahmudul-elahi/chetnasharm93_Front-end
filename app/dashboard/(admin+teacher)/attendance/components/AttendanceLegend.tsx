"use client";
import React from "react";
import { CheckCircle, XCircle, RefreshCw, Calendar } from "lucide-react";
import { ActionButton } from "@/components/ui/ActionButton";

const AttendanceLegend = () => {
  const legendItems = [
    {
      icon: CheckCircle,
      label: "Has Status",
      description: "Attendance has been taken for this day",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950/20",
      borderColor: "border-green-200 dark:border-green-800"
    },
    {
      icon: XCircle,
      label: "No Status",
      description: "No attendance taken for this day",
      color: "text-gray-500 dark:text-gray-400",
      bgColor: "bg-gray-50 dark:bg-gray-900/20",
      borderColor: "border-gray-200 dark:border-gray-800"
    },
    {
      icon: Calendar,
      label: "Today",
      description: "Current day highlighted",
      color: "text-primary",
      special: "ring-2 ring-primary"
    },
    {
      icon: RefreshCw,
      label: "Update Button",
      description: "Click to update attendance for this day",
      customElement: (
        <ActionButton variant="edit" icon={RefreshCw} size="sm" label="Update" showText={false} />
      )
    }
  ];
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        Legend & Information
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {legendItems.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            {item.customElement ? (
              item.customElement
            ) : (
              <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${item.bgColor} border ${item.borderColor}`}>
                <item.icon size={18} className={item.color} />
              </div>
            )}
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {item.label}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {item.description}
              </p>
              {item.special && (
                <div className={`mt-1 w-full h-0.5 ${item.special}`} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceLegend;