"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Shield,
  Calendar,
  Clock,
  UserX,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Users,
  User,
  Video,
  Mail,
  FileText,
  Menu,
  X,
  ChevronRight,
  DollarSign,
  CalendarX,
  Timer,
  BookOpen,
  Ban,
  Receipt,
  UserRoundX,
} from "lucide-react";

interface ContentItem {
  subtitle?: string;
  text?: string;
  list?: string[];
  note?: string;
  example?: string;
}

interface Section {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  content: ContentItem[];
}

const RefundPolicyPage = () => {
  const lastUpdated = "June 3, 2026";
  const [isJumpMenuOpen, setIsJumpMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const sections: Section[] = [
    {
      id: "cancellation-before-start",
      title: "Cancellation Before the Batch Starts",
      icon: CalendarX,
      content: [
        {
          text: "If you register for a batch but decide to cancel before the course officially begins, please note the following policy:",
          list: [
            "No Refunds: We strictly enforce a no-refund policy.",
            "Course Credit: You may reschedule and take the same batch at a later date, subject to teacher availability. We will do our best to provide you with alternative class and batch options at that time.",
            "6-Month Validity: You must redeem this credit and resume your classes within 6 months of your original registration date.",
            "Condition: This option is only valid if you have not attended any classes and did not stop mid-way through a session.",
          ],
        },
      ],
    },
    {
      id: "dissatisfaction-after-first",
      title: "Dissatisfaction After the First Class",
      icon: UserRoundX,
      content: [
        {
          text: "To ensure the best possible learning experience and avoid dissatisfaction during your course, we strongly encourage you to select your instructor carefully:",
          list: [
            "Demo Classes: Always take a demo class before fully enrolling to familiarize yourself with the instructor's teaching style.",
          ],
        },
      ],
    },
  ];

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsJumpMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("[data-section-id]");
      let currentActive = "";

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          currentActive = section.getAttribute("data-section-id") || "";
        }
      });

      setActiveSection(currentActive);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
    setIsJumpMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative bg-linear-to-r from-primary/10 via-secondary/5 to-primary/10 pt-37 pb-25">
        <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Refund Policy
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Our{" "}
              <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                Refund Policy
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Clear guidelines for cancellations and course credits
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Last Updated: {lastUpdated}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Jump to Section Button - Sticky */}
        <div className="sticky top-20 z-30 mb-8">
          <button
            ref={buttonRef}
            onClick={() => setIsJumpMenuOpen(!isJumpMenuOpen)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group cursor-pointer"
          >
            {isJumpMenuOpen ? (
              <X className="w-4 h-4 text-primary" />
            ) : (
              <Menu className="w-4 h-4 text-primary" />
            )}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Jump to Section
            </span>
            <ChevronRight
              className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
                isJumpMenuOpen ? "rotate-90" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu with Animation */}
          <div
            ref={menuRef}
            className={`absolute left-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 origin-top-left z-20 ${
              isJumpMenuOpen
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
            }`}
          >
            <div className="p-2 max-h-96 overflow-y-auto">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group cursor-pointer ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <div
                      className={`p-1.5 rounded-lg transition-all ${
                        isActive
                          ? "bg-primary/20"
                          : "bg-gray-100 dark:bg-gray-700 group-hover:bg-primary/10"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 ${
                          isActive
                            ? "text-primary"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      />
                    </div>
                    <span
                      className={`text-sm font-medium flex-1 ${
                        isActive
                          ? "text-primary"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {section.title}
                    </span>
                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Policy Sections */}
        <div className="space-y-8">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div
                key={section.id}
                id={section.id}
                data-section-id={section.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden scroll-mt-20 transition-all duration-300 hover:shadow-md"
              >
                <div className="border-b border-gray-200 dark:border-gray-700 bg-linear-to-r from-primary/5 to-secondary/5 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {section.title}
                    </h2>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  {section.content.map((content, idx) => (
                    <div key={idx}>
                      {content.text && (
                        <p className="text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                          {content.text}
                        </p>
                      )}
                      {content.list && (
                        <ul className="space-y-2 mt-3">
                          {content.list.map((item, itemIdx) => (
                            <li key={itemIdx} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                              <span className="text-gray-600 dark:text-gray-400 text-sm">
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Important Notice Box */}
        <div className="mt-12 p-6 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-200 dark:border-red-800">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="font-semibold text-red-800 dark:text-red-300 mb-1">
                Important Notice
              </h3>
              <p className="text-sm text-red-700 dark:text-red-400">
                By enrolling in any Listenact class, you agree to the terms and
                conditions outlined in this policy. Please read carefully before
                completing your registration.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            By using Listenact, you acknowledge that you have read, understood,
            and agree to be bound by this Refund Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicyPage;