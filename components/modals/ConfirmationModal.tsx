"use client";

import React from "react";
import { ModalPortal } from "@/components/ui/ModalPortal";
import {
  X,
  AlertTriangle,
  Ban,
  CircleCheckBig,
  CircleStar,
} from "lucide-react";
import MyButton from "@/components/ui/MyButton";
import { toast } from "sonner";
import { Button } from "../ui/button";

export type ConfirmationType =
  | "suspend"
  | "activate"
  | "delete"
  | "warning"
  | "info"
  | "top";

export type EntityType =
  | "user"
  | "teacher"
  | "student"
  | "course"
  | "item"
  | "class"
  | "batch"
  | "payment";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  type: ConfirmationType;
  title?: string;
  message?: string;
  isLoading?: boolean;
  userName?: string;
  payload?: any;
  userId?: number | null;
  mutation?: any;
  onSuccess?: () => void;
  entityType?: EntityType;
  entityName?: string;
  successMessage?: string; // custom success message override
}

const getEntityLabels = (
  entityType: EntityType,
): {
  singular: string;
  singularLower: string;
  plural: string;
  pluralLower: string;
} => {
  const entities: Record<
    EntityType,
    {
      singular: string;
      singularLower: string;
      plural: string;
      pluralLower: string;
    }
  > = {
    user: {
      singular: "User",
      singularLower: "user",
      plural: "Users",
      pluralLower: "users",
    },
    teacher: {
      singular: "Teacher",
      singularLower: "teacher",
      plural: "Teachers",
      pluralLower: "teachers",
    },
    student: {
      singular: "Student",
      singularLower: "student",
      plural: "Students",
      pluralLower: "students",
    },
    course: {
      singular: "Course",
      singularLower: "course",
      plural: "Courses",
      pluralLower: "courses",
    },
    item: {
      singular: "Item",
      singularLower: "item",
      plural: "Items",
      pluralLower: "items",
    },
    class: {
      singular: "Class",
      singularLower: "class",
      plural: "Classes",
      pluralLower: "classes",
    },
    batch: {
      singular: "Batch",
      singularLower: "batch",
      plural: "Batches",
      pluralLower: "batches",
    },
    payment: {
      singular: "Payment",
      singularLower: "payment",
      plural: "Payments",
      pluralLower: "payments",
    },
  };
  return entities[entityType];
};

const configs: Record<
  ConfirmationType,
  {
    icon: React.ElementType;
    iconColor: string;
    iconBg: string;
    buttonColor: string;
    buttonText: (entityType?: EntityType, customName?: string) => string;
    defaultTitle: (entityType?: EntityType, customName?: string) => string;
    defaultMessage: (
      name?: string,
      entityType?: EntityType,
      customName?: string,
    ) => string;
    successMessage: (
      name?: string,
      entityType?: EntityType,
      customName?: string,
    ) => string;
  }
