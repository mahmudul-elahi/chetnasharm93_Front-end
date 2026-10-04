"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  X,
  Upload,
  Eye,
  EyeOff,
  ChevronDown,
  UserRoundPlus,
} from "lucide-react";
import { ModalPortal } from "@/components/ui/ModalPortal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCreateUserMutation } from "@/src/redux/api/admin/users";
import { SpinnerCustom } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import PhoneInput from "react-phone-input-2";
import { getBrowserCountry } from "@/lib/phone";
import "../../../../../style/phone-input.css";
import "react-phone-input-2/lib/style.css";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// Form schema with Zod - Department is now optional
const userSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must not exceed 50 characters")
      .nonempty("Name is required"),

    email: z
      .string()
      .email("Please enter a valid email address")
      .nonempty("Email is required"),

    mobile: z
      .string()
      .min(10, "Please enter a valid mobile number (minimum 10 digits)")
      .nonempty("Mobile number is required"),

    department: z.string().optional(), // Made optional

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(50, "Password must not exceed 50 characters")
      .nonempty("Password is required"),

    password_confirmation: z.string().nonempty("Please confirm your password"),

    image: z.any().optional(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

type FormData = z.infer<typeof userSchema>;

const AddUserModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [mobileValue, setMobileValue] = useState("");
  const imageInputRef = React.useRef<HTMLInputElement>(null);
  const [createUser, { isLoading }] = useCreateUserMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
    clearErrors,
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      department: "",
      password: "",
      password_confirmation: "",
    },
  });

  const watchImage = watch("image");
  const selectedDepartment = watch("department");

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
  
  // Update the image upload onChange handler to be more explicit
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      // User cancelled the file picker - do nothing
      return;
    }

    // Set the new file
    setValue("image", e.target.files);
  };
  
  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      reset();
      setImagePreview(null);
      setMobileValue("");
    }
  }, [isOpen, reset]);

  // Handle image preview
  useEffect(() => {
    if (watchImage && watchImage instanceof FileList && watchImage[0]) {
      const file = watchImage[0];

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("image", { message: "Image size should be less than 5MB" });
        setValue("image", undefined);
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("image", { message: "Please upload a valid image file" });
        setValue("image", undefined);
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      clearErrors("image");
    } else {
      setImagePreview(null);
    }
  }, [watchImage, setValue, setError, clearErrors]);

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  const onSubmit = async (data: FormData) => {
    try {
      // Validate mobile number
      const digitsOnly = mobileValue.replace(/\D/g, "");
      if (digitsOnly.length < 10) {
        setError("mobile", {
          message: "Please enter a valid mobile number (minimum 10 digits)",
        });
        return;
      }

      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append("name", data.name);
      submitData.append("email", data.email);
      submitData.append("mobile", formatPhoneForAPI(mobileValue));
      
      // Only append department if it has a value
      if (data.department && data.department.trim() !== "") {
        submitData.append("department", data.department);
      }
      
      submitData.append("password", data.password);
      submitData.append("password_confirmation", data.password_confirmation);

      if (data.image && data.image[0]) {
        submitData.append("image", data.image[0]);
      }

      // Call the API
      const result = await createUser(submitData).unwrap();

      // Handle success
      onSuccess?.();
      onClose();
      reset();
      setMobileValue("");
      toast.success("User successfully created!");
    } catch (error: any) {
      // Handle API errors
      if (error?.data?.errors) {
        // Handle validation errors from API
        const apiErrors = error.data.errors;
        Object.keys(apiErrors).forEach((key) => {
          setError(key as keyof FormData, { message: apiErrors[key][0] });
        });
      } else if (error?.data?.message) {
        // Handle general error message
        setError("root", { message: error.data.message });
      } else {
        setError("root", {
          message: "Failed to create user. Please try again.",
        });
      }
    }
  };

  const handleRemoveImage = () => {
    setValue("image", undefined);
    setImagePreview(null);
    clearErrors("image");
  };

  // Handle phone change
  const handlePhoneChange = (phone: string) => {
    setMobileValue(phone);
    setValue("mobile", phone);
    clearErrors("mobile");
  };

  // Handle department clear
  const handleClearDepartment = () => {
    setValue("department", "");
    clearErrors("department");
  };

  // Department options
  const departments = [
    "IT",
    "HR",
    "Finance",
    "Marketing",
    "Sales",
    "Operations",
  ];

  if (!isOpen) return null;

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" />

        {/* Modal */}
        <div className="rounded-2xl overflow-hidden w-full md:w-3/4 lg:w-1/2 xl:w-1/3">
          <div className="relative bg-white dark:bg-gray-800 shadow-2xl w-full max-h-[90vh] overflow-y-auto transition-all duration-300 animate-in fade-in zoom-in">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <UserRoundPlus className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Create New Admin
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
                aria-label="Close modal"
                type="button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
              {/* General Error */}
              {errors.root && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {errors.root.message}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("name")}
                  className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 ${
                    errors.name
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:border-primary"
                  } bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}
                  placeholder="Enter full name"
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  {...register("email")}
                  className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 ${
                    errors.email
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:border-primary"
                  } bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}
                  placeholder="user@example.com"
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Mobile - Using PhoneInput */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <PhoneInput
                  country={getBrowserCountry()}
                  value={mobileValue}
                  onChange={handlePhoneChange}
                  inputProps={{
                    name: "mobile",
                    required: true,
                  }}
                  enableSearch={true}
                  searchPlaceholder="Search country"
                  containerClass="w-full"
                  inputClass={`!w-full !h-11 !pl-12 !pr-4 !py-2 !rounded-xl !border ${
                    errors.mobile
                      ? "!border-red-500"
                      : "!border-gray-300 dark:!border-gray-600"
                  } !bg-white dark:!bg-gray-900 !text-gray-900 dark:!text-white focus:!ring-2 focus:!ring-primary/50 focus:!border-primary`}
                  buttonClass="!rounded-l-xl !border !border-gray-300 dark:!border-gray-600 !border-r-0 !bg-white dark:!bg-gray-900 hover:!bg-gray-50 dark:hover:!bg-gray-800"
                  dropdownClass="!rounded-xl h-45"
                  disabled={isLoading}
                />
                {errors.mobile && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.mobile.message}
                  </p>
                )}
              </div>

              {/* Department - Optional Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Department{" "}
                  <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className={`w-full px-4 py-2 border rounded-xl text-left focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 flex items-center justify-between cursor-pointer ${
                            errors.department
                              ? "border-red-500"
                              : "border-gray-300 dark:border-gray-600 focus:border-primary"
                          } bg-white dark:bg-gray-900`}
                          disabled={isLoading}
                        >
                          <span
                            className={
                              selectedDepartment
                                ? "text-gray-900 dark:text-white"
                                : "text-gray-400 dark:text-gray-500"
                            }
                          >
                            {selectedDepartment || "Select Department (Optional)"}
                          </span>
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-[calc(100vw-3rem)] md:w-[calc(100%-3rem)] min-w-50 "
                        align="start"
                      >
                        {departments.map((dept) => (
                          <DropdownMenuItem
                          className="cursor-pointer"
                            key={dept}
                            onClick={() => {
                              setValue("department", dept);
                              clearErrors("department");
                            }}
                          >
                            {dept}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  {selectedDepartment && (
                    <button
                      type="button"
                      onClick={handleClearDepartment}
                      className="px-3 py-2 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
                {errors.department && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.department.message}
                  </p>
                )}
              </div>

              {/* Image Upload - Optional */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Profile Image{" "}
                  <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <div className="flex items-center gap-4">
                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-20 h-20 rounded-full object-cover ring-2 ring-primary/20"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  <label
                  className={`cursor-pointer flex-1 ${!imagePreview ? "w-full" : ""}`}
                  >
                    <div
                      className={`border-2 border-dashed rounded-xl p-4 text-center hover:border-primary transition-colors duration-200 flex-1 ${
                        errors.image
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Click to upload image
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        PNG, JPG, JPEG up to 5MB
                      </p>
                    </div>
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      disabled={isLoading}
                    />
                  </label>
                </div>
                {errors.image && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.image.message as string}
                  </p>
                )}
              </div>
              
              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 pr-10 ${
                      errors.password
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:border-primary"
                    } bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}
                    placeholder="Enter password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("password_confirmation")}
                    className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 pr-10 ${
                      errors.password_confirmation
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:border-primary"
                    } bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}
                    placeholder="Confirm password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password_confirmation && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.password_confirmation.message}
                  </p>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  className="flex-1"
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? (
                    <>
                      <SpinnerCustom />
                      <span className="ml-2">Creating...</span>
                    </>
                  ) : (
                    <span>Create User</span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};

export default AddUserModal;