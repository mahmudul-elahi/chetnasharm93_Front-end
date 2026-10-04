"use client";

import Link from "next/link";
import React from "react";
import { Languages, Mic, HelpCircle, ChevronRight } from "lucide-react";
import MyButton from "@/components/ui/MyButton";

const FreeResourcesManagementPage = () => {
  const resources = [
    {
      name: "Vocabulary Management",
      description:
        "Manage vocabulary words, meanings, examples, and pronunciations",
      href: "/dashboard/free-resources/vocabulary",
      icon: Languages,
      color: "purple",
    },
    {
      name: "Speaking Topics",
      description:
        "Manage speaking topics for different proficiency levels (A1-C2)",
      href: "/dashboard/free-resources/speaking-topics",
      icon: Mic,
      color: "blue",
    },
    {
      name: "Basic Questions",
      description: "Manage basic questions for language learning and practice",
      href: "/dashboard/free-resources/basic-questions",
      icon: HelpCircle,
      color: "green",
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      purple: {
        bg: "bg-purple-50",
        text: "text-purple-600",
        hover: "hover:border-purple-200",
        icon: "text-purple-500",
      },
      blue: {
        bg: "bg-blue-50 ",
        text: "text-blue-600",
        hover: "hover:border-blue-200 dark:hover:border-blue-800",
        icon: "text-blue-500",
      },
      green: {
        bg: "bg-green-50 ",
        text: "text-green-600",
        hover: "hover:border-green-200 dark:hover:border-green-800",
        icon: "text-green-500",
      },
    };
    return colors[color as keyof typeof colors] || colors.purple;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Free Resources Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage all your free educational resources in one place
          </p>
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource, index) => {
          const Icon = resource.icon;
          const colors = getColorClasses(resource.color);

          return (
            <Link
              key={index}
              href={resource.href}
              className="group block bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-200 hover:border-primary/50"
            >
              <div className="p-6">
                {/* Icon */}
                <div
                  className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center mb-4`}
                >
                  <Icon className={`w-6 h-6 ${colors.icon}`} />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                  {resource.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {resource.description}
                </p>

                {/* Action */}
                <MyButton variant="secondary"
                  className={`flex items-center text-sm font-medium`}
                >
                  <span>Manage Resources</span>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </MyButton>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Help Section */}
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
            <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
              Need help managing resources?
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Click on any card above to start managing that specific resource.
              Each section has its own set of tools for adding, editing, and
              organizing content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeResourcesManagementPage;
