import { useState } from "react";
import { toast } from "sonner";
import { useAddBatchForAdminMutation } from "@/src/redux/api/admin/adminBatchesApi";

interface SubmitBatchParams {
  class_id: number;
  teacher_id: number;
  name: string;
  total_seat: number;
  start_date: string;
  end_date: string;
  zoom_link: string;
  status: string;
  schedules: { day_of_week: string; start_time: string }[];
}

export const useBatchSubmission = () => {
  const [addBatch, { isLoading }] = useAddBatchForAdminMutation();

  const submitBatch = async (params: SubmitBatchParams): Promise<boolean> => {
    try {
      await addBatch(params).unwrap();
      toast.success("Batch created successfully!");
      return true;
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create batch");
      return false;
    }
  };

  return {
    isSubmitting: isLoading,
    submitBatch,
  };
};