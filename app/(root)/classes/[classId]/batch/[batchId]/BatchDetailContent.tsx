"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetSingleBatchByIdQuery } from "@/src/redux/api/home/batchesApi";
import MyButton from "@/components/ui/MyButton";
import { toast } from "sonner";
import {
  CreditCard,
  Wallet,
  Ticket,
  Calendar,
  Clock,
  BookOpen,
  User,
  CheckCircle,
  Shield,
  Loader2,
  AlertCircle,
  ChevronsLeft,
  OctagonAlert,
  UserRound,
} from "lucide-react";
import { FaPaypal } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useCreatePaymentMutation } from "@/src/redux/api/student/studentPaymentApi";
import { useAuth } from "@/hooks/useAuth";
import BatchDetailSkeleton from "../../_components/BatchDetailSkeleton";
import AddToWishListButton from "../../_components/AddToWishListButton";
import { convertUtcScheduleToLocal } from "@/src/utils/timezone";

interface PaymentMethod {
  id: "stripe" | "paypal" | "token";
  name: string;
  icon: any;
  description: string;
  enabled: boolean;
}

export default function BatchDetailContent({ batchId: propBatchId }: { batchId?: string }) {
  const params = useParams();
  const router = useRouter();
  const batchId = propBatchId ?? (params?.batchId as string);
  const { user, isStudent, isLoading } = useAuth();

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "stripe" | "paypal" | "token"
  >("stripe");
  const [isProcessing, setIsProcessing] = useState(false);
  const [createPayment] = useCreatePaymentMutation();

  // Fetch batch details
  const {
    data: batchDataRes,
    isLoading: batchLoading,
    error: batchError,
  } = useGetSingleBatchByIdQuery(batchId);
  const batchData = batchDataRes?.data;
  const enrolledStatus = batchDataRes?.enrolled_status;


  const formatDate = (dateString: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handlePayment = async () => {
    if (!user) {
      toast.error("Please login first to enroll in batch");
      return;
    }

    if (!selectedPaymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    setIsProcessing(true);
    let shouldRedirect = false;

    try {
      const payload = {
        batch_id: batchId,
        payment_method: selectedPaymentMethod,
      };

      const result = await createPayment(payload).unwrap();
      console.log("Payment API Response:", result);

      // Handle Stripe payment
      if (result.url && selectedPaymentMethod === "stripe") {
        toast.success("Redirecting to Stripe payment gateway");
        router.push(result.url);
        shouldRedirect = true;
      }
      if (result.url && selectedPaymentMethod === "paypal") {
        toast.success("Redirecting to Paypal payment gateway");
        router.push(result.url);
        shouldRedirect = true;
      }

      // Handle Manual Payment
      if (result.status && result.payment_id) {
        // Save data to sessionStorage
        sessionStorage.setItem(
          "manualPaymentData",
          JSON.stringify({
            payment_id: result.payment_id,
            support_number: result.support_number,
            message: result.message,
            type: "manual",
          }),
        );

        toast.success("Redirecting to payment confirmation page");
        router.push(`/manual-payment`);
        shouldRedirect = true;
      }
      // Handle other payment methods (PayPal, etc.)
      if (result.redirect_url && selectedPaymentMethod === "paypal") {
        router.push(result.redirect_url);
        shouldRedirect = true;
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      // ... error handling code remains same
    } finally {
      if (!shouldRedirect) {
        setIsProcessing(false);
      }
    }
  };

  if (batchLoading || isLoading) {
    return <BatchDetailSkeleton />;
  }

  if (batchError || !batchData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Batch not found
          </h2>
          <p className="text-gray-600 mb-6">
            The batch you're looking for doesn't exist or has been removed.
          </p>
          <MyButton onClick={() => router.back()}>Go Back</MyButton>
        </div>
      </div>
    );
  }

  const availableSeats = batchData.total_seat - batchData.filled_seat;
  const price = parseFloat(batchData.class?.price || "0");

  return (
    <div className="min-h-screen pt-25 bg-linear-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Side - Batch Details */}
          <div className="lg:col-span-2 space-y-6">
            <Button
              className="px-6 lg:hidden"
              onClick={() => router.back()}
              variant="outline"
            >
              <ChevronsLeft size={16} /> Back
            </Button>
            {/* Already Enrolled Alert */}
            {enrolledStatus && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">
                      Already Enrolled
                    </p>
                    <p className="text-sm text-green-700">
                      You are already enrolled in this batch. You can access
                      your classes from the dashboard.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Batch Info Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-linear-to-r from-primary/5 to-transparent">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {batchData.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-2">
                      <BookOpen className="w-4 h-4 text-primary" />
                      <span className="text-primary font-medium">
                        {batchData.class?.title}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6 p-6">
                {/* Class Description */}
                {batchData.class?.description && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      About This Course
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {batchData.class.description}
                    </p>
                  </div>
                )}

                {/* Schedule Information */}
                {batchData.schedules && batchData.schedules.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      Class Schedule
                    </h3>
                    <div className="space-y-2">
                      {batchData.schedules.map((schedule: any) => {
                        const localSchedule = convertUtcScheduleToLocal(
                          schedule.day_of_week,
                          schedule.start_time,
                          schedule.end_time
                        );
                        return (
                          <div
                            key={schedule.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
                          >
                            <div className="flex items-center gap-2.5">
                              <Calendar className="w-4 h-4 text-primary" />
                              <span className="font-semibold text-gray-800 text-sm">
                                {localSchedule.day}
                              </span>
                            </div>
                            <span className="font-medium text-gray-700 text-sm">
                              {localSchedule.timeString}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Teacher Info */}
                {batchData.teacher && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <UserRound className="w-5 h-5 text-primary" />
                      Instructor
                    </h3>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      {batchData.teacher.image_url ? (
                        <img
                          src={batchData.teacher.image_url}
                          alt={batchData.teacher.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary/10 to-primary/20 flex items-center justify-center">
                          <User className="w-6 h-6 text-primary" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">
                          {batchData.teacher.name}
                        </p>
                        <p className="text-sm text-gray-500">Lead Instructor</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Batch Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-sm text-gray-500">Total Seats</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {batchData.total_seat}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Filled Seats</p>
                    <p className="text-lg font-semibold text-green-600">
                      {batchData.filled_seat}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Available Seats</p>
                    <p className="text-lg font-semibold text-orange-600">
                      {availableSeats}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatDate(batchData.start_date)} -{" "}
                      {formatDate(batchData.end_date)}
                    </p>
                  </div>
                </div>

                {/* Seat Availability Progress Bar */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Seat Availability
                    </span>
                    <span className="text-sm text-gray-500">
                      {availableSeats} seats left
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-linear-to-r from-primary to-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${(batchData.filled_seat / batchData.total_seat) * 100}%`,
                      }}
                    />
                  </div>
                  {availableSeats <= 5 && availableSeats > 0 && (
                    <p className="text-xs text-orange-600 mt-2">
                      ⚡ Only {availableSeats} seats left! Enroll soon.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Payment Options */}
          <div className="lg:col-span-1 flex flex-col">
            {" "}
            <div className="sticky top-24">
              <Button
                className="px-6 mb-6 hidden lg:flex justify-center items-center w-full"
                onClick={() => router.back()}
                variant="outline"
              >
                <ChevronsLeft size={16} /> Back
              </Button>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 ">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900">
                    Payment Details
                  </h3>
                  <div className="mt-4 p-4 bg-linear-to-r from-primary/5 to-primary/10 rounded-xl">
                    <p className="text-sm text-gray-600">Enrollment Fee</p>
                    <p className="text-3xl font-bold text-primary">$ {price}</p>
                  </div>
                  {!user && (
                    <p className="mt-4 text-center text-red-500 flex justify-center items-center gap-2">
                      <OctagonAlert size={16} /> Please login first to enroll in
                      batch
                    </p>
                  )}
                </div>
                {isStudent &&
                  new Date(batchData.start_date) > new Date() &&
                  batchData?.filled_seat < batchData?.total_seat && (
                    <div>
                      {!enrolledStatus && (
                        <div className="p-6 space-y-4">
                          <p className="font-semibold text-gray-900">
                            Select Payment Method
                          </p>

                          <div className="space-y-3">
                            {/* Stripe Payment */}
                            <label
                              className={`flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                                selectedPaymentMethod === "stripe"
                                  ? "border-primary bg-primary/5"
                                  : "border-gray-200 hover:border-primary/50"
                              }`}
                            >
                              <input
                                type="radio"
                                name="payment_method"
                                value="stripe"
                                checked={selectedPaymentMethod === "stripe"}
                                onChange={() =>
                                  setSelectedPaymentMethod("stripe")
                                }
                                className="mt-1 mr-3 text-primary"
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <CreditCard className="w-5 h-5 text-primary" />
                                  <span className="font-medium">Stripe</span>
                                </div>
                                <p className="text-sm text-gray-500">
                                  Pay securely with your card via Stripe
                                </p>
                              </div>
                              {selectedPaymentMethod === "stripe" && (
                                <CheckCircle className="w-5 h-5 text-primary" />
                              )}
                            </label>

                            {/* PayPal Payment */}
                            <label
                              className={`flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                                selectedPaymentMethod === "paypal"
                                  ? "border-primary bg-primary/5"
                                  : "border-gray-200 hover:border-primary/50"
                              }`}
                            >
                              <input
                                type="radio"
                                name="payment_method"
                                value="paypal"
                                checked={selectedPaymentMethod === "paypal"}
                                onChange={() =>
                                  setSelectedPaymentMethod("paypal")
                                }
                                className="mt-1 mr-3 text-primary"
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <FaPaypal className="w-5 h-5 text-primary" />
                                  <span className="font-medium">PayPal</span>
                                </div>
                                <p className="text-sm text-gray-500">
                                  Pay with your PayPal account
                                </p>
                              </div>
                              {selectedPaymentMethod === "paypal" && (
                                <CheckCircle className="w-5 h-5 text-primary" />
                              )}
                            </label>

                            {/* Manual Payment */}
                            <label
                              className={`flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                                selectedPaymentMethod === "token"
                                  ? "border-primary bg-primary/5"
                                  : "border-gray-200 hover:border-primary/50"
                              }`}
                            >
                              <input
                                type="radio"
                                name="payment_method"
                                value="token"
                                checked={selectedPaymentMethod === "token"}
                                onChange={() =>
                                  setSelectedPaymentMethod("token")
                                }
                                className="mt-1 mr-3 text-primary"
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <Ticket className="w-5 h-5 text-primary" />
                                  <span className="font-medium">
                                    Manual Payment
                                  </span>
                                </div>
                                <p className="text-sm text-gray-500">
                                  Pay manually via support with payment ID
                                </p>
                              </div>
                              {selectedPaymentMethod === "token" && (
                                <CheckCircle className="w-5 h-5 text-primary" />
                              )}
                            </label>
                          </div>

                          <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                            <Shield className="w-4 h-4 text-green-600 mt-0.5" />
                            <p className="text-xs text-gray-600">
                              Your payment information is secure. We use
                              industry-standard encryption.
                            </p>
                          </div>

                          <MyButton
                            onClick={handlePayment}
                            disabled={isProcessing}
                            className="w-full"
                          >
                            {isProcessing ? (
                              <div className="flex items-center justify-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Processing...
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-2">
                                <Wallet className="w-4 h-4" />
                                {selectedPaymentMethod === "token"
                                  ? "Proceed with Manual Payment"
                                  : `Pay with ${selectedPaymentMethod === "stripe" ? "Card" : "PayPal"}`}
                              </div>
                            )}
                          </MyButton>

                          <p className="text-xs text-center text-gray-500">
                            By completing this payment, you agree to our Terms
                            of Service
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                {enrolledStatus && (
                  <div className="p-6">
                    <div className="bg-green-50 rounded-xl p-4 text-center">
                      <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                      <p className="font-medium text-green-800">
                        You're already enrolled!
                      </p>
                      <p className="text-sm text-green-700 mt-1">
                        You have access to all classes in this batch.
                      </p>
                      <MyButton
                        onClick={() => router.push("/dashboard")}
                        className="w-full mt-4"
                      >
                        Go to Dashboard
                      </MyButton>
                    </div>
                  </div>
                )}
                {/* wishlist button */}
                {!enrolledStatus &&
                  batchData?.filled_seat < batchData?.total_seat &&
                  batchData?.end_date &&
                  new Date(batchData.start_date) <= new Date() &&
                  isStudent && (
                    <AddToWishListButton
                      batch_id={batchData?.id}
                      batch_name={batchData?.name}
                    />
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
