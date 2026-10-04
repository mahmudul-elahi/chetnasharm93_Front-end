import { TeacherBatchesStateCardProps } from "@/types/batches";
import { BookOpen, User, UserRound, Users, UsersRound } from "lucide-react";
import React from "react";

const TeacherBatchesStateCard = ({
  batches,
  total,
}: TeacherBatchesStateCardProps) => {
  return (
    <div>
      {batches && batches.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-linear-to-brr from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Batches
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {total || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <UserRound className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Active Batches
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {batches?.filter((b: any) => b.active_status === 1).length ||
                    0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <UsersRound className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Students
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {batches?.reduce(
                    (acc: number, batch: any) => acc + (batch.filled_seat || 0),
                    0,
                  ) || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherBatchesStateCard;
