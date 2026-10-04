"use client";

import { useState, useEffect } from "react";
import {
  Mail,
  Camera,
  Video,
  X,
  UserRoundPen,
  UserRound,
  BookOpen,
  GraduationCap,
  Briefcase,
  FileText,
} from "lucide-react";
import MyButton from "@/components/ui/MyButton";
import { toast } from "sonner";
import { ModalPortal } from "@/components/ui/ModalPortal";
import {
  useGetAdminTeacherByIdQuery,
  useUpdateTeacherMutation,
} from "@/src/redux/api/admin/teachersApi";
import Loader from "@/components/ui/Loader";
import { Button } from "@/components/ui/button";
import PhoneInput from "react-phone-input-2";
import { getBrowserCountry } from "@/lib/phone";
import "react-phone-input-2/lib/style.css";
import { getAllCountries, getTimezonesForCountry } from "countries-and-timezones";
import SearchableSelect from "@/components/ui/SearchableSelect";
import TagInput from "@/components/ui/TagInput";

interface UpdateTeacherModalProps {
  id: number;
  onClose: () => void;
  onUpdate?: () => void;
}

export default function UpdateTeacherModal({
  id,
  onClose,
  onUpdate,
}: UpdateTeacherModalProps) {
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [bio, setBio] = useState("");
  const [about, setAbout] = useState("");
  const [qualification, setQualification] = useState("");
  const [expertise, setExpertise] = useState("");
  const [yearsOfExp, setYearsOfExp] = useState<number>(0);
  const [suspendStatus, setSuspendStatus] = useState<number>(0);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [phoneCountry, setPhoneCountry] = useState<string>(() => getBrowserCountry());
  const [selectedTimezone, setSelectedTimezone] = useState<string>("");
  const [availableTimezones, setAvailableTimezones] = useState<string[]>([]);

  // Array fields state
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [languagesSpoken, setLanguagesSpoken] = useState<string[]>([]);
  const [coursesCanTeach, setCoursesCanTeach] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);

  // File states
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [introVideo, setIntroVideo] = useState<File | null>(null);
  const [videoFileName, setVideoFileName] = useState("");
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");

  // Fetch teacher data
  const {
    data: teacherData,
    isLoading: isLoadingTeacher,
    isError: isTeacherError,
  } = useGetAdminTeacherByIdQuery(id);

  const [updateTeacher, { isLoading: isUpdating, isSuccess, isError, error }] =
    useUpdateTeacherMutation();

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

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
      if (countryCode) {
        setPhoneCountry(countryCode.toLowerCase());
      }
    if (countryCode) {
      setPhoneCountry(countryCode.toLowerCase());
    }

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
    setSelectedTimezone(timezone);
  };

  // Set teacher data when fetched
  useEffect(() => {
    if (teacherData?.data) {
      const teacher = teacherData.data;
      setName(teacher.name || "");
      setEmail(teacher.email || "");
      setMobile(formatPhoneForDisplay(teacher.mobile || ""));
      setBio(teacher.bio || "");
      setAbout(teacher.about || "");
      setQualification(teacher.qualification || "");
      setExpertise(teacher.expertise || "");
      setYearsOfExp(teacher.years_of_exp || 0);
      setSuspendStatus(teacher.suspend_status ?? 0);
      setPreviewUrl(teacher.image_url || "");
      setCurrentVideoUrl(teacher.intro_video_url || "");

      // Set array fields
      setSpecializations(teacher.specializations || []);
      setLanguagesSpoken(teacher.languages_spoken || []);
      setCoursesCanTeach(teacher.courses_can_teach || []);
      setInterests(teacher.interests || []);

      // Set country and timezone
      const countryCode = teacher.country || "";
      setSelectedCountry(countryCode);
      if (countryCode) {
        setPhoneCountry(countryCode.toLowerCase());
      }
      setSelectedTimezone(teacher.timezone || "");

      if (countryCode) {
        const timezones = getTimezonesForCountry(countryCode);
        if (timezones && timezones.length > 0) {
          setAvailableTimezones(timezones.map((tz) => tz.name));
        }
      }
    }
  }, [teacherData]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Teacher updated successfully!");
      onUpdate?.();
      onClose();
    }
  }, [isSuccess, onUpdate, onClose]);

  useEffect(() => {
    if (isError && error) {
      const errorMessage =
        (error as any)?.data?.message || "Failed to update teacher";
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
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }
      setProfileImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("video/")) {
        toast.error("Please upload a video file");
        return;
      }
      if (file.size > 20 * 1024 * 1024) {
        toast.error("Video size should be less than 20MB");
        return;
      }
      setIntroVideo(file);
      setVideoFileName(file.name);
    }
  };

  const handleRemoveVideo = () => {
    setIntroVideo(null);
    setVideoFileName("");
    setCurrentVideoUrl("");
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

    if (mobile) {
      const digitsOnly = mobile.replace(/\D/g, "");
      if (digitsOnly.length < 10) {
        toast.error("Please enter a valid mobile number (minimum 10 digits)");
        return;
      }
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("suspend_status", String(suspendStatus));

    if (selectedCountry) formData.append("country", selectedCountry);
    if (selectedTimezone) formData.append("timezone", selectedTimezone);
    if (mobile) formData.append("mobile", formatPhoneForAPI(mobile));
    if (bio) formData.append("bio", bio);
    if (about) formData.append("about", about);
    if (qualification) formData.append("qualification", qualification);
    if (expertise) formData.append("expertise", expertise);
    if (yearsOfExp !== undefined)
      formData.append("years_of_exp", String(yearsOfExp));

    // Array fields as JSON
    if (specializations.length > 0)
      formData.append("specializations", JSON.stringify(specializations));
    if (languagesSpoken.length > 0)
      formData.append("languages_spoken", JSON.stringify(languagesSpoken));
    if (coursesCanTeach.length > 0)
      formData.append("courses_can_teach", JSON.stringify(coursesCanTeach));
    if (interests.length > 0)
      formData.append("interests", JSON.stringify(interests));

    if (profileImage) formData.append("image", profileImage);
    if (introVideo) formData.append("intro_video", introVideo);

    await updateTeacher({ id, teacherData: formData });
  };

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl !== teacherData?.data?.image_url) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, teacherData?.data?.image_url]);

  if (isLoadingTeacher) {
    return (
      <ModalPortal>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="rounded-2xl overflow-hidden">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md mx-4 p-8 animate-in fade-in zoom-in">
              <div className="flex flex-col items-center justify-center gap-4">
                <Loader />
                <p className="text-gray-600 dark:text-gray-400">
                  Loading teacher data...
                </p>
              </div>
            </div>
          </div>
        </div>
      </ModalPortal>
    );
  }

  if (isTeacherError) {
    return (
      <ModalPortal>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="rounded-2xl overflow-hidden">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md mx-4 p-8 animate-in fade-in zoom-in">
              <div className="flex flex-col items-center justify-center gap-4">
                <p className="text-red-500">Failed to load teacher data</p>
                <MyButton onClick={onClose}>Close</MyButton>
              </div>
            </div>
          </div>
        </div>
      </ModalPortal>
    );
  }

  const allCountries = getAllCountries();
  const countries = Object.values(allCountries).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" />

        <div className="rounded-2xl overflow-hidden w-full md:w-3/4 lg:w-1/2 xl:w-2/5">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full overflow-y-auto max-h-[90vh] transition-all duration-300 animate-in fade-in zoom-in">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <UserRoundPen className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Edit Teacher
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
                  Full Name <span className="text-red-500">*</span>
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
                  Email Address <span className="text-red-500">*</span>
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

              {/* Mobile */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mobile Number 
                </label>
                <PhoneInput
                  country={phoneCountry}
                  value={mobile}
                  onChange={(phone) => setMobile(phone)}
                  inputProps={{ name: "mobile" }}
                  enableSearch={true}
                  searchPlaceholder="Search country"
                  containerClass="w-full"
                  inputClass="!w-full !h-11 !pl-12 !pr-4 !py-2 !rounded-xl !border !border-gray-300 dark:!border-gray-600 !bg-white dark:!bg-gray-900 !text-gray-900 dark:!text-white focus:!ring-2 focus:!ring-primary focus:!border-transparent"
                  buttonClass="!rounded-l-xl !border !border-gray-300 dark:!border-gray-600 !border-r-0 !bg-white dark:!bg-gray-900 hover:!bg-gray-50 dark:hover:!bg-gray-800"
                  dropdownClass="!rounded-xl h-45"
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
                    value={selectedTimezone}
                    onChange={handleTimezoneChange}
                    placeholder="Select a timezone"
                    searchPlaceholder="Search timezone..."
                  />
                ) : (
                  <div className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-400 dark:text-gray-500">
                    Select a country first
                  </div>
                )}
              </div>

              {/* Expertise */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Expertise 
                </label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={expertise}
                    onChange={(e) => setExpertise(e.target.value)}
                    placeholder="e.g., Mathematics, Physics, English"
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Qualification */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Qualification 
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    placeholder="e.g., M.Sc. in Mathematics"
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Years of Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Years of Experience 
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={yearsOfExp}
                    onChange={(e) => setYearsOfExp(Number(e.target.value))}
                    placeholder="e.g., 5"
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio 
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    placeholder="Enter teacher bio..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
                  />
                </div>
              </div>

              {/* About */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  About 
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <textarea
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    rows={3}
                    placeholder="Enter about the teacher..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
                  />
                </div>
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
                />
              </div>

              {/* Intro Video */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Introduction Video 
                </label>
                {(videoFileName || currentVideoUrl) && (
                  <div className="mb-3 flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <Video className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300 flex-1 truncate">
                      {videoFileName || (currentVideoUrl ? "Current video" : "")}
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
                  <div className="border-2 border-dashed rounded-xl p-4 text-center hover:border-primary transition-colors duration-200 border-gray-300 dark:border-gray-600">
                    <Video className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Click to {currentVideoUrl ? "replace" : "upload"} introduction video
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      MP4, MOV, AVI, WEBM up to 20MB
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="video/mp4,video/quicktime,video/x-msvideo,video/webm"
                    onChange={handleVideoChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Suspend Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="suspend_status"
                      value={0}
                      checked={suspendStatus === 0}
                      onChange={() => setSuspendStatus(0)}
                      className="w-4 h-4 text-primary border-gray-300 focus:ring-primary cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Active
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="suspend_status"
                      value={1}
                      checked={suspendStatus === 1}
                      onChange={() => setSuspendStatus(1)}
                      className="w-4 h-4 text-red-500 border-gray-300 focus:ring-red-500 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Suspended
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