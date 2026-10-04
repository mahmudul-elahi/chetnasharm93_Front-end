"use client";

import React from "react";
import Image from "next/image";

interface PaymentStepCardProps {
  stepNumber: number;
  title: string;
  description: string;
  imagePath: string;
}

const PaymentStepCard = ({
  stepNumber,
  title,
  description,
  imagePath,
}: PaymentStepCardProps) => {
  return (
    <div className="flex flex-col items-center text-center">
      {/* Step Number Badge */}
      <div className="mb-4">
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white text-lg font-bold">
          {stepNumber + 1}
        </span>
      </div>

      {/* Image Card */}
      <div className="w-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-xl transition-shadow duration-300 p-4 mb-4">
        <div className="relative w-full h-64 flex items-center justify-center">
          <Image
            src={imagePath}
            alt={title}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </div>

      {/* Step Title */}
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>

      {/* Step Description */}
      <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
        {description}
      </p>
    </div>
  );
};

export default PaymentStepCard;