import { useState, useEffect } from "react";
import { useLazyGetTeacherAvailabilityForBatchQuery } from "@/src/redux/api/admin/adminBatchesApi";
import { AvailabilityItem } from "@/types/batches";

interface GetAvailabilityParams {
  teacher_id: number;
  start_date: string;
  end_date: string;
}

export const useTeacherAvailability = () => {
  const [getAvailabilityQuery, { data: availabilityData, isLoading }] =
    useLazyGetTeacherAvailabilityForBatchQuery();
  const [availability, setAvailability] = useState<AvailabilityItem[]>([]);

  useEffect(() => {
    if (availabilityData?.data) {
      setAvailability(availabilityData.data);
    }
  }, [availabilityData]);

  const getAvailability = (params: GetAvailabilityParams) => {
    getAvailabilityQuery(params);
  };

  const resetAvailability = () => {
    setAvailability([]);
  };

  return {
    availability,
    isLoading,
    getAvailability,
    resetAvailability,
  };
};