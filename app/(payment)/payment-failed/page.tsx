"use client";

import {
  XCircle,
  Home,
  BookOpen,
} from "lucide-react";
import MyButton from "@/components/ui/MyButton";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const PaymentFailedContentStripe = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary/5 to-secondary/5 p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Icon */}
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Failed
          </h1>
          
          <p className="text-gray-600 mb-6">
            Your payment could not be processed. Please try again.
          </p>

          {/* Buttons */}
          <div className="flex flex-col gap-4">
            <Link href="/classes">
              <MyButton className="w-full">
                Try Again
              </MyButton>
            </Link>
            
            <Link href="/">
              <Button variant="outline" className="w-full">
                Go to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailedContentStripe;