import React from "react";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MyButton from "@/components/ui/MyButton";
import { ClassItem, TeacherItem } from "@/types/batches";

interface ClassTeacherSelectionProps {
  selectedClass: ClassItem | null;
  selectedTeacher: TeacherItem | null;
  classList: ClassItem[];
  teachersList: TeacherItem[];
  onClassSelect: (cls: ClassItem) => void;
  onTeacherSelect: (teacher: TeacherItem) => void;
  onGetAvailability: () => void;
  onClearSchedules?: () => void;
  isLoading: boolean;
  isDisabled: boolean;
}

const buttonClassName =
  "w-full justify-between px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 hover:bg-gray-50 transition-all duration-200";

export const ClassTeacherSelection: React.FC<ClassTeacherSelectionProps> = ({
  selectedClass,
  selectedTeacher,
  classList,
  teachersList,
  onClassSelect,
  onTeacherSelect,
  onGetAvailability,
  onClearSchedules,
  isLoading,
  isDisabled,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 space-y-4">
      <h2 className="text-lg font-semibold">Assign Class & Teacher</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Class *
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className={buttonClassName}>
                <span className="flex items-center gap-2 truncate flex-1 text-left">
                  {selectedClass ? selectedClass.title : "Select a class"}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full min-w-70 max-w-md">
              <DropdownMenuLabel>Available Classes</DropdownMenuLabel>
              <DropdownMenuGroup>
                {classList.map((cls) => (
                  <DropdownMenuItem
                    key={cls.id}
                    onClick={() => onClassSelect(cls)}
                    className="cursor-pointer"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{cls.title}</p>
                      <p className="text-xs text-gray-500">ID: {cls.id}</p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teacher *
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className={buttonClassName}>
                <span className="flex items-center gap-2 truncate flex-1 text-left">
                  {selectedTeacher ? selectedTeacher.name : "Select a teacher"}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full min-w-[280px] max-w-md">
              <DropdownMenuLabel>Available Teachers</DropdownMenuLabel>
              <DropdownMenuGroup>
                {teachersList.map((teacher) => (
                  <DropdownMenuItem
                    key={teacher.id}
                    onClick={() => onTeacherSelect(teacher)}
                    className="cursor-pointer"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{teacher.name}</p>
                      <p className="text-xs text-gray-500">
                        {teacher.expertise || "Teacher"} • ID: {teacher.id}
                      </p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <MyButton
          type="button"
          onClick={onGetAvailability}
          disabled={isLoading || isDisabled}
        >
          {isLoading ? "Fetching..." : "Get Teacher Availability"}
        </MyButton>
      </div>
    </div>
  );
};
