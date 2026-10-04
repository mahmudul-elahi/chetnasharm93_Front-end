import React from "react";
import {
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Play,
  MessageCircle,
  Briefcase,
  BadgeQuestionMark,
  Box,
} from "lucide-react";
import Link from "next/link";
import MyButton from "@/components/ui/MyButton";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Learn",
      description: "Concepts explained in your language",
      icon: Play,
      placeholder: "/assets/howItWorks/Learning-languages.svg",
      bgColor: "from-blue-500/10 to-blue-600/5",
      borderColor: "border-blue-200 dark:border-blue-900/30",
      iconColor: "text-blue-600",
      details: [
        "Concepts explained in your native language ",
        "1-on-1 live speaking sessions ",
        "Real-time pronunciation feedback",
        "Daily speaking challenges",
      ],
    },
    {
      number: "02",
      title: "Practice",
      description: "Speak with your teacher live",
      icon: MessageCircle,
      placeholder: "/assets/howItWorks/Voice-chat-pana.svg",
      bgColor: "from-purple-500/10 to-purple-600/5",
      borderColor: "border-purple-200 dark:border-purple-900/30",
      iconColor: "text-purple-600",
      details: [
        "Role-play exercises in class",
        "Daily translation practice",
        "Group practice with other students",
        "Weekly speaking challenges",
      ],
    },
    {
      number: "03",
      title: "Implement",
      description: "Use English in real-life situations",
      icon: Briefcase,
      placeholder: "/assets/howItWorks/Group-therapy.svg",
      bgColor: "from-green-500/10 to-green-600/5",
      borderColor: "border-green-200 dark:border-green-900/30",
      iconColor: "text-green-600",
      details: [
        "Real-life conversation practice",
        "Assignments to build confidence",
        "Weekly tests to track progress",
        "Use English in your daily life",
      ],
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-linear-to-bl from-white via-gray-50 to-secondary/5">
      <div className="max-w-350 px-4 sm:px-6 lg:px-8 xl:px-0 mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <BadgeQuestionMark className="w-4 h-4" />
            How It Works
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            Simple{" "}
            <span className="bg-linear-to-r from-primary via-primary/90 to-secondary bg-clip-text text-transparent">
              3-Step System
            </span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            Learn → Practice → Implement - A proven path to English fluency
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-6xl mx-auto space-y-12 md:space-y-20">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className={`flex flex-col ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } gap-8 lg:gap-12 items-center group`}
            >
              {/* Image Container - Fixed dimensions */}
              <div className="flex-1 w-full">
                <div className="relative max-w-md mx-auto lg:mx-0">
                  {/* Decorative background */}
                  <div
                    className={`absolute inset-0 bg-linear-to-br ${step.bgColor} rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform duration-500`}
                  />
                  <div
                    className={`absolute inset-0 bg-linear-to-br ${step.bgColor} rounded-3xl transform -rotate-3 group-hover:-rotate-6 transition-transform duration-500`}
                  />

                  {/* Image Box */}
                  <div
                    className={`relative bg-white dark:bg-gray-800 rounded-3xl border-2 ${step.borderColor} shadow-xl overflow-hidden group-hover:shadow-2xl transition-all duration-300`}
                  >
                    {/* Fixed aspect ratio box - 4:3 */}
                    <div className="relative w-full aspect-4/3">
                      <img
                        src={step.placeholder}
                        alt={`${step.title} illustration`}
                        className="w-full h-full object-contain p-6 md:p-8 transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* Step Number Badge */}
                    <div
                      className={`absolute -top-3 -left-3 w-14 h-14 rounded-full bg-linear-to-br from-primary to-primary/80 text-white flex items-center justify-center font-bold text-xl shadow-lg ring-4 ring-white dark:ring-gray-800`}
                    >
                      {step.number}
                    </div>

                    {/* Icon Badge */}
                    <div
                      className={`absolute -bottom-3 -right-3 w-12 h-12 rounded-full bg-white dark:bg-gray-800 ${step.borderColor} border-2 flex items-center justify-center shadow-lg`}
                    >
                      <step.icon className={`w-6 h-6 ${step.iconColor}`} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 w-full">
                <div className="space-y-5">
                  {/* Title with accent line */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-1 h-8 rounded-full bg-linear-to-b to-primary`}
                      />
                      <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                        {step.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-primary font-semibold text-lg flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      {step.description}
                    </p>
                  </div>

                  {/* Details List - Grid layout */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {step.details.map((detail, idx) => (
                      <div
                        key={detail}
                        className="flex items-start gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group/item"
                        style={{ animationDelay: `${idx * 100}ms` }}
                      >
                        <CheckCircle2
                          className={`w-5 h-5 ${step.iconColor} shrink-0 mt-0.5 transition-transform group-hover/item:scale-110`}
                        />
                        <span className="text-gray-600 dark:text-gray-300 text-sm">
                          {detail}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Decorative line */}
                  <div className="pt-4">
                    <div
                      className={`w-20 h-1 rounded-full bg-linear-to-r to-primary opacity-50`}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

        </div>
        <div className="max-w-3xl mx-auto mt-12 md:mt-20">
          <div className="relative group">
            {/* Animated border */}
            <div className="absolute -inset-0.5 bg-linear-to-r from-emerald-400 to-green-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500" />

            <div className="relative bg-linear-to-br from-emerald-50 via-white to-green-50 border border-emerald-200 rounded-2xl p-6 md:p-8 text-center shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className="text-4xl animate-bounce">⚠️</span>
                <p className="text-emerald-800 font-bold text-lg md:text-xl">
                  This is where most people fail
                </p>
              </div>
              <p className="text-emerald-700 mb-4">
                Most courses only teach you concepts - they never make you
                practice or implement what you've learned.
              </p>
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-linear-to-r from-emerald-500 to-green-500 rounded-full shadow-md hover:shadow-lg transition-all duration-300">
                <TrendingUp className="w-4 h-4 text-white animate-pulse" />
                <span className="text-white font-semibold">We fix that. ✓</span>
              </div>
            </div>
          </div>
        </div>
<div className="text-center mt-12 md:mt-16">
          <div className="relative flex flex-col gap-4">
            <Link href="/dashboard">
              <MyButton className="gap-3 relative group overflow-hidden">
                Start Your Journey
                <TrendingUp className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </MyButton>
            </Link>
                        <Link href="/free-resources">
              <MyButton className="gap-3 relative group overflow-hidden">
                Free Resources
                <Box className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </MyButton>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-primary" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                10,000+ Learners
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-primary" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                500+ Courses
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-primary" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                4.9★ Rating
              </span>
            </div>
          </div>
        </div>
        {/* Flow Connector Lines (Desktop) */}
        <div className="hidden lg:block relative max-w-4xl mx-auto my-8">
          <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-16 bg-linear-to-b from-gray-300 to-transparent dark:from-gray-700" />
          <div
            className="absolute left-1/2 transform -translate-x-1/2 w-px h-16 bg-linear-to-b from-gray-300 to-transparent dark:from-gray-700"
            style={{ top: "calc(33.33% - 32px)" }}
          />
        </div>
        
      </div>
    </section>
  );
}
