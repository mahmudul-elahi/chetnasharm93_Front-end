"use client";

import { CheckCircle2 } from "lucide-react";
import { CurriculumModule } from "@/types/classes";

interface WhatYouWillLearnProps {
  curriculum?: CurriculumModule[];
  description?: string;
}

const WhatYouWillLearn = ({ curriculum, description }: WhatYouWillLearnProps) => {
  // Extract learning points from curriculum or description
  const extractLearningPoints = (): string[] => {
    // Try to extract from curriculum array first
    if (curriculum && curriculum.length > 0) {
      const points = curriculum.flatMap((module) => module.keypoints || []);
      if (points.length > 0) {
        return points.slice(0, 6); // Limit to 6 points
      }
    }

    // Fallback: extract from description (split by sentences)
    if (description) {
      const sentences = description
        .split(/[.!?]+/)
        .map(s => s.trim())
        .filter(s => s.length > 10 && s.length < 100);
      
      if (sentences.length > 0) {
        return sentences.slice(0, 6);
      }
    }

    return [];
  };

  const learningPoints = extractLearningPoints();

  if (learningPoints.length === 0) {
    return null;
  }

  return (
    <section className="py-8 lg:py-12 animate-slide-up">
      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 lg:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            What You'll Learn
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {learningPoints.map((point, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200"
              >
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700 leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatYouWillLearn;