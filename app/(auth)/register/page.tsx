import { Suspense } from "react";
import LoginPageSkeletonLoader from "@/components/skeleton/LoginPageSkeletonLoader";
import RegisterContent from "./components/RegisterContent";


// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;


export default function RegisterPage() {
  return (
    <Suspense fallback={<LoginPageSkeletonLoader />}>
      <RegisterContent />
    </Suspense>
  );
}