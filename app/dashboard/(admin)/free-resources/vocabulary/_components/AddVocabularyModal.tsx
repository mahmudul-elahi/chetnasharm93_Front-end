"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Upload, Languages, BookOpen, Volume2, Mic, ChevronDown } from "lucide-react";
import { ModalPortal } from "@/components/ui/ModalPortal";
import { SpinnerCustom } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAddVocabulariesForAdminMutation } from "@/src/redux/api/admin/vocabulariesApi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AddVocabularyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// Form schema with Zod - Example sentence is now optional
const vocabularySchema = z.object({
  word: z
    .string()
    .min(2, "Word must be at least 2 characters")
    .max(100, "Word must not exceed 100 characters")
    .nonempty("Word is required"),

  meaning: z
    .string()
    .min(2, "Meaning must be at least 2 characters")
    .max(500, "Meaning must not exceed 500 characters")
    .nonempty("Meaning is required"),

  example: z
    .string()
    .max(500, "Example must not exceed 500 characters")
    .optional()
    .or(z.literal("")), // Made optional

  pronunciation: z
    .string()
    .max(200, "Pronunciation must not exceed 200 characters")
    .optional()
    .or(z.literal("")),

  part_of_speech: z
    .string()
    .min(2, "Part of speech must be at least 2 characters")
    .max(50, "Part of speech must not exceed 50 characters")
    .nonempty("Part of speech is required"),

  image: z.any().optional(),
});

type VocabularyFormData = z.infer<typeof vocabularySchema>;

const partOfSpeechOptions = [
  { value: "Noun", label: "Noun" },
  { value: "Pronoun", label: "Pronoun" },
  { value: "Verb", label: "Verb" },
  { value: "Adjective", label: "Adjective" },
  { value: "Adverb", label: "Adverb" },
  { value: "Preposition", label: "Preposition" },
  { value: "Conjunction", label: "Conjunction" },
  { value: "Interjection", label: "Interjection" },
];

const AddVocabularyModal: React.FC<AddVocabularyModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [addVocabulary, { isLoading }] = useAddVocabulariesForAdminMutation();
  
  // Add refs for file inputs
  const imageInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
    clearErrors,
    setError,
  } = useForm<VocabularyFormData>({
    resolver: zodResolver(vocabularySchema),
    defaultValues: {
      word: "",
      meaning: "",
      example: "",
      pronunciation: "",
      part_of_speech: "",
    },
  });

  const watchImage = watch("image");
  const selectedPartOfSpeech = watch("part_of_speech");

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      reset();
      setImagePreview(null);
      // Reset file input ref
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  }, [isOpen, reset]);

  // Handle image change - preserves previous selection if user cancels
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      // User cancelled the file picker - do nothing, keep existing image
      return;
    }

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

    // Set the new file
    setValue("image", e.target.files);
    clearErrors("image");
  };

  // Handle image preview
  useEffect(() => {
    if (watchImage && watchImage instanceof FileList && watchImage[0]) {
      const file = watchImage[0];

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  }, [watchImage]);

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

  const onSubmit = async (data: VocabularyFormData) => {
    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append("word", data.word);
      submitData.append("meaning", data.meaning);
      submitData.append("part_of_speech", data.part_of_speech);
      
      // Only append example if it has a value
      if (data.example && data.example.trim()) {
        submitData.append("example", data.example);
      }
      
      if (data.pronunciation && data.pronunciation.trim()) {
        submitData.append("pronunciation", data.pronunciation);
      }

      if (data.image && data.image[0]) {
        submitData.append("image", data.image[0]);
      }

      // Call the API
      await addVocabulary(submitData).unwrap();

      // Handle success
      onSuccess?.();
      onClose();
      reset();
      setImagePreview(null);
      toast.success("Vocabulary successfully created!");
    } catch (error: any) {
      // Handle API errors
      if (error?.data?.errors) {
        // Handle validation errors from API
        const apiErrors = error.data.errors;
        Object.keys(apiErrors).forEach((key) => {
          setError(key as keyof VocabularyFormData, { message: apiErrors[key][0] });
        });
      } else if (error?.data?.message) {
        // Handle general error message
        setError("root", { message: error.data.message });
      } else {
        setError("root", {
          message: "Failed to create vocabulary. Please try again.",
        });
      }
    }
  };

  const handleRemoveImage = () => {
    setValue("image", undefined);
    setImagePreview(null);
    clearErrors("image");
    // Reset file input value so the same file can be selected again
    if (imageInputRef.current) imageInputRef.current.value = "";
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
                  <Languages className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Add New Vocabulary
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

              {/* Word - Required */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Word <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    {...register("word")}
                    className={`w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 ${
                      errors.word
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:border-primary"
                    } bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}
                    placeholder="Enter vocabulary word"
                    disabled={isLoading}
                  />
                </div>
                {errors.word && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.word.message}
                  </p>
                )}
              </div>

              {/* Meaning - Required */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Meaning <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Languages className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    {...register("meaning")}
                    className={`w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 ${
                      errors.meaning
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:border-primary"
                    } bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}
                    placeholder="Enter meaning in your language"
                    disabled={isLoading}
                  />
                </div>
                {errors.meaning && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.meaning.message}
                  </p>
                )}
              </div>

              {/* Example Sentence - Optional & Auto-expanding */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Example Sentence{" "}
                  <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <div className="relative">
                  <Mic className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <textarea
                    {...register("example")}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = "auto";
                      target.style.height = `${target.scrollHeight}px`;
                    }}
                    rows={1}
                    className={`w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 overflow-hidden ${
                      errors.example
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:border-primary"
                    } bg-white dark:bg-gray-900 text-gray-900 dark:text-white resize-none`}
                    placeholder="Enter an example sentence using this word (optional)"
                    disabled={isLoading}
                    style={{ height: "auto", minHeight: "42px" }}
                  />
                </div>
                {errors.example && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.example.message}
                  </p>
                )}
              </div>

              {/* Pronunciation - Optional */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Pronunciation{" "}
                  <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <div className="relative">
                  <Volume2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    {...register("pronunciation")}
                    className={`w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 ${
                      errors.pronunciation
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:border-primary"
                    } bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}
                    placeholder="e.g., /wɜːd/ or phonetic spelling"
                    disabled={isLoading}
                  />
                </div>
                {errors.pronunciation && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.pronunciation.message}
                  </p>
                )}
              </div>

              {/* Part of Speech - Required with DropdownMenu */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Part of Speech <span className="text-red-500">*</span>
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 flex items-center justify-between ${
                        errors.part_of_speech
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600 focus:border-primary"
                      } bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}
                      disabled={isLoading}
                    >
                      <span className={!selectedPartOfSpeech ? "text-gray-400" : ""}>
                        {selectedPartOfSpeech || "Select part of speech"}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full min-w-[200px]">
                    {partOfSpeechOptions.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={() => {
                          setValue("part_of_speech", option.value);
                          clearErrors("part_of_speech");
                        }}
                        className="cursor-pointer"
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                {errors.part_of_speech && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.part_of_speech.message}
                  </p>
                )}
              </div>

              {/* Image Upload - Optional (with preserve previous selection) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Vocabulary Image{" "}
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
                      className={`border-2 border-dashed rounded-xl p-4 text-center hover:border-primary transition-colors duration-200 ${
                        errors.image ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Click to upload vocabulary image
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
                    <span>Create Vocabulary</span>
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

export default AddVocabularyModal;