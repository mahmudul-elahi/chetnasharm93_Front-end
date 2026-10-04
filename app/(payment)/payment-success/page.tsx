import { Suspense } from "react";
import Loader from "@/components/ui/Loader";
import PaymentSuccessContentStripe from "./components/PaymentSuccessContentStripe";

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

const PaymentSuccessPage = () => {
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
      <PaymentSuccessContentStripe />
    </Suspense>
  );
};

export default PaymentSuccessPage;
