"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Upload, Video, UserRoundPlus } from "lucide-react";
import { ModalPortal } from "@/components/ui/ModalPortal";
import { useCreateTeacherMutation } from "@/src/redux/api/admin/teachersApi";
import { SpinnerCustom } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "../../../../../style/phone-input.css";
import { getAllCountries, getTimezonesForCountry } from "countries-and-timezones";
import SearchableSelect from "@/components/ui/SearchableSelect";
import TagInput from "@/components/ui/TagInput";

interface AddTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// Form schema with Zod
const teacherSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(255, "Name must not exceed 255 characters")
    .nonempty("Name is required"),

  email: z
    .string()
    .email("Please enter a valid email address")
    .nonempty("Email is required"),

  mobile: z.string().optional().or(z.literal("")),

  country: z.string().optional().or(z.literal("")),

  timezone: z.string().optional().or(z.literal("")),

  bio: z
    .string()
    .max(500, "Bio must not exceed 500 characters")
    .optional()
    .or(z.literal("")),

  about: z
    .string()
    .optional()
    .or(z.literal("")),

  qualification: z
    .string()
    .max(500, "Qualification must not exceed 500 characters")
    .optional()
    .or(z.literal("")),

  expertise: z
    .string()
    .max(255, "Expertise must not exceed 255 characters")
    .optional()
    .or(z.literal("")),

  years_of_exp: z
    .number()
    .min(0, "Experience cannot be negative")
    .max(50, "Experience cannot exceed 50 years")
    .optional()
    .or(z.literal(0)),

  image: z.any().optional(),
  intro_video: z.any().optional(),
});

type TeacherFormData = z.infer<typeof teacherSchema>;

