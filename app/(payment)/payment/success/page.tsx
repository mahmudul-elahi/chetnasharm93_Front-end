import React, { Suspense } from "react";
import SuccessContent from "../components/SuccessContent";
import Loader from "@/components/ui/Loader";

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

const PaypalPaymentSuccessPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center">
            <Loader />
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
};

export default PaypalPaymentSuccessPage;
