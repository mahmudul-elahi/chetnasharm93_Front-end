"use client";

import React, { useEffect } from "react";
import {
  BookOpen,
  FileText,
  MessageCircle,
  Download,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Gift,
  Clock,
  TrendingUp,
  Headphones,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MyButton from "@/components/ui/MyButton";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { restoreTabFromStorage, setActiveTab } from "@/src/redux/slices/tabSlice";

export default function FreeStudyMaterial() {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector((state) => state.tab.activeTab);
  const pathname = usePathname();

  // Restore saved tab on mount
  useEffect(() => {
    dispatch(restoreTabFromStorage());
  }, [dispatch]);

  // Save last visited tab when leaving the page
  useEffect(() => {
    return () => {
      // This runs when component unmounts (user navigates away)
      localStorage.setItem('lastVisitedTab', activeTab.toString());
      localStorage.setItem('lastVisitedPage', pathname);
    };
  }, [activeTab, pathname]);

  const handleTabChange = (tabIndex: number) => {
    dispatch(setActiveTab(tabIndex));
  };

  const tabs = [
    {
      name: "Vocabulary",
      icon: BookOpen,
      color: "blue",
      content: {
        title: "Build Your Word Power",
        description: "Weekly themed vocabulary lists with real-life examples",
        stats: [
          "500+ words/year",
          "Thematic categories",
          "Audio pronunciations",
          "Flashcards",
        ],
        image: "/assets/freeStudyMaterial/vocabulary.svg",
        monthly: "50+ new words every month",
        link: "/free-resources/vocabulary",
      },
      data: false,
    },
    {
      name: "Speaking Topics",
      icon: MessageCircle,
      color: "purple",
      content: {
        title: "Never Run Out of Things to Say",
        description: "Real-world topics that spark natural conversations",
        stats: [
          "96 topics/year",
          "Debate questions",
          "Role-play scenarios",
          "Discussion guides",
        ],
        image: "/assets/freeStudyMaterial/speaking.svg",
        monthly: "8 fresh topics every month",
        link: "/free-resources/speaking-topics",
      },
      data: false,
    },
    {
      name: "Basic English Questions",
      icon: FileText,
      color: "green",
      content: {
        title: "Reinforce What You Learn",
        description: "Worksheets and quizzes to lock in your progress",
        stats: [
          "240+ exercises/year",
          "Answer keys included",
          "Progress tracking",
          "Self-assessment",
        ],
        image: "/assets/freeStudyMaterial/practice.svg",
        monthly: "20+ exercises every month",
        link: "/free-resources/practice-exercises",
      },
      data: false,
    },
  ];

  return (
    <section className="min-h-screen bg-linear-to-br from-slate-50 via-white to-purple-50">
      {/* Header */}
      <section className="relative bg-linear-to-r from-purple-500/10 via-indigo-500/5 to-purple-500/10 pt-25 lg:pt-33 xl:pt-37 pb-12">
        <div className="max-w-350 mx-auto px-4">
          <div className="text-center mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 rounded-full mb-4">
              <Gift className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-600">
                Included With Every Plan
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Free Study Material{" "}
              <span className="bg-linear-to-r from-primary via-primary/90 to-secondary bg-clip-text text-transparent">
                Every Month
              </span>
            </h2>
            <p className="text-gray-600 text-lg">
              You get structured content so you're never lost
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-350 px-4 sm:px-6 lg:px-8 mx-auto py-12 lg:py-16 xl:py-25">
        {/* Hero Stat Bar - Responsive Grid */}
        <div className="bg-linear-to-r from-primary/5 via-secondary/5 to-primary/5 rounded-2xl p-3 md:p-4 mb-10 md:mb-12">
          <div className="grid grid-cols-3 divide-x divide-gray-200">
            <div className="text-center px-2">
              <p className="text-xl md:text-2xl font-bold text-primary">500+</p>
              <p className="text-xs text-gray-500">Vocabulary Words</p>
            </div>
            <div className="text-center px-2">
              <p className="text-xl md:text-2xl font-bold text-primary">96</p>
              <p className="text-xs text-gray-500">Speaking Topics</p>
            </div>
            <div className="text-center px-2">
              <p className="text-xl md:text-2xl font-bold text-primary">240+</p>
              <p className="text-xs text-gray-500">Practice Exercises</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation - Scrollable on mobile */}
        <div className="flex flex-col md:flex-row justify-center gap-4 mb-8 pb-2 px-1">
          {tabs.map((tab, idx) => (
            <button
              key={tab.name}
              onClick={() => handleTabChange(idx)}
              className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-3 rounded-full transition-all whitespace-nowrap cursor-pointer ${
                activeTab === idx
                  ? `bg-${tab.color}-500 text-white shadow-lg`
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <tab.icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="text-xs md:text-sm font-medium">{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Tab Content - Responsive Card */}
        <div className="max-w-4xl mx-auto mb-10 md:mb-12">
          {tabs.map((tab, idx) => (
            <div
              key={tab.name}
              className={`transition-all duration-500 ${
                activeTab === idx ? "block" : "hidden"
              }`}
            >
              <div
                className={`bg-linear-to-br from-${tab.color}-50 to-white rounded-2xl border border-${tab.color}-200 shadow-xl overflow-hidden`}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Left - Content */}
                  <div className="flex-1 p-5 md:p-8">
                    <div
                      className={`inline-flex items-center gap-2 px-2 py-1 md:px-3 md:py-1 rounded-full bg-${tab.color}-100 text-${tab.color}-700 text-xs font-medium mb-3 md:mb-4`}
                    >
                      <Clock className="w-3 h-3" />
                      {tab.content.monthly}
                    </div>

                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">
                      {tab.content.title}
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
                      {tab.content.description}
                    </p>

                    <div className="space-y-2 md:space-y-3 mb-5 md:mb-6">
                      {tab.content.stats.map((stat) => (
                        <div
                          key={stat}
                          className="flex items-center gap-2 md:gap-3"
                        >
                          <CheckCircle2
                            className={`w-4 h-4 md:w-5 md:h-5 text-${tab.color}-500 shrink-0`}
                          />
                          <span className="text-sm md:text-base text-gray-700">
                            {stat}
                          </span>
                        </div>
                      ))}
                    </div>
                    {tab.content.link && (
                      <Link href={tab.content.link}>
                        <Button
                          variant="outline"
                          className={`gap-2 px-4 text-sm md:text-base bg-${tab.color}-500 text-white`}
                        >
                          Show All {tab.name}
                          <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        </Button>
                      </Link>
                    )}
                  </div>

                  {/* Right - Visual */}
                  <div
                    className={`flex-1 bg-linear-to-br from-${tab.color}-500 to-${tab.color}-600 p-6 md:p-8 flex flex-col items-center justify-center text-center min-h-[200px] md:min-h-0`}
                  >
                    <img src={tab.content.image} alt={tab.content.title} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {tabs.map((tab, idx) => (
          <div
            key={tab.name}
            className={`transition-all duration-500 ${
              activeTab === idx && tab.data === true ? "block" : "hidden"
            }`}
          >
            hello
          </div>
        ))}

        {/* Features Grid - Responsive */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-10">
          <div className="text-center p-2 md:p-3">
            <div className="w-8 h-8 md:w-10 md:h-10 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-1 md:mb-2">
              <Download className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            </div>
            <p className="text-xs text-gray-600">Downloadable PDFs</p>
          </div>
          <div className="text-center p-2 md:p-3">
            <div className="w-8 h-8 md:w-10 md:h-10 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-1 md:mb-2">
              <Headphones className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            </div>
            <p className="text-xs text-gray-600">Audio Included</p>
          </div>
          <div className="text-center p-2 md:p-3">
            <div className="w-8 h-8 md:w-10 md:h-10 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-1 md:mb-2">
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            </div>
            <p className="text-xs text-gray-600">Track Progress</p>
          </div>
          <div className="text-center p-2 md:p-3">
            <div className="w-8 h-8 md:w-10 md:h-10 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-1 md:mb-2">
              <Calendar className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            </div>
            <p className="text-xs text-gray-600">New Every Month</p>
          </div>
        </div>

        {/* CTA - Responsive (commented out in original) */}
        {/* <div className="text-center">
          <div className="inline-flex flex-col items-center w-full sm:w-auto">
            <Link href="/register" className="w-full sm:w-auto">
              <MyButton className="gap-2 md:gap-3 group w-full sm:w-auto">
                Start Getting Free Materials
                <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 transition-transform group-hover:translate-x-1" />
              </MyButton>
            </Link>
            <div className="flex items-center gap-1.5 md:gap-2 mt-2 md:mt-3">
              <CheckCircle2 className="w-3 h-3 text-green-500" />
              <span className="text-xs text-gray-500">
                Included with any class package • No extra cost
              </span>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
}