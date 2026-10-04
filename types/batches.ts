export interface Slot {
  start_time: string;
  end_time: string;
}

export interface AvailabilityItem {
  date: string;
  day: number;
  slots: Slot[];
}

export interface SelectedSchedule {
  day_of_week: string;
  start_time: string;
}

export interface ClassItem {
  id: number;
  title: string;
  image_url?: string;
}

export interface TeacherItem {
  id: number;
  name: string;
  image?: string;
  expertise?: string;
  timezone?: string;
  country?: string;
}


// for apis
export interface UpdateBatchData {
  id: number;
  class_id: number;
  teacher_id: number;
  name: string;
  total_seat: number;
  start_date: string;
  end_date: string;
  zoom_link: string;
  status: string;
  active_status: number;
  schedules: { day_of_week: number; start_time: string }[];
}


// types/batches.ts
export interface Batch {
  id: number;
  class_id: number;
  teacher_id: number;
  name: string;
  total_seat: number;
  filled_seat: number;
  start_date: string;
  end_date: string;
  status?: "upcoming" | "ongoing" | "completed" | "cancelled";
  active_status?: 0 | 1;
  teacher?: {
    id: number;
    name: string;
    image: string;
    intro_video: string;
    image_url: string;
    intro_video_url: string;
    timezone?: string;
    country?: string;
  };
  class?: {
    id: number;
    title: string;
    image: string;
    image_url: string;
  };
  schedules?: Array<{
    id: number;
    batch_id: number;
    day_of_week: number;
    start_time: string;
    end_time: string;
  }>;
}

export interface TeacherBatchesStateCardProps {
  batches: Batch[];  
  total: number;     
}