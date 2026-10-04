"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle,
  Copy,
  Check,
  Ticket,
  Home,
  BookOpen,
  Mail,
  Clock,
  AlertCircle,
  DollarSign,
  Shield,
} from "lucide-react";
import MyButton from "@/components/ui/MyButton";
import Link from "next/link";
import Loader from "@/components/ui/Loader";
import { Button } from "@/components/ui/button";

const PaymentSuccessContentStripe = () => {
  const searchParams = useSearchParams();
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Read payment_id from URL params
    const paymentIdFromUrl = searchParams.get("payment_id");

    if (paymentIdFromUrl) {
      setPaymentId(paymentIdFromUrl);
    }

    setIsLoading(false);
  }, [searchParams]);

  const handleCopyPaymentId = async () => {
    if (paymentId) {
      await navigator.clipboard.writeText(paymentId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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

  // No payment ID found
  if (!paymentId) {
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
      <div className="overflow-hidden max-w-6xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Column - Payment Success Info */}
          <div className="rounded-2xl overflow-hidden p-8 bg-[#533AFD]/10 ">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Payment Successful!
              </h1>
              <p className="text-gray-600 text-sm">
                Thank you for your payment
              </p>
            </div>

            {/* Payment ID Section */}
            <div className="bg-white rounded-xl p-5 mb-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-blue-600" />
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Payment ID
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
                #{paymentId}
              </code>
              <p className="text-xs text-gray-500 mt-3 text-center">
                Save this ID for future reference
              </p>
            </div>

            {/* Success Message */}
            <div className="bg-green-100 rounded-xl p-4 mb-6 border border-green-200">
              <p className="text-sm text-green-800 text-center">
                Your payment has been processed successfully!
              </p>
            </div>

            {/* Payment Summary */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <p className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Payment Summary:
              </p>
              <ul className="text-xs text-gray-600 space-y-2">
                <li className="flex justify-between">
                  <span>Transaction Status:</span>
                  <span className="text-green-600 font-semibold">
                    Completed
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Payment Method:</span>
                  <span className="font-semibold">
                    Credit/Debit Card (Stripe)
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Transaction ID:</span>
                  <span className="font-mono text-xs">
                    {paymentId.slice(0, 15)}...
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Next Steps */}
          <div className="p-8 ">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              What's Next?
            </h2>

            {/* Steps */}
            <div className="space-y-4 mb-8">
              {[
                {
                  step: 1,
                  title: "Confirmation Email",
                  desc: "A confirmation email has been sent to your registered email address",
                  icon: Mail,
                },
                {
                  step: 2,
                  title: "Enrollment Processing",
                  desc: "Your enrollment is being processed and will be activated shortly",
                  icon: BookOpen,
                },
                {
                  step: 3,
                  title: "Access Your Batches",
                  desc: "You can now access your batches from the dashboard",
                  icon: Home,
                },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <DollarSign className="w-4 h-4 text-green-600 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Payment Status</p>
                <p className="text-sm font-semibold text-green-600">
                  Completed
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <Shield className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Transaction</p>
                <p className="text-sm font-semibold text-blue-600">Secure</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4">
              <Link href="/dashboard">
                <MyButton className="w-full">Go to Dashboard</MyButton>
              </Link>

              <Link href="/dashboard/my-enrolled-batches">
                <Button variant="outline" className="w-full">
                  View My Batches
                </Button>
              </Link>
            </div>

            {/* Support Link */}
            <p className="text-center mt-6">
              <Link
                href="/support"
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors inline-flex items-center gap-1"
              >
                Need help? Contact support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessContentStripe;
