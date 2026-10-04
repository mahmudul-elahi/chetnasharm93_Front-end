"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Mic } from "lucide-react";
import { ModalPortal } from "@/components/ui/ModalPortal";
import { SpinnerCustom } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAddSpeakingTopicForAdminMutation } from "@/src/redux/api/admin/speakingTopicsApi";

interface AddSpeakingTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// Form schema with Zod
const topicSchema = z.object({
  topic: z
    .string()
    .min(5, "Topic must be at least 5 characters")
    .max(500, "Topic must not exceed 500 characters")
    .nonempty("Topic is required"),

  level: z
    .string()
    .min(1, "Level is required")
    .nonempty("Level is required"),
});

type TopicFormData = z.infer<typeof topicSchema>;

const AddSpeakingTopicModal: React.FC<AddSpeakingTopicModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [addTopic, { isLoading }] = useAddSpeakingTopicForAdminMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm<TopicFormData>({
    resolver: zodResolver(topicSchema),
    defaultValues: {
      topic: "",
      level: "",
    },
  });

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

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

  // Auto-expand textarea function
  const autoExpandTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  // Handle topic change with auto-expand
  const handleTopicChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Call react-hook-form's onChange
    register("topic").onChange(e);
    // Auto-expand
    autoExpandTextarea(e);
  };

  const onSubmit = async (data: TopicFormData) => {
    try {
      // Call the API
      await addTopic(data).unwrap();

      // Handle success
      onSuccess?.();
      onClose();
      reset();
      toast.success("Speaking topic successfully created!");
    } catch (error: any) {
      // Handle API errors
      if (error?.data?.errors) {
        // Handle validation errors from API
        const apiErrors = error.data.errors;
        Object.keys(apiErrors).forEach((key) => {
          setError(key as keyof TopicFormData, { message: apiErrors[key][0] });
        });
      } else if (error?.data?.message) {
        // Handle general error message
        setError("root", { message: error.data.message });
      } else {
        setError("root", {
          message: "Failed to create speaking topic. Please try again.",
        });
      }
    }
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
                  <Mic className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Add New Speaking Topic
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

              {/* Topic - Required with Auto-expanding */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Topic <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mic className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <textarea
                    {...register("topic")}
                    onChange={handleTopicChange}
                    rows={1}
                    className={`w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 overflow-hidden resize-none ${
                      errors.topic
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:border-primary"
                    } bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}
                    placeholder="Enter speaking topic question or prompt"
                    disabled={isLoading}
                    style={{ height: "auto", minHeight: "42px" }}
                  />
                </div>
                {errors.topic && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.topic.message}
                  </p>
                )}
              </div>

              {/* Level - Required with Normal Text Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Level <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    {...register("level")}
                    className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 ${
                      errors.level
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:border-primary"
                    } bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}
                    placeholder="e.g., A1-A2, B1-B2, C1-C2, or custom level"
                    disabled={isLoading}
                  />
                </div>
                {errors.level && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.level.message}
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
                    <span>Create Topic</span>
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

export default AddSpeakingTopicModal;