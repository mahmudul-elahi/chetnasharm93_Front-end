"use client";
import { Button } from "@/components/ui/button";
import { CheckCircle, Zap } from "lucide-react";
import React from "react";
import { toast } from "sonner";

const BookingButton = ({ classData }: { classData: any }) => {
  const [isBooking, setIsBooking] = React.useState(false);
  const isFree = classData.price === 0;

  const handleBookNow = () => {
    if (isFree) {
      // Handle free booking
      setIsBooking(true);
      setTimeout(() => {
        setIsBooking(false);
        toast.success("Successfully enrolled! Check your email for class details.");
      }, 1000);
    } else {
      // Redirect to payment page or open payment modal
      toast.info("Redirecting to payment gateway...");
    }
  };
  return (
    <div>
      <Button
        onClick={handleBookNow}
        disabled={isBooking || classData.status === "completed"}
        className="w-full py-6 text-lg bg-purple-600 hover:bg-purple-700"
      >
        {isBooking ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
            Processing...
          </span>
        ) : classData.status === "completed" ? (
          <span className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Course Completed
          </span>
        ) : isFree ? (
          <span className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Enroll for Free
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Pay & Enroll Now
          </span>
        )}
      </Button>
    </div>
  );
};

export default BookingButton;
