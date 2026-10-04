"use client";

import { Users, Check } from "lucide-react";

interface CourseAudienceProps {
  who_is_for?: string;
}

const CourseAudience = ({ who_is_for }: CourseAudienceProps) => {
  if (!who_is_for) {
    return null;
  }

  // Parse the who_is_for text into individual items
  const parseAudienceItems = (text: string): string[] => {
    // Split by newlines, bullet points, or commas
    const items = text
      .split(/\n|•|·|\*/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0 && !item.match(/^[-–—]\s*/));

    // If no clear items found, return the whole text as one item
    if (items.length === 0 && text.trim().length > 0) {
      return [text.trim()];
    }

    return items.slice(0, 8); // Limit to 8 items
  };

  const audienceItems = parseAudienceItems(who_is_for);

  return (
    <section className="animate-slide-up border-t border-gray-100 py-6 lg:py-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-primary/10 rounded-full">
          <Users className="w-4 h-4 text-primary" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
          Who Is This Course For?
        </h2>
      </div>

      <div className="flex flex-col gap-4">
        {audienceItems.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
              <Check className="w-3 h-3 text-green-600" />
            </div>
            <p className="text-gray-700 leading-relaxed">{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CourseAudience;