> = {
  suspend: {
    icon: Ban,
    iconColor: "text-red-600 dark:text-red-400",
    iconBg: "bg-red-100 dark:bg-red-900/30",
    buttonColor: "bg-red-600 hover:bg-red-700",
    buttonText: (entityType = "user", customName) => {
      const label = customName || getEntityLabels(entityType).singular;
      return `Suspend ${label}`;
    },
    defaultTitle: (entityType = "user", customName) => {
      const label = customName || getEntityLabels(entityType).singular;
      return `Suspend ${label}`;
    },
    defaultMessage: (name, entityType = "user", customName) => {
      const label = customName || getEntityLabels(entityType).singularLower;
      return `Are you sure you want to suspend ${name ? `"${name}"` : `this ${label}`}? They will not be able to access the platform until reactivated.`;
    },
    successMessage: (name, entityType = "user", customName) => {
      const label = customName || getEntityLabels(entityType).singular;
      return `${label} ${name ? `"${name}"` : ""} has been suspended successfully.`;
    },
  },
  activate: {
    icon: CircleCheckBig,
    iconColor: "text-green-600 dark:text-green-400",
    iconBg: "bg-green-100 dark:bg-green-900/30",
    buttonColor: "bg-green-600 hover:bg-green-700",
    buttonText: (entityType = "user", customName) => {
      const label = customName || getEntityLabels(entityType).singular;
      return `Activate ${label}`;
    },
    defaultTitle: (entityType = "user", customName) => {
      const label = customName || getEntityLabels(entityType).singular;
      return `Activate ${label}`;
    },
    defaultMessage: (name, entityType = "user", customName) => {
      const label = customName || getEntityLabels(entityType).singularLower;
      return `Are you sure you want to activate ${name ? `"${name}"` : `this ${label}`}? They will regain full access to the platform.`;
    },
    successMessage: (name, entityType = "user", customName) => {
      const label = customName || getEntityLabels(entityType).singular;
      return `${label} ${name ? `"${name}"` : ""} has been activated successfully.`;
    },
  },
  delete: {
    icon: AlertTriangle,
    iconColor: "text-red-600 dark:text-red-400",
    iconBg: "bg-red-100 dark:bg-red-900/30",
    buttonColor: "bg-red-600 hover:bg-red-700",
    buttonText: (entityType = "item", customName) => {
      const label = customName || getEntityLabels(entityType).singular;
      return `Delete ${label}`;
    },
    defaultTitle: (entityType = "item", customName) => {
      const label = customName || getEntityLabels(entityType).singular;
      return `Delete ${label}`;
    },
    defaultMessage: (name, entityType = "item", customName) => {
      const label = customName || getEntityLabels(entityType).singularLower;
      return `Are you sure you want to delete ${name ? `"${name}"` : `this ${label}`}? This action cannot be undone.`;
    },
    successMessage: (name, entityType = "item", customName) => {
      const label = customName || getEntityLabels(entityType).singular;
      return `${label} ${name ? `"${name}"` : ""} deleted successfully.`;
    },
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "text-yellow-600 dark:text-yellow-400",
    iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
    buttonColor: "bg-yellow-600 hover:bg-yellow-700",
    buttonText: () => "Confirm",
    defaultTitle: () => "Warning",
    defaultMessage: () => "Are you sure you want to proceed?",
    successMessage: () => "Action completed successfully.",
  },
  info: {
    icon: AlertTriangle,
    iconColor: "text-blue-600 dark:text-blue-400",
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    buttonColor: "bg-blue-600 hover:bg-blue-700",
    buttonText: () => "Confirm",
    defaultTitle: () => "Confirm Action",
    defaultMessage: () => "Are you sure you want to proceed?",
    successMessage: () => "Action completed successfully.",
  },
  top: {
    icon: CircleStar,
    iconColor: "text-amber-600 dark:text-amber-400",
    iconBg: "bg-amber-100 dark:bg-amber-900/30",
    buttonColor: "bg-amber-600 hover:bg-amber-700",
    buttonText: (entityType = "teacher", customName) => {
      const label = customName || getEntityLabels(entityType).singular;
      return `Toggle Top ${label}`;
    },
    defaultTitle: (entityType = "teacher", customName) => {
      const label = customName || getEntityLabels(entityType).singular;
      return `Change Top Status`;
    },
    defaultMessage: (name, entityType = "teacher", customName) => {
      const label = customName || getEntityLabels(entityType).singularLower;
      return `Are you sure you want to change top status for ${name ? `"${name}"` : `this ${label}`}?`;
    },
    successMessage: (name, entityType = "teacher", customName) => {
      const label = customName || getEntityLabels(entityType).singular;
      return `${label} ${name ? `"${name}"` : ""} top status toggled successfully.`;
    },
  },
};

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  type,
  title,
  message,
  isLoading: externalLoading,
  userName,
  userId,
  payload,
  mutation,
  onSuccess,
  entityType = "user",
  entityName,
  successMessage,
}: ConfirmationModalProps) {
  const config = configs[type];
  const Icon = config.icon;

  const modalTitle = title || config.defaultTitle(entityType, entityName);
  const modalMessage =
    message || config.defaultMessage(userName, entityType, entityName);

  const [isLoading, setIsLoading] = React.useState(false);
  const loading = externalLoading || isLoading;

  const handleConfirm = async () => {
    if (onConfirm) {
      onConfirm();
      return;
    }

    if (mutation && (userId || payload)) {
      try {
        setIsLoading(true);
        await mutation(payload || userId).unwrap();
        // Use custom successMessage if provided, else fallback to config
        const finalSuccessMessage =
          successMessage || config.successMessage(userName, entityType, entityName);
        toast.success(finalSuccessMessage);
        onSuccess?.();
        onClose();
      } catch (error: any) {
        toast.error(
          error?.data?.message || "Operation failed. Please try again.",
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="rounded-2xl overflow-hidden w-full max-w-md">
          <div className="relative bg-white dark:bg-gray-800 shadow-2xl w-full transition-all duration-300 animate-in fade-in zoom-in">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className={`p-2 ${config.iconBg} rounded-full`}>
                  <Icon className={`w-5 h-5 ${config.iconColor}`} />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {modalTitle}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
                aria-label="Close modal"
                disabled={loading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {modalMessage}
              </p>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  className="flex-1"
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <MyButton
                  type="button"
                  onClick={handleConfirm}
                  isLoading={loading}
                  className={`flex-1 ${config.buttonColor} text-white`}
                >
                  {config.buttonText(entityType, entityName)}
                </MyButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}