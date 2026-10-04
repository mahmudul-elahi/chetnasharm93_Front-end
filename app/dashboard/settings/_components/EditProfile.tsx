"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { User, Mail, Camera, Building2, UserRound, Upload } from "lucide-react";
import MyButton from "@/components/ui/MyButton";
import { toast } from "sonner";
import { ModalPortal } from "@/components/ui/ModalPortal";
import { useProfileUpdateMutation } from "@/src/redux/api/auth/authApi";
import PhoneInput from "react-phone-input-2";
import "../../../../style/phone-input.css";
import "react-phone-input-2/lib/style.css";
import { Button } from "@/components/ui/button";
import { getBrowserCountry } from "@/lib/phone";

interface EditProfileProps {
  user: any;
  onClose: () => void;
  onUpdate?: () => void;
}

export default function EditProfile({
  user,
  onClose,
  onUpdate,
}: EditProfileProps) {
  const formatPhoneForDisplay = (phone: string): string => {
    if (!phone) return "";
    let cleaned = phone.trim().replace(/^\+/, "");
    if (cleaned.startsWith("0")) {
      cleaned = cleaned.replace(/^0+/, "");
      return `880${cleaned}`;
    }
    return cleaned;
  };

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

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [mobile, setMobile] = useState<string>(() => {
    return formatPhoneForDisplay(user?.mobile || "");
  });
  const [department, setDepartment] = useState(user?.department || "");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(user?.image_url || "");
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setMobile(formatPhoneForDisplay(user.mobile || ""));
      setDepartment(user.department || "");
      setPreviewUrl(user.image_url || "");
    }
  }, [user]);

  const [
    profileUpdate,
    { isLoading: isProfileUpdating, isError, isSuccess, error },
  ] = useProfileUpdateMutation();

  // Handle success
  useEffect(() => {
    if (isSuccess) {
      toast.success("Profile updated successfully!");
      onUpdate?.();
      handleClose();
    }
  }, [isSuccess, onUpdate]);

  // Handle error
  useEffect(() => {
    if (isError && error) {
      const errorMessage =
        (error as any)?.data?.message || "Failed to update profile";
      toast.error(errorMessage);
    }
  }, [isError, error]);

  // Animation on mount
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

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



  // Validate email format
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!mobile.trim()) {
      toast.error("Mobile number is required");
      return;
    }

    // Format mobile number for backend
    const formattedMobile = formatPhoneForAPI(mobile);

    // Validate phone number length
    const digitsOnly = formattedMobile.replace(/\D/g, "");
    if (digitsOnly.length < 10) {
      toast.error("Please enter a valid mobile number");
      return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email); // ✅ Email is now updateable
    formData.append("mobile", formattedMobile);
    formData.append("department", department);

    if (profileImage) {
      formData.append("image", profileImage);
    }

    // Call the mutation
    await profileUpdate(formData);
  };

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl !== user?.image_url) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, user?.image_url]);

  return (
    <ModalPortal>
      {/* Overlay Animation */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ease-out ${
          isVisible && !isClosing
            ? "bg-black/50 backdrop-blur-sm"
            : "bg-black/0 backdrop-blur-none"
        }`}
        onClick={handleClose}
      >
        {/* Modal Container Animation - Zoom In/Out */}
        <div
          className={`flex items-center justify-center min-h-full p-4 transition-all duration-300 ease-out ${
            isVisible && !isClosing
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 rounded-t-2xl z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <UserRound className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Edit Profile
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-5 overflow-y-auto flex-1"
            >
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
                    <Upload className="w-3 h-3 text-white" />
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
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {/* Email - Now Updateable */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
                
              </div>

              {/* Mobile - Using PhoneInput */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <PhoneInput
                  country={getBrowserCountry()}
                  value={mobile}
                  onChange={(phone) => setMobile(phone)}
                  inputProps={{
                    name: "mobile",
                    required: true,
                  }}
                  enableSearch={true}
                  searchPlaceholder="Search country"
                  containerClass="w-full"
                  inputClass="!w-full !h-11.5 !pl-12 !pr-4 !py-2.5 !rounded-xl !border !border-gray-300 dark:!border-gray-600 !bg-white dark:!bg-gray-900 !text-gray-900 dark:!text-white focus:!ring-2 focus:!ring-primary focus:!border-transparent transition-all duration-200"
                  buttonClass="!rounded-l-xl !border !border-gray-300 dark:!border-gray-600 !border-r-0 !bg-white dark:!bg-gray-900 hover:!bg-gray-50 dark:hover:!bg-gray-800 transition-colors duration-200"
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
                    placeholder="Enter your department"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 sticky bottom-0 bg-white dark:bg-gray-800 mt-4">
                <Button
                  variant="outline"
                  className="flex-1 transition-all duration-200 hover:scale-[1.02]"
                  type="button"
                  onClick={handleClose}
                  disabled={isProfileUpdating}
                >
                  Cancel
                </Button>
                <MyButton
                  type="submit"
                  isLoading={isProfileUpdating}
                  className="flex-1 transition-all duration-200 hover:scale-[1.02]"
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