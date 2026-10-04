"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  HelpCircle,
  MessageCircle,
  Mail,
  BookOpen,
  Clock,
  CreditCard,
  Globe,
  Shield,
  Headphones,
} from "lucide-react";
import Link from "next/link";
import MyButton from "@/components/ui/MyButton";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const FAQPage = () => {
  const [openItems, setOpenItems] = useState<number[]>([1]);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const faqs: FAQItem[] = [
   
    {
      id: 1,
      question: "What is ListenAct?",
      answer:
        "ListenAct is an online language learning platform that focuses on active speaking practice. Unlike traditional classes where you mostly listen, our classes are designed to get you speaking 80% of the time with real-time feedback from expert tutors.",
      category: "general",
    },
    {
      id: 2,
      question:
        "How is ListenAct different from other language learning platforms?",
      answer:
        "The key difference is our focus on speaking practice. In traditional classes, students only speak about 20% of the time. At ListenAct, you'll speak 80% of the time with immediate corrections and feedback. We also offer small group classes (max 8 students) to ensure everyone gets speaking time.",
      category: "general",
    },
    {
      id: 3,
      question: "Who are the tutors?",
      answer:
        "Our tutors are certified language instructors with years of experience. They are native or near-native speakers who are passionate about teaching. All tutors undergo a rigorous selection process and continuous training to ensure high-quality instruction.",
      category: "general",
    },
    {
      id: 4,
      question: "What languages do you offer?",
      answer:
        "Currently, we offer English language courses for all levels - from beginner to advanced. We're planning to add more languages like Spanish, French, German, and Mandarin in the near future.",
      category: "general",
    },

    // Classes & Learning
    {
      id: 5,
      question: "How do the classes work?",
      answer:
        "Classes are conducted live online via our interactive platform. Each session lasts 60 minutes and includes speaking exercises, discussions, role-plays, and real-time feedback. Classes have a maximum of 8 students to ensure personalized attention.",
      category: "classes",
    },
    {
      id: 6,
      question: "What is the class schedule like?",
      answer:
        "We offer classes throughout the day to accommodate different time zones. You can choose from morning, afternoon, or evening sessions. Once you enroll, you'll have access to our schedule and can book classes that fit your availability.",
      category: "classes",
    },
    {
      id: 7,
      question: "What materials do I need?",
      answer:
        "All you need is a computer or mobile device with a stable internet connection, a microphone, and speakers/headphones. We provide all learning materials through our platform - no additional textbooks or purchases required.",
      category: "classes",
    },
    {
      id: 8,
      question: "What happens if I miss a class?",
      answer:
        "We understand life happens! You can reschedule your class up to 12 hours before the scheduled time. If you miss a class without rescheduling, we'll provide you with the class recording and materials to catch up on your own time.",
      category: "classes",
    },

    // Pricing & Payment
    {
      id: 9,
      question: "How much does it cost?",
      answer:
        "We offer flexible pricing plans starting from $15 per class. Monthly subscriptions start at $120 for 10 classes per month. We also offer free trial classes so you can experience our teaching method before committing.",
      category: "pricing",
    },
    {
      id: 10,
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. All payments are processed securely through Stripe.",
      category: "pricing",
    },
    {
      id: 11,
      question: "Is there a refund policy?",
      answer:
        "Yes! We offer a 7-day money-back guarantee for all our plans. If you're not satisfied with your classes, you can request a full refund within 7 days of your purchase. No questions asked.",
      category: "pricing",
    },
    {
      id: 12,
      question: "Can I get a free trial?",
      answer:
        "Absolutely! We offer a free 30-minute trial class with one of our expert tutors. This gives you a chance to experience our teaching method, meet a tutor, and decide if ListenAct is right for you.",
      category: "pricing",
    },

    // Technical Support
    {
      id: 13,
      question: "What technology do I need?",
      answer:
        "You'll need a stable internet connection (minimum 5 Mbps), a modern browser (Chrome, Firefox, Safari, or Edge), a microphone, and speakers. A webcam is optional but recommended for a better learning experience.",
      category: "technical",
    },
    {
      id: 14,
      question: "How do I access my classes?",
      answer:
        "Once you log in to your dashboard, you'll see your upcoming classes. Click on the 'Join Session' button 5 minutes before your class starts to enter the virtual classroom. No additional software installation is required.",
      category: "technical",
    },
    {
      id: 15,
      question: "Is the platform mobile-friendly?",
      answer:
        "Yes! Our platform works perfectly on mobile devices. You can join classes, access materials, and practice speaking from your smartphone or tablet through our responsive web app.",
      category: "technical",
    },
    {
      id: 16,
      question: "What if I have technical issues during class?",
      answer:
        "Our support team is available 24/7 to assist you. You can reach us via live chat, email, or phone. We'll help troubleshoot the issue so you can get back to learning quickly.",
      category: "technical",
    },
  ];

  const categories = [
    { id: "all", name: "All Questions", icon: HelpCircle },
    { id: "general", name: "General", icon: Globe },
    { id: "classes", name: "Classes & Learning", icon: BookOpen },
    { id: "pricing", name: "Pricing & Payment", icon: CreditCard },
    { id: "technical", name: "Technical Support", icon: Shield },
  ];

  const toggleItem = (id: number) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const filteredFAQs =
    activeCategory === "all"
      ? faqs
      : faqs.filter((faq) => faq.category === activeCategory);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50 ">
      {/* Hero Section */}
      <section className="relative bg-linear-to-r from-primary/10 via-secondary/5 to-primary/10 pt-37 pb-25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <HelpCircle className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">FAQ</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Frequently Asked{" "}
              <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                Questions
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Find answers to common questions about ListenAct classes, pricing,
              and more
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category.id
                    ? "bg-primary text-white shadow-lg shadow-primary/30"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.name}
              </button>
            );
          })}
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {filteredFAQs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all hover:shadow-md"
              >
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                >
                  <span className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                    {faq.question}
                  </span>
                  {openItems.includes(faq.id) ? (
                    <ChevronUp className="w-5 h-5 text-primary shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-primary shrink-0" />
                  )}
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out ${
                    openItems.includes(faq.id)
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 pb-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Still Have Questions */}
          <div className="mt-16 bg-linear-to-r from-primary/5 to-secondary/5 rounded-2xl p-8 text-center border border-primary/20">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Still have questions?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Can't find the answer you're looking for? Please contact our
              support team.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <MyButton>
                  <MessageCircle className="w-4 h-4" />
                  Contact Support
                </MyButton>
              </Link>
              <Link href="/classes">
                <MyButton variant="outline">Try a Free Class</MyButton>
              </Link>
            </div>
          </div>

          {/* Quick Help Links */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center hover:shadow-md transition-all">
              <Mail className="w-8 h-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                Email Support
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                support@listenact.com
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center hover:shadow-md transition-all">
              <Headphones className="w-8 h-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                Live Chat
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                24/7 Support Available
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center hover:shadow-md transition-all">
              <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                Response Time
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Within 24 hours
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
