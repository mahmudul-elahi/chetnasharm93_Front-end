"use client";

import { useState, useEffect, useRef } from "react";
import {
  X,
  Camera,
  Languages,
  BookOpen,
  Volume2,
  Mic,
  Edit,
  ChevronDown,
} from "lucide-react";
import MyButton from "@/components/ui/MyButton";
import { toast } from "sonner";
import { ModalPortal } from "@/components/ui/ModalPortal";
import Loader from "@/components/ui/Loader";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useGetSingleVocabularyForAdminByIdQuery,
  useUpdateVocabularyForAdminMutation,
} from "@/src/redux/api/admin/vocabulariesApi";

interface UpdateVocabularyModalProps {
  id: number;
  onClose: () => void;
  onUpdate?: () => void;
}

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

export default function UpdateVocabularyModal({
  id,
  onClose,
  onUpdate,
}: UpdateVocabularyModalProps) {
  // Form state
  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [example, setExample] = useState("");
  const [pronunciation, setPronunciation] = useState("");
  const [partOfSpeech, setPartOfSpeech] = useState("");
  const [status, setStatus] = useState<number>(1);

  // File states
  const [vocabularyImage, setVocabularyImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  // Add ref for file input
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Fetch vocabulary data
  const {
    data: vocabularyData,
    isLoading: isLoadingVocabulary,
    isError: isVocabularyError,
  } = useGetSingleVocabularyForAdminByIdQuery(id);

  const [
    updateVocabulary,
    { isLoading: isUpdating, isSuccess, isError, error },
  ] = useUpdateVocabularyForAdminMutation();

  // Set vocabulary data when fetched
  useEffect(() => {
    if (vocabularyData?.data) {
      const vocabulary = vocabularyData.data;
      setWord(vocabulary.word || "");
      setMeaning(vocabulary.meaning || "");
      setExample(vocabulary.example || "");
      setPronunciation(vocabulary.pronunciation || "");
      setPartOfSpeech(vocabulary.part_of_speech || "");
      setStatus(vocabulary.status ?? 1);
      setPreviewUrl(vocabulary.image_url || "");
    }
  }, [vocabularyData]);

  // Handle success
  useEffect(() => {
    if (isSuccess) {
      toast.success("Vocabulary updated successfully!");
      onUpdate?.();
      onClose();
    }
  }, [isSuccess, onUpdate, onClose]);

  // Handle error
  useEffect(() => {
    if (isError && error) {
      const errorMessage =
        (error as any)?.data?.message || "Failed to update vocabulary";
      toast.error(errorMessage);
    }
  }, [isError, error]);

  // Handle image change - preserves previous selection if user cancels
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      // User cancelled the file picker - do nothing, keep existing image
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setVocabularyImage(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!word.trim()) {
      toast.error("Word is required");
      return;
    }

    if (!meaning.trim()) {
      toast.error("Meaning is required");
      return;
    }

    // Example sentence is now optional - removed validation
    if (!partOfSpeech.trim()) {
      toast.error("Part of speech is required");
      return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append("word", word);
    formData.append("meaning", meaning);
    formData.append("part_of_speech", partOfSpeech);
    formData.append("status", String(status));

    // Only append example if it has a value
    if (example && example.trim()) {
      formData.append("example", example);
    }

    if (pronunciation && pronunciation.trim()) {
      formData.append("pronunciation", pronunciation);
    }

    // Handle image: send new file if selected
    if (vocabularyImage) {
      formData.append("image", vocabularyImage);
    }

    await updateVocabulary({ id: String(id), data: formData });
  };

  const handleRemoveImage = () => {
    setVocabularyImage(null);
    setPreviewUrl(vocabularyData?.data?.image_url || "");
    // Reset file input value so the same file can be selected again
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (
        previewUrl &&
        previewUrl !== vocabularyData?.data?.image_url &&
        previewUrl.startsWith("blob:")
      ) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, vocabularyData?.data?.image_url]);

  // Auto-expand textarea function
  const autoExpandTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    target.style.height = "auto";
    target.style.height = `${target.scrollHeight}px`;
  };

  // Show loading state
  if (isLoadingVocabulary) {
    return (
      <ModalPortal>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="rounded-2xl overflow-hidden">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md mx-4 p-8 animate-in fade-in zoom-in">
              <div className="flex flex-col items-center justify-center gap-4">
                <Loader />
                <p className="text-gray-600 dark:text-gray-400">
                  Loading vocabulary data...
                </p>
              </div>
            </div>
          </div>
        </div>
      </ModalPortal>
    );
  }

  // Show error state
  if (isVocabularyError) {
    return (
      <ModalPortal>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="rounded-2xl overflow-hidden">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md mx-4 p-8 animate-in fade-in zoom-in">
              <div className="flex flex-col items-center justify-center gap-4">
                <p className="text-red-500">Failed to load vocabulary data</p>
                <MyButton onClick={onClose}>Close</MyButton>
              </div>
            </div>
          </div>
        </div>
      </ModalPortal>
    );
  }

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" />

        {/* Modal */}
        <div className="rounded-2xl overflow-hidden w-full md:w-3/4 lg:w-1/2 xl:w-2/5">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full overflow-y-auto max-h-[90vh] transition-all duration-300 animate-in fade-in zoom-in">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Edit className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Edit Vocabulary
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
              {/* Vocabulary Image */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-24 h-24 rounded-lg border-4 border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-100 dark:bg-gray-900">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Vocabulary"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Languages className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 p-1.5 bg-primary rounded-full cursor-pointer shadow-md hover:bg-primary/90 transition-colors">
                    <Camera className="w-3 h-3 text-white" />
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  {previewUrl &&
                    previewUrl !== vocabularyData?.data?.image_url && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                </div>
              </div>

              {/* Word - Required */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Word <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={word}
                    onChange={(e) => setWord(e.target.value)}
                    placeholder="Enter vocabulary word"
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Meaning - Required */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Meaning <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Languages className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={meaning}
                    onChange={(e) => setMeaning(e.target.value)}
                    placeholder="Enter meaning in your language"
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Example - Optional & Auto-expanding */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Example Sentence{" "}
                  <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <div className="relative">
                  <Mic className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <textarea
                    value={example}
                    onChange={(e) => {
                      setExample(e.target.value);
                      autoExpandTextarea(e);
                    }}
                    rows={1}
                    placeholder="Enter an example sentence using this word (optional)"
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent overflow-hidden resize-none"
                    style={{ height: "auto", minHeight: "42px" }}
                  />
                </div>
              </div>

              {/* Pronunciation - Optional */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Pronunciation{" "}
                  <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <div className="relative">
                  <Volume2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={pronunciation}
                    onChange={(e) => setPronunciation(e.target.value)}
                    placeholder="e.g., /wɜːd/ or phonetic spelling"
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Part of Speech - Required with DropdownMenu */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Part of Speech <span className="text-red-500">*</span>
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent flex items-center justify-between"
                    >
                      <span className={!partOfSpeech ? "text-gray-400" : ""}>
                        {partOfSpeech || "Select part of speech"}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full min-w-[200px]">
                    {partOfSpeechOptions.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={() => setPartOfSpeech(option.value)}
                        className="cursor-pointer"
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value={1}
                      checked={status === 1}
                      onChange={() => setStatus(1)}
                      className="w-4 h-4 text-green-500 border-gray-300 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Active
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value={0}
                      checked={status === 0}
                      onChange={() => setStatus(0)}
                      className="w-4 h-4 text-red-500 border-gray-300 focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Inactive
                    </span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  className="flex-1"
                  type="button"
                  onClick={onClose}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  {isUpdating ? "Updating..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
