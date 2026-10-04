"use client";

import { useState, useEffect } from "react";
import { Clock, Save, Phone, Mail, Bell, Pen, X } from "lucide-react";
import { toast } from "sonner";
import MyButton from "@/components/ui/MyButton";
import Loader from "@/components/ui/Loader";
import PhoneInput from "react-phone-input-2";
import { getBrowserCountry } from "@/lib/phone";
import "../../../../style/phone-input.css";
import "react-phone-input-2/lib/style.css";
import {
  useGetAdminSettingsQuery,
  useUpdateAdminSettingsMutation,
} from "@/src/redux/api/admin/adminSettingsApi";
import { EnvSettings } from "./EnvSettings";

export default function AdminSettings() {
  const {
    data: settingsData,
    isLoading,
    refetch,
  } = useGetAdminSettingsQuery({});
  const [updateSettings] = useUpdateAdminSettingsMutation();

  const [classTime, setClassTime] = useState(0);
  const [classNotifyTime, setClassNotifyTime] = useState(0);
  const [supportNumber, setSupportNumber] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(true);

  // Store original values to reset on cancel
  const [originalValues, setOriginalValues] = useState({
    classTime: 0,
    classNotifyTime: 0,
    supportNumber: "",
    supportEmail: "",
  });

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

  useEffect(() => {
    if (settingsData?.data) {
      const data = settingsData.data;
      const newValues = {
        classTime: data.class_time ?? 0,
        classNotifyTime: data.class_notify_time ?? 0,
        supportNumber: data.support_number ?? "",
        supportEmail: data.support_email ?? "",
      };

      setClassTime(newValues.classTime);
      setClassNotifyTime(newValues.classNotifyTime);
      setSupportNumber(formatPhoneForDisplay(newValues.supportNumber));
      setSupportEmail(newValues.supportEmail);

      // Store original values when data is loaded
      setOriginalValues(newValues);
    }
  }, [settingsData]);

  const handleCancel = () => {
    setClassTime(originalValues.classTime);
    setClassNotifyTime(originalValues.classNotifyTime);
    setSupportNumber(formatPhoneForDisplay(originalValues.supportNumber));
    setSupportEmail(originalValues.supportEmail);
    setIsReadOnly(true);
  };

  const handleClassTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setClassTime(0);
    } else {
      const numValue = parseInt(value);
      setClassTime(isNaN(numValue) ? 0 : numValue);
    }
  };

  const handleClassNotifyTimeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    if (value === "") {
      setClassNotifyTime(0);
    } else {
      const numValue = parseInt(value);
      setClassNotifyTime(isNaN(numValue) ? 0 : numValue);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);

    // Check if values are valid
    if (classTime <= 0 || isNaN(classTime)) {
      setIsSaving(false);
      return toast.error("Class duration must be at least 1 minute");
    }
    if (classNotifyTime <= 0 || isNaN(classNotifyTime)) {
      setIsSaving(false);
      return toast.error("Class notification time must be at least 1 minute");
    }

    // Validate phone number
    const digitsOnly = supportNumber.replace(/\D/g, "");
    if (supportNumber && digitsOnly.length < 10) {
      setIsSaving(false);
      return toast.error("Please enter a valid phone number");
    }

    try {
      const payload = {
        class_time: classTime,
        class_notify_time: classNotifyTime,
        support_number: supportNumber ? formatPhoneForAPI(supportNumber) : "",
        support_email: supportEmail,
      };

      await updateSettings(payload).unwrap();
      toast.success("Settings updated successfully!");

      // Update original values after successful save
      setOriginalValues({
        classTime,
        classNotifyTime,
        supportNumber: supportNumber ? formatPhoneForAPI(supportNumber) : "",
        supportEmail,
      });

      setIsReadOnly(true);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-155px)] w-full flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Admin Settings
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage system-wide configuration
          </p>
        </div>
        {isReadOnly ? (
          <MyButton onClick={() => setIsReadOnly(false)} className="min-w-35">
            <Pen className="w-4 h-4" />
            <span>Edit Settings</span>
          </MyButton>
        ) : (
          <div className="flex flex-col-reverse md:flex-row flex-wrap justify-center items-center gap-2">
            <MyButton
              onClick={handleCancel}
              className="min-w-42"
              variant="outline"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </MyButton>
            <MyButton
              onClick={handleSave}
              isLoading={isSaving}
              className="min-w-42"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </MyButton>
          </div>
        )}

        
      </div>

      {/* Class Settings Section */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="flex items-center gap-3 p-5 border-b border-gray-200 bg-gray-50">
          <div className="p-1.5 bg-primary/10 rounded-lg">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <h2 className="font-semibold text-gray-900 dark:text-white">
            Class Settings
          </h2>
        </div>
        <div className="p-5 space-y-4">
          {/* Class Duration */}
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Class Duration (minutes)
              </label>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Default duration for each class session
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={classTime === 0 ? "" : classTime}
                onChange={handleClassTimeChange}
                readOnly={isReadOnly}
                className={`w-32 px-3 py-2 rounded-lg border border-gray-300 ${
                  isReadOnly
                    ? "bg-gray-100"
                    : "bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                } text-gray-900 text-center`}
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                minutes
              </span>
            </div>
          </div>

          {/* Class Notification Time */}
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Class Notification Time (minutes)
              </label>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                How many minutes before class to send notification
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={classNotifyTime === 0 ? "" : classNotifyTime}
                readOnly={isReadOnly}
                onChange={handleClassNotifyTimeChange}
                className={`w-32 px-3 py-2 rounded-lg border border-gray-300 ${
                  isReadOnly
                    ? "bg-gray-100"
                    : "bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                } text-gray-900 text-center`}
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                minutes
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Support Settings Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-3 p-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div className="p-1.5 bg-primary/10 rounded-lg">
            <Phone className="w-5 h-5 text-primary" />
          </div>
          <h2 className="font-semibold text-gray-900 dark:text-white">
            Support Settings
          </h2>
        </div>
        <div className="p-5 space-y-4">
          {/* Support Number - Using PhoneInput */}
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-400" />
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Support Phone Number
                </label>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Contact number for customer support
                </span>
              </div>
            </div>
            {isReadOnly ? (
              <input
                type="tel"
                value={"+" + supportNumber}
                readOnly={true}
                className="flex-1 max-w-xs px-3 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-900"
              />
            ) : (
              <PhoneInput
                country={getBrowserCountry()}
                value={supportNumber}
                onChange={(phone) => setSupportNumber(phone)}
                inputProps={{
                  name: "supportNumber",
                }}
                enableSearch={true}
                searchPlaceholder="Search country"
                containerClass="w-full max-w-xs"
                inputClass="!w-full !h-11 !pl-12 !pr-4 !py-2 !rounded-lg !border !border-gray-300 dark:!border-gray-600 !bg-white dark:!bg-gray-900 !text-gray-900 dark:!text-white focus:!ring-2 focus:!ring-primary focus:!border-transparent"
                buttonClass="!rounded-l-lg !border !border-gray-300 dark:!border-gray-600 !border-r-0 !bg-white dark:!bg-gray-900 hover:!bg-gray-50 dark:hover:!bg-gray-800"
                dropdownClass="!rounded-lg h-45"
              />
            )}
          </div>

          {/* Support Email */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Support Email Address
                </label>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Email for customer support inquiries
                </span>
              </div>
            </div>
            <input
              type="email"
              value={supportEmail}
              readOnly={isReadOnly}
              onChange={(e) => setSupportEmail(e.target.value)}
              placeholder="e.g., support@example.com"
              className={`flex-1 max-w-xs px-3 py-2 rounded-lg border border-gray-300 ${
                isReadOnly
                  ? "bg-gray-100"
                  : "bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              } text-gray-900`}
            />
          </div>
        </div>
      </div>
      <div className="mt-6">
        <EnvSettings />
      </div>
    </div>
  );
}
