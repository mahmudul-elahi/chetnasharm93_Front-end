"use client";
import ActionButton from "@/components/ui/ActionButton";
import SearchBar from "@/components/ui/SearchBar";
import CustomTable from "@/components/ui/Table";
import { useGetAllStudentsQuery } from "@/src/redux/api/teacher/teacherBatchesApi";
import { useAddStudentNoteMutation } from "@/src/redux/api/teacher/studentNotesApi";
import { Column } from "@/types/table";
import { Eye, User, Mail, MessageSquareMore } from "lucide-react";
import Link from "next/link";
import React, { useCallback, useState } from "react";
import Loader from "@/components/ui/Loader";
import { toast } from "sonner";
import AddFeedbackModal from "@/components/modals/AddFeedbackModal";

const MyStudentsPage = () => {
  const [filters, setFilters] = useState({
    currentPage: 1,
    perPageItem: 10,
    search: "",
  });

  const { data: apiResponse, isLoading } = useGetAllStudentsQuery({
    page: filters.currentPage,
    per_page: filters.perPageItem,
    search: filters.search,
  });

  const students = apiResponse?.data;
  const pagination = apiResponse?.pagination;

  const handleSearch = (term: string) => {
    setFilters((prev) => ({
      ...prev,
      search: term,
      currentPage: 1,
    }));
  };

  const handleClearSearch = () => {
    setFilters((prev) => ({
      ...prev,
      search: "",
      currentPage: 1,
    }));
  };

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({
      ...prev,
      currentPage: page,
    }));

    document.getElementById("students-table-container")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  const columns: Column<any>[] = [
    {
      header: "Student Name",
      accessor: "name",
      headerClassName: "text-left",
      cellClassName: "px-4 py-3 text-left font-medium whitespace-nowrap",
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
          <span>{row.name}</span>
        </div>
      ),
    },
    {
      header: "Email",
      accessor: "email",
      headerClassName: "text-left",
      cellClassName: "px-4 py-3 text-left",
    },
    {
      header: "Batch",
      accessor: "batch_name",
      headerClassName: "text-center",
      cellClassName: "px-4 py-3 text-center whitespace-nowrap",
    },
    {
      header: "Class",
      accessor: "class_title",
      headerClassName: "text-center",
      cellClassName: "px-4 py-3 text-center min-w-60",
    },
    {
      header: "Actions",
      headerClassName: "text-center",
      cellClassName: "px-4 py-3 text-center",
      render: (_, row) => (
        <div className="flex justify-center gap-2">
          <Link
            href={`/dashboard/my-students/${row.user_id}?batch_id=${row.batch_id}`}
          >
            <ActionButton
              variant="view"
              icon={Eye}
              label="View All Feedback"
              size="sm"
              
            />
          </Link>
          <AddFeedbackButton student={row} />
        </div>
      ),
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
    <div className="space-y-6" id="students-table-container">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            All Students
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            View and manage student notes and feedback
          </p>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex flex-col-reverse md:flex-row gap-4 items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing {students?.length || 0} of {pagination?.total || 0} students
          {filters.search && (
            <span className="ml-2">
              matching <span className="font-medium">"{filters.search}"</span>
            </span>
          )}
        </p>
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search by student name or email..."
          initialValue={filters.search}
          className="w-5/6 md:w-2/4 xl:w-2/6 max-w-92"
          debounceDelay={500}
          size="md"
          variant="default"
          showClearButton={true}
        />
      </div>

      {/* Table */}
      <div className="relative overflow-visible">
        <CustomTable
          data={students}
          columns={columns}
          showIndex={true}
          indexLabel="SN"
          isLoading={isLoading}
          emptyMessage={
            filters.search
              ? `No students found matching "${filters.search}"`
              : "No students found"
          }
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

// Add Feedback Button Component
const AddFeedbackButton = ({ student }: { student: any }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [addStudentNote] = useAddStudentNoteMutation();

  const handleAddNote = async (data: { comment: string; status: string }) => {
    try {
      await addStudentNote({
        batch_id: student.batch_id,
        student_user_id: student.user_id,
        ...data,
      }).unwrap();
      toast.success("Feedback added successfully!");
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to add feedback");
    }
  };

  return (
    <>
      <ActionButton
        variant="edit"
        icon={MessageSquareMore}
        label="Add feedback"
        size="sm"
        onClick={() => setIsModalOpen(true)}
      />
      {isModalOpen && (
        <AddFeedbackModal
          student={student}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddNote}
          mode="add"
        />
      )}
    </>
  );
};

export default MyStudentsPage;
