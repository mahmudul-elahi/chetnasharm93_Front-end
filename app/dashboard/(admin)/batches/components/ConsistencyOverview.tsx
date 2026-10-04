import React from "react";
import { Clock, Info } from "lucide-react";
import { ConsistencyDetail } from "../hooks/useConsistencyCheck";
import { weekdayLabels } from "@/utils/batchUtils";
import { format } from "date-fns";

interface ConsistencyOverviewProps {
  consistencyDetails: Map<number, ConsistencyDetail>;
}

export const ConsistencyOverview: React.FC<ConsistencyOverviewProps> = ({
  consistencyDetails,
}) => {
  return (
    <div className="bg-blue-50 p-3 rounded-lg overflow-x-auto">
      <p className="text-sm font-medium text-blue-800 flex items-center gap-2">
        <Clock className="w-4 h-4 shrink-0" /> Consistency Overview
      </p>
      <div className="flex flex-wrap gap-2 mt-2">
        {[0, 1, 2, 3, 4, 5, 6].map((day) => {
          const details = consistencyDetails.get(day);
          const isConsistent = details?.isConsistent || false;
          const hasWarning = !isConsistent && details?.gapMessage;

          return (
            <div key={day} className="relative group">
              <span
                className={`text-xs px-2 py-1 rounded-full whitespace-nowrap cursor-help ${
                  isConsistent
                    ? "bg-green-100 text-green-800"
                    : hasWarning
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-500"
                }`}
              >
                {weekdayLabels[day].slice(0, 3)}{" "}
                {isConsistent ? "✓" : hasWarning ? "⚠" : "✗"}
              </span>

              {details && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10 min-w-[200px]">
                  <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3">
                    <p className="font-semibold mb-1">{weekdayLabels[day]}</p>
                    {details.isConsistent ? (
                      <p className="text-green-300">
                        ✓ Fully consistent across all weeks
                      </p>
                    ) : (
                      <>
                        <p className="text-yellow-300 mb-1">
                          ⚠ Consistency Issue
                        </p>
                        {details.gapMessage && (
                          <p className="text-gray-300">{details.gapMessage}</p>
                        )}
                        {details.consistentStartDate &&
                          details.consistentEndDate && (
                            <p className="text-gray-300 mt-1">
                              Best range:{" "}
                              {format(details.consistentStartDate, "MMM d")} -{" "}
                              {format(details.consistentEndDate, "MMM d")}
                            </p>
                          )}
                        {details.availableSlots &&
                          details.availableSlots.length > 0 && (
                            <p className="text-gray-300 mt-1">
                              Available slots:{" "}
                              {details.availableSlots.join(", ")}
                            </p>
                          )}
                      </>
                    )}
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                    <div className="border-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="text-xs text-gray-600 mt-2 flex flex-wrap gap-3">
        <span className="inline-flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-green-100 border border-green-800"></span>
          ✓ = Consistent all weeks
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-yellow-100 border border-yellow-800"></span>
          ⚠ = Partial/No consistency (hover for details)
        </span>
        <span className="inline-flex items-center gap-1">
          <Info className="w-3 h-3" />
          Hover for more information
        </span>
      </div>
    </div>
  );
};
