"use client";

import { CreditCard, Wallet, Banknote } from "lucide-react";
import PaymentStepCard from "@/components/payment-options/PaymentStepCard";
import PaymentFAQ from "@/components/payment-options/PaymentFAQ";
import SecurePaymentCard from "@/components/payment-options/SecurePaymentCard";
import SupportCard from "@/components/payment-options/SupportCard";

const PaymentOptionsPage = () => {
  const paymentMethods = [
    {
      id: "stripe",
      title: "Stripe",
      description: "Pay securely with your credit or debit card",
      icon: <CreditCard className="w-6 h-6" />,
    },
    {
      id: "paypal",
      title: "PayPal",
      description: "Pay using your PayPal account",
      icon: <Wallet className="w-6 h-6" />,
    },
    {
      id: "manual",
      title: "Manual Payment",
      description: "Pay via bank transfer or mobile banking",
      icon: <Banknote className="w-6 h-6" />,
    },
  ];

  const paymentSteps: Record<
    string,
    Array<{ step: number; title: string; description: string; image: string }>
  > = {
    stripe: [
      {
        step: 0,
        title: "Select Stripe as Your Payment Method",
        description:
          "Choose Stripe from the available payment options to begin the secure checkout process.",
        image: "/assets/payment-options/stripe-step-0.png",
      },
      {
        step: 1,
        title: "Enter Your Payment Details",
        description:
          "Fill in your card information and billing details on Stripe's secure payment page.",
        image: "/assets/payment-options/stripe-step-1.png",
      },
    ],
    paypal: [
      {
        step: 0,
        title: "Select PayPal as Your Payment Method",
        description: "Choose PayPal from the available payment options.",
        image: "/assets/payment-options/paypal-step-0.png",
      },
      {
        step: 1,
        title: "Login to PayPal",
        description:
          "Sign in to your PayPal account to proceed with the payment.",
        image: "/assets/payment-options/paypal-step-1.png",
      },
      {
        step: 2,
        title: "Confirm Payment",
        description: "Review and confirm your payment on PayPal.",
        image: "/assets/payment-options/paypal-step-2.png",
      },
    ],
    manual: [
      {
        step: 0,
        title: "Select Manual Payment",
        description:
          "Choose Manual Payment option to pay via bank transfer or mobile banking.",
        image: "/assets/payment-options/manual-step-0.png",
      },
      {
        step: 1,
        title: "Get Payment Code",
        description:
          "You will receive a unique payment code to include with your transaction.",
        image: "/assets/payment-options/manual-step-1.png",
      },
      {
        step: 2,
        title: "Contact Support",
        description:
          "Contact our support team with your payment code to confirm your payment.",
        image: "/assets/payment-options/manual-step-2.png",
      },
    ],
  };

  const faqItems = [
    {
      question: "Which cards are accepted?",
      answer:
        "We accept all major credit and debit cards including Visa, MasterCard, American Express, and Discover through Stripe.",
    },
    {
      question: "Is my payment secure?",
      answer:
        "Yes, all payments are processed through Stripe with industry-standard SSL encryption. Your payment information is never stored on our servers.",
    },
    {
      question: "Will I receive a receipt?",
      answer:
        "Yes, you will receive an email receipt immediately after your payment is processed successfully.",
    },
    {
      question: "What should I do if my payment fails?",
      answer:
        "If your payment fails, please check your card details and try again. If the issue persists, contact our support team for assistance.",
    },
  ];

  return (
    <div className="  ">
      {/* Hero Section */}
      {/* <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
          Payment Options
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Choose your preferred payment method and follow the step-by-step guide to complete your payment securely.
        </p>
      </div> */}

      <section className="relative bg-linear-to-r from-primary/10 via-secondary/5 to-primary/10 pt-37 pb-25 p-4 ">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <CreditCard className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Payment Options
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
              Payment Options
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Choose your preferred payment method and follow the step-by-step
            guide to complete your payment securely.
          </p>
          {/* <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Last Updated: {lastUpdated}
            </p> */}
        </div>
      </section>
 <div className="max-w-350 mx-auto pt-12">
      {/* Payment Methods Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Available Payment Methods
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                  {method.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {method.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {method.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stripe Steps */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          How to Pay with Stripe
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Follow these simple steps to complete your payment
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {paymentSteps.stripe.map((step) => (
            <PaymentStepCard
              key={step.step}
              stepNumber={step.step}
              title={step.title}
              description={step.description}
              imagePath={step.image}
            />
          ))}
        </div>
      </div>

      {/* PayPal Steps */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          How to Pay with PayPal
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Follow these simple steps to complete your payment
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paymentSteps.paypal.map((step) => (
            <PaymentStepCard
              key={step.step}
              stepNumber={step.step}
              title={step.title}
              description={step.description}
              imagePath={step.image}
            />
          ))}
        </div>
      </div>

      {/* Manual Payment Steps */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          How to Pay with Manual Payment
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Follow these simple steps to complete your payment
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paymentSteps.manual.map((step) => (
            <PaymentStepCard
              key={step.step}
              stepNumber={step.step}
              title={step.title}
              description={step.description}
              imagePath={step.image}
            />
          ))}
        </div>
      </div>

      {/* Secure Payment Section */}
      <div className="mb-12">
        <SecurePaymentCard />
      </div>

      {/* FAQ Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Frequently Asked Questions
        </h2>
        <PaymentFAQ items={faqItems} />
      </div>

      {/* Support Section */}
      <div className="mb-12">
        <SupportCard />
      </div>
     </div>
    </div>
  );
};

export default PaymentOptionsPage;
