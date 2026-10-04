import { Suspense } from "react";
import BatchDetailContent from "./BatchDetailContent";
import BatchDetailSkeleton from "../../_components/BatchDetailSkeleton";

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export default async function Page({
  params,
}: {
  params: Promise<{ classId: string; batchId: string }>;
}) {
  const { batchId } = await params;
  return (
    <Suspense fallback={<BatchDetailSkeleton />}>
      <BatchDetailContent batchId={batchId} />
    </Suspense>
  );
}
