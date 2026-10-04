import { Suspense } from "react";
import ClassDetailsContent from "./ClassDetailsContent";
import ClassDetailsSkeleton from "./_components/ClassDetailsSkeleton";

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export default async function Page({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const { classId } = await params;
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-purple-50">
          <ClassDetailsSkeleton />
        </div>
      }
    >
      <ClassDetailsContent classId={classId} />
    </Suspense>
  );
}
