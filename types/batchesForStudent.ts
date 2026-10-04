export interface Schedule {
  id: number;
  batch_id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
}

interface Teacher {
  id: number;
  name: string;
  image_url: string | null;
  intro_video_url: string | null;
}

interface Class {
  id: number;
  title: string;
  description: string;
  image: string;
  image_url: string;
}

interface BatchData {
  id: number;
  class_id: number;
  teacher_id: number;
  name: string;
  total_seat: number;
  filled_seat: number;
  start_date: string;
  end_date: string;
  zoom_link: string;
  status: string;
  active_status: number;
  created_at: string;
  updated_at: string;
  class: Class;
  teacher: Teacher;
  schedules: Schedule[];
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data: BatchData;
}