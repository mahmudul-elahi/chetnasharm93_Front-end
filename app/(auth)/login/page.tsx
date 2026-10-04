import { Suspense } from "react";
import LoginContent from "./_components/LoginContent";
import LoginPageSkeletonLoader from "@/components/skeleton/LoginPageSkeletonLoader";


// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;


export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageSkeletonLoader />}>
      <LoginContent />
    </Suspense>
  );
}