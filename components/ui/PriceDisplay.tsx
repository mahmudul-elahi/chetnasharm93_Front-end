"use client";
import { useUserCurrency } from "@/hooks/useUserCurrency";

export const PriceDisplay = ({ amountUSD = 0 }: { amountUSD?: number }) => {
  const { formatted, loading, currencyCode } = useUserCurrency(amountUSD);

  if (loading) {
    return <div className="h-6 w-24 bg-gray-200 animate-pulse rounded" />;
  }

  return (
    <div className="flex items-center gap-1">
      <span >{formatted}</span>
      {/* <span className="text-sm text-gray-500">{currencyCode}</span> */}
    </div>
  );
};
