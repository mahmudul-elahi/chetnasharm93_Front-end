"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Shield,
  FileText,
  Scale,
  CreditCard,
  Users,
  AlertCircle,
  CheckCircle,
  BookOpen,
  Clock,
  Mail,
  Lock,
  Globe,
  Server,
  UserCheck,
  DollarSign,
  RefreshCw,
  XCircle,
  Menu,
  ChevronRight,
  Video,
  Calendar,
  Ban,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import MyButton from "@/components/ui/MyButton";

interface ContentItem {
  subtitle?: string;
  text?: string;
  list?: string[];
  note?: string;
}

interface Section {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  content: ContentItem[];
}

const TermsOfServicePage = () => {
  const lastUpdated = "June 2, 2026";
  const [isJumpMenuOpen, setIsJumpMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const sections: Section[] = [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      icon: FileText,
      content: [
        {
          text: "Welcome to Listenact (the 'Platform,' 'we,' 'us,' or 'our'). These Terms and Conditions ('Terms') govern your access to and use of the Listenact website, services, and live language classes (collectively, the 'Services').",
        },
        {
          text: "By creating an account, purchasing a class package, or using our Services as either a student ('Student') or an independent instructor ('Teacher'), you agree to be bound by these Terms. If you do not agree, do not use the Platform.",
          note: "Please review these Terms periodically for changes. Continued use constitutes acceptance of the new Terms.",
        },
      ],
    },
    {
      id: "platform-nature",
      title: "Nature of Our Platform",
      icon: Globe,
      content: [
        {
          text: "Listenact is an online marketplace and educational platform that connects independent language Teachers with Students.",
          list: [
            "Independent Contractor Status: Teachers are independent service providers and are not employees, agents, or partners of Listenact. Listenact does not control the specific teaching methods of individual Teachers, though we maintain quality guidelines.",
            "No Endorsement: While we vet our instructors, Listenact does not guarantee the specific fluency outcomes, academic success, or individual satisfaction of any class.",
          ],
        },
      ],
    },
    {
      id: "eligibility",
      title: "Account Eligibility & Security",
      icon: UserCheck,
      content: [
        {
          subtitle: "Age Requirement",
          text: "You must be at least 16 years of age to create an account and use the Services. Listenact does not offer classes for children at this time.",
        },
        {
          subtitle: "Account Responsibility",
          text: "You are responsible for maintaining the confidentiality of your login credentials. Any activity occurring under your account is your sole responsibility.",
        },
      ],
    },
    {
      id: "subscription",
      title: "Subscription, Billing, and Fees",
      icon: DollarSign,
      content: [
        {
          subtitle: "Subscription Model",
          text: "Students purchase monthly class packages. The renewal fees depend on the frequency of classes selected per week.",
        },
        {
          subtitle: "Automatic Renewal",
          text: "Unless cancelled prior to your next billing cycle, monthly subscriptions will automatically renew at the prevailing rate.",
        },
        {
          subtitle: "Demo Classes",
          text: "Students are highly encouraged to take a demo class before purchasing a full package to ensure the platform and teaching style meet their expectations.",
          note: "Take advantage of our demo class offer to experience the platform risk-free!",
        },
      ],
    },
    {
      id: "cancellation",
      title: "Strict Cancellation and Refund Policy",
      icon: Ban,
      content: [
        {
          text: "Because our classes are scheduled in fixed premium blocks, booking a slot for one student means turning away another. Therefore, we enforce a strict policy regarding payments and scheduling:",
        },
        {
          subtitle: "4.1. General Refund Policy",
          text: "No Cash/Credit Card Refunds: All sales are final. No cash or credit card refunds will be issued under any circumstances.",
        },
        {
          subtitle: "4.2. Prior to Batch Commencement",
          text: "If a Student cannot attend classes due to unforeseen personal circumstances and notifies Listenact before the scheduled batch officially starts, they may request Store Credit.",
          list: [
            "Store Credit is valid for exactly six (6) months from the date of issuance and can be used toward future Listenact packages.",
            "After six months, unused credit is permanently forfeited.",
          ],
        },
        {
          subtitle: "4.3. After Batch Commencement",
          text: "Once a batch has officially started, absolutely no refunds, no store credits, and no pro-rated adjustments will be provided for any reason.",
          note: "This policy applies regardless of attendance or participation.",
        },
        {
          subtitle: "4.4. Schedule Changes and Timing",
          text: "Class timings are fixed upon booking. Once a batch has started, Students cannot change their class timings.",
          list: [
            "Students may submit a written request for a schedule modification",
            "We will make reasonable efforts to accommodate the request based on Teacher and platform availability",
            "No guarantees or promises are made for schedule changes",
          ],
        },
        {
          subtitle: "4.5. Student and Teacher No-Shows",
          text: "",
          list: [
            "Student No-Show: If a student misses a scheduled live class, the class is considered forfeited. No make-up class, credit, or replacement will be provided.",
            "Teacher No-Show: If a teacher fails to show up to a scheduled class, the class will be postponed. Listenact will arrange a replacement make-up class for the affected Students at a later date.",
          ],
        },
      ],
    },
    {
      id: "recordings",
      title: "Live Class Recordings and Privacy",
      icon: Video,
      content: [
        {
          subtitle: "Class Recording",
          text: "To ensure quality assurance and to provide educational support, group classes are recorded.",
        },
        {
          subtitle: "Missed Classes",
          text: "If a Student misses a scheduled group class, Listenact may provide them with access to the Zoom/video recording of that specific session.",
        },
        {
          subtitle: "Consent",
          text: "By participating in group classes, you explicitly consent to your voice, video, and username being recorded and shared with the other registered students of that specific batch.",
          list: [
            "You agree not to download, distribute, or publicly share these recordings outside of the Platform.",
          ],
          note: "Unauthorized distribution of class recordings is a violation of these Terms and may result in account termination.",
        },
      ],
    },
    {
      id: "conduct",
      title: "Code of Conduct and Non-Circumvention",
      icon: Shield,
      content: [
        {
          subtitle: "Acceptable Use",
          text: "Users must treat each other with respect.",
          list: [
            "Harassment, abusive language, discrimination, or inappropriate behavior during live sessions will result in immediate account termination without refund.",
          ],
        },
        {
          subtitle: "Non-Circumvention (Off-Platform Payments)",
          text: "Students and Teachers are strictly prohibited from soliciting, offering, or accepting private lessons or payments outside of the Listenact platform.",
          list: [
            "Any attempt to bypass the Listenact billing system will result in a permanent ban for both the Student and the Teacher.",
          ],
          note: "This policy protects both parties and ensures quality control through our platform.",
        },
      ],
    },
    {
      id: "limitation",
      title: "Limitation of Liability",
      icon: AlertCircle,
      content: [
        {
          text: "To the maximum extent permitted by applicable law, Listenact, its directors, employees, and partners shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of, or inability to use, the Services.",
        },
      ],
    },
    {
      id: "governing",
      title: "Governing Law",
      icon: Scale,
      content: [
        {
          text: "These Terms and any disputes arising out of or related to them shall be governed by and construed in accordance with the laws of the Province of Ontario and the federal laws of Canada, without regard to its conflict of law principles.",
        },
        {
          text: "Any legal actions must be brought in the courts located in Ottawa, Ontario.",
        },
      ],
    },
    {
      id: "modifications",
      title: "Modifications to Terms",
      icon: RefreshCw,
      content: [
        {
          text: "We reserve the right to modify these Terms at any time. We will notify users of any major changes by updating the 'Last Updated' date at the top of this page or via email.",
        },
        {
          text: "Continued use of the platform after changes are posted constitutes acceptance of the new Terms.",
          note: "Please review these Terms periodically to stay informed of updates.",
        },
      ],
    },
    {
      id: "contact",
      title: "Contact Us",
      icon: Mail,
      content: [
        {
          text: "For any questions, legal notices, or clarifications regarding these Terms, please contact us at:",
          list: [
            "Email: contact@listenact.ca",
            "Location: Ottawa, Ontario, Canada",
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
              <Scale className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Terms and Conditions
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                Terms & Conditions
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Please read these terms carefully before using our service
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
              <XCircle className="w-4 h-4 text-primary" />
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
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
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

        {/* Terms Sections */}
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
                      {content.subtitle && (
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                          {content.subtitle}
                        </h3>
                      )}
                      {content.text && !content.subtitle && (
                        <p className="text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                          {content.text}
                        </p>
                      )}
                      {content.text && content.subtitle && (
                        <p className="text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                          {content.text}
                        </p>
                      )}
                      {content.list && (
                        <ul className="space-y-2 mt-3">
                          {content.list.map((item, itemIdx) => (
                            <li
                              key={itemIdx}
                              className="flex items-start gap-2"
                            >
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                              <span className="text-gray-600 dark:text-gray-400 text-sm">
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {content.note && (
                        <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                            <p className="text-sm text-amber-800 dark:text-amber-300">
                              {content.note}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Acceptance Banner */}
        <div className="mt-12 bg-linear-to-r from-primary/5 to-secondary/5 rounded-2xl p-6 text-center border border-primary/20">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            By using Listenact, you agree to these Terms and Conditions
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            If you do not agree with any part of these terms, please do not use
            our service.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/contact">
              <MyButton variant="primary" className="gap-2">
                Contact Us
              </MyButton>
            </Link>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            These Terms and Conditions constitute the entire agreement between you
            and Listenact regarding the use of our service.
          </p>
          <p className="mt-2">
            For legal inquiries, please contact us at{" "}
            <a
              href="mailto:contact@listenact.ca"
              className="text-primary hover:underline"
            >
              contact@listenact.ca
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;