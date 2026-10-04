import React, { Suspense } from "react";
import AuthCallbackContent from "./components/AuthCallbackContent";
import Loader from "@/components/ui/Loader";

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

const AuthCallback = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex justify-center items-center">
          <Loader />
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
};

export default AuthCallback;
