"use client";

import { useGetSupportInfoQuery } from "@/src/redux/api/home/supportApi";
import { Mail, Phone } from "lucide-react";
import React, { useEffect, useState } from "react";

const SupportInfo = () => {
  const [mounted, setMounted] = useState(false);
  const { data } = useGetSupportInfoQuery(null, { skip: !mounted });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="space-y-2 mb-3 min-h-[44px]" />;
  }

  const supportInfo = data?.data;
  if (!supportInfo?.support_email && !supportInfo?.support_number) return null;

  return (
    <div className="space-y-2 mb-3">
      {supportInfo?.support_email && (
        <div className="flex items-center gap-2 text-gray-400 text-xs">
          <Mail className="w-3 h-3 text-primary" />
          <span>{supportInfo.support_email}</span>
        </div>
      )}
      {supportInfo?.support_number && (
        <div className="flex items-center gap-2 text-gray-400 text-xs">
          <Phone className="w-3 h-3 text-primary" />
          <span>{supportInfo.support_number}</span>
        </div>
      )}
    </div>
  );
};

export default SupportInfo;
