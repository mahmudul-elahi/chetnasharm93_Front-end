"use client";

import { User, GraduationCap } from "lucide-react";
import { ClassTeacher } from "@/types/classes";

interface InstructorsProps {
  teachers?: ClassTeacher[];
}

const Instructors = ({ teachers }: InstructorsProps) => {
  if (!teachers || teachers.length === 0) {
    return null;
  }

  return (
    <section className="animate-slide-up border-t border-gray-100 pt-6 lg:pt-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-primary/10 rounded-full">
          <GraduationCap className="w-4 h-4 text-primary" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
          Your Instructors
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {teachers.map((teacher) => (
          <div
            key={teacher.id}
            className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-primary/20 hover:shadow-sm transition-all duration-200"
          >
            {/* Teacher Image */}
            {teacher.image_url ? (
              <img
                src={teacher.image_url || ""}
                alt={teacher.name}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/20 shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-linear-to-br from-primary/10 to-primary/20 flex items-center justify-center shrink-0">
                <User className="w-7 h-7 text-primary" />
              </div>
            )}

            {/* Teacher Info */}
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">
                {teacher.name}
              </h3>
              {teacher.batches && teacher.batches.length > 0 && (
                <p className="text-sm text-gray-500 truncate">
                  {teacher.batches.map((b) => b.name).join(", ")}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Instructors;
