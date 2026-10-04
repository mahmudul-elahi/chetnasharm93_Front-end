import { UserRole } from "./user";

export interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
  badge?: number;
}


export interface TimeSlot {
  id: number;
  start_time: string;
  end_time: string;
}

export interface DaySchedule {
  day_of_week: number;
  slots: TimeSlot[];
}

export interface ApiResponse {
  data: DaySchedule[];
}
