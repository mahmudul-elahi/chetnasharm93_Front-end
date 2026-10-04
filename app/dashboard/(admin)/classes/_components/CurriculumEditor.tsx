"use client";

import { useState } from "react";
import { Plus, Trash2, BookOpen, ListChecks, GripVertical } from "lucide-react";
import { CurriculumModule } from "@/types/classes";

interface CurriculumEditorProps {
  value: CurriculumModule[];
  onChange: (modules: CurriculumModule[]) => void;
}

const CurriculumEditor = ({ value, onChange }: CurriculumEditorProps) => {
  const modules = value || [];

  // Track which keypoint is currently being dragged
  const [draggedKeypoint, setDraggedKeypoint] = useState<{
    moduleIndex: number;
    keypointIndex: number;
  } | null>(null);

  // Track which keypoint index the drag is hovering over (for drop line indicator)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleAddModule = () => {
    onChange([...modules, { title: "", keypoints: [""] }]);
  };

  const handleRemoveModule = (moduleIndex: number) => {
    onChange(modules.filter((_, i) => i !== moduleIndex));
  };

  const handleModuleTitleChange = (moduleIndex: number, title: string) => {
    onChange(
      modules.map((module, i) =>
        i === moduleIndex ? { ...module, title } : module
      )
    );
  };

  const handleAddKeypoint = (moduleIndex: number) => {
    onChange(
      modules.map((module, i) =>
        i === moduleIndex
          ? { ...module, keypoints: [...module.keypoints, ""] }
          : module
      )
    );
  };

  const handleKeypointChange = (
    moduleIndex: number,
    keypointIndex: number,
    keypoint: string
  ) => {
    onChange(
      modules.map((module, i) =>
        i === moduleIndex
          ? {
              ...module,
              keypoints: module.keypoints.map((kp, ki) =>
                ki === keypointIndex ? keypoint : kp
              ),
            }
          : module
      )
    );
  };

  const handleRemoveKeypoint = (moduleIndex: number, keypointIndex: number) => {
    onChange(
      modules.map((module, i) =>
        i === moduleIndex
          ? {
              ...module,
              keypoints: module.keypoints.filter((_, ki) => ki !== keypointIndex),
            }
          : module
      )
    );
  };

  const handleReorderKeypoints = (
    moduleIndex: number,
    fromIndex: number,
    toIndex: number
  ) => {
    if (fromIndex === toIndex) return;

    const module = modules[moduleIndex];
    const newKeypoints = [...module.keypoints];
    const [removed] = newKeypoints.splice(fromIndex, 1);
    newKeypoints.splice(toIndex, 0, removed);

    onChange(
      modules.map((mod, i) =>
        i === moduleIndex ? { ...mod, keypoints: newKeypoints } : mod
      )
    );
  };

  return (
    <div className="space-y-4">
      {modules.length === 0 && (
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center">
          <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No curriculum modules added yet.
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Click the button below to add your first module.
          </p>
        </div>
      )}

      {modules.map((module, moduleIndex) => (
        <div
          key={moduleIndex}
          className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
        >
          {/* Module Header */}
          <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <BookOpen className="w-4 h-4 text-primary shrink-0" />
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider shrink-0">
              Module {moduleIndex + 1}
            </span>
            <input
              type="text"
              value={module.title}
              onChange={(e) =>
                handleModuleTitleChange(moduleIndex, e.target.value)
              }
              placeholder="Module title (e.g., Speaking Foundations)"
              className="flex-1 min-w-0 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => handleRemoveModule(moduleIndex)}
              className="p-1.5 text-gray-400 hover:text-red-500 transition-colors shrink-0"
              title="Remove module"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Keypoints */}
          <div
            className="p-3 space-y-2"
            onDragLeave={(e) => {
              const related = e.relatedTarget as Node | null;
              if (!related || !e.currentTarget.contains(related)) {
                setDragOverIndex(null);
              }
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <ListChecks className="w-4 h-4 text-gray-400" />
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Key Points
              </span>
            </div>

            {module.keypoints.map((keypoint, keypointIndex) => {
              const isDragging =
                draggedKeypoint?.moduleIndex === moduleIndex &&
                draggedKeypoint?.keypointIndex === keypointIndex;

              const showDropLine =
                draggedKeypoint !== null &&
                dragOverIndex === keypointIndex &&
                draggedKeypoint.moduleIndex === moduleIndex;

              return (
                <div
                  key={keypointIndex}
                  className={`relative flex items-center gap-2 transition-all duration-300 ease-in-out ${
                    isDragging ? "opacity-50" : "opacity-100"
                  }`}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.effectAllowed = "move";
                    e.dataTransfer.setData(
                      "text/plain",
                      JSON.stringify({ moduleIndex, keypointIndex })
                    );
                    setDraggedKeypoint({ moduleIndex, keypointIndex });
                    // Use a transparent 1x1 image to suppress the default ghost image
                    const img = new Image();
                    img.src =
                      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60g6kgAAAABJRU5ErkJggg==";
                    e.dataTransfer.setDragImage(img, 0, 0);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                    setDragOverIndex(keypointIndex);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const data = JSON.parse(
                      e.dataTransfer.getData("text/plain")
                    );
                    if (
                      data.moduleIndex === moduleIndex &&
                      data.keypointIndex !== keypointIndex
                    ) {
                      handleReorderKeypoints(
                        moduleIndex,
                        data.keypointIndex,
                        keypointIndex
                      );
                    }
                    setDraggedKeypoint(null);
                    setDragOverIndex(null);
                  }}
                  onDragEnd={() => {
                    setDraggedKeypoint(null);
                    setDragOverIndex(null);
                  }}
                >
                  {/* Drop indicator line - shows when hovering over a valid drop target */}
                  {showDropLine && (
                    <div className="absolute -top-0.5 left-0 right-0 h-0.5 bg-primary rounded-full transition-all duration-200 ease-in-out" />
                  )}

                  <div
                    className="cursor-grab active:cursor-grabbing shrink-0 p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                    title="Drag to reorder"
                  >
                    <GripVertical className="w-4 h-4" />
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <input
                    type="text"
                    value={keypoint}
                    onChange={(e) =>
                      handleKeypointChange(
                        moduleIndex,
                        keypointIndex,
                        e.target.value
                      )
                    }
                    placeholder={`Key point ${keypointIndex + 1}`}
                    className="flex-1 min-w-0 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveKeypoint(moduleIndex, keypointIndex)
                    }
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors shrink-0"
                    title="Remove key point"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}

            <button
              type="button"
              onClick={() => handleAddKeypoint(moduleIndex)}
              className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors mt-2"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Key Point
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAddModule}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-primary hover:text-primary transition-colors duration-200"
      >
        <Plus className="w-4 h-4" />
        Add Module
      </button>
    </div>
  );
};

export default CurriculumEditor;
