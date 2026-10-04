"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  VolumeX,
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  Zap,
  Trophy,
  TrendingUp,
  Radio,
  Clock,
  Target,
  Brain,
  Book,
} from "lucide-react";
import Link from "next/link";
import MyButton from "@/components/ui/MyButton";

function CircularMeter({
  percentage,
  color,
  bgColor = "#E5E7EB",
  animate = false,
}: {
  percentage: number;
  color: string;
  bgColor?: string;
  animate?: boolean;
}) {
  const radius = 62;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = animate
    ? circumference - (percentage / 100) * circumference
    : circumference;

  return (
    <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
      <circle
        cx="80"
        cy="80"
        r={radius}
        fill="transparent"
        stroke={bgColor}
        strokeWidth={strokeWidth}
      />
      <circle
        cx="80"
        cy="80"
        r={radius}
        fill="transparent"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        className="transition-all duration-1000 ease-out"
      />
    </svg>
  );
}

export default function SpeakMore() {
  const [showChart, setShowChart] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Speaking tips for the placeholder
  const speakingTips = [
    {
      icon: Mic,
      title: "Start Small",
      description: "Begin with short sentences and gradually increase length",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Target,
      title: "Set Daily Goals",
      description: "Aim to speak for 5 minutes every day without stopping",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Brain,
      title: "Think in English",
      description: "Practice thinking directly in English, don't translate",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Clock,
      title: "Consistent Practice",
      description: "15 minutes daily is better than 2 hours weekly",
      color: "from-orange-500 to-red-500",
    },
  ];

  const [activeTipIndex, setActiveTipIndex] = useState(0);

  // Rotate through tips
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTipIndex((prev) => (prev + 1) % speakingTips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !showChart) {
            setShowChart(true);
          }
        });
      },
      { threshold: 0.3 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [showChart]);

  return (
    <section
      ref={sectionRef}
      className="py-14 sm:py-16 md:py-24 bg-linear-to-bl from-white via-gray-50 to-secondary/5 relative overflow-hidden"
    >

      <div className="max-w-350 px-5 sm:px-6 lg:px-8 mx-auto relative">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-linear-to-r from-primary/10 to-secondary/10 text-primary text-xs md:text-sm font-medium mb-4 md:mb-6 border border-primary/20">
            <Radio className="w-3 h-3 md:w-4 md:h-4 animate-pulse" />
            <span>85% of students speak more in their first class</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
            Speak{" "}
            <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent relative inline-block">
              More
              <svg
                className="absolute -bottom-1 md:-bottom-2 left-0 w-full hidden sm:block"
                height="4"
                viewBox="0 0 100 4"
              >
                <path
                  d="M0 2 Q 25 0, 50 2 T 100 2"
                  stroke="url(#wave)"
                  fill="none"
                  strokeWidth="2"
                />
                <defs>
                  <linearGradient id="wave" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            , Not Just{" "}
            <span className="text-gray-400 line-through">Listen</span>
          </h2>

          <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
            You're not sitting quietly - you're actively speaking in every class
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Left Column */}
          <div className="space-y-6 md:space-y-8">
            {/* Speaking Meter with Recharts */}
            <div className="bg-linear-to-br from-gray-50 to-white rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-200 shadow-lg">
              <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-4 md:mb-6 text-center">
                Speaking Time Comparison
              </h3>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 md:gap-12">
                {/* Traditional Class Chart */}
                <div className="text-center">
                  <div className="relative w-40 h-40 md:w-48 md:h-48 mx-auto">
                    <CircularMeter
                      percentage={20}
                      color="#EF4444"
                      animate={showChart}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <VolumeX className="w-5 h-5 md:w-6 md:h-6 text-red-400 mb-1" />
                      <p className="text-2xl md:text-3xl font-bold text-red-500">
                        20%
                      </p>
                      <p className="text-xs text-gray-500">Traditional</p>
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="hidden sm:flex items-center">
                  <ArrowRight className="w-6 h-6 md:w-8 md:h-8 text-primary animate-pulse" />
                </div>
                <div className="sm:hidden text-center">
                  <ArrowRight className="w-5 h-5 text-primary animate-pulse rotate-90" />
                </div>

                {/* ListenAct Class Chart */}
                <div className="text-center">
                  <div className="relative w-40 h-40 md:w-48 md:h-48 mx-auto">
                    <CircularMeter
                      percentage={80}
                      color="#10B981"
                      animate={showChart}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Mic className="w-5 h-5 md:w-6 md:h-6 text-green-500 mb-1" />
                      <p className="text-2xl md:text-3xl font-bold text-green-600">
                        80%
                      </p>
                      <p className="text-xs text-green-600 font-medium">
                        ListenAct
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 text-center mt-6">
                <span className="font-bold text-green-600">
                  4x more speaking practice
                </span>{" "}
                than traditional classes
              </p>
            </div>

            {/* Speaking Tips Carousel - Replaces Testimonials */}
            <div className="bg-linear-to-r from-primary/5 to-secondary/5 rounded-2xl p-4 sm:p-6 border border-primary/20">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  💡 Speaking Tip of the Day
                </h3>
              </div>

              <div className="relative min-h-48 flex items-center justify-center">
                {speakingTips.map((tip, idx) => (
                  <div
                    key={idx}
                    className={`absolute transition-all duration-700 text-center px-4 w-full ${
                      idx === activeTipIndex
                        ? "opacity-100 transform translate-y-0"
                        : "opacity-0 transform translate-y-4"
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-full bg-linear-to-r ${tip.color} flex items-center justify-center shadow-lg`}
                    >
                      <tip.icon className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-lg md:text-xl font-bold text-gray-800 mb-2">
                      {tip.title}
                    </h4>
                    <p className="text-gray-600 text-sm md:text-base">
                      {tip.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Dot indicators */}
              <div className="flex justify-center gap-2 mt-2">
                {speakingTips.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTipIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === activeTipIndex
                        ? "w-6 bg-primary"
                        : "w-2 bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4 md:space-y-6">
            {/* Hero Stat Card */}
            <div className="bg-linear-to-r from-primary to-secondary rounded-2xl p-4 md:p-6 text-white text-center">
              <p className="text-xs md:text-sm opacity-90 mb-2">
                Every Session Includes
              </p>
              <div className="grid grid-cols-3 gap-2 md:gap-4">
                <div>
                  <p className="text-xl md:text-3xl font-bold">15+</p>
                  <p className="text-xs opacity-90">Speaking Turns</p>
                </div>
                <div>
                  <p className="text-xl md:text-3xl font-bold">80%</p>
                  <p className="text-xs opacity-90">Your Voice</p>
                </div>
                <div>
                  <p className="text-xl md:text-3xl font-bold">3s</p>
                  <p className="text-xs opacity-90">Feedback Time</p>
                </div>
              </div>
            </div>

            {/* Feature Cards */}
            {[
              {
                icon: MessageCircle,
                title: "Active Participation",
                description: "No hiding in the back - everyone speaks equally",
                tag: "Guaranteed",
              },
              {
                icon: Zap,
                title: "Real-time Correction",
                description: "Teachers correct your pronunciation instantly",
                tag: "Immediate",
              },
              {
                icon: Trophy,
                title: "Confidence Building",
                description: "From nervous to natural speaker in weeks",
                tag: "Proven",
              },
              {
                icon: Target,
                title: "Personalized Feedback",
                description: "Custom guidance after every class to accelerate fluency",
                tag: "Actionable",
              },
            ].map((feature) => (
              <div key={feature.title} className="group relative">
                <div className="absolute inset-0 bg-linear-to-r from-primary/5 to-secondary/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
                  <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl bg-linear-to-br from-primary/10 to-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                    <feature.icon className="w-5 h-5 md:w-7 md:h-7 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1 md:gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 text-sm md:text-base">
                        {feature.title}
                      </h3>
                      <span className="text-xs px-1.5 md:px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                        {feature.tag}
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-gray-600">
                      {feature.description}
                     </p>
                  </div>
                  <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-gray-300 group-hover:text-primary transition-colors shrink-0" />
                </div>
              </div>
            ))}

            {/* CTA */}
            <div className="flex flex-col gap-4">
              <Link href="/classes">
                <MyButton className="w-full gap-2 group text-sm md:text-base">
                  Start Speaking Today
                  <Mic className="w-4 h-4 group-hover:animate-pulse" />
                </MyButton>
              </Link>

            </div>

            {/* Trust Badges - Hidden on mobile */}
            <div className="hidden sm:flex justify-center gap-4 md:gap-6 text-xs text-gray-500 mt-4">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                No risk trial
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                Cancel anytime
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                7-day money back
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
