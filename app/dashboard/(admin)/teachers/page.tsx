"use client";
import Loader from "@/components/ui/Loader";
import CustomTable from "@/components/ui/Table";
import { useAuth } from "@/hooks/useAuth";
import {
  useGetAdminTeachersQuery,
  useSuspendOrActivateTeacherMutation,
  useTopStatusToggleMutation,
} from "@/src/redux/api/admin/teachersApi";
import { Column } from "@/types/table";
import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  UserRoundPlus,
  UserRound,
  UserRoundPen,
  Ban as BanIcon,
  Eye,
  CircleCheckBig,
  CircleStar,
  CircleX,
} from "lucide-react";
import SearchBar from "@/components/ui/SearchBar";
import MyButton from "@/components/ui/MyButton";
import ActionButton from "@/components/ui/ActionButton";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import AddTeacherModal from "./_components/AddTeacherModal";
import UpdateTeacherModal from "./_components/UpdateTeacherModal";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const TeachersManagement = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  //  Get initial values from URL
  const urlPage = Number(searchParams.get("page")) || 1;
  const urlSearch = searchParams.get("search") || "";

  // State for pagination and filters
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState(urlPage);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  // Confirmation modal state for suspend/activate
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    type: "suspend" | "activate";
    userId: number | null;
    userName: string;
  }>({
    isOpen: false,
    type: "suspend",
    userId: null,
    userName: "",
  });

  // Confirmation modal state for top status toggle
  const [topConfirmation, setTopConfirmation] = useState<{
    isOpen: boolean;
    userId: number | null;
    userName: string;
    action: "add" | "remove";
  }>({
    isOpen: false,
    userId: null,
    userName: "",
    action: "add",
  });

  const [topStatusToggle] = useTopStatusToggleMutation();
  const isInitialLoad = useRef(true);

  //  Update URL when filters change (skip on initial load)
  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    const params = new URLSearchParams();
    if (currentPage > 1) params.set("page", String(currentPage));
    if (searchTerm) params.set("search", searchTerm);

    const url = params.toString()
      ? `/dashboard/teachers?${params.toString()}`
      : "/dashboard/teachers";

    router.replace(url, { scroll: false });
  }, [currentPage, searchTerm, router]);

  // Fetch teachers with pagination and filters
  const {
    data: apiResponse,
    isLoading,
    refetch,
  } = useGetAdminTeachersQuery({
    page: currentPage,
    per_page: itemsPerPage,
    search: searchTerm,
    skip: !isAuthenticated,
  });

  // Use teacher mutation
  const [suspendOrActivateTeacher] = useSuspendOrActivateTeacherMutation();

  // Extract data from API response
  const teachers = apiResponse?.data || [];
  const pagination = apiResponse?.pagination;

  // Get pagination info from API
  const totalTeachers = pagination?.total || 0;

  //  Handle search with page reset
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, []);

  //  Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    document.getElementById("teacher-table-container")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  //  Clear search
  const handleClearSearch = useCallback(() => {
    setSearchTerm("");
    setCurrentPage(1);
  }, []);

  // Open top status confirmation modal
  const handleTopStatusClick = (
    teacherId: number,
    teacherName: string,
    currentStatus: number,
  ) => {
    setTopConfirmation({
      isOpen: true,
      userId: teacherId,
      userName: teacherName,
      action: currentStatus === 0 ? "add" : "remove",
    });
  };

  const columns: Column<any>[] = [
    {
      header: "Teacher",
      render: (_, row) => (
        <div className="flex justify-center">
          {row?.image_url ? (
            <img
              className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-primary/20"
              src={row?.image_url}
              alt={row?.name}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://ui-avatars.com/api/?name=" +
                  row?.name +
                  "&size=200&background=F4EAFC&color=000&bold=true&length=2";
              }}
            />
          ) : (
            <div className="w-10 h-10 rounded-full flex items-center justify-center ring-2 ring-primary/20">
              <UserRound size={24} className="text-gray-400" />
            </div>
          )}
        </div>
      ),
      cellClassName: "px-4 py-3 text-center",
    },
    {
      header: "Name",
      headerClassName: "text-left",
      accessor: "name",
      cellClassName: "px-4 py-3 text-left font-medium whitespace-nowrap",
    },
    {
      header: "Email",
      headerClassName: "text-left",
      accessor: "email",
      cellClassName: "px-4 py-3 text-left",
    },
    {
      header: "Mobile",
      accessor: "mobile",
      cellClassName: "px-4 py-3 text-center",
    },
    {
      header: "Expertise",
      accessor: "expertise",
      cellClassName: "px-4 py-3 text-center",
      render: (value) => value || "—",
    },
    {
      header: "Qualification",
      accessor: "qualification",
      cellClassName: "px-4 py-3 text-center",
      render: (value) => value || "—",
    },
    {
      header: "Experience",
      accessor: "years_of_exp",
      cellClassName: "px-4 py-3 text-center",
      render: (value) => (value ? `${value} years` : "—"),
    },
    {
      header: "Status",
      accessor: "suspend_status",
      cellClassName: "px-4 py-3 text-center",
      render: (value) => (
        <span
          className={`
            inline-block px-2 py-1 rounded-full text-xs font-semibold
            ${
              value === 0
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }
          `}
        >
          {value === 0 ? "Active" : "Suspended"}
        </span>
      ),
    },
    {
      header: "Actions",
      render: (_, row) => (
        <div className="flex justify-center gap-2 overflow-visible py-2">
          <Link href={`/dashboard/teachers/${row.id}`}>
            <ActionButton variant="view" icon={Eye} label="View Details" />
          </Link>
          <ActionButton
            variant="edit"
            icon={UserRoundPen}
            onClick={() => {
              setSelectedUserId(Number(row.id));
              setIsUpdateModalOpen(true);
            }}
            label="Edit Teacher"
          />
          {row.is_top === 0 ? (
            <ActionButton
              variant="success"
              icon={CircleStar}
              onClick={() => handleTopStatusClick(row.id, row.name, row.is_top)}
              label="Add To Top Tutor"
            />
          ) : (
            <ActionButton
              variant="delete"
              icon={CircleX}
              onClick={() => handleTopStatusClick(row.id, row.name, row.is_top)}
              label="Remove From Top Tutor"
            />
          )}
          {row.suspend_status === 0 ? (
            <ActionButton
              variant="delete"
              icon={BanIcon}
              onClick={() => {
                setConfirmationModal({
                  isOpen: true,
                  type: "suspend",
                  userId: Number(row.id),
                  userName: row.name,
                });
              }}
              label="Suspend Teacher"
            />
          ) : (
            <ActionButton
              variant="success"
              icon={CircleCheckBig}
              onClick={() => {
                setConfirmationModal({
                  isOpen: true,
                  type: "activate",
                  userId: Number(row.id),
                  userName: row.name,
                });
              }}
              label="Activate Teacher"
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
    <div className="space-y-6" id="teacher-table-container">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 ">
            Teacher Management
          </h1>
          <p className="text-sm text-gray-500  mt-1">
            Manage all teachers, their expertise, and status
          </p>
        </div>
        <MyButton onClick={() => setIsAddModalOpen(true)}>
          <UserRoundPlus className="w-4 h-4" />
          <span>Add New Teacher</span>
        </MyButton>
      </div>

      {/* Results Summary */}
      <div className="flex flex-col-reverse md:flex-row gap-4 items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing {teachers.length} of {totalTeachers} teachers
          {searchTerm && (
            <span className="ml-2">
              matching <span className="font-medium">"{searchTerm}"</span>
            </span>
          )}
        </p>

        {/* Search and Filter Bar */}
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search by name, email, or phone..."
          initialValue={searchTerm}
          debounceDelay={500}
          className="w-5/6 md:w-2/4 xl:w-2/6 max-w-92"
          size="md"
          variant="default"
          showClearButton={true}
        />
      </div>

      {/* Table */}
      <div className="relative overflow-visible">
        <CustomTable
          data={teachers}
          columns={columns}
          showIndex={true}
          indexLabel="SN"
          isLoading={isLoading}
          emptyMessage={
            searchTerm
              ? `No teachers found matching "${searchTerm}"`
              : "No teachers found"
          }
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Add Teacher Modal */}
      <AddTeacherModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          refetch();
          setCurrentPage(1);
        }}
      />

      {/* Update Teacher Modal */}
      {isUpdateModalOpen && selectedUserId && (
        <UpdateTeacherModal
          id={selectedUserId}
          onClose={() => {
            setIsUpdateModalOpen(false);
            setSelectedUserId(null);
          }}
          onUpdate={() => {
            refetch();
            setIsUpdateModalOpen(false);
            setSelectedUserId(null);
          }}
        />
      )}

      {/* Confirmation Modal for Suspend/Activate */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() =>
          setConfirmationModal({
            isOpen: false,
            type: "suspend",
            userId: null,
            userName: "",
          })
        }
        type={confirmationModal.type}
        userId={confirmationModal.userId}
        userName={confirmationModal.userName}
        mutation={suspendOrActivateTeacher}
        entityType="teacher"
        onSuccess={() => {
          refetch();
        }}
      />

      {/* Confirmation Modal for Top Status Toggle */}
      <ConfirmationModal
        isOpen={topConfirmation.isOpen}
        onClose={() =>
          setTopConfirmation({
            isOpen: false,
            userId: null,
            userName: "",
            action: "add",
          })
        }
        type="top"
        entityType="teacher"
        userId={topConfirmation.userId}
        mutation={topStatusToggle}
        userName={topConfirmation.userName}
        title={
          topConfirmation.action === "add"
            ? "Add to Top Tutors"
            : "Remove from Top Tutors"
        }
        message={
          topConfirmation.action === "add"
            ? `Are you sure you want to add "${topConfirmation.userName}" as a Top Tutor?`
            : `Are you sure you want to remove "${topConfirmation.userName}" from Top Tutors?`
        }
        successMessage={
          topConfirmation.action === "add"
            ? `${topConfirmation.userName} added as Top Tutor successfully!`
            : `${topConfirmation.userName} removed from Top Tutors.`
        }
        onSuccess={() => {
          refetch();
          setTopConfirmation({
            isOpen: false,
            userId: null,
            userName: "",
            action: "add",
          });
        }}
      />
    </div>
  );
};

export default TeachersManagement;
