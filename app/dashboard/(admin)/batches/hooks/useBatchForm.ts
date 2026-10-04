import { useState } from "react";
import { ClassItem, TeacherItem } from "@/types/batches";

interface FormState {
  selectedClass: ClassItem | null;
  selectedTeacher: TeacherItem | null;
  batchName: string;
  totalSeat: number | "";
  startDate: Date | undefined;
  endDate: Date | undefined;
  zoomLink: string;
  status: string;
}

export const useBatchForm = () => {
  const [formState, setFormState] = useState<FormState>({
    selectedClass: null,
    selectedTeacher: null,
    batchName: "",
    totalSeat: "",
    startDate: undefined,
    endDate: undefined,
    zoomLink: "",
    status: "upcoming",
  });

  const [selectedSchedules, setSelectedSchedules] = useState<
    { day_of_week: string; start_time: string }[]
  >([]);

  const updateFormState = (updates: Partial<FormState>) => {
    setFormState((prev) => ({ ...prev, ...updates }));
  };

  const resetForm = () => {
    setFormState({
      selectedClass: null,
      selectedTeacher: null,
      batchName: "",
      totalSeat: "",
      startDate: undefined,
      endDate: undefined,
      zoomLink: "",
      status: "upcoming",
    });
  };

  return {
    formState,
    selectedSchedules,
    setSelectedSchedules,
    updateFormState,
    resetForm,
  };
};