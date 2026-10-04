import React from "react";
import { format } from "date-fns";
import { CalendarIcon, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { CustomCalendar } from "@/components/ui/CustomCalendar";

interface BatchDetailsFormProps {
  batchName: string;
  totalSeat: number | "";
  startDate: Date | undefined;
  endDate: Date | undefined;
  zoomLink: string;
  status: string;
  activeStatus: boolean;
  onBatchNameChange: (value: string) => void;
  onTotalSeatChange: (value: number | undefined) => void;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  onZoomLinkChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onActiveStatusChange: (value: boolean) => void;
}

const inputClassName =
  "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 bg-white text-gray-900";
const buttonClassName =
  "w-full justify-between px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 hover:bg-gray-50 transition-all duration-200";

export const BatchDetailsForm: React.FC<BatchDetailsFormProps> = ({
  batchName,
  totalSeat,
  startDate,
  endDate,
  zoomLink,
  status,
  activeStatus,
  onBatchNameChange,
  onTotalSeatChange,
  onStartDateChange,
  onEndDateChange,
  onZoomLinkChange,
  onStatusChange,
  onActiveStatusChange,
}) => {
  const [isStartDateOpen, setIsStartDateOpen] = React.useState(false);
  const [isEndDateOpen, setIsEndDateOpen] = React.useState(false);

  const statusOptions = [
    { value: "upcoming", label: "Upcoming" },
    { value: "ongoing", label: "Ongoing" },
    { value: "completed", label: "Completed" },
  ];

  const getStatusLabel = (value: string) => {
    return statusOptions.find((option) => option.value === value)?.label || "Select status";
  };

  const getTodayDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 space-y-4">
      <h2 className="text-lg font-semibold">Batch Details</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Batch Name *
          </label>
          <input
            type="text"
            value={batchName}
            onChange={(e) => onBatchNameChange(e.target.value)}
            className={inputClassName}
            placeholder="Enter batch name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Seats *
          </label>
          <input
            type="number"
            value={totalSeat}
            onChange={(e) => onTotalSeatChange(Number(e.target.value))}
            className={inputClassName}
            placeholder="Enter total seats"
            required
            min={1}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date *
          </label>
          <Popover open={isStartDateOpen} onOpenChange={setIsStartDateOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className={buttonClassName}>
                <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                <span className="flex-1 text-left truncate">
                  {startDate ? format(startDate, "PPP") : "Select start date"}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start" sideOffset={5}>
              <CustomCalendar
                selected={startDate}
                onSelect={(date) => {
                  onStartDateChange(date);
                  setIsStartDateOpen(false);
                }}
                disabled={(date) => date < getTodayDate()}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date *
          </label>
          <Popover open={isEndDateOpen} onOpenChange={setIsEndDateOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className={buttonClassName}>
                <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                <span className="flex-1 text-left truncate">
                  {endDate ? format(endDate, "PPP") : "Select end date"}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start" sideOffset={5}>
              <CustomCalendar
                selected={endDate}
                onSelect={(date) => {
                  onEndDateChange(date);
                  setIsEndDateOpen(false);
                }}
                disabled={(date) => {
                  const today = getTodayDate();
                  if (date < today) return true;
                  if (startDate && date < startDate) return true;
                  return false;
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Zoom Link
          </label>
          <input
            type="url"
            value={zoomLink}
            onChange={(e) => onZoomLinkChange(e.target.value)}
            className={inputClassName}
            placeholder="https://zoom.us/..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status *
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className={buttonClassName}>
                <span className="flex-1 text-left truncate">
                  {getStatusLabel(status)}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full min-w-[200px]">
              <DropdownMenuLabel>Select Status</DropdownMenuLabel>
              <DropdownMenuGroup>
                {statusOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => onStatusChange(option.value)}
                    className="cursor-pointer"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{option.label}</p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Active Status
          </label>
          <div className="flex items-center gap-3 p-2 border border-gray-300 rounded-lg bg-white">
            <Switch
              checked={activeStatus}
              onCheckedChange={onActiveStatusChange}
              className="data-[state=checked]:bg-primary"
            />
            <span className="text-sm text-gray-600">
              {activeStatus ? "Active" : "Inactive"}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Inactive batches will not be visible to students
          </p>
        </div>
      </div>
    </div>
  );
};