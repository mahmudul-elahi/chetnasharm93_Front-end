"use client";

import React from "react";
import {
  FileText,
  TrendingUp,
  AlertCircle,
  Target,
  CheckCircle2,
  FileChartColumn,

} from "lucide-react";
import Link from "next/link";
import MyButton from "@/components/ui/MyButton";

export default function MonthlyProgress() {
  const weeks = [
    { week: "Week 1", score: 65 },
    { week: "Week 2", score: 72 },
    { week: "Week 3", score: 78 },
    { week: "Week 4", score: 85 }
  ];

  return (
    <section className="py-16 md:py-24 bg-linear-to-bl from-white via-gray-50 to-secondary/5">
      <div className="max-w-350 px-4 sm:px-6 lg:px-8 mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-linear-to-r from-primary/10 to-secondary/10 text-primary text-xs md:text-sm font-medium mb-4 md:mb-6 border border-primary/20">
            <FileText className="w-4 h-4" />
            Monthly Progress Reports
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 ">
            Know Exactly{" "}
            <span className="bg-linear-to-r from-primary via-primary/90 to-secondary bg-clip-text text-transparent">Where You Stand</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            <span className="flex items-center gap-1 text-sm text-gray-600">
              <AlertCircle className="w-4 h-4 text-red-500" />
              Your mistakes
            </span>
            <span className="text-gray-300">→</span>
            <span className="flex items-center gap-1 text-sm text-gray-600">
              <TrendingUp className="w-4 h-4 text-green-500" />
              Your improvement
            </span>
            <span className="text-gray-300">→</span>
            <span className="flex items-center gap-1 text-sm text-gray-600">
              <Target className="w-4 h-4 text-purple-500" />
              What to fix next
            </span>
          </div>
          <p className="text-gray-400 text-sm mt-3">
            No confusion. No guessing.
          </p>
        </div>

        {/* Demo Report Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
            {/* Report Header */}
            <div className="bg-linear-to-r from-primary to-secondary px-6 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-white/70 text-xs">Monthly Progress Report</p>
                  <p className="text-white font-semibold text-sm md:text-base">Student Demo | March 2026</p>
                </div>
                <div className="bg-white/20 rounded-full px-2 py-2 flex items-center justify-center">
                  <span className="text-white text-xs font-medium">Sample Report</span>
                </div>
              </div>
            </div>

            {/* Report Content */}
            <div className="p-6">
              {/* Three Key Metrics */}
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                {/* Mistakes Card */}
                <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="text-xs font-semibold text-red-600">Your Mistakes</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                  <p className="text-xs text-red-500 mt-1">↓ 45% from last month</p>
                  <div className="mt-3 pt-2 border-t border-red-100">
                    <p className="text-xs text-gray-600">Top error: Article usage</p>
                    <p className="text-xs text-gray-500 mt-0.5">12 occurrences</p>
                  </div>
                </div>

                {/* Improvement Card */}
                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-xs font-semibold text-green-600">Your Improvement</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">+32%</p>
                  <p className="text-xs text-green-500 mt-1">↑ Overall progress</p>
                  <div className="mt-3 pt-2 border-t border-green-100">
                    <p className="text-xs text-gray-600">Speaking: +18%</p>
                    <p className="text-xs text-gray-500 mt-0.5">Grammar: +12%</p>
                  </div>
                </div>

                {/* What to Fix Card */}
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-purple-500" />
                    <span className="text-xs font-semibold text-purple-600">What to Fix Next</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">3 Focus Areas</p>
                  <div className="mt-3 pt-2 border-t border-purple-100">
                    <p className="text-xs text-gray-600">Present Perfect Tense</p>
                    <p className="text-xs text-gray-500 mt-0.5">Business Vocabulary</p>
                    <p className="text-xs text-gray-500 mt-0.5">'th' Pronunciation</p>
                  </div>
                </div>
              </div>

              {/* Progress Chart */}
              <div className="border-t border-gray-100 pt-6">
                <p className="text-sm font-medium text-gray-700 mb-4">Weekly Progress Trend</p>
                <div className="space-y-3">
                  {weeks.map((week) => (
                    <div key={week.week}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">{week.week}</span>
                        <span className="text-gray-500">{week.score}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${week.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-primary/5 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Overall Improvement</span>
                    <span className="text-primary font-semibold text-sm">+20%</span>
                  </div>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-center text-sm text-gray-500 mb-4">
                  Every student gets detailed monthly reports
                </p>
                <div className="flex justify-center">
                  <Link href="/">
                    <MyButton className="gap-2">
                      View Sample Report
                      <FileChartColumn  className="w-4 h-4" />
                    </MyButton>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span className="text-sm text-gray-600">Track your mistakes</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span className="text-sm text-gray-600">See your improvement</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span className="text-sm text-gray-600">Personalized focus areas</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}