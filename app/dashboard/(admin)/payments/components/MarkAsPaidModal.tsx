"use client";

import React from "react";
import { ModalPortal } from "@/components/ui/ModalPortal";
import {
  X,
  CheckCircle,
  CreditCard,
  User,
  Package,
  DollarSign,
} from "lucide-react";
import MyButton from "@/components/ui/MyButton";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface MarkAsPaidModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: (transactionId: string) => void;
  paymentData?: {
    id: number;
    payment_id: string;
    user_name: string;
    amount: string;
    payment_method: string;
    batch_name?: string;
  };
  isLoading?: boolean;
  mutation?: any;
  onSuccess?: () => void;
}

const getPaymentMethodBadge = (method: string) => {
  const methodConfig: Record<string, { color: string; label: string }> = {
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
  const config = methodConfig[method] || methodConfig.token;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
    >
      <CreditCard className="w-3 h-3" />
      {config.label}
    </span>
  );
};

export default function MarkAsPaidModal({
  isOpen,
  onClose,
  onConfirm,
  paymentData,
  isLoading: externalLoading,
  mutation,
  onSuccess,
}: MarkAsPaidModalProps) {
  const [transactionId, setTransactionId] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const loading = externalLoading || isLoading;

  // Reset transaction ID when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setTransactionId("");
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    if (!transactionId.trim()) {
      toast.error("Please enter a transaction ID");
      return;
    }

    if (onConfirm) {
      onConfirm(transactionId);
      return;
    }

    if (mutation && paymentData?.id) {
      try {
        setIsLoading(true);
        await mutation({
          id: paymentData.id,
          transaction_id: transactionId,
        }).unwrap();
        toast.success(
          `Payment ${paymentData.payment_id} marked as paid successfully`,
        );
        onSuccess?.();
        onClose();
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to update payment status");
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!isOpen || !paymentData) return null;

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="rounded-2xl overflow-hidden w-full max-w-md">
          <div className="relative bg-white dark:bg-gray-800 shadow-2xl w-full transition-all duration-300 animate-in fade-in zoom-in">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Mark Payment as Paid
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="Close modal"
                disabled={loading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Payment Information */}
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-500">
                    <CreditCard className="w-4 h-4" />
                    <span>Payment ID:</span>
                  </div>
                  <span className="font-mono font-semibold text-gray-900 dark:text-white">
                    {paymentData.payment_id}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-500">
                    <User className="w-4 h-4" />
                    <span>Student:</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {paymentData.user_name}
                  </span>
                </div>

                {paymentData.batch_name && (
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Package className="w-4 h-4" />
                      <span>Batch:</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {paymentData.batch_name}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-500">
                    <DollarSign className="w-4 h-4" />
                    <span>Amount:</span>
                  </div>
                  <span className="font-bold text-green-600">
                    $ {parseFloat(paymentData.amount).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-500">
                    <CreditCard className="w-4 h-4" />
                    <span>Payment Method:</span>
                  </div>
                  {getPaymentMethodBadge(paymentData.payment_method)}
                </div>
              </div>

              {/* Transaction ID Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Transaction ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Enter transaction ID (e.g., TXN-123456789)"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  autoFocus
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  This ID will be used for payment reference and tracking
                </p>
              </div>

              {/* Note */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 border border-yellow-200 dark:border-yellow-800">
                <p className="text-xs text-yellow-800 dark:text-yellow-200">
                  <span className="font-medium">Note:</span> Once marked as
                  paid, the student will be automatically enrolled in the batch
                  and will receive a confirmation email.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6 items-center">
                <Button
                  variant="outline"
                  className="flex-1"
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <MyButton
                  type="button"
                  onClick={handleConfirm}
                  isLoading={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  Confirm Payment
                </MyButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
