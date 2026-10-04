"use client";
import React, { useState, useEffect, useCallback } from "react";
import Loader from "@/components/ui/Loader";
import CustomTable from "@/components/ui/Table";
import SearchBar from "@/components/ui/SearchBar";
import { useGetAllClassesForBatchQuery } from "@/src/redux/api/admin/adminBatchesApi";
import { useLazyGetBatchesByClassForAdminQuery } from "@/src/redux/api/admin/enrollmentsApi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronsUpDown,
  Bell,
  Mail,
  MessageCircle,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  RefreshCw,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Column } from "@/types/table";
import { format } from "date-fns";
import { useGetNotificationsForAdminQuery } from "@/src/redux/api/admin/notificationsApi";
import { getMessageType } from "@/utils/helper";

// Define types
interface ClassOption {
  value: number;
  label: string;
}

interface BatchOption {
  value: number;
  label: string;
}

interface NotificationLog {
  id: number;
  user_id: number;
  batch_id: number;
  type: "email" | "whatsapp";
  message_type: "class_reminder" | "enrollment_completed";
  message: string;
  status: "sent" | "failed" | "pending";
  sent_at: string;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  batch: {
    id: number;
    name: string;
  };
}

const NotificationLogs = () => {
  const [selectedClass, setSelectedClass] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [selectedMessageType, setSelectedMessageType] = useState<string>("");
  const [filters, setFilters] = useState({
    page: 1,
    per_page: 10,
  });

  const { data: classesData, isLoading: classesLoading } =
    useGetAllClassesForBatchQuery(null);
  const [getBatchesByClass, { data: batchesData, isLoading: batchesLoading }] =
    useLazyGetBatchesByClassForAdminQuery();
  const {
    data: notificationsResponse,
    isLoading: notificationsLoading,
    refetch,
  } = useGetNotificationsForAdminQuery(
    {
      page: filters.page,
      per_page: filters.per_page,
      message_type: selectedMessageType || undefined,
      batch_id: selectedBatch?.id || undefined,
    },
    {
      skip: false,
    },
  );

  // Extract data from responses
  const classes = classesData?.data || [];
  const batches = batchesData?.data || [];
  const notifications = notificationsResponse?.data || [];
  const pagination = notificationsResponse?.pagination;

  // Map classes to options format
  const classOptions: ClassOption[] = classes.map((cls: any) => ({
    value: cls.id,
    label: cls.title || cls.name,
  }));

  // Map batches to options format
  const batchOptions: BatchOption[] = batches.map((batch: any) => ({
    value: batch.id,
    label: batch.name,
  }));

  // Message type options
  const messageTypeOptions = [
    { value: "", label: "All Types" },
    { value: "class_reminder", label: "Class Reminder" },
    { value: "enrollment_confirmation", label: "Enrollment Confirmation" },
  ];

  const handleClassSelect = (classItem: ClassOption) => {
    setSelectedClass({
      id: classItem.value,
      name: classItem.label,
    });
    setSelectedBatch(null);
    setFilters({ page: 1, per_page: 10 });
    getBatchesByClass({ class_id: classItem.value });
  };

  const handleBatchSelect = (batchItem: BatchOption) => {
    setSelectedBatch({
      id: batchItem.value,
      name: batchItem.label,
    });
    setFilters({ page: 1, per_page: 10 });
  };

  const handleMessageTypeChange = (type: string) => {
    setSelectedMessageType(type);
    setFilters({ page: 1, per_page: 10 });
  };

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({
      ...prev,
      page: page,
    }));
  }, []);

  const handleRefresh = () => {
    refetch();
  };

  const handleClearFilters = () => {
    setSelectedClass(null);
    setSelectedBatch(null);
    setSelectedMessageType("");
    setFilters({ page: 1, per_page: 10 });
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { color: string; label: string; icon: any }
    > = {
      sent: {
        color: "text-green-600 bg-green-100",
        label: "Sent",
        icon: CheckCircle,
      },
      failed: {
        color: "text-red-600 bg-red-100",
        label: "Failed",
        icon: XCircle,
      },
      pending: {
        color: "text-yellow-600 bg-yellow-100",
        label: "Pending",
        icon: Clock,
      },
    };
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };
  

  // Get type badge
  const getTypeBadge = (type: string) => {
    const typeConfig: Record<
      string,
      { color: string; label: string; icon: any }
    > = {
      email: {
        color: "text-blue-600 bg-blue-100",
        label: "Email",
        icon: Mail,
      },
      whatsapp: {
        color: "text-green-600 bg-green-100",
        label: "WhatsApp",
        icon: MessageCircle,
      },
    };
    const config = typeConfig[type] || typeConfig.email;
    const Icon = config.icon;
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  // Get message type badge
  const getMessageTypeBadge = (messageType: string) => {
    const typeConfig: Record<string, { color: string; label: string }> = {
      class_reminder: {
        color: "text-purple-600 bg-purple-100",
        label: "Class Reminder",
      },
      enrollment_completed: {
        color: "text-indigo-600 bg-indigo-100",
        label: "Enrollment Completed",
      },
    };
    const config = typeConfig[messageType] || {
      color: "text-gray-600 bg-gray-100",
      label: messageType,
    };
    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const columns: Column<NotificationLog>[] = [
    {
      header: "User",
      headerClassName: "text-left",
      cellClassName: "px-4 py-3 text-left whitespace-nowrap",
      render: (_: any, row: NotificationLog) => (
        <div>
          <p className="font-medium text-gray-900">{row.user?.name || "—"}</p>
          <p className="text-xs text-gray-500">{row.user?.email}</p>
        </div>
      ),
    },
    {
      header: "Batch",
      headerClassName: "text-left",
      cellClassName: "px-4 py-3 whitespace-nowrap text-left",
      render: (_: any, row: NotificationLog) => (
        <div>
          <p className="font-medium text-gray-900">{row.batch?.name || "—"}</p>
        </div>
      ),
    },
    {
      header: "Type",
      headerClassName: "text-center",
      cellClassName: "px-4 py-3 text-center",
      render: (_: any, row: NotificationLog) => getTypeBadge(row.type),
    },
    {
      header: "Message Type",
      headerClassName: "text-center",
    cellClassName: "px-4 py-3 text-center whitespace-nowrap",
      render: (_: any, row: NotificationLog) =>
        getMessageTypeBadge(getMessageType(row.message_type)),
    },
    {
      header: "Message",
      headerClassName: "text-left",
      cellClassName: "px-4 py-3 text-left max-w-md",
      render: (_: any, row: NotificationLog) => (
        <p className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-md">
          {row.message || "—"}
        </p>
      ),
    },
    {
      header: "Status",
      headerClassName: "text-center",
      cellClassName: "px-4 py-3 text-center",
      render: (_: any, row: NotificationLog) => getStatusBadge(row.status),
    },
    {
      header: "Sent At",
      headerClassName: "text-center",
      cellClassName: "px-4 py-3 text-center whitespace-nowrap",
      render: (_: any, row: NotificationLog) => (
        <div className="flex items-center justify-center gap-1">
          <Clock className="w-3 h-3 text-gray-400" />
          <span className="text-sm">
            {row.sent_at ? format(row.sent_at, "dd MMM yyyy, hh:mm a") : "—"}
          </span>
        </div>
      ),
    },
  ];

  // Show loading state
  if (classesLoading) {
    return (
      <div className="h-[calc(100vh-155px)] w-full flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Notification Logs
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Track all notification activities including emails and WhatsApp
            messages
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          className="gap-2"
          disabled={notificationsLoading}
        >
          <RefreshCw
            className={`w-4 h-4 ${notificationsLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Filters Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Class Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filter by Class
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between px-4 py-2.5 h-auto"
                >
                  <span className="flex-1 text-left truncate">
                    {selectedClass ? selectedClass.name : "All Classes"}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-50 max-h-75 overflow-y-auto">
                <DropdownMenuLabel>Select Class</DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedClass(null);
                      setSelectedBatch(null);
                    }}
                    className="cursor-pointer px-4 py-2"
                  >
                    <div className="flex-1">
                      <p className="font-medium">All Classes</p>
                    </div>
                  </DropdownMenuItem>
                  {classOptions.map((option: ClassOption) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => handleClassSelect(option)}
                      className="cursor-pointer px-4 py-2"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{option.label}</p>
                      </div>
                    </DropdownMenuItem>
                  ))}
                  {classOptions.length === 0 && (
                    <DropdownMenuItem disabled>
                      <div className="flex-1">
                        <p className="font-medium text-gray-400">
                          No classes found
                        </p>
                      </div>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Batch Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filter by Batch
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between px-4 py-2.5 h-auto"
                  disabled={!selectedClass && batches.length === 0}
                >
                  <span className="flex-1 text-left truncate">
                    {batchesLoading
                      ? "Loading batches..."
                      : selectedBatch
                        ? selectedBatch.name
                        : !selectedClass
                          ? "Select a class first"
                          : "All Batches"}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-50 max-h-75 overflow-y-auto">
                <DropdownMenuLabel>Select Batch</DropdownMenuLabel>
                <DropdownMenuGroup>
                  {selectedClass && (
                    <DropdownMenuItem
                      onClick={() => setSelectedBatch(null)}
                      className="cursor-pointer px-4 py-2"
                    >
                      <div className="flex-1">
                        <p className="font-medium">All Batches</p>
                      </div>
                    </DropdownMenuItem>
                  )}
                  {batchOptions.map((option: BatchOption) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => handleBatchSelect(option)}
                      className="cursor-pointer px-4 py-2"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{option.label}</p>
                      </div>
                    </DropdownMenuItem>
                  ))}
                  {!selectedClass && batchOptions.length === 0 && (
                    <DropdownMenuItem disabled>
                      <div className="flex-1">
                        <p className="font-medium text-gray-400">
                          Please select a class first
                        </p>
                      </div>
                    </DropdownMenuItem>
                  )}
                  {selectedClass &&
                    batchOptions.length === 0 &&
                    !batchesLoading && (
                      <DropdownMenuItem disabled>
                        <div className="flex-1">
                          <p className="font-medium text-gray-400">
                            No batches found for this class
                          </p>
                        </div>
                      </DropdownMenuItem>
                    )}
                  {batchesLoading && (
                    <DropdownMenuItem disabled>
                      <div className="flex-1">
                        <p className="font-medium text-gray-400">
                          Loading batches...
                        </p>
                      </div>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Message Type Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filter by Message Type
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between px-4 py-2.5 h-auto"
                >
                  <span className="flex-1 text-left truncate">
                    {messageTypeOptions.find(
                      (opt) => opt.value === selectedMessageType,
                    )?.label || "All Types"}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-50">
                <DropdownMenuLabel>Select Message Type</DropdownMenuLabel>
                <DropdownMenuGroup>
                  {messageTypeOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => handleMessageTypeChange(option.value)}
                      className="cursor-pointer px-4 py-2"
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
        </div>

        {/* Clear Filters Button */}
        {(selectedClass || selectedBatch || selectedMessageType) && (
          <div className="mt-4 flex justify-end">
            <Button
              onClick={handleClearFilters}
              variant="ghost"
              size="sm"
              className="gap-2 text-gray-500"
            >
              <Filter className="w-4 h-4" />
              Clear All Filters
            </Button>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-gray-400" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing {notifications?.length || 0} of {pagination?.total || 0}{" "}
              notifications
            </p>
          </div>
          {selectedBatch && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
              <Package className="w-3 h-3" />
              Batch: {selectedBatch.name}
            </div>
          )}
          {selectedMessageType && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
              {messageTypeOptions.find(
                (opt) => opt.value === selectedMessageType,
              )?.label || selectedMessageType}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="relative overflow-visible">
        <CustomTable
          data={notifications}
          columns={columns}
          showIndex={true}
          indexLabel="SN"
          isLoading={notificationsLoading}
          emptyMessage={
            selectedBatch || selectedMessageType
              ? "No notifications found with the selected filters"
              : "No notifications found"
          }
          pagination={
            pagination
              ? {
                  current_page: pagination.current_page || filters.page,
                  per_page: pagination.per_page || filters.per_page,
                  total: pagination.total || 0,
                  last_page: pagination.last_page || 1,
                }
              : undefined
          }
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default NotificationLogs;
