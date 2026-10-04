"use client";

import React, { useState, useEffect } from "react";
import {
  Target,
  Trophy,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Award,
  Clock,
  FileText,
  Star,
  Users,
  Zap,
  ChevronsLeft,
  ChevronRight
} from "lucide-react";

export default function TestsAndEvaluation() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const courseDurations = [
    {
      duration: "1 Month",
      icon: Zap,
      tests: "4 Weekly quizzes",
      testDetail: "Weekly assessments",
      finalExam: "Final assessment",
      certificate: "Completion Certificate",
      color: "blue",
      gradient: "from-blue-500 to-cyan-500",
      items: ["4 Weekly quizzes", "Final assessment", "Completion certificate"]
    },
    {
      duration: "2 Months",
      icon: Target,
      tests: "8 Bi-weekly tests",
      testDetail: "Bi-weekly assessments",
      finalExam: "Mid-term + Final exam",
      certificate: "Level Certificate",
      color: "purple",
      gradient: "from-purple-500 to-pink-500",
      items: ["8 Bi-weekly tests", "Mid-term + Final exam", "Level certificate"]
    },
    {
      duration: "3 Months",
      icon: Trophy,
      tests: "12 Weekly tests",
      testDetail: "Weekly assessments",
      finalExam: "Comprehensive final exam",
      certificate: "Advanced Certificate",
      color: "amber",
      gradient: "from-amber-500 to-orange-500",
      items: ["12 Weekly tests", "Comprehensive final exam", "Advanced certificate"]
    }
  ];

  const features = [
    { icon: TrendingUp, text: "See real improvement over time" },
    { icon: Calendar, text: "Regular progress tracking" },
    { icon: Award, text: "Get certified for your growth" },
    { icon: Clock, text: "Flexible test schedule" }
  ];

  // Check if mobile on mount and on resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % courseDurations.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + courseDurations.length) % courseDurations.length);
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-350 px-4 sm:px-6 lg:px-8 mx-auto">
        {/* Header */}
        <div className="text-center mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Target className="w-4 h-4" />
            Tests & Evaluation
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Track Your{" "}
            <span className="bg-linear-to-r from-primary via-primary/90 to-secondary bg-clip-text text-transparent">
              Progress & Get Certified
            </span>
          </h2>
          <p className="text-gray-600 text-lg">
            Regular tests and final evaluation based on your course duration
          </p>
        </div>

        {/* Course Duration Cards - Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 mb-12">
          {courseDurations.map((course) => (
            <div 
              key={course.duration}
              className="group relative bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all overflow-hidden"
            >
              <div className={`h-1 bg-linear-to-r ${course.gradient}`} />
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <course.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-primary">{course.duration}</p>
                    <p className="text-xs text-gray-500">Course</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Tests:</p>
                  <p className="text-gray-600 text-sm">{course.tests}</p>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Final Exam:</p>
                  <p className="text-gray-600 text-sm">{course.finalExam}</p>
                </div>
                
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-gray-900">{course.certificate}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Slider */}
        {isMobile && (
          <div className="md:hidden relative mb-12">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-300 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {courseDurations.map((course) => (
                  <div key={course.duration} className="w-full shrink-0 px-2">
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                      <div className={`h-1 bg-linear-to-r ${course.gradient}`} />
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <course.icon className="w-6 h-6 text-primary" />
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-primary">{course.duration}</p>
                            <p className="text-xs text-gray-500">Course</p>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          {course.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                              <span className="text-sm text-gray-600">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-8 h-8 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center active:scale-95 transition-all"
              aria-label="Previous slide"
            >
              <ChevronsLeft className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-8 h-8 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center active:scale-95 transition-all"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-4">
              {courseDurations.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all ${
                    currentSlide === idx ? "w-6 bg-primary" : "w-2 bg-gray-300"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Test Schedule Overview - Desktop */}
        <div className="hidden md:block max-w-4xl mx-auto mb-12">
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 text-center mb-6">
              What You Get Based on Your Course
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              {courseDurations.map((course) => (
                <div key={course.duration} className="text-center">
                  <div className={`inline-block px-3 py-1 rounded-full bg-${course.color}-100 text-${course.color}-700 text-xs font-medium mb-3`}>
                    {course.duration} Course
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {course.items.map((item, idx) => (
                      <li key={idx} className="flex items-center justify-center gap-2">
                        <CheckCircle2 className={`w-4 h-4 text-${course.color}-500`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Overview - Simplified */}
        {isMobile && (
          <div className="md:hidden max-w-4xl mx-auto mb-12">
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
              <h3 className="text-md font-bold text-gray-900 text-center mb-4">
                Based on Your Course
              </h3>
              <div className="space-y-4">
                {courseDurations.map((course) => (
                  <div key={course.duration} className="text-center">
                    <div className={`inline-block px-3 py-1 rounded-full bg-${course.color}-100 text-${course.color}-700 text-xs font-medium mb-2`}>
                      {course.duration} Course
                    </div>
                    <p className="text-sm text-gray-600">{course.tests} • {course.finalExam}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Benefits Row */}
        <div className="flex flex-wrap justify-center gap-4">
          {features.map((benefit) => (
            <div key={benefit.text} className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-200">
              <benefit.icon className="w-4 h-4 text-primary" />
              <span className="text-sm text-gray-700">{benefit.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}