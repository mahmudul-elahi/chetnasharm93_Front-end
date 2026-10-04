"use client";

import React, { useState, useEffect } from "react";
import { X, Link2 } from "lucide-react";
import { toast } from "sonner";
import MyButton from "@/components/ui/MyButton";
import { Button } from "@/components/ui/button";
import { useUpdateBatchZoomLinkMutation } from "@/src/redux/api/teacher/teacherBatchesApi";

interface UpdateZoomLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  batchId: number;
  currentZoomLink: string;
  onSuccess: () => void;
}

const UpdateZoomLinkModal: React.FC<UpdateZoomLinkModalProps> = ({
  isOpen,
  onClose,
  batchId,
  currentZoomLink,
  onSuccess,
}) => {
  const [zoomLink, setZoomLink] = useState("");
  const [updateBatchZoomLink, { isLoading: isUpdating }] = useUpdateBatchZoomLinkMutation();

  useEffect(() => {
    if (isOpen) {
      setZoomLink(currentZoomLink || "");
    }
  }, [isOpen, currentZoomLink]);

  const handleUpdateZoomLink = async () => {
    if (!zoomLink.trim()) {
      toast.error("Please enter a valid Zoom link");
      return;
    }

    try {
      await updateBatchZoomLink({
        id: batchId,
        zoom_link: zoomLink,
      }).unwrap();

      toast.success("Zoom link updated successfully!");
      onClose();
      setZoomLink("");
      onSuccess();
    } catch (error) {
      toast.error("Failed to update zoom link");
      console.error("Update zoom link error:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md mx-4 overflow-hidden shadow-xl animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Link2 className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-800">
              Update Zoom Link
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Zoom Meeting Link
          </label>
          <input
            type="url"
            value={zoomLink}
            onChange={(e) => setZoomLink(e.target.value)}
            placeholder="https://zoom.us/j/123456789"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
            autoFocus
          />
          <p className="text-xs text-gray-500 mt-2">
            Enter the Zoom meeting link for your live classes
          </p>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50">
          <Button onClick={onClose} variant="outline" className="px-4 flex-1">
            Cancel
          </Button>
          <MyButton
            onClick={handleUpdateZoomLink}
            className="flex-1"
            isLoading={isUpdating}
          >
            Update Link
          </MyButton>
        </div>
      </div>
    </div>
  );
};

export default UpdateZoomLinkModal;