"use client";
import Loader from "@/components/ui/Loader";
import CustomTable from "@/components/ui/Table";
import { useAuth } from "@/hooks/useAuth";
import { Column } from "@/types/table";
import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  Download,
  Plus,
  Eye,
  Edit,
  BookOpen,
  Clock,
  Calendar,
  Ban as BanIcon,
  CircleCheckBig,
  Pen,
} from "lucide-react";
import SearchBar from "@/components/ui/SearchBar";
import MyButton from "@/components/ui/MyButton";
import ActionButton from "@/components/ui/ActionButton";
import {
  useGetClassesForAdminQuery,
  useUpdateClassStatusForAdminMutation,
} from "@/src/redux/api/admin/adminClassApi";
import { useRouter, useSearchParams } from "next/navigation";
import AddClassModal from "./_components/AddClassModal";
import UpdateClassModal from "./_components/UpdateClassModal";
import ActionConfirmationModal, {
  ActionType,
} from "@/components/modals/ActionConfirmationModal";

const ClassesManagement = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlPage = Number(searchParams.get("page")) || 1;
  const urlSearch = searchParams.get("search") || "";

  const [currentPage, setCurrentPage] = useState(urlPage);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  // State for action modal
  const [actionModal, setActionModal] = useState<{
    isOpen: boolean;
    actionType: ActionType;
    id: number | null;
    name: string;
  }>({
    isOpen: false,
    actionType: "deactivate",
    id: null,
    name: "",
  });

  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    const params = new URLSearchParams();
    if (currentPage > 1) params.set("page", String(currentPage));
    if (searchTerm) params.set("search", searchTerm);

    const url = params.toString()
      ? `/dashboard/classes?${params.toString()}`
      : "/dashboard/classes";

    router.replace(url, { scroll: false });
  }, [currentPage, searchTerm, router]);

  const {
    data: apiResponse,
    isLoading,
    refetch,
  } = useGetClassesForAdminQuery({
    page: currentPage,
    per_page: itemsPerPage,
    search: searchTerm,
    skip: !isAuthenticated,
  });

  const [updateClassStatus] = useUpdateClassStatusForAdminMutation();

  const classes = apiResponse?.data || [];
  const pagination = apiResponse?.pagination;
  const totalClasses = pagination?.total || 0;

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    document.getElementById("class-table-container")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchTerm("");
    setCurrentPage(1);
  }, []);

  const columns: Column<any>[] = [
    {
      header: "Class",
      render: (_, row) => (
        <div className="flex justify-center">
          {row?.image_url ? (
            <img
              className="w-12 h-12 rounded-lg object-cover shrink-0 ring-2 ring-primary/20"
              src={row?.image_url}
              alt={row?.title}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://ui-avatars.com/api/?name=" +
                  row?.title +
                  "&background=9b35e3&color=fff&size=200&bold=true";
              }}
            />
          ) : (
            <div className="w-12 h-12 rounded-lg flex items-center justify-center ring-2 ring-primary/20 bg-primary/10">
              <BookOpen size={24} className="text-primary" />
            </div>
          )}
        </div>
      ),
      cellClassName: "px-4 py-3 text-center",
    },
    {
      header: "Title",
      headerClassName: "text-left",
      accessor: "title",
      cellClassName: "px-4 py-3 text-left font-medium whitespace-nowrap",
    },
    {
      header: "Description",
      headerClassName: "text-left",
      accessor: "description",
      cellClassName: "px-4 py-3 text-left max-w-xs",
      render: (value) => (
        <p className="truncate max-w-50" title={value}>
          {value || "—"}
        </p>
      ),
    },
    {
      header: "Price",
      accessor: "price",
      cellClassName: "px-4 py-3 text-center font-medium",
      render: (value) => (
        <span className="text-green-600 dark:text-green-400">
          ${parseFloat(value || 0).toFixed(2)}
        </span>
      ),
    },
    {
      header: "Duration",
      accessor: "duration_in_days",
      cellClassName: "px-4 py-3 text-center",
      render: (value) => (
        <div className="flex items-center justify-center gap-1 whitespace-nowrap">
          <Calendar className="w-3 h-3 text-gray-400" />
          <span>{value} days</span>
        </div>
      ),
    },
    {
      header: "Total Classes",
      accessor: "total_classes",
      cellClassName: "px-4 py-3 text-center",
      render: (value) => (
        <div className="flex items-center justify-center gap-1">
          <Clock className="w-3 h-3 text-gray-400" />
          <span>{value}</span>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "is_active",
      cellClassName: "px-4 py-3 text-center",
      render: (value) => (
        <span
          className={`
            inline-block px-2 py-1 rounded-full text-xs font-semibold
            ${
              value === 1
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }
          `}
        >
          {value === 1 ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "Actions",
      render: (_, row) => (
        <div className="flex justify-center gap-2 overflow-visible py-2">
          <ActionButton
            variant="edit"
            icon={Pen}
            onClick={() => {
              setSelectedClassId(Number(row.id));
              setIsUpdateModalOpen(true);
            }}
            label="Edit Class"
          />
          {row.is_active === 1 ? (
            <ActionButton
              variant="delete"
              icon={BanIcon}
              onClick={() => {
                setActionModal({
                  isOpen: true,
                  actionType: "deactivate",
                  id: Number(row.id),
                  name: row.title,
                });
              }}
              label="Deactivate Class"
            />
          ) : (
            <ActionButton
              variant="success"
              icon={CircleCheckBig}
              onClick={() => {
                setActionModal({
                  isOpen: true,
                  actionType: "activate",
                  id: Number(row.id),
                  name: row.title,
                });
              }}
              label="Activate Class"
            />
          )}
        </div>
      ),
      cellClassName: "px-4 py-3 text-center overflow-visible relative",
    },
  ];

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-155px)] w-full flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6" id="class-table-container">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Classes Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage all classes, their schedules, and details
          </p>
        </div>
        <MyButton onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4" />
          <span>Add New Class</span>
        </MyButton>
      </div>

      {/* Results Summary */}
      <div className="flex flex-col-reverse md:flex-row gap-4 items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing {classes.length} of {totalClasses} classes
          {searchTerm && (
            <span className="ml-2">
              matching <span className="font-medium">"{searchTerm}"</span>
            </span>
          )}
        </p>
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search by title or description..."
          className="w-5/6 md:w-2/4 xl:w-2/6 max-w-92"
          initialValue={searchTerm}
          debounceDelay={500}
          size="md"
          variant="default"
          showClearButton={true}
        />
      </div>

      {/* Table */}
      <div className="relative overflow-visible">
        <CustomTable
          data={classes}
          columns={columns}
          showIndex={true}
          indexLabel="SN"
          isLoading={isLoading}
          emptyMessage={
            searchTerm
              ? `No classes found matching "${searchTerm}"`
              : "No classes found"
          }
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Add Class Modal */}
      <AddClassModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          refetch();
          setCurrentPage(1);
        }}
      />

      {/* Update Class Modal */}
      {isUpdateModalOpen && selectedClassId && (
        <UpdateClassModal
          id={selectedClassId}
          onClose={() => {
            setIsUpdateModalOpen(false);
            setSelectedClassId(null);
          }}
          onUpdate={() => {
            refetch();
            setIsUpdateModalOpen(false);
            setSelectedClassId(null);
          }}
        />
      )}
      <ActionConfirmationModal
        isOpen={actionModal.isOpen}
        onClose={() =>
          setActionModal({
            isOpen: false,
            actionType: "deactivate",
            id: null,
            name: "",
          })
        }
        id={actionModal.id}
        name={actionModal.name}
        mutation={updateClassStatus}
        actionType={actionModal.actionType}
        entityName="Class"
        onSuccess={() => refetch()}
      />
    </div>
  );
};

export default ClassesManagement;
