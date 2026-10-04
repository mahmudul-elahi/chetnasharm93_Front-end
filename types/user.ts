// types/user.ts
export type UserRole = 'admin' | 'teacher' | 'student';

export interface User {
  id: number | string;
  name: string;
  email: string;
  role: UserRole;
  mobile?: string | null;        // ✅ Add null
  department?: string | null;    // ✅ Add null
  image?: string | null;
  image_url?: string | null;
  avatarUrl?: string | null;
  teacher_id?: number | null;
  has_password?: boolean;
  suspended?: number;
  suspend_status?: number;
  class?: string | null;
  provider?: string | null;
  provider_id?: string | null;
  created_at?: string;
  updated_at?: string;
  email_verified_at?: string | null;
}