"use client";
import React, { useState } from "react";
import {
  FaHeadphones,
  FaArrowRight,
  FaUsers,
  FaLanguage,
  FaClock,
  FaComments,
} from "react-icons/fa6";
import { FaCheckCircle, FaChalkboardTeacher } from "react-icons/fa";
import MyButton from "@/components/ui/MyButton";
import { Info } from "lucide-react";

const AboutUs = () => {
  const [activeLanguage, setActiveLanguage] = useState("English");

  const languages = [
    {
      name: "English",
      flagColor: "from-blue-500 to-red-500",
      bgColor: "bg-blue-50",
      activeBg: "bg-blue-500",
    },
    {
      name: "French",
      flagColor: "from-blue-600 to-red-600",
      bgColor: "bg-indigo-50",
      activeBg: "bg-indigo-500",
    },
    {
      name: "Punjabi",
      flagColor: "from-orange-500 to-yellow-600",
      bgColor: "bg-orange-50",
      activeBg: "bg-orange-500",
    },
    {
      name: "Hindi",
      flagColor: "from-orange-600 to-yellow-600",
      bgColor: "bg-amber-50",
      activeBg: "bg-amber-500",
    },
  ];

  const features = [
    {
      icon: FaChalkboardTeacher,
      title: "Live Interactive Classes",
      description:
        "Real-time sessions with native speakers. Ask questions and get instant feedback.",
    },
    {
      icon: FaUsers,
      title: "Small Group Learning",
      description:
        "Maximum 8 students per class for personalized attention and real conversation.",
    },
    {
      icon: FaComments,
      title: "Speaking First Method",
      description:
        "You'll speak from day one. No boring grammar drills - just real communication.",
    },
    {
      icon: FaClock,
      title: "Flexible Schedule",
      description:
        "Classes offered across time zones. Learn at your own pace, on your own time.",
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Subtle Light linear Background */}
      <div className="fixed inset-0 bg-linear-to-br from-gray-50 via-white to-purple-50/20 -z-10"></div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Info className="w-4 h-4" />
            Live Language Learning
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-gray-900">
            Speak a New Language
            <br />
            <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
              With Confidence
            </span>
          </h1>

          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Live, interactive classes in English, French, Punjabi, and Hindi.
            Learn from native speakers in small groups - anywhere, anytime.
          </p>
        </div>

        {/* Choose Your Language - Minimal Horizontal Design */}
        <div className="mb-28">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              Choose Your Language
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Learn with native speakers who bring culture to every class
            </p>
          </div>

          {/* Horizontal Pills / Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {languages.map((lang) => (
              <button
                key={lang.name}
                onClick={() => setActiveLanguage(lang.name)}
                className={`
                  relative px-8 py-3 rounded-full font-semibold text-base transition-all duration-300
                  ${
                    activeLanguage === lang.name
                      ? `${lang.activeBg} text-white shadow-lg scale-105`
                      : `bg-gray-100 text-gray-600 hover:bg-gray-200`
                  }
                `}
              >
                {lang.name}
                {activeLanguage === lang.name && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
                )}
              </button>
            ))}
          </div>

          {/* Active Language Content Area */}
          {languages.map(
            (lang) =>
              activeLanguage === lang.name && (
                <div key={lang.name} className="animate-fadeIn">
                  <div
                    className={`${lang.bgColor} rounded-3xl p-10 md:p-12 text-center border border-gray-100 shadow-sm`}
                  >
                    <div
                      className={`w-24 h-24 mx-auto rounded-full bg-linear-to-r ${lang.flagColor} flex items-center justify-center shadow-lg mb-6`}
                    >
                      <FaLanguage className="text-white text-3xl" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-4">
                      {lang.name}
                    </h3>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
                      Master {lang.name} with our immersive live classes. From
                      beginner to fluent - your journey starts here.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                      <div className="flex items-center gap-2 text-gray-700">
                        <FaCheckCircle className="text-green-500 text-sm" />
                        <span className="text-sm">Native Teachers</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <FaCheckCircle className="text-green-500 text-sm" />
                        <span className="text-sm">Live Conversation</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <FaCheckCircle className="text-green-500 text-sm" />
                        <span className="text-sm">Certificate Included</span>
                      </div>
                    </div>
                  </div>
                </div>
              ),
          )}
        </div>

        {/* Core Message Card */}
        <div className="relative group mb-28">
          <div className="absolute -inset-0.5 bg-linear-to-r from-purple-200 to-pink-200 rounded-3xl blur-md opacity-50 group-hover:opacity-100 transition duration-500"></div>

          <div className="relative bg-white border border-gray-200 rounded-3xl p-10 md:p-16 shadow-xl">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              {/* Icon Circle */}
              <div className="shrink-0">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-linear-to-br from-purple-100 to-pink-100 flex items-center justify-center border border-purple-200 shadow-md">
                  <FaHeadphones className="text-5xl md:text-6xl text-purple-600" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
                  Listen. Speak. <br />
                  <span className="text-purple-600">Connect.</span>
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  We believe language is more than vocabulary and grammar. It's
                  about connection, culture, and confidence. Our live platform
                  brings you face-to-face with native speakers who don't just
                  teach - they inspire.
                </p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <span className="px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700 border border-gray-200">
                    Native Speakers
                  </span>
                  <span className="px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700 border border-gray-200">
                    Live Classes
                  </span>
                  <span className="px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700 border border-gray-200">
                    Small Groups
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-28">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group hover:border-purple-200 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4 group-hover:bg-purple-200 transition">
                <feature.icon className="text-purple-600 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Final Statement & Call to Action */}
        <div className="text-center">
          <blockquote className="text-2xl md:text-3xl font-light italic text-gray-600 max-w-3xl mx-auto leading-relaxed">
            "Language is the road map of a culture. <br />
            <span className="text-purple-600 font-normal not-italic">
              Let us guide you.
            </span>
            "
          </blockquote>

          <div className="mt-12">
            <MyButton>
              Start Your Free Trial
              <FaArrowRight className="group-hover:translate-x-1 transition" />
            </MyButton>
          </div>

          <p className="text-gray-400 text-sm mt-10 tracking-wide">
            © 2025 ListenAct - Live Language Learning Platform
          </p>
        </div>
      </div>

      {/* Add this style tag for animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AboutUs;
