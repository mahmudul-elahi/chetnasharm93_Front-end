"use client";

import Loader from "@/components/ui/Loader";
import CustomTable from "@/components/ui/Table";
import { useAuth } from "@/hooks/useAuth";
import { Column } from "@/types/table";
import React, { useState, useCallback, useEffect } from "react";
import {
  Plus,
  Pen,
  Ban as BanIcon,
  CircleCheckBig,
  Trash,
  HelpCircle,
  ChevronsLeft,
} from "lucide-react";
import SearchBar from "@/components/ui/SearchBar";
import MyButton from "@/components/ui/MyButton";
import ActionButton from "@/components/ui/ActionButton";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useDeleteBasicQuestionForAdminMutation,
  useGetAllBasicQuestionsForAdminQuery,
} from "@/src/redux/api/admin/basicQuestionsApi";
import AddBasicQuestionModal from "./_components/AddBasicQuestionModal";
import ActionConfirmationModal, {
  ActionType,
} from "@/components/modals/ActionConfirmationModal";
import UpdateBasicQuestionModal from "./_components/UpdateBasicQuestionModal";

const BasicQuestionManagementPage = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlPage = Number(searchParams.get("page")) || 1;
  const urlSearch = searchParams.get("search") || "";

  const [currentPage, setCurrentPage] = useState(urlPage);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(
    null,
  );
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  // State for action modal
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

  // Update URL when page or search changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.set("page", String(currentPage));
    if (searchTerm) params.set("search", searchTerm);

    const url = params.toString()
      ? `/dashboard/free-resources/basic-questions?${params.toString()}`
      : "/dashboard/free-resources/basic-questions";

    router.replace(url, { scroll: false });
  }, [currentPage, searchTerm, router]);

  const {
    data: apiResponse,
    isLoading,
    refetch,
  } = useGetAllBasicQuestionsForAdminQuery({
    page: currentPage,
    per_page: itemsPerPage,
    search: searchTerm,
    skip: !isAuthenticated,
  });

  const [deleteQuestion] = useDeleteBasicQuestionForAdminMutation();

  const questions = apiResponse?.data || [];
  const pagination = apiResponse?.pagination;
  const totalQuestions = pagination?.total || 0;

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    document.getElementById("basic-questions-table-container")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  const getLevelBadgeColor = (level: string) => {
    const colors: Record<string, string> = {
      A1: "bg-green-100 text-green-600",
      A2: "bg-emerald-100 text-emerald-600",
      B1: "bg-blue-100 text-blue-600",
      B2: "bg-indigo-100 text-indigo-600",
      C1: "bg-purple-100 text-purple-600",
      C2: "bg-pink-100 text-pink-600",
    };
    return colors[level] || "bg-gray-100 text-gray-600";
  };

  const columns: Column<any>[] = [
    {
      header: "Question",
      headerClassName: "text-left",
      accessor: "question",
      cellClassName: "px-4 py-3 text-left font-medium",
      render: (value) => (
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-primary" />
          <span>{value}</span>
        </div>
      ),
    },
    {
      header: "Level",
      headerClassName: "text-center",
      accessor: "level",
      cellClassName: "px-4 py-3 text-center",
      render: (value) => (
        <span
          className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getLevelBadgeColor(
            value,
          )}`}
        >
          {value || "-"}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
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
              setSelectedQuestionId(Number(row.id));
              setIsUpdateModalOpen(true);
            }}
            label="Edit Question"
          />
          <ActionButton
            variant="delete"
            icon={Trash}
            onClick={() => {
              setActionModal({
                isOpen: true,
                actionType: "delete",
                id: Number(row.id),
                mutation: deleteQuestion,
                name: row.question,
                buttonText: "Yes Confirm",
                entityName: "Basic Question",
              });
            }}
            label="Delete Question"
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
    <div className="space-y-6" id="basic-questions-table-container">
      {/* Header Section */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
      >
        <ChevronsLeft className="w-4 h-4" />
        <span>Back to Free Resource Management</span>
      </button>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Basic Questions Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage all basic questions for different proficiency levels
          </p>
        </div>
        <MyButton onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4" />
          <span>Add New Question</span>
        </MyButton>
      </div>

      {/* Results Summary */}
      <div className="flex flex-col-reverse md:flex-row gap-4 items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing {questions.length} of {totalQuestions} basic questions
          {searchTerm && (
            <span className="ml-2">
              matching <span className="font-medium">"{searchTerm}"</span>
            </span>
          )}
        </p>
        {/* <SearchBar
          onSearch={handleSearch}
          placeholder="Search by question..."
          className="w-5/6 md:w-2/4 xl:w-2/6 max-w-92"
          initialValue={searchTerm}
          debounceDelay={500}
          size="md"
          variant="default"
          showClearButton={true}
        /> */}
      </div>

      {/* Table */}
      <div className="relative overflow-visible">
        <CustomTable
          data={questions}
          columns={columns}
          showIndex={true}
          indexLabel="SN"
          isLoading={isLoading}
          emptyMessage={
            searchTerm
              ? `No basic questions found matching "${searchTerm}"`
              : "No basic questions found"
          }
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Add Question Modal */}
      <AddBasicQuestionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          refetch();
          setCurrentPage(1);
        }}
      />

      {/* Update Question Modal */}
      {isUpdateModalOpen && selectedQuestionId && (
        <UpdateBasicQuestionModal
          id={selectedQuestionId}
          onClose={() => {
            setIsUpdateModalOpen(false);
            setSelectedQuestionId(null);
          }}
          onUpdate={() => {
            refetch();
            setIsUpdateModalOpen(false);
            setSelectedQuestionId(null);
          }}
        />
      )}

      {/* Action Confirmation Modal */}
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

export default BasicQuestionManagementPage;
