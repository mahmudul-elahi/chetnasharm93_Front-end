"use client";

import React from "react";
import { CheckCircle, Clock } from "lucide-react";
import MyButton from "@/components/ui/MyButton";

interface PaymentMethodCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isActive: boolean;
  isSelected: boolean;
  onClick: () => void;
  comingSoon?: boolean;
}

const PaymentMethodCard = ({
  title,
  description,
  icon,
  isActive,
  isSelected,
  onClick,
  comingSoon = false,
}: PaymentMethodCardProps) => {
  return (
    <div
      onClick={isActive && !comingSoon ? onClick : undefined}
      className={`
        relative p-6 rounded-2xl border-2 transition-all duration-300
        ${isActive && !comingSoon ? "cursor-pointer hover:shadow-lg" : "cursor-default"}
        ${isSelected 
          ? "border-primary bg-primary/5 shadow-lg" 
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
        }
        ${!isActive ? "opacity-60" : ""}
      `}
    >
      {comingSoon && (
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
            <Clock className="w-3 h-3" />
            Coming Soon
          </span>
        </div>
      )}

      <div className="flex items-start gap-4">
        <div className={`
          p-3 rounded-xl
          ${isSelected 
            ? "bg-primary text-white" 
            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
          }
        `}>
          {icon}
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </div>

        {isSelected && isActive && (
          <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
        )}
      </div>
    </div>
  );
};

export default PaymentMethodCard;