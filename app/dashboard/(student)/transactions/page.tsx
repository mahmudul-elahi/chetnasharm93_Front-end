"use client";
import { useGetPaymentHistoryForStudentQuery } from "@/src/redux/api/student/studentPaymentApi";
import React, { useCallback, useState, useEffect } from "react";
import CustomTable from "@/components/ui/Table";
import SearchBar from "@/components/ui/SearchBar";
import Loader from "@/components/ui/Loader";
import { Column } from "@/types/table";
import {
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  Calendar,
  DollarSign,
  Package,
} from "lucide-react";
import { PaymentData } from "@/types/payments";
import { format } from "date-fns";

const StudentTransactionsPage = () => {
  const [filters, setFilters] = useState({
    page: 1,
    per_page: 10,
    search: "",
  });

  const {
    data: apiResponse,
    isLoading: isFetching,
    refetch,
  } = useGetPaymentHistoryForStudentQuery(filters);

  const payments = apiResponse?.data;
  const pagination = apiResponse?.pagination;

  const handleSearch = (term: string) => {
    setFilters((prev) => ({
      ...prev,
      search: term,
      page: 1, // Reset to first page when searching
    }));
  };

  const handleClearSearch = () => {
    setFilters((prev) => ({
      ...prev,
      search: "",
      page: 1,
    }));
  };

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({
      ...prev,
      page: page,
    }));
  }, []);

  // Scroll to top when page changes
  useEffect(() => {
    document.getElementById("transaction-table-container")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [filters.page]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      paid: {
        color: "text-green-600 bg-green-100",
        icon: CheckCircle,
        label: "Paid",
      },
      pending: {
        color: "text-yellow-600 bg-yellow-100",
        icon: Clock,
        label: "Pending",
      },
      failed: {
        color: "text-red-600 bg-red-100",
        icon: XCircle,
        label: "Failed",
      },
      refunded: {
        color: "text-gray-600 bg-gray-100",
        icon: XCircle,
        label: "Refunded",
      },
    };
    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
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

  const getPaymentMethodBadge = (method: string) => {
    const methodConfig = {
      stripe: {
        color: "text-purple-600 bg-purple-100",
        label: "Stripe",
      },
      paypal: {
        color: "text-blue-600 bg-blue-100",
        label: "PayPal",
      },
      token: {
        color: "text-orange-600 bg-orange-100",
        label: "Manual Payment",
      },
    };
    const config =
      methodConfig[method as keyof typeof methodConfig] || methodConfig.token;
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        <CreditCard className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const columns: Column<PaymentData>[] = [
    {
      header: "Payment ID",
      headerClassName: "text-left",
      accessor: "payment_id",
      cellClassName:
        "px-4 py-3 text-left font-mono font-medium whitespace-nowrap",
      render: (value) => (
        <p className="font-mono font-semibold text-gray-900">{value}</p>
      ),
    },
    {
      header: "Batch",
      headerClassName: "text-left",
      cellClassName: "px-4 py-3 text-left",
      render: (_, row) => (
        <div>
          {row.batch ? (
            <>
              <p className="font-medium text-gray-900">{row.batch.name}</p>
              <p className="text-xs text-gray-500">Batch ID: {row.batch_id}</p>
            </>
          ) : (
            <span className="text-gray-400 text-sm">No batch assigned</span>
          )}
        </div>
      ),
    },
    {
      header: "Amount",
      headerClassName: "text-right",
      cellClassName: "px-4 py-3 text-right whitespace-nowrap",
      render: (_, row) => (
        <div>
          <p className="font-bold text-green-600">
            $ {parseFloat(row.amount).toLocaleString()}
          </p>
        </div>
      ),
    },
    {
      header: "Payment Method",
      headerClassName: "text-center",
      cellClassName: "px-4 py-3 text-center whitespace-nowrap",
      render: (_, row) => getPaymentMethodBadge(row.payment_method),
    },
    {
      header: "Transaction ID",
      headerClassName: "text-left",
      cellClassName: "px-4 py-3 text-left font-mono text-xs",
      render: (_, row) => (
        <p className="font-mono text-gray-600">{row.transaction_id || "-"}</p>
      ),
    },
    {
      header: "Status",
      headerClassName: "text-center",
      cellClassName: "px-4 py-3 text-center",
      render: (_, row) => getStatusBadge(row.status),
    },
    {
      header: "Paid At",
      headerClassName: "text-center",
      cellClassName: "px-4 py-3 text-center whitespace-nowrap",
      render: (_, row) => (
        <div className="flex items-center justify-center gap-1">
          <Calendar className="w-3 h-3 text-gray-400" />
          <span className="text-sm">
            {row.paid_at ? format(row.paid_at, "dd MMM yyyy") : "-"}
          </span>
        </div>
      ),
    },
    {
      header: "Created At",
      headerClassName: "text-center",
      cellClassName: "px-4 py-3 text-center whitespace-nowrap",
      render: (_, row) => (
        <div className="flex items-center justify-center gap-1">
          <Calendar className="w-3 h-3 text-gray-400" />
          <span className="text-sm">
            {format(row.created_at, "dd MMM yyyy")}
          </span>
        </div>
      ),
    },
  ];

  if (isFetching) {
    return (
      <div className="h-[calc(100vh-155px)] w-full flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6" id="transaction-table-container">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            My Payment History
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            View all your payment transactions and history
          </p>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex flex-col-reverse md:flex-row gap-4 items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing {payments?.length || 0} of {pagination?.total || 0}{" "}
          transactions
          {filters.search && (
            <span className="ml-2">
              matching <span className="font-medium">"{filters.search}"</span>
            </span>
          )}
        </p>
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search by payment ID ..."
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
          data={payments}
          columns={columns}
          showIndex={true}
          indexLabel="SN"
          isLoading={isFetching}
          emptyMessage={
            filters.search
              ? `No transactions found matching "${filters.search}"`
              : "No transactions found"
          }
          pagination={{
            current_page: pagination?.current_page || filters.page,
            per_page: pagination?.per_page || filters.per_page,
            total: pagination?.total || 0,
            last_page: pagination?.last_page || 1,
          }}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default StudentTransactionsPage;
