"use client";

import React from "react";
import { Shield, CheckCircle } from "lucide-react";

const SecurePaymentCard = () => {
  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-800 p-6 md:p-8">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-green-600 rounded-xl">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Secure Payments
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
            All Stripe payments are securely processed using industry-standard encryption. 
            Your payment information is never stored on ListenAct servers.
          </p>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-xs text-gray-700 dark:text-gray-300">SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-xs text-gray-700 dark:text-gray-300">PCI Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-xs text-gray-700 dark:text-gray-300">Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurePaymentCard;