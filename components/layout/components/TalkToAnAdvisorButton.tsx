"use client";

import MyButton from "@/components/ui/MyButton";
import { useGetSupportInfoQuery } from "@/src/redux/api/home/supportApi";
import { RiCustomerService2Fill } from "react-icons/ri";
import { toast } from "sonner";

const DEFAULT_MESSAGE =
  "Hi, I would like to speak with an advisor about your classes.";

const TalkToAnAdvisorButton = () => {
  const { data, isLoading, isError } = useGetSupportInfoQuery(null);
  const supportNumber = data?.data?.support_number;

  const handleWhatsApp = () => {
    if (!supportNumber) {
      toast.error("Support number not available. Please try again later.");
      return;
    }

    // Remove everything except digits
    const cleanNumber = supportNumber.replace(/\D/g, "");

    if (!cleanNumber) {
      toast.error("Invalid support number.");
      return;
    }

    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
      DEFAULT_MESSAGE,
    )}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  if (isLoading) return null;

  if (isError) {
    return (
      <MyButton className="h-11" onClick={() => toast.error("Support number not available")}>
        <span className="flex  items-center justify-center gap-2 md:gap-3  font-semibold">
          Talk to an Advisor
          <RiCustomerService2Fill className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform duration-100" />
        </span>
      </MyButton>
    );
  }

  return (
    <MyButton className="h-11" onClick={handleWhatsApp}>
      <span className="flex  items-center justify-center gap-2 md:gap-3  font-semibold">
        Talk to an Advisor
        <RiCustomerService2Fill className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform duration-100" />
      </span>
    </MyButton>
  );
};

export default TalkToAnAdvisorButton;
