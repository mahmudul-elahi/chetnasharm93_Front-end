"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";

interface TagInputProps {
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

const TagInput = ({
  value,
  onChange,
  placeholder = "Type and press Enter to add...",
  disabled = false,
}: TagInputProps) => {
  const [input, setInput] = useState("");

  const addTags = (rawInput: string) => {
    // Split by comma, trim each, filter empty, and deduplicate
    const newTags = rawInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    if (newTags.length === 0) return;

    // Merge with existing, avoiding duplicates
    const existingSet = new Set(value);
    const uniqueNew = newTags.filter((tag) => !existingSet.has(tag));

    if (uniqueNew.length > 0) {
      onChange([...value, ...uniqueNew]);
    }
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      addTags(input);
    }
  };

  const handleBlur = () => {
    if (input.trim()) {
      addTags(input);
    }
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-primary bg-primary/5 border border-primary/10 rounded-full"
          >
            {tag}
            <button
              type="button"
              onClick={() => handleRemove(index)}
              disabled={disabled}
              className="text-primary/60 hover:text-red-500 transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
        />
        {input.trim() && (
          <button
            type="button"
            onClick={() => addTags(input)}
            disabled={disabled}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-primary hover:text-primary/80 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>
      <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">
        Press Enter to add
      </p>
    </div>
  );
};

export default TagInput;