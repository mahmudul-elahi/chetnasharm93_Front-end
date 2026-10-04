"use client";

import { useState, useEffect } from "react";
import {
  Mail,
  Camera,
  Phone,
  Building2,
  Lock,
  Eye,
  EyeOff,
  X,
  UserRoundPen,
  UserRound,
} from "lucide-react";
import MyButton from "@/components/ui/MyButton";
import { toast } from "sonner";
import { ModalPortal } from "@/components/ui/ModalPortal";
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "@/src/redux/api/admin/users";
import Loader from "@/components/ui/Loader";
import { Button } from "@/components/ui/button";
import PhoneInput from "react-phone-input-2";
import { getBrowserCountry } from "@/lib/phone";
import "../../../../../style/phone-input.css";
import "react-phone-input-2/lib/style.css";

interface UpdateUserModalProps {
  id: number;
  onClose: () => void;
  onUpdate?: () => void;
}

export default function UpdateUserModal({
  id,
  onClose,
  onUpdate,
}: UpdateUserModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  // Fetch user data
  const {
    data: userData,
    isLoading: isLoadingUser,
    isError: isUserError,
  } = useGetUserByIdQuery(id);
  const [updateUser, { isLoading: isUpdating, isSuccess, isError, error }] =
    useUpdateUserMutation();

  // Format phone number for display in PhoneInput
  const formatPhoneForDisplay = (phone: string): string => {
    if (!phone) return "";
    let cleaned = phone.trim().replace(/^\+/, "");
    if (cleaned.startsWith("0")) {
      cleaned = cleaned.replace(/^0+/, "");
      return `880${cleaned}`;
    }
    return cleaned;
  };

  // Format phone number to E.164 format (with +) for API
  const formatPhoneForAPI = (phone: string): string => {
    if (!phone) return "";
    let cleaned = phone.replace(/[\s\-\(\)]/g, "");
    if (cleaned.startsWith("+0")) {
      cleaned = cleaned.slice(2);
      if (!cleaned.startsWith("0")) cleaned = "0" + cleaned;
    }
    if (/^01[3-9]\d{8}$/.test(cleaned)) {
      return `+88${cleaned}`;
    }
    return cleaned.startsWith("+") ? cleaned : `+${cleaned}`;
  };

  // Set user data when fetched
  useEffect(() => {
    if (userData?.data) {
      const user = userData.data.user;
      setName(user.name || "");
      setEmail(user.email || "");
      setMobile(formatPhoneForDisplay(user.mobile || ""));
      setDepartment(user.department || "");
      setPreviewUrl(user.image_url || "");
    }
  }, [userData]);

  // Handle success
  useEffect(() => {
    if (isSuccess) {
      toast.success("User updated successfully!");
      onUpdate?.();
      onClose();
    }
  }, [isSuccess, onUpdate, onClose]);

  // Handle error
  useEffect(() => {
    if (isError && error) {
      const errorMessage =
        (error as any)?.data?.message || "Failed to update user";
      toast.error(errorMessage);
    }
  }, [isError, error]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setProfileImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    // Validate mobile number if provided
    if (mobile) {
      const digitsOnly = mobile.replace(/\D/g, "");
      if (digitsOnly.length < 10) {
        toast.error("Please enter a valid mobile number (minimum 10 digits)");
        return;
      }
    }

    // Validate password if provided
    if (password && password !== passwordConfirmation) {
      toast.error("Passwords do not match");
      return;
    }

    if (password && password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("mobile", mobile ? formatPhoneForAPI(mobile) : "");
    formData.append("department", department || "");

    // Only append password if provided
    if (password) {
      formData.append("password", password);
      formData.append("password_confirmation", passwordConfirmation);
    }

    // Handle image: send new file if selected
    if (profileImage) {
      formData.append("image", profileImage);
    }

    await updateUser({ id, data: formData });
  };

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl !== userData?.data?.image_url) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, userData?.data?.image_url]);

  // Show loading state
  if (isLoadingUser) {
    return (
      <ModalPortal>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="rounded-2xl overflow-hidden">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md mx-4 p-8 animate-in fade-in zoom-in">
              <div className="flex flex-col items-center justify-center gap-4">
                <Loader />
                <p className="text-gray-600 dark:text-gray-400">
                  Loading user data...
                </p>
              </div>
            </div>
          </div>
        </div>
        <style jsx>{`
          @keyframes fade-in {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          @keyframes zoom-in {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          .animate-in {
            animation-duration: 0.3s;
            animation-fill-mode: both;
          }
          .fade-in {
            animation-name: fade-in;
          }
          .zoom-in {
            animation-name: zoom-in;
          }
        `}</style>
      </ModalPortal>
    );
  }

  // Show error state
  if (isUserError) {
    return (
      <ModalPortal>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="rounded-2xl overflow-hidden">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md mx-4 p-8 animate-in fade-in zoom-in">
              <div className="flex flex-col items-center justify-center gap-4">
                <p className="text-red-500">Failed to load user data</p>
                <MyButton onClick={onClose}>Close</MyButton>
              </div>
            </div>
          </div>
        </div>
        <style jsx>{`
          @keyframes fade-in {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          @keyframes zoom-in {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          .animate-in {
            animation-duration: 0.3s;
            animation-fill-mode: both;
          }
          .fade-in {
            animation-name: fade-in;
          }
          .zoom-in {
            animation-name: zoom-in;
          }
        `}</style>
      </ModalPortal>
    );
  }

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" />

        {/* Modal */}
        <div className="rounded-2xl overflow-hidden w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full overflow-y-auto max-h-[90vh] transition-all duration-300 animate-in fade-in zoom-in">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <UserRoundPen className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Edit User
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Profile Image */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-4 border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-100 dark:bg-gray-900">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Profile"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <UserRound className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 p-1.5 bg-primary rounded-full cursor-pointer shadow-md hover:bg-primary/90 transition-colors">
                    <Camera className="w-3 h-3 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Mobile - Using PhoneInput */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mobile Number
                </label>
                <PhoneInput
                  country={getBrowserCountry()}
                  value={mobile}
                  onChange={(phone) => setMobile(phone)}
                  inputProps={{
                    name: "mobile",
                  }}
                  enableSearch={true}
                  searchPlaceholder="Search country"
                  containerClass="w-full"
                  inputClass="!w-full !h-11 !pl-12 !pr-4 !py-2 !rounded-xl !border !border-gray-300 dark:!border-gray-600 !bg-white dark:!bg-gray-900 !text-gray-900 dark:!text-white focus:!ring-2 focus:!ring-primary focus:!border-transparent"
                  buttonClass="!rounded-l-xl !border !border-gray-300 dark:!border-gray-600 !border-r-0 !bg-white dark:!bg-gray-900 hover:!bg-gray-50 dark:hover:!bg-gray-800"
                  dropdownClass="!rounded-xl h-45"
                />
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Department
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Enter department"
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password (Leave blank to keep current)
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full pl-10 pr-10 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Password Confirmation */}
              {password && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full pl-10 pr-10 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required={!!password}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  className="flex-1"
                  type="button"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <MyButton
                  type="submit"
                  isLoading={isUpdating}
                  className="flex-1"
                >
                  Save Changes
                </MyButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}