"use client";

import { useState } from "react";
import {
  Mail,
  Calendar,
  Shield,
  Camera,
  Edit2,
  Phone,
  Building2,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import UpdatePassword from "./UpdatePassword";
import {
  useGetMeQuery,
} from "@/src/redux/api/auth/authApi";
import { useAuth } from "@/hooks/useAuth";
import MyButton from "@/components/ui/MyButton";
import EditProfile from "./EditProfile";

export default function ProfileCard() {
  const { isAuthenticated } = useAuth();
  const { data, refetch } = useGetMeQuery(undefined, {
    skip: !isAuthenticated,
  });
  const user = data?.user;
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  // Format date safely
  const formatDate = (date: string | undefined) => {
    if (!date) return "Not available";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  const handleProfileUpdate = () => {
    refetch(); // Refetch user data after profile update
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Cover Image */}
        <div className="h-28 bg-linear-to-r from-primary/80 to-primary overflow-hidden">
          <img
            src="/assets/profile-banner.webp"
            alt="profile banner"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="relative -mt-12 mb-4 flex justify-between items-end">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-white bg-white dark:border-gray-800 overflow-hidden shadow-lg">
                {user?.image ? (
                  <Image
                    src={user.image_url}
                    alt={user?.name || "User"}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-primary/80 to-primary flex items-center justify-center">
                    <UserRound className="w-12 h-12 text-white" />
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowEditProfileModal(true)}
                className="absolute bottom-0 right-0 p-1.5 bg-white dark:bg-gray-800 rounded-full shadow-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <Camera className="w-3 h-3 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* User Info */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {user?.name || "User Name"}
            </h2>
            <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary mt-1">
              {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) ||
                "Member"}
            </span>
          </div>

          {/* Profile Details */}
          <div className="space-y-3 text-sm mb-6">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400 break-all">
                {user?.email || "Not provided"}
              </span>
            </div>

            {user?.mobile && (
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">
                  {user.mobile}
                </span>
              </div>
            )}

            {user?.department && (
              <div className="flex items-center gap-3">
                <Building2 className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">
                  {user.department}
                </span>
              </div>
            )}

            {user?.createdAt && (
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">
                  Joined: {formatDate(user?.createdAt)}
                </span>
              </div>
            )}
          </div>

          {/* Actions Buttons */}
          <div className="flex flex-wrap justify-center items-center gap-2">
            <MyButton
              onClick={() => setShowEditProfileModal(true)}
              className="gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </MyButton>
            <MyButton
              onClick={() => setShowPasswordModal(true)}
              className="gap-2"
            >
              <Shield className="w-4 h-4" />
              {user?.has_password ? "Update" : "Add"} Password
            </MyButton>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <EditProfile
          user={user}
          onClose={() => setShowEditProfileModal(false)}
          onUpdate={handleProfileUpdate}
        />
      )}

      {/* Update Password Modal */}
      {showPasswordModal && (
        <UpdatePassword onClose={() => setShowPasswordModal(false)} />
      )}
    </>
  );
}
