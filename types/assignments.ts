export interface Assignment {
  id: number;
  batch_id: number;
  title: string;
  description: string | null;
  attachment_url: string | null;
  starts_at: string;
  due_at: string;
  total_marks: number;
  submissions_count?: number;
  created_at: string;
  updated_at: string;
}

export interface AssignmentResponse {
  data: Assignment[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

export interface CreateAssignmentData {
  title: string;
  description?: string;
  starts_at: string;
  due_at: string;
  total_marks: number;
  attachment?: File | null;
}

export interface UpdateAssignmentData extends CreateAssignmentData {
  id: number;
}

export interface AssignmentSubmission {
  id: number;
  assignment_id: number;
  student_user_id: number;
  student_name: string;
  student_email: string;
  file_url: string;
  total_marks: string;
  obtained_marks: string | null;
  feedback: string | null;
  graded_at: string | null;
  submitted_at: string;
  created_at: string;
}

export interface StudentAssignment {
  id: number;
  batch_id: number;
  teacher_id: number;
  title: string;
  description: string;
  attachment_url: string | null;
  starts_at: string;
  due_at: string;
  total_marks: string;
  submissions_count: number | null;
  created_at: string;
  updated_at: string;
  batch_name: string;
  class_title: string;
  is_open: boolean;
  has_submitted: boolean;
  my_submission: {
    id: number;
    assignment_id: number;
    student_user_id: number;
    file_url: string;
    total_marks: string;
    obtained_marks: string | null;
    feedback: string | null;
    graded_at: string | null;
    submitted_at: string;
  } | null;
}
