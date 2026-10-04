export interface Student {
  id: number;
  user_id: number;
  batch_id: number;
  class_id: number;
  status: "active" | "inactive" | "expired";
  enrolled_at: string;
  expiry_date: string;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  batch: {
    id: number;
    name: string;
    teacher_id: number;
  };
  class: {
    id: number;
    title: string;
    image_url: string | null;
  };
}