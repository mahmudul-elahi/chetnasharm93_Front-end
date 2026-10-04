import { Suspense } from "react";
import TeacherDetailsContent from "./TeacherDetailsContent";
import Loader from "@/components/ui/Loader";

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Suspense fallback={<Loader />}>
      <TeacherDetailsContent id={id} />
    </Suspense>
  );
}