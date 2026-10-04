"use client";

import React, { useState, useEffect } from "react";
import { ModalPortal } from "@/components/ui/ModalPortal";
import {
  X,
  RefreshCw,
  User,
  Package,
  AlertCircle,
  ChevronsUpDown,
} from "lucide-react";
import MyButton from "@/components/ui/MyButton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLazyGetBatchesByClassForAdminQuery } from "@/src/redux/api/admin/enrollmentsApi";

interface ClassType {
  id: number;
  title?: string;
  name?: string;
}

interface BatchType {
  id: number;
  name: string;
}

interface ChangeBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  enrollmentData?: {
    id: number;
    user_id: number;
    user_name: string;
    current_batch_id: number;
    current_batch_name: string;
    class_id?: number;
    class_name?: string;
  };
  classes: ClassType[];
  onSave: (toBatchId: number) => Promise<void>;
  isLoading?: boolean;
}

export default function ChangeBatchModal({
  isOpen,
  onClose,
  enrollmentData,
  classes,
  onSave,
  isLoading: externalLoading,
}: ChangeBatchModalProps) {
  const [selectedBatch, setSelectedBatch] = useState<{ id: number; name: string } | null>(null);
  const [batches, setBatches] = useState<BatchType[]>([]);
  const [isLoadingBatches, setIsLoadingBatches] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [getBatchesByClass] = useLazyGetBatchesByClassForAdminQuery();
  
  const isLoading = externalLoading || isSaving;

  // Get the current class info
  const currentClass = enrollmentData?.class_id 
    ? classes.find(c => c.id === enrollmentData.class_id)
    : null;
  
  const currentClassName = currentClass 
    ? (currentClass.title || currentClass.name || "")
    : enrollmentData?.class_name || "";

  // Map batches to options format
  const batchOptions = batches.map((batch) => ({
    value: batch.id,
    label: batch.name
  }));

  // Fetch batches for the current class when modal opens
  useEffect(() => {
    if (isOpen && enrollmentData?.class_id) {
      fetchBatchesByClass(enrollmentData.class_id);
    }
  }, [isOpen, enrollmentData]);

  // Reset selected batch when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedBatch(null);
    }
  }, [isOpen]);

  const fetchBatchesByClass = async (classId: number) => {
    setIsLoadingBatches(true);
    try {
      const result = await getBatchesByClass({ class_id: classId }).unwrap();
      setBatches(result?.data || []);
    } catch (error) {
      console.error("Failed to fetch batches:", error);
      toast.error("Failed to load batches");
    } finally {
      setIsLoadingBatches(false);
    }
  };

  const handleBatchSelect = (batchItem: { value: number; label: string }) => {
    setSelectedBatch({
      id: batchItem.value,
      name: batchItem.label
    });
  };

  const handleSave = async () => {
    if (!selectedBatch) {
      toast.error("Please select a batch");
      return;
    }

    if (selectedBatch.id === enrollmentData?.current_batch_id) {
      toast.error("Selected batch is the same as current batch");
      return;
    }

    try {
      setIsSaving(true);
      await onSave(selectedBatch.id);
      toast.success(
        `Student ${enrollmentData?.user_name} moved from ${enrollmentData?.current_batch_name} to ${selectedBatch.name} successfully`
      );
      onClose();
    } catch (error: any) {
      console.error("Failed to change batch:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen || !enrollmentData) return null;

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="rounded-2xl overflow-hidden w-full  max-w-lg">
          <div className="relative bg-white dark:bg-gray-800 shadow-2xl max-h-[90vh] w-full overflow-y-auto transition-all duration-300 animate-in fade-in zoom-in">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <RefreshCw className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Change Student Batch
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
              {/* Current Student Information */}
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 space-y-3 mb-6">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Current Information
                </h3>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-500">
                    <User className="w-4 h-4" />
                    <span>Student:</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {enrollmentData.user_name} (ID: {enrollmentData.user_id})
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Package className="w-4 h-4" />
                    <span>Current Class:</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {currentClassName}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Package className="w-4 h-4" />
                    <span>Current Batch:</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {enrollmentData.current_batch_name}
                  </span>
                </div>
              </div>

              {/* New Batch Selection */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Select New Batch
                </h3>

                {/* Fixed Class Display (Read-only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Class <span className="text-red-500">*</span>
                  </label>
                  <div className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 cursor-not-allowed">
                    {currentClassName}
                  </div>
                </div>

                {/* Batch Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select New Batch <span className="text-red-500">*</span>
                  </label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full justify-between px-4 py-2.5 h-auto"
                        disabled={isLoadingBatches || isLoading}
                      >
                        <span className="flex-1 text-left truncate">
                          {isLoadingBatches 
                            ? "Loading batches..." 
                            : selectedBatch 
                            ? selectedBatch.name 
                            : "Select a batch"}
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-50 max-h-75 overflow-y-auto">
                      <DropdownMenuLabel>Select Batch</DropdownMenuLabel>
                      <DropdownMenuGroup>
                        {batchOptions.map((option) => (
                          <DropdownMenuItem
                            key={option.value}
                            onClick={() => handleBatchSelect(option)}
                            className="cursor-pointer px-4 py-2"
                            disabled={option.value === enrollmentData.current_batch_id}
                          >
                            <div className="flex-1">
                              <p className="font-medium">
                                {option.label}
                                {option.value === enrollmentData.current_batch_id && " (Current Batch)"}
                              </p>
                            </div>
                          </DropdownMenuItem>
                        ))}
                        {batchOptions.length === 0 && !isLoadingBatches && (
                          <DropdownMenuItem disabled>
                            <div className="flex-1">
                              <p className="font-medium text-gray-400">No batches available for this class</p>
                            </div>
                          </DropdownMenuItem>
                        )}
                        {isLoadingBatches && (
                          <DropdownMenuItem disabled>
                            <div className="flex-1">
                              <p className="font-medium text-gray-400">Loading batches...</p>
                            </div>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Warning Note */}
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 border border-yellow-200 dark:border-yellow-800">
                  <div className="flex gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-yellow-800 dark:text-yellow-200">
                      <span className="font-medium">Note:</span> Changing the batch will:
                      <br />• Update student's enrollment to the new batch
                      <br />• Remove student from current batch
                      <br />• Student will remain in the same class
                      <br />• May affect attendance, payments, and class schedules
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <Button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <MyButton
                  type="button"
                  onClick={handleSave}
                  isLoading={isLoading}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white"
                >
                  Save Changes
                </MyButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}