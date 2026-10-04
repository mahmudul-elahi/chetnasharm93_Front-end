"use client";

import React from "react";

interface PaymentTimelineProps {
  steps: Array<{
    number: number;
    title: string;
  }>;
}

const PaymentTimeline = ({ steps }: PaymentTimelineProps) => {
  return (
    <div className="relative">
      {/* Timeline Line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-primary/20 hidden md:block" />

      {/* Timeline Steps */}
      <div className="space-y-8">
        {steps.map((step, index) => (
          <div
            key={step.number}
            className="relative flex items-center justify-center"
          >
            {/* Timeline Dot */}
            <div className="absolute left-1/2 transform -translate-x-1/2 z-10 hidden md:block">
              <div className="w-4 h-4 rounded-full bg-primary border-4 border-white dark:border-gray-900 shadow-md" />
            </div>

            {/* Mobile Timeline Line */}
            <div className="absolute left-5 top-16 bottom-0 w-0.5 bg-primary/20 md:hidden" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentTimeline;