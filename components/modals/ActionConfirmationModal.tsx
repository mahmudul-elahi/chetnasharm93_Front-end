"use client";

import React from "react";
import { ModalPortal } from "@/components/ui/ModalPortal";
import { X, AlertTriangle, Ban, CircleCheckBig, Trash } from "lucide-react";
import MyButton from "@/components/ui/MyButton";
import { toast } from "sonner";
import { Button } from "../ui/button";

export type ActionType =
  | "deactivate"
  | "activate"
  | "delete"
  | "suspend"
  | "confirm";

interface ActionConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Core props
  id: number | null;
  name: string;
  mutation: any; // RTK Query mutation
  // Customization props
  actionType: ActionType;
  entityName?: string; // e.g., "Class", "Teacher", "User"
  title?: string;
  message?: string;
  confirmButtonText?: string;
  successMessage?: string;
  // Callbacks
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

const actionConfigs: Record<
  ActionType,
  {
    icon: React.ElementType;
    iconColor: string;
    iconBg: string;
    buttonColor: string;
    defaultTitle: (entity: string) => string;
    defaultMessage: (name: string, entity: string) => string;
    defaultConfirmText: (entity: string) => string;
    defaultSuccessMessage: (name: string, entity: string) => string;
  }
> = {
  deactivate: {
    icon: Ban,
    iconColor: "text-red-600 dark:text-red-400",
    iconBg: "bg-red-100 dark:bg-red-900/30",
    buttonColor: "bg-red-600 hover:bg-red-700",
    defaultTitle: (entity) => `Deactivate ${entity}`,
    defaultMessage: (name, entity) =>
      `Are you sure you want to deactivate "${name}"? This ${entity.toLowerCase()} will no longer be visible to users.`,
    defaultConfirmText: (entity) => `Deactivate ${entity}`,
    defaultSuccessMessage: (name, entity) =>
      `${entity} "${name}" has been deactivated successfully.`,
  },
  activate: {
    icon: CircleCheckBig,
    iconColor: "text-green-600 dark:text-green-400",
    iconBg: "bg-green-100 dark:bg-green-900/30",
    buttonColor: "bg-green-600 hover:bg-green-700",
    defaultTitle: (entity) => `Activate ${entity}`,
    defaultMessage: (name, entity) =>
      `Are you sure you want to activate "${name}"? This ${entity.toLowerCase()} will become visible to users.`,
    defaultConfirmText: (entity) => `Activate ${entity}`,
    defaultSuccessMessage: (name, entity) =>
      `${entity} "${name}" has been activated successfully.`,
  },
  suspend: {
    icon: Ban,
    iconColor: "text-red-600 dark:text-red-400",
    iconBg: "bg-red-100 dark:bg-red-900/30",
    buttonColor: "bg-red-600 hover:bg-red-700",
    defaultTitle: (entity) => `Suspend ${entity}`,
    defaultMessage: (name, entity) =>
      `Are you sure you want to suspend "${name}"? They will not be able to access the platform until reactivated.`,
    defaultConfirmText: (entity) => `Suspend ${entity}`,
    defaultSuccessMessage: (name, entity) =>
      `${entity} "${name}" has been suspended successfully.`,
  },
  delete: {
    icon: Trash,
    iconColor: "text-red-600 dark:text-red-400",
    iconBg: "bg-red-100 dark:bg-red-900/30",
    buttonColor: "bg-red-600 hover:bg-red-700",
    defaultTitle: (entity) => `Delete ${entity}`,
    defaultMessage: (name, entity) =>
      `Are you sure you want to delete "${name}"? This action cannot be undone.`,
    defaultConfirmText: (entity) => `Delete ${entity}`,
    defaultSuccessMessage: (name, entity) =>
      `${entity} "${name}" has been deleted successfully.`,
  },
  confirm: {
    icon: AlertTriangle,
    iconColor: "text-yellow-600 dark:text-yellow-400",
    iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
    buttonColor: "bg-yellow-600 hover:bg-yellow-700",
    defaultTitle: () => "Confirm Action",
    defaultMessage: () => "Are you sure you want to proceed?",
    defaultConfirmText: () => "Confirm",
    defaultSuccessMessage: () => "Action completed successfully.",
  },
};

export default function ActionConfirmationModal({
  isOpen,
  onClose,
  id,
  name,
  mutation,
  actionType,
  entityName = "Item",
  title,
  message,
  confirmButtonText,
  successMessage,
  onSuccess,
  onError,
}: ActionConfirmationModalProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const config = actionConfigs[actionType];
  const Icon = config.icon;

  const modalTitle = title || config.defaultTitle(entityName);
  const modalMessage = message || config.defaultMessage(name, entityName);
  const buttonText = confirmButtonText || config.defaultConfirmText(entityName);
  const toastSuccessMessage =
    successMessage || config.defaultSuccessMessage(name, entityName);

  const handleConfirm = async () => {
    if (!id || !mutation) return;

    try {
      setIsLoading(true);
      const result = await mutation(id).unwrap();
      toast.success(toastSuccessMessage || result?.message);
      onSuccess?.();
      onClose();
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || "Operation failed. Please try again.";
      toast.error(errorMessage);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />

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
                disabled={isLoading}
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
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 cursor-pointer"
                >
                  Cancel
                </Button>
                <MyButton
                  type="button"
                  onClick={handleConfirm}
                  isLoading={isLoading}
                  className={`flex-1 ${config.buttonColor} text-white cursor-pointer`}
                >
                  {buttonText}
                </MyButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
