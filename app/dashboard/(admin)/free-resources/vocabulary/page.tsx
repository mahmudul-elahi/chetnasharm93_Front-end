"use client";

import Loader from "@/components/ui/Loader";
import CustomTable from "@/components/ui/Table";
import { useAuth } from "@/hooks/useAuth";
import { Column } from "@/types/table";
import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  Plus,
  Pen,
  Ban as BanIcon,
  CircleCheckBig,
  Languages,
  Trash,
  ChevronsLeft,
} from "lucide-react";
import SearchBar from "@/components/ui/SearchBar";
import MyButton from "@/components/ui/MyButton";
import ActionButton from "@/components/ui/ActionButton";

import { useRouter, useSearchParams } from "next/navigation";
import {
  useDeleteVocabularyForAdminMutation,
  useGetAllVocabulariesForAdminQuery,
} from "@/src/redux/api/admin/vocabulariesApi";
import AddVocabularyModal from "./_components/AddVocabularyModal";
import UpdateVocabularyModal from "./_components/UpdateVocabularyModal";
import ActionConfirmationModal, {
  ActionType,
} from "@/components/modals/ActionConfirmationModal";

const VocabularyManagementPage = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlPage = Number(searchParams.get("page")) || 1;
  const urlSearch = searchParams.get("search") || "";

  const [currentPage, setCurrentPage] = useState(urlPage);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedVocabularyId, setSelectedVocabularyId] = useState<
    number | null
  >(null);
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
      ? `/dashboard/free-resources/vocabulary?${params.toString()}`
      : "/dashboard/free-resources/vocabulary";

    router.replace(url, { scroll: false });
  }, [currentPage, searchTerm, router]);

  const {
    data: apiResponse,
    isLoading,
    refetch,
  } = useGetAllVocabulariesForAdminQuery({
    page: currentPage,
    per_page: itemsPerPage,
    search: searchTerm,
    skip: !isAuthenticated,
  });
  const [deleteVocabulary] = useDeleteVocabularyForAdminMutation();

  const vocabularies = apiResponse?.data || [];
  const pagination = apiResponse?.pagination;
  const totalVocabularies = pagination?.total || 0;

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    document.getElementById("vocabulary-table-container")?.scrollIntoView({
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
      header: "Example Image",
      render: (value, row) => (
        <div className="flex items-center justify-center gap-3">
          {row?.image_url ? (
            <img
              className="w-10 h-10 rounded-lg object-cover shrink-0 ring-2 ring-primary/20"
              src={row?.image_url}
              alt={row?.word}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://ui-avatars.com/api/?name=" +
                  row?.word +
                  "&background=9b35e3&color=fff&size=200&bold=true";
              }}
            />
          ) : (
            <div className="w-10 h-10 rounded-lg flex items-center justify-center ring-2 ring-primary/20 bg-primary/10">
              <Languages size={20} className="text-primary" />
            </div>
          )}
          <span className="font-semibold">{value}</span>
        </div>
      ),
    },
    {
      header: "Word",
      headerClassName: "text-left",
      accessor: "word",
      cellClassName: "px-4 py-3 text-left font-medium whitespace-nowrap",
      render: (value, row) => <span className="font-semibold">{value}</span>,
    },
    {
      header: "Meaning",
      headerClassName: "text-left",
      accessor: "meaning",
      cellClassName: "px-4 py-3 text-left",
    },
    {
      header: "Example",
      headerClassName: "text-left",
      accessor: "example",
      cellClassName: "px-4 py-3 text-left max-w-xs",
      render: (value) => (
        <p className="truncate max-w-50 italic text-gray-600" title={value}>
          "{value || "-"}"
        </p>
      ),
    },
    {
      header: "Pronunciation",
      accessor: "pronunciation",
      cellClassName: "px-4 py-3 text-center",
      render: (value) => <span className="text-gray-600">{value || "-"}</span>,
    },
    {
      header: "Part of Speech",
      accessor: "part_of_speech",
      cellClassName: "px-4 py-3 text-center",
      render: (value) => (
        <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-600">
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
              setSelectedVocabularyId(Number(row.id));
              setIsUpdateModalOpen(true);
            }}
            label="Edit Vocabulary"
          />
          <ActionButton
            variant="delete"
            icon={Trash}
            onClick={() => {
              setActionModal({
                isOpen: true,
                actionType: "delete",
                id: Number(row.id),
                mutation: deleteVocabulary,
                name: row.word,
                buttonText: "Yes Confirm",
                entityName: "Vocabulary",
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
    <div className="space-y-6" id="vocabulary-table-container">
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
            Vocabulary Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage all vocabulary words, their meanings, and examples
          </p>
        </div>
        <MyButton onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4" />
          <span>Add New Vocabulary</span>
        </MyButton>
      </div>

      {/* Results Summary */}
      <div className="flex flex-col-reverse md:flex-row gap-4 items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing {vocabularies.length} of {totalVocabularies} vocabulary words
          {searchTerm && (
            <span className="ml-2">
              matching <span className="font-medium">"{searchTerm}"</span>
            </span>
          )}
        </p>
        {/* <SearchBar
          onSearch={handleSearch}
          placeholder="Search by word or meaning..."
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
          data={vocabularies}
          columns={columns}
          showIndex={true}
          indexLabel="SN"
          isLoading={isLoading}
          emptyMessage={
            searchTerm
              ? `No vocabulary words found matching "${searchTerm}"`
              : "No vocabulary words found"
          }
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Add Vocabulary Modal */}
      <AddVocabularyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          refetch();
          setCurrentPage(1);
        }}
      />

      {/* Update Vocabulary Modal */}
      {isUpdateModalOpen && selectedVocabularyId && (
        <UpdateVocabularyModal
          id={selectedVocabularyId}
          onClose={() => {
            setIsUpdateModalOpen(false);
            setSelectedVocabularyId(null);
          }}
          onUpdate={() => {
            refetch();
            setIsUpdateModalOpen(false);
            setSelectedVocabularyId(null);
          }}
        />
      )}

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

export default VocabularyManagementPage;
