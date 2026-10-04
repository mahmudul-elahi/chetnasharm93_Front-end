"use client";
import { useGetSupportInfoQuery } from "@/src/redux/api/home/supportApi";
import { Mail, Phone } from "lucide-react";
import React from "react";

const SupportInfo = () => {
  const { data, isLoading } = useGetSupportInfoQuery(null);
  const supportInfo = data?.data;
  if (isLoading) return <></>;
  return (
    <div className="space-y-2 mb-3">
      <div className="flex items-center gap-2 text-gray-400 text-xs">
        <Mail className="w-3 h-3 text-primary" />
        <span>{supportInfo?.support_email}</span>
      </div>
      <div className="flex items-center gap-2 text-gray-400 text-xs">
        <Phone className="w-3 h-3 text-primary" />
        <span>{supportInfo?.support_number}</span>
      </div>
    </div>
  );
};

export default SupportInfo;
