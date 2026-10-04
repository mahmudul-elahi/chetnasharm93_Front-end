"use client";

import { useState } from "react";
import { ChevronDown, BookOpen } from "lucide-react";
import { CurriculumModule } from "@/types/classes";

interface CurriculumAccordionProps {
  curriculum?: CurriculumModule[];
}

const CurriculumAccordion = ({ curriculum }: CurriculumAccordionProps) => {
  const [openModule, setOpenModule] = useState<number | null>(null);

  if (!curriculum || curriculum.length === 0) {
    return null;
  }

  const toggleModule = (index: number) => {
    setOpenModule(openModule === index ? null : index);
  };

  return (
    <section className="animate-slide-up border-t border-gray-100 py-6 lg:py-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-primary/10 rounded-full">
          <BookOpen className="w-4 h-4 text-primary" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
          What You'll Learn
        </h2>
      </div>

      <div className="space-y-3">
        {curriculum.map((module, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-xl overflow-hidden hover:border-primary/20 transition-colors duration-200"
          >
            <button
              onClick={() => toggleModule(index)}
              className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
            >
              <h3 className="font-semibold text-gray-900 text-left">
                {module.title}
              </h3>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                  openModule === index ? "transform rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`grid transition-all duration-300 ease-in-out ${
                openModule === index
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="p-4 bg-white border-t border-gray-200">
                  <ul className="space-y-2">
                    {module.keypoints.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="flex items-start gap-2 text-sm text-gray-700"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CurriculumAccordion;