const AddTeacherModal: React.FC<AddTeacherModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoFileName, setVideoFileName] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [availableTimezones, setAvailableTimezones] = useState<string[]>([]);

  // Array fields state
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [languagesSpoken, setLanguagesSpoken] = useState<string[]>([]);
  const [coursesCanTeach, setCoursesCanTeach] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);

  const [createTeacher, { isLoading }] = useCreateTeacherMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
    clearErrors,
    setError,
  } = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      country: "",
      timezone: "",
      bio: "",
      about: "",
      qualification: "",
      expertise: "",
      years_of_exp: 0,
    },
  });

  const watchImage = watch("image");
  const watchVideo = watch("intro_video");
  const imageInputRef = React.useRef<HTMLInputElement>(null);
  const videoInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setValue("image", e.target.files);
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setValue("intro_video", e.target.files);
  };

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
    setValue("country", countryCode);
    setValue("timezone", "");

    if (countryCode) {
      const timezones = getTimezonesForCountry(countryCode);
      if (timezones && timezones.length > 0) {
        setAvailableTimezones(timezones.map((tz) => tz.name));
      } else {
        setAvailableTimezones([]);
      }
    } else {
      setAvailableTimezones([]);
    }
  };

  const handleTimezoneChange = (timezone: string) => {
    setValue("timezone", timezone);
    if (timezone) clearErrors("timezone");
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      reset();
      setImagePreview(null);
      setVideoFileName("");
      setMobile("");
      setSelectedCountry("");
      setAvailableTimezones([]);
      setSpecializations([]);
      setLanguagesSpoken([]);
      setCoursesCanTeach([]);
      setInterests([]);
      if (imageInputRef.current) imageInputRef.current.value = "";
      if (videoInputRef.current) videoInputRef.current.value = "";
    }
  }, [isOpen, reset]);

  // Handle image preview (max 2MB)
  useEffect(() => {
    if (watchImage && watchImage instanceof FileList && watchImage[0]) {
      const file = watchImage[0];

      if (file.size > 2 * 1024 * 1024) {
        setError("image", { message: "Image size should be less than 2MB" });
        setValue("image", undefined);
        return;
      }

      if (!file.type.startsWith("image/")) {
        setError("image", { message: "Please upload a valid image file" });
        setValue("image", undefined);
        return;
      }

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

  // Handle video selection (max 20MB)
  useEffect(() => {
    if (watchVideo && watchVideo instanceof FileList && watchVideo[0]) {
      const file = watchVideo[0];

      if (file.size > 20 * 1024 * 1024) {
        setError("intro_video", {
          message: "Video size should be less than 20MB",
        });
        setValue("intro_video", undefined);
        setVideoFileName("");
        return;
      }

      if (!file.type.startsWith("video/")) {
        setError("intro_video", {
          message: "Please upload a valid video file",
        });
        setValue("intro_video", undefined);
        setVideoFileName("");
        return;
      }

      setVideoFileName(file.name);
      clearErrors("intro_video");
    } else {
      setVideoFileName("");
    }
  }, [watchVideo, setValue, setError, clearErrors]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  const formatPhoneNumber = (phone: string): string => {
    const cleaned = phone.replace(/\s/g, "");
    return cleaned.startsWith("+") ? cleaned : `+${cleaned}`;
  };

  const onSubmit = async (data: TeacherFormData) => {
    try {
      const submitData = new FormData();
      submitData.append("name", data.name);
      submitData.append("email", data.email);

      if (mobile) {
        const formattedMobile = formatPhoneNumber(mobile);
        const digitsOnly = formattedMobile.replace(/\D/g, "");
        if (digitsOnly.length < 10) {
          toast.error("Please enter a valid mobile number");
          return;
        }
        submitData.append("mobile", formattedMobile);
      }

      if (data.country) submitData.append("country", data.country);
      if (data.timezone) submitData.append("timezone", data.timezone);
      if (data.bio) submitData.append("bio", data.bio);
      if (data.about) submitData.append("about", data.about);
      if (data.qualification) submitData.append("qualification", data.qualification);
      if (data.expertise) submitData.append("expertise", data.expertise);
      if (data.years_of_exp !== undefined)
        submitData.append("years_of_exp", String(data.years_of_exp));

      // Array fields as JSON
      if (specializations.length > 0)
        submitData.append("specializations", JSON.stringify(specializations));
      if (languagesSpoken.length > 0)
        submitData.append("languages_spoken", JSON.stringify(languagesSpoken));
      if (coursesCanTeach.length > 0)
        submitData.append("courses_can_teach", JSON.stringify(coursesCanTeach));
      if (interests.length > 0)
        submitData.append("interests", JSON.stringify(interests));

      if (data.image && data.image[0]) {
        submitData.append("image", data.image[0]);
      }

      if (data.intro_video && data.intro_video[0]) {
        submitData.append("intro_video", data.intro_video[0]);
      }

      await createTeacher(submitData).unwrap();

      onSuccess?.();
      onClose();
      reset();
      setMobile("");
      setSelectedCountry("");
      setAvailableTimezones([]);
      setSpecializations([]);
      setLanguagesSpoken([]);
      setCoursesCanTeach([]);
      setInterests([]);
      toast.success("Teacher successfully created!");
    } catch (error: any) {
      if (error?.data?.errors) {
        const apiErrors = error.data.errors;
        Object.keys(apiErrors).forEach((key) => {
          setError(key as keyof TeacherFormData, {
            message: apiErrors[key][0],
          });
        });
      } else if (error?.data?.message) {
        setError("root", { message: error.data.message });
      } else {
        setError("root", {
          message: "Failed to create teacher. Please try again.",
        });
      }
    }
  };

  const handleRemoveImage = () => {
    setValue("image", undefined);
    setImagePreview(null);
    clearErrors("image");
  };

  const handleRemoveVideo = () => {
    setValue("intro_video", undefined);
    setVideoFileName("");
    clearErrors("intro_video");
  };

  if (!isOpen) return null;

  const allCountries = getAllCountries();
  const countries = Object.values(allCountries).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" />

        <div className="rounded-2xl overflow-hidden w-full md:w-3/4 lg:w-1/2 xl:w-2/5">
          <div className="relative bg-white dark:bg-gray-800 shadow-2xl w-full max-h-[90vh] overflow-y-auto transition-all duration-300 animate-in fade-in zoom-in">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <UserRoundPlus className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Add New Teacher
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
              {errors.root && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {errors.root.message}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("name")}
                  className={`w-full px-4 py-2.5 rounded-xl border ${
                    errors.name ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                  } bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                  placeholder="Enter full name"
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name.message as string}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  {...register("email")}
                  className={`w-full px-4 py-2.5 rounded-xl border ${
                    errors.email ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                  } bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                  placeholder="teacher@example.com"
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mobile Number  
                </label>
                <PhoneInput
                  country={"us"}
                  value={mobile}
                  onChange={(phone) => {
                    setMobile(phone);
                    setValue("mobile", phone);
                  }}
                  inputProps={{ name: "mobile" }}
                  enableSearch={true}
                  searchPlaceholder="Search country"
                  containerClass="w-full"
                  inputClass="!w-full !h-11.5 !pl-12 !pr-4 !py-2.5 !rounded-xl !border !border-gray-300 dark:!border-gray-600 !bg-white dark:!bg-gray-900 !text-gray-900 dark:!text-white focus:!ring-2 focus:!ring-primary focus:!border-transparent"
                  buttonClass="!rounded-l-xl !border !border-gray-300 dark:!border-gray-600 !border-r-0 !bg-white dark:!bg-gray-900 hover:!bg-gray-50 dark:hover:!bg-gray-800"
                  dropdownClass="!rounded-xl"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Country  
                </label>
                <SearchableSelect
                  options={countries.map((c) => ({ value: c.id, label: c.name }))}
                  value={selectedCountry}
                  onChange={handleCountryChange}
                  placeholder="Select a country"
                  searchPlaceholder="Search country..."
                  disabled={isLoading}
                />
              </div>

              {/* Timezone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Timezone  
                </label>
                {availableTimezones.length > 0 ? (
                  <SearchableSelect
                    options={availableTimezones.map((tz) => ({ value: tz, label: tz }))}
                    value={watch("timezone") || ""}
                    onChange={handleTimezoneChange}
                    placeholder="Select a timezone"
                    searchPlaceholder="Search timezone..."
                    disabled={isLoading}
                  />
                ) : (
                  <div className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-400 dark:text-gray-500">
                    Select a country first
                  </div>
                )}
              </div>

              {/* Expertise */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Expertise  
                </label>
                <input
                  type="text"
                  {...register("expertise")}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., Mathematics, Physics, English"
                  disabled={isLoading}
                />
                {errors.expertise && (
                  <p className="mt-1 text-sm text-red-500">{errors.expertise.message}</p>
                )}
              </div>

              {/* Qualification */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Qualification  
                </label>
                <input
                  type="text"
                  {...register("qualification")}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., M.Sc. in Mathematics"
                  disabled={isLoading}
                />
                {errors.qualification && (
                  <p className="mt-1 text-sm text-red-500">{errors.qualification.message}</p>
                )}
              </div>

              {/* Years of Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Years of Experience  
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  {...register("years_of_exp", { valueAsNumber: true })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., 5"
                  disabled={isLoading}
                />
                {errors.years_of_exp && (
                  <p className="mt-1 text-sm text-red-500">{errors.years_of_exp.message}</p>
                )}
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio  
                </label>
                <textarea
                  {...register("bio")}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
                  placeholder="Enter teacher bio..."
                  disabled={isLoading}
                />
                {errors.bio && (
                  <p className="mt-1 text-sm text-red-500">{errors.bio.message}</p>
                )}
              </div>

              {/* About */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  About  
                </label>
                <textarea
                  {...register("about")}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
                  placeholder="Enter about the teacher..."
                  disabled={isLoading}
                />
              </div>

              {/* Specializations */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Specializations  
                </label>
                <TagInput
                  value={specializations}
                  onChange={setSpecializations}
                  placeholder="e.g., Spoken English, Pronunciation"
                  disabled={isLoading}
                />
              </div>

              {/* Languages Spoken */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Languages Spoken  
                </label>
                <TagInput
                  value={languagesSpoken}
                  onChange={setLanguagesSpoken}
                  placeholder="e.g., English, Bengali"
                  disabled={isLoading}
                />
              </div>

              {/* Courses Can Teach */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Courses Can Teach  
                </label>
                <TagInput
                  value={coursesCanTeach}
                  onChange={setCoursesCanTeach}
                  placeholder="e.g., Spoken English Masterclass"
                  disabled={isLoading}
                />
              </div>

              {/* Interests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Interests  
                </label>
                <TagInput
                  value={interests}
                  onChange={setInterests}
                  placeholder="e.g., Public speaking, Travel"
                  disabled={isLoading}
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Profile Image  
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
                  <label className={`cursor-pointer flex-1 ${!imagePreview ? "w-full" : ""}`}>
                    <div
                      className={`border-2 border-dashed rounded-xl p-4 text-center hover:border-primary transition-colors duration-200 ${
                        errors.image ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Click to upload image
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        PNG, JPG, JPEG up to 2MB
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
                  <p className="mt-1 text-sm text-red-500">{errors.image.message as string}</p>
                )}
              </div>

              {/* Intro Video Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Introduction Video  
                </label>
                <div>
                  {videoFileName && (
                    <div className="mb-3 flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <Video className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300 flex-1 truncate">
                        {videoFileName}
                      </span>
                      <button
                        type="button"
                        onClick={handleRemoveVideo}
                        className="p-1 text-white bg-red-500 hover:bg-red-600 rounded-full transition-colors cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  <label className="cursor-pointer">
                    <div
                      className={`border-2 border-dashed rounded-xl p-4 text-center hover:border-primary transition-colors duration-200 ${
                        errors.intro_video ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      <Video className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Click to upload introduction video
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        MP4, MOV, AVI, WEBM up to 20MB
                      </p>
                    </div>
                    <input
                      ref={videoInputRef}
                      type="file"
                      accept="video/mp4,video/quicktime,video/x-msvideo,video/webm"
                      onChange={handleVideoChange}
                      className="hidden"
                      disabled={isLoading}
                    />
                  </label>
                </div>
                {errors.intro_video && (
                  <p className="mt-1 text-sm text-red-500">{errors.intro_video.message as string}</p>
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
                    <span>Create Teacher</span>
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

export default AddTeacherModal;