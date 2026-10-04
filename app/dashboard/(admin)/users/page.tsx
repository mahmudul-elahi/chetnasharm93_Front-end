"use client";
import Loader from "@/components/ui/Loader";
import CustomTable from "@/components/ui/Table";
import { useAuth } from "@/hooks/useAuth";
import {
  useDeleteUserMutation,
  useGetAdminUsersQuery,
  useSuspendOrActivateUserMutation,
} from "@/src/redux/api/admin/users";
import { Column } from "@/types/table";
import { User } from "@/types/user";
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  ChevronDown,
  UserRoundPlus,
  UserRound,
  UserRoundPen,
  BanIcon,
  CircleCheckBig,
  UsersRound,
  Trash,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/ui/SearchBar";
import MyButton from "@/components/ui/MyButton";
import AddUserModal from "./components/AddUserModal";
import UsersStatesCards from "./components/UsersStatesCards";
import UpdateUserModal from "./components/UpdateUserModal";
import ActionButton from "@/components/ui/ActionButton";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import { useRouter, useSearchParams } from "next/navigation";
import ActionConfirmationModal, {
  ActionType,
} from "@/components/modals/ActionConfirmationModal";

const UserManagement = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlPage = Number(searchParams.get("page")) || 1;
  const urlSearch = searchParams.get("search") || "";
  const urlRole = searchParams.get("role") || "all";

  // State for pagination and filters
  const [currentPage, setCurrentPage] = useState(urlPage);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [roleFilter, setRoleFilter] = useState(urlRole);
  const [showFilters, setShowFilters] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [actionModal, setActionModal] = useState<{
    isOpen: boolean;
    actionType: ActionType;
    id: number | null;
    mutation: any;
    name: string;
    buttonText: string;
    entityName: string;
  }>({
    isOpen: false,
    actionType: "delete",
    id: null,
    mutation: null,
    name: "",
    buttonText: "",
    entityName: "",
  });
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

  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    const params = new URLSearchParams();
    if (currentPage > 1) params.set("page", String(currentPage));
    if (searchTerm) params.set("search", searchTerm);
    if (roleFilter !== "all") params.set("role", roleFilter);

    const url = params.toString()
      ? `/dashboard/users?${params.toString()}`
      : "/dashboard/users";

    router.replace(url, { scroll: false });
  }, [currentPage, searchTerm, roleFilter, router]);

  // Fetch users with pagination and filters
  const {
    data: apiResponse,
    isLoading,
    refetch,
  } = useGetAdminUsersQuery({
    page: currentPage,
    per_page: itemsPerPage,
    search: searchTerm,
    role: roleFilter !== "all" ? roleFilter : undefined,
    skip: !isAuthenticated,
  });

  const [suspendOrActivateUser] = useSuspendOrActivateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  // Extract data from API response
  const users = apiResponse?.data || [];
  const pagination = apiResponse?.pagination;
  const counts = apiResponse?.counts;

  // Get pagination info from API
  const totalUsers = pagination?.total || 0;

  // Handle search with page reset
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, []);

  // Handle role filter change
  const handleRoleChange = useCallback((role: string) => {
    setRoleFilter(role);
    setCurrentPage(1);
  }, []);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    document.getElementById("user-table-container")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    setRoleFilter("all");
    setCurrentPage(1);
  }, []);

  const columns: Column<User>[] = [
    {
      header: "User",
      render: (_, row) => (
        <div className="flex justify-center">
          {row?.image_url ? (
            <img
              className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-primary/20"
              src={row?.image_url || "/user.png"}
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
      header: "Department",
      accessor: "department",
      cellClassName: "px-4 py-3 text-center",
    },
    {
      header: "Role",
      accessor: "role",
      cellClassName: "px-4 py-3 text-center",
      render: (value) => (
        <span
          className={`
            inline-block px-2 py-1 rounded-full text-xs font-semibold
            ${
              value?.toLowerCase() === "admin"
                ? "bg-red-100 text-red-500"
                : value?.toLowerCase() === "teacher"
                  ? "bg-blue-100 text-blue-500"
                  : "bg-green-100 text-green-500"
            }
          `}
        >
          {value}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "suspended",
      cellClassName: "px-4 py-3 text-center",
      render: (value) => (
        <span
          className={`
            inline-block px-2 py-1 rounded-full text-xs font-semibold
            ${
              value === 0
                ? "bg-green-100 text-green-500"
                : "bg-red-100 text-red-500"
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
          <ActionButton
            variant="edit"
            icon={UserRoundPen}
            onClick={() => {
              setSelectedUserId(Number(row.id));
              setIsUpdateModalOpen(true);
            }}
            label="Edit User"
          />
          {row.suspended === 0 ? (
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
              label="Suspend User"
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
              label="Activate User"
            />
          )}
          <ActionButton
            variant="delete"
            icon={Trash}
            onClick={() => {
              setActionModal({
                isOpen: true,
                actionType: "delete",
                id: Number(row.id),
                mutation: deleteUser,
                name: row.name,
                buttonText: "Yes Confirm",
                entityName: "User",
              });
            }}
            label="Delete User"
          />
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
    <div className="space-y-6" id="user-table-container">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            User Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage all users, their roles, and permissions
          </p>
        </div>
        <MyButton onClick={() => setIsAddModalOpen(true)}>
          <UserRoundPlus className="w-4 h-4" />
          <span>Create New Admin</span>
        </MyButton>
      </div>

      {/* Stats Cards */}
      <UsersStatesCards counts={counts} />

      {/* Results Summary */}
      <div className="flex flex-col-reverse md:flex-row gap-4 items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {users.length} of {totalUsers} users
          {searchTerm && (
            <span className="ml-2">
              matching <span className="font-medium">"{searchTerm}"</span>
            </span>
          )}
          {roleFilter !== "all" && (
            <span className="ml-2">
              with role <span className="font-medium">{roleFilter}</span>
            </span>
          )}
        </p>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search by name or email"
            initialValue={searchTerm}
            debounceDelay={500}
            size="md"
            variant="default"
            showClearButton={true}
          />

          {/* Role Dropdown with icon */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 h-10.5">
                <UsersRound className="w-4 h-4" />
                {roleFilter === "all"
                  ? "All Roles"
                  : roleFilter === "admin"
                    ? "Admin"
                    : roleFilter === "teacher"
                      ? "Teacher"
                      : "Student"}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                className="cursor-pointer h-10"
                onClick={() => handleRoleChange("all")}
              >
                All Roles
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer h-10"
                onClick={() => handleRoleChange("admin")}
              >
                Admin
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer h-10"
                onClick={() => handleRoleChange("teacher")}
              >
                Teacher
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer h-10"
                onClick={() => handleRoleChange("student")}
              >
                Student
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div className="relative overflow-visible">
        <CustomTable
          data={users}
          columns={columns}
          showIndex={true}
          indexLabel="SN"
          isLoading={isLoading}
          emptyMessage={
            searchTerm || roleFilter !== "all"
              ? "No users found matching your filters"
              : "No users found"
          }
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          refetch();
          setCurrentPage(1);
        }}
      />

      {/* Update User Modal */}
      {isUpdateModalOpen && selectedUserId && (
        <UpdateUserModal
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

      {/* Confirmation Modal */}
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
        mutation={suspendOrActivateUser}
        entityType="user"
        onSuccess={() => {
          refetch();
        }}
      />
      <ActionConfirmationModal
        isOpen={actionModal.isOpen}
        onClose={() =>
          setActionModal({
            isOpen: false,
            actionType: "delete",
            mutation: null,
            id: null,
            name: "",
            buttonText: "",
            entityName: "",
          })
        }
        id={actionModal.id}
        name={actionModal.name}
        mutation={actionModal.mutation}
        actionType={actionModal.actionType}
        entityName={actionModal.entityName}
        onSuccess={() => refetch()}
      />
    </div>
  );
};

export default UserManagement;
