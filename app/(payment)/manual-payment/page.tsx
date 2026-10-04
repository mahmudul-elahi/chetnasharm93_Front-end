"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Copy,
  Check,
  Ticket,
  Clock,
  AlertCircle,
  Phone,
  CreditCard,
  DollarSign,
  Shield,
} from "lucide-react";
import MyButton from "@/components/ui/MyButton";
import Link from "next/link";
import Loader from "@/components/ui/Loader";
import { Button } from "@/components/ui/button";

const ManualPaymentSuccessPage = () => {
  const router = useRouter();
  const [paymentData, setPaymentData] = useState<{
    payment_id: string;
    support_number: string;
    message: string;
    type: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const manualPaymentData = sessionStorage.getItem("manualPaymentData");

    if (manualPaymentData) {
      try {
        const data = JSON.parse(manualPaymentData);
        setPaymentData(data);
        setIsLoading(false);
        // Optional: Clear sessionStorage after reading
        // sessionStorage.removeItem("manualPaymentData");
      } catch (error) {
        console.error("Error parsing manual payment data:", error);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleCopyPaymentId = async () => {
    if (paymentData?.payment_id) {
      await navigator.clipboard.writeText(paymentData.payment_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopySupportNumber = async () => {
    if (paymentData?.support_number) {
      await navigator.clipboard.writeText(paymentData.support_number);
      setCopiedNumber(true);
      setTimeout(() => setCopiedNumber(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader />
        </div>
      </div>
    );
  }

  // No data found
  if (!paymentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-yellow-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            No Payment Information
          </h1>
          <p className="text-gray-600 mb-6">
            No payment information found. Please contact support if you've made
            a payment.
          </p>
          <Link href="/dashboard">
            <MyButton className="w-full">Go to Dashboard</MyButton>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 p-4 overflow-auto">
      <div className="  overflow-hidden max-w-6xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Column - Payment Info & Instructions */}
          <div className="rounded-2xl overflow-hidden p-8 bg-linear-to-br from-primary/10 to-secondary/10">
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-10 h-10 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Manual Payment Required
              </h1>
              <p className="text-gray-600 text-sm">
                Complete your payment using the instructions below
              </p>
            </div>

            {/* Payment ID Section */}
            <div className="bg-white rounded-xl p-5 mb-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-blue-600" />
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Payment Reference ID
                  </label>
                </div>
                <button
                  onClick={handleCopyPaymentId}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-lg text-xs text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-green-600" />
                      <span className="text-green-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <code className="text-2xl font-mono font-bold text-gray-900 bg-gray-50 px-4 py-3 rounded-lg block text-center border border-gray-200 break-all">
                {paymentData.payment_id}
              </code>
              <p className="text-xs text-gray-500 mt-3 text-center">
                Please quote this ID when making the payment
              </p>
            </div>

            {/* Message from server */}
            {paymentData.message && (
              <div className="bg-blue-100 rounded-xl p-4 mb-6 border border-blue-200">
                <p className="text-sm text-blue-800 text-center">
                  {paymentData.message}
                </p>
              </div>
            )}

            {/* Payment Instructions */}
            <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
              <p className="text-sm text-yellow-800 font-medium mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Important Instructions:
              </p>
              <ul className="text-xs text-yellow-700 space-y-2">
                <li>
                  • Complete payment within 24 hours to confirm enrollment
                </li>
                <li>• Your spot is temporarily reserved</li>
                <li>• Use the Reference ID when making the payment</li>
                <li>• Contact support after completing payment</li>
              </ul>
            </div>
          </div>

          {/* Right Column - Support & Next Steps */}
          <div className="p-8 ">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Next Steps
            </h2>

            {/* Steps */}
            <div className="space-y-4 mb-8">
              {[
                {
                  step: 1,
                  title: "Make the Payment",
                  desc: "Use the Reference ID to make the payment to the provided account",
                },
                {
                  step: 2,
                  title: "Contact Support",
                  desc: "Share the payment confirmation with our support team",
                },
                {
                  step: 3,
                  title: "Get Enrolled",
                  desc: "Your enrollment will be activated within few minutes",
                },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-00">
                    <span className="text-blue-600 font-bold text-sm shrink-0">
                      {item.step}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Support Contact */}
            {paymentData.support_number && (
              <div className="bg-green-50 rounded-xl p-5 mb-8 border border-green-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-800">
                      Payment Support
                    </span>
                  </div>
                  <button
                    onClick={handleCopySupportNumber}
                    className="flex items-center gap-1 px-3 py-1.5 bg-white rounded-lg text-xs text-gray-600 hover:text-gray-900 transition-colors shadow-sm cursor-pointer"
                  >
                    {copiedNumber ? (
                      <>
                        <Check className="w-3 h-3 text-green-600" />
                        <span className="text-green-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <Phone className="w-5 h-5 text-green-600" />
                  <a
                    href={`tel:${paymentData.support_number}`}
                    className="text-2xl font-mono font-bold text-green-700 hover:text-green-800 transition-colors"
                  >
                    {paymentData.support_number}
                  </a>
                </div>
                <p className="text-xs text-green-700 mt-3 text-center">
                  Call or WhatsApp for payment assistance
                </p>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <DollarSign className="w-4 h-4 text-orange-600 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Payment Status</p>
                <p className="text-sm font-semibold text-orange-600">Pending</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <Shield className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Reservation</p>
                <p className="text-sm font-semibold text-blue-600">24 Hours</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4">
              <Link href="/dashboard">
                <MyButton className="w-full">Go to Dashboard</MyButton>
              </Link>

              <div>
                {paymentData.support_number && (
                  <a href={`tel:${paymentData.support_number}`}>
                    <Button variant="outline" className="w-full">
                      <Phone className="w-4 h-4 mr-2" />
                      Contact Support Now
                    </Button>
                  </a>
                )}
              </div>
            </div>

            {/* Support Link */}
            <p className="text-center mt-6">
              <Link
                href="/support"
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors inline-flex items-center gap-1"
              >
                Need more help? Visit support center
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualPaymentSuccessPage;
