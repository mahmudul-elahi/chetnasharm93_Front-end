import React from "react";
import { Users, CheckCircle, Clock, XCircle } from "lucide-react";
import StateCardsGrid from "@/components/ui/StateCardsGrid";

// Interface for User
interface IUser {
  id: number;
  name: string;
  email: string;
}

// Interface for Batch
interface IBatch {
  id: number;
  name: string;
  teacher_id: number;
}

// Interface for Class
interface IClass {
  id: number;
  title: string;
  image_url: string | null;
}

// Interface for Enrollment (Student)
interface IEnrollment {
  id: number;
  user_id: number;
  batch_id: number;
  class_id: number;
  status: "active" | "inactive" | "expired" | "pending";
  enrolled_at: string;
  expiry_date: string;
  created_at: string;
  updated_at: string;
  user: IUser;
  batch: IBatch;
  class: IClass;
}

// Interface for Pagination
interface IPagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

// Props interface for the component
interface MyStudentsStateCardsProps {
  students: IEnrollment[];
  pagination?: IPagination;
}

// Helper functions
const isExpired = (expiryDate: string): boolean => {
  return new Date(expiryDate) < new Date();
};

const getDaysRemaining = (expiryDate: string): number => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const MyStudentsStateCards: React.FC<MyStudentsStateCardsProps> = ({ 
  students, 
  pagination 
}) => {const stateCards = [
    {
      title: "Total Students",
      value: pagination?.total || 0,
      icon: Users,
      color: "blue" as const,
    },
    {
      title: "Active Students",
      value: students?.filter(
        (s) => s.status === "active" && !isExpired(s.expiry_date)
      ).length || 0,
      icon: CheckCircle,
      color: "green" as const,
      subtitle: "Currently enrolled and active",
    },
    {
      title: "Expiring Soon",
      value: students?.filter((s) => {
        const daysRemaining = getDaysRemaining(s.expiry_date);
        return daysRemaining <= 7 && daysRemaining > 0;
      }).length || 0,
      icon: Clock,
      color: "orange" as const,
      subtitle: "Within next 7 days",
    },
    {
      title: "Expired",
      value: students?.filter((s) => isExpired(s.expiry_date)).length || 0,
      icon: XCircle,
      color: "red" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <StateCardsGrid cards={stateCards} columns={4} />
      {/* Rest of your page */}
    </div>
  );
};

export default MyStudentsStateCards;