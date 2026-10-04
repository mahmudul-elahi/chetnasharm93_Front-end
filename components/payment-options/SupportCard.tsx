"use client";

import React from "react";
import { Headphones, MessageCircle } from "lucide-react";
import MyButton from "@/components/ui/MyButton";
import { useGetSupportInfoQuery } from "@/src/redux/api/home/supportApi";
import { toast } from "sonner";

const SupportCard = () => {
  const { data, isLoading, isError } = useGetSupportInfoQuery(null);
  const supportNumber = data?.data?.support_number;

  const handleWhatsApp = () => {
    if (!supportNumber) {
      toast.error("Support number not available. Please try again later.");
      return;
    }

    const cleanNumber = supportNumber.replace(/\D/g, "");

    if (!cleanNumber) {
      toast.error("Invalid support number.");
      return;
    }

    const whatsappUrl = `https://wa.me/${cleanNumber}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  if (isLoading) {
    return (
      <div className="bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 p-6 md:p-8">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Need Help?
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              If you experience any issues during payment, please contact our
              support team. We're happy to help.
            </p>
            <MyButton variant="primary" className="gap-2" disabled>
              <MessageCircle className="w-4 h-4" />
              Loading...
            </MyButton>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 p-6 md:p-8">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Need Help?
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              If you experience any issues during payment, please contact our
              support team. We're happy to help.
            </p>
            <MyButton
              variant="primary"
              className="gap-2"
              onClick={() => toast.error("Support number not available")}
            >
              <MessageCircle className="w-4 h-4" />
              Contact Support
            </MyButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 p-6 md:p-8">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Need Help?
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
            If you experience any issues during payment, please contact our
            support team. We're happy to help.
          </p>
          <MyButton
            variant="primary"
            className="gap-2"
            onClick={handleWhatsApp}
          >
            <MessageCircle className="w-4 h-4" />
            Contact Support
          </MyButton>
        </div>
      </div>
    </div>
  );
};

export default SupportCard;
