"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Upload, BookOpen, DollarSign, Calendar, Clock, FileText, Users } from "lucide-react";
import { ModalPortal } from "@/components/ui/ModalPortal";
import { useAddClassForAdminMutation } from "@/src/redux/api/admin/adminClassApi";
import { SpinnerCustom } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import CurriculumEditor from "./CurriculumEditor";

interface AddClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// Form schema with Zod
const classSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title must not exceed 100 characters")
    .nonempty("Title is required"),

  short_description: z
    .string()
    .max(300, "Short description must not exceed 300 characters")
    .optional(),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must not exceed 1000 characters")
    .nonempty("Description is required"),

  who_is_for: z
    .string()
    .optional(),

  curriculum: z
    .array(
      z.object({
        title: z.string(),
        keypoints: z.array(z.string()),
      })
    )
    .optional(),

  price: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Please enter a valid price")
    .nonempty("Price is required"),

  duration_in_days: z
    .string()
    .regex(/^\d+$/, "Duration must be a number")
    .nonempty("Duration is required"),

  total_classes: z
    .string()
    .regex(/^\d+$/, "Total classes must be a number")
    .nonempty("Total classes is required"),

  is_class_recording: z.boolean(),

  image: z.any().optional(),
});

type ClassFormData = z.infer<typeof classSchema>;

const AddClassModal: React.FC<AddClassModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [addClass, { isLoading }] = useAddClassForAdminMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
    clearErrors,
    setError,
  } = useForm<ClassFormData>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      title: "",
      short_description: "",
      description: "",
      who_is_for: "",
      curriculum: [],
      price: "",
      duration_in_days: "",
      total_classes: "",
      is_class_recording: false,
    },
  });

  const watchImage = watch("image");

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      reset();
      setImagePreview(null);
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

  const onSubmit = async (data: ClassFormData) => {
    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append("title", data.title);
      submitData.append("short_description", data.short_description || "");
      submitData.append("description", data.description);
      submitData.append("who_is_for", data.who_is_for || "");
      submitData.append(
        "curriculum",
        JSON.stringify(data.curriculum || [])
      );
      submitData.append("price", data.price);
      submitData.append("duration_in_days", data.duration_in_days);
      submitData.append("total_classes", data.total_classes);
      submitData.append("is_class_recording", data.is_class_recording ? "1" : "0");

      if (data.image && data.image[0]) {
        submitData.append("image", data.image[0]);
      }

      // Call the API
      await addClass(submitData).unwrap();

      // Handle success
      onSuccess?.();
      onClose();
      reset();
      toast.success("Class successfully created!");
    } catch (error: any) {
      // Handle API errors
      if (error?.data?.errors) {
        // Handle validation errors from API
        const apiErrors = error.data.errors;
        Object.keys(apiErrors).forEach((key) => {
          setError(key as keyof ClassFormData, { message: apiErrors[key][0] });
        });
      } else if (error?.data?.message) {
        // Handle general error message
        setError("root", { message: error.data.message });
      } else {
        setError("root", {
          message: "Failed to create class. Please try again.",
        });
      }
    }
  };

  const handleRemoveImage = () => {
    setValue("image", undefined);
    setImagePreview(null);
    clearErrors("image");
  };

  if (!isOpen) return null;

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" />

        {/* Modal */}
        <div className="rounded-2xl overflow-hidden w-full md:w-3/4 lg:w-1/2 xl:w-2/5">
          <div className="relative bg-white dark:bg-gray-800 shadow-2xl w-full max-h-[90vh] overflow-y-auto transition-all duration-300 animate-in fade-in zoom-in">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Add New Class
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

              {/* Title - Required */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    {...register("title")}
                    className={`w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 ${
                      errors.title
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:border-primary"
                    } bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}
                    placeholder="Enter class title"
                    disabled={isLoading}
                  />
                </div>
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Short Description - Optional */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Short Description{" "}
                  <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <textarea
                    {...register("short_description")}
                    rows={2}
                    className={`w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 ${
                      errors.short_description
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:border-primary"
                    } bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}
                    placeholder="Brief summary of the class (max 300 characters)"
                    disabled={isLoading}
                  />
                </div>
                {errors.short_description && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.short_description.message}
                  </p>
                )}
              </div>

              {/* Description - Required */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <textarea
                    {...register("description")}
                    rows={3}
                    className={`w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 resize-y ${
                      errors.description
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:border-primary"
                    } bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}
                    placeholder="Enter class description"
                    disabled={isLoading}
                  />
                </div>
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Who Is This Course For? - Optional */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Who Is This Course For?{" "}
                  <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <textarea
                    {...register("who_is_for")}
                    rows={3}
                    className={`w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 resize-y ${
                      errors.who_is_for
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:border-primary"
                    } bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}
                    placeholder="• Beginners&#10;• Intermediate learners&#10;• IELTS students&#10;• Working professionals"
                    disabled={isLoading}
                  />
                </div>
                {errors.who_is_for && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.who_is_for.message}
                  </p>
                )}
              </div>

              {/* Curriculum - Optional */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Curriculum{" "}
                  <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <CurriculumEditor
                  value={watch("curriculum") || []}
                  onChange={(modules) => setValue("curriculum", modules)}
                />
                {errors.curriculum && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.curriculum.message as string}
                  </p>
                )}
              </div>

              {/* Price - Required */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Price ($) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    {...register("price")}
                    className={`w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 ${
                      errors.price
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:border-primary"
                    } bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}
                    placeholder="e.g., 199.99"
                    disabled={isLoading}
                  />
                </div>
                {errors.price && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.price.message}
                  </p>
                )}
              </div>

              {/* Duration in Days - Required */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Duration (Days) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    {...register("duration_in_days")}
                    className={`w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 ${
                      errors.duration_in_days
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:border-primary"
                    } bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}
                    placeholder="e.g., 30"
                    disabled={isLoading}
                  />
                </div>
                {errors.duration_in_days && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.duration_in_days.message}
                  </p>
                )}
              </div>

              {/* Total Classes - Required */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Total Classes <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    {...register("total_classes")}
                    className={`w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 ${
                      errors.total_classes
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:border-primary"
                    } bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}
                    placeholder="e.g., 20"
                    disabled={isLoading}
                  />
                </div>
                {errors.total_classes && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.total_classes.message}
                  </p>
                )}
              </div>

              {/* Class Recording Available - Optional */}
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Class Recording Available
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Students will have access to recorded classes
                  </p>
                </div>
                <Switch
                  checked={watch("is_class_recording")}
                  onCheckedChange={(checked) =>
                    setValue("is_class_recording", checked)
                  }
                  disabled={isLoading}
                />
              </div>

              {/* Image Upload - Optional */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Class Image{" "}
                  <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <div className="flex items-center gap-4">
                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-20 h-20 rounded-lg object-cover ring-2 ring-primary/20"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  <label
                    className={`flex-1 cursor-pointer ${!imagePreview ? "w-full" : ""}`}
                  >
                    <div
                      className={`border-2 border-dashed rounded-xl p-4 text-center hover:border-primary transition-colors duration-200 ${
                        errors.image ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Click to upload class image
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        PNG, JPG, JPEG up to 5MB
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      {...register("image")}
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
                    <span>Create Class</span>
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

export default AddClassModal;