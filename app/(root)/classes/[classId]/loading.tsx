import React from "react";
import ClassDetailsSkeleton from "./_components/ClassDetailsSkeleton";

export default function ClassDetailsLoading() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-purple-50">
      <ClassDetailsSkeleton />
    </div>
  );
}
