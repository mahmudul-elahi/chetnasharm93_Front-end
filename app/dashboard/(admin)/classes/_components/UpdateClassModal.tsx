"use client";

import { useState, useEffect } from "react";
import {
  X,
  Camera,
  BookOpen,
  DollarSign,
  Calendar,
  Clock,
  FileText,
  Edit,
  Users,
} from "lucide-react";
import MyButton from "@/components/ui/MyButton";
import { toast } from "sonner";
import { ModalPortal } from "@/components/ui/ModalPortal";
import {
  useGetClassForAdminByIdQuery,
  useUpdateClassForAdminMutation,
} from "@/src/redux/api/admin/adminClassApi";
import Loader from "@/components/ui/Loader";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import CurriculumEditor from "./CurriculumEditor";
import { CurriculumModule } from "@/types/classes";

interface UpdateClassModalProps {
  id: number;
  onClose: () => void;
  onUpdate?: () => void;
}

export default function UpdateClassModal({
  id,
  onClose,
  onUpdate,
}: UpdateClassModalProps) {
  // Form state
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [whoIsFor, setWhoIsFor] = useState("");
  const [curriculum, setCurriculum] = useState<CurriculumModule[]>([]);
  const [price, setPrice] = useState("");
  const [durationInDays, setDurationInDays] = useState("");
  const [totalClasses, setTotalClasses] = useState("");
  const [isActive, setIsActive] = useState<number>(1);
  const [isClassRecording, setIsClassRecording] = useState(false);

  // File states
  const [classImage, setClassImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  // Fetch class data
  const {
    data: classData,
    isLoading: isLoadingClass,
    isError: isClassError,
  } = useGetClassForAdminByIdQuery(String(id));

  const [updateClass, { isLoading: isUpdating, isSuccess, isError, error }] =
    useUpdateClassForAdminMutation();

  // Set class data when fetched
  useEffect(() => {
    if (classData?.data) {
      const classItem = classData.data;
      setTitle(classItem.title || "");
      setShortDescription(classItem.short_description || "");
      setDescription(classItem.description || "");
      setWhoIsFor(classItem.who_is_for || "");

      // Parse curriculum - it could be an array or a JSON string
      if (Array.isArray(classItem.curriculum)) {
        setCurriculum(classItem.curriculum);
      } else if (typeof classItem.curriculum === "string" && classItem.curriculum) {
        try {
          const parsed = JSON.parse(classItem.curriculum);
          setCurriculum(Array.isArray(parsed) ? parsed : []);
        } catch {
          setCurriculum([]);
        }
      } else {
        setCurriculum([]);
      }
      setPrice(classItem.price || "");
      setDurationInDays(String(classItem.duration_in_days || ""));
      setTotalClasses(String(classItem.total_classes || ""));
      setIsActive(classItem.is_active ?? 1);
      setIsClassRecording(classItem.is_class_recording ?? false);
      setPreviewUrl(classItem.image_url || "");
    }
  }, [classData]);

  // Handle success
  useEffect(() => {
    if (isSuccess) {
      toast.success("Class updated successfully!");
      onUpdate?.();
      onClose();
    }
  }, [isSuccess, onUpdate, onClose]);

  // Handle error
  useEffect(() => {
    if (isError && error) {
      const errorMessage =
        (error as any)?.data?.message || "Failed to update class";
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
      setClassImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!description.trim()) {
      toast.error("Description is required");
      return;
    }

    if (!price.trim()) {
      toast.error("Price is required");
      return;
    }

    if (!durationInDays.trim()) {
      toast.error("Duration is required");
      return;
    }

    if (!totalClasses.trim()) {
      toast.error("Total classes is required");
      return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append("title", title);
    formData.append("short_description", shortDescription);
    formData.append("description", description);
    formData.append("who_is_for", whoIsFor);
    formData.append("curriculum", JSON.stringify(curriculum));
    formData.append("price", price);
    formData.append("duration_in_days", durationInDays);
    formData.append("total_classes", totalClasses);
    formData.append("is_active", String(isActive));
    formData.append("is_class_recording", isClassRecording ? "1" : "0");

    // Handle image: send new file if selected
    if (classImage) {
      formData.append("image", classImage);
    }

    await updateClass({ id: String(id), data: formData });
  };

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl !== classData?.data?.image_url) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, classData?.data?.image_url]);

  // Show loading state
  if (isLoadingClass) {
    return (
      <ModalPortal>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="rounded-2xl overflow-hidden">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md mx-4 p-8 animate-in fade-in zoom-in">
              <div className="flex flex-col items-center justify-center gap-4">
                <Loader />
                <p className="text-gray-600 dark:text-gray-400">
                  Loading class data...
                </p>
              </div>
            </div>
          </div>
        </div>
      </ModalPortal>
    );
  }

  // Show error state
  if (isClassError) {
    return (
      <ModalPortal>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="rounded-2xl overflow-hidden">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md mx-4 p-8 animate-in fade-in zoom-in">
              <div className="flex flex-col items-center justify-center gap-4">
                <p className="text-red-500">Failed to load class data</p>
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
                  Edit Class
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
              {/* Class Image */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-24 h-24 rounded-lg border-4 border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-100 dark:bg-gray-900">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Class"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-gray-400" />
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

              {/* Title - Required */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter class title"
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Short Description - Optional */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Short Description{" "}
                  <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <textarea
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    rows={2}
                    placeholder="Brief summary of the class (max 300 characters)"
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Description - Required */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Enter class description"
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
                    required
                  />
                </div>
              </div>

              {/* Who Is This Course For? - Optional */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Who Is This Course For?{" "}
                  <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <textarea
                    value={whoIsFor}
                    onChange={(e) => setWhoIsFor(e.target.value)}
                    rows={3}
                    placeholder="• Beginners&#10;• Intermediate learners&#10;• IELTS students&#10;• Working professionals"
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
                  />
                </div>
              </div>

              {/* Curriculum - Optional */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Curriculum{" "}
                  <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <CurriculumEditor
                  value={curriculum}
                  onChange={setCurriculum}
                />
              </div>

              {/* Price - Required */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price ($) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g., 199.99"
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Duration in Days - Required */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Duration (Days) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={durationInDays}
                    onChange={(e) => setDurationInDays(e.target.value)}
                    placeholder="e.g., 30"
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Total Classes - Required */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Total Classes <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={totalClasses}
                    onChange={(e) => setTotalClasses(e.target.value)}
                    placeholder="e.g., 20"
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
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
                  checked={isClassRecording}
                  onCheckedChange={setIsClassRecording}
                />
              </div>

              {/* Active Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="is_active"
                      value={1}
                      checked={isActive === 1}
                      onChange={() => setIsActive(1)}
                      className="w-4 h-4 text-green-500 border-gray-300 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Active
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="is_active"
                      value={0}
                      checked={isActive === 0}
                      onChange={() => setIsActive(0)}
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
