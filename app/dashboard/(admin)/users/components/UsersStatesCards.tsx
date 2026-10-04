import { UserStats } from "@/types/userManagement";
import { LuUsersRound } from "react-icons/lu";

interface Props {
  counts?: UserStats;
}

const UsersStatesCards = ({ counts }: Props) => {
  const totalUsersCount = counts?.total_users || 0;
  const adminCount = counts?.admin || 0;
  const teacherCount = counts?.teacher || 0;
  const studentCount = counts?.student || 0;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">
              {totalUsersCount}
            </p>
          </div>
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <LuUsersRound className="w-5 h-5 text-primary" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Admins</p>
            <p className="text-2xl font-bold text-red-600">{adminCount}</p>
          </div>
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <LuUsersRound className="w-5 h-5 text-red-600" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Teachers</p>
            <p className="text-2xl font-bold text-blue-600">{teacherCount}</p>
          </div>
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <LuUsersRound className="w-5 h-5 text-blue-600" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Students</p>
            <p className="text-2xl font-bold text-green-600">{studentCount}</p>
          </div>
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <LuUsersRound className="w-5 h-5 text-green-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersStatesCards;
