export interface ClassItem {
  id: number;
  title: string;
  description: string;
  price: string;
  duration_in_days: number;
  total_classes: number;
  image: string;
  image_url: string;
}

export interface LiveClassCardProps {
  classItem: ClassItem;
}

export interface CurriculumModule {
  title: string;
  keypoints: string[];
}

export interface TeacherBatch {
  id: number;
  name: string;
  status: string;
  active_status: number;
}

export interface ClassTeacher {
  id: number;
  name: string;
  image: string | null;
  image_url: string | null;
  about: string | null;
  specializations: string[];
  languages_spoken: string[];
  courses_can_teach: string[];
  interests: string[];
  country: string | null;
  timezone: string | null;
  batches_count: number;
  batches: TeacherBatch[];
}

export interface ClassDetails {
  id: number;
  title: string;
  description: string;
  short_description: string;
  who_is_for: string;
  curriculum: CurriculumModule[];
  price: string;
  duration_in_days: number;
  total_classes: number;
  image: string | null;
  is_class_recording: number;
  teachers_count: number;
  batches_count: number;
  teachers: ClassTeacher[];
  image_url: string | null;
}