"use client";

import { useState, useEffect } from "react";
import { Heart, Coffee, Quote, Gift } from "lucide-react";
import { FaHeart } from "react-icons/fa";

export default function TeacherSettings() {
  const [encouragementIndex, setEncouragementIndex] = useState(0);
  const [affirmationIndex, setAffirmationIndex] = useState(0);
  const [fadeEncouragement, setFadeEncouragement] = useState(true);
  const [fadeAffirmation, setFadeAffirmation] = useState(true);

  const encouragements = [
    "You're shaping futures, one word at a time.",
    "Every class you teach changes a life.",
    "Your students remember you forever.",
    "Teaching is the greatest act of optimism.",
    "You're not just teaching language - you're building bridges.",
  ];

  const affirmations = [
    "I make learning fun and engaging.",
    "My students feel safe to make mistakes.",
    "I am patient, kind, and inspiring.",
    "Every day I become a better teacher.",
    "I am proud of the impact I create.",
  ];

  // Rotate encouragement every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setFadeEncouragement(false);
      setTimeout(() => {
        setEncouragementIndex((prev) => (prev + 1) % encouragements.length);
        setFadeEncouragement(true);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, [encouragements.length]);

  // Rotate affirmation every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setFadeAffirmation(false);
      setTimeout(() => {
        setAffirmationIndex((prev) => (prev + 1) % affirmations.length);
        setFadeAffirmation(true);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, [affirmations.length]);

  return (
    <div className="min-h-screen ">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 lg:py-0">
        
        {/* Warm Welcome */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-purple-100 mb-6">
            <Heart className="w-4 h-4 text-pink-500" />
            <span className="text-sm text-gray-600">For You, Dear Teacher</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Hello, Wonderful Teacher
          </h1>

          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Before you plan your next class, take a moment for yourself.
          </p>
        </div>

        {/* Daily Encouragement Card - With Fade Animation */}
        <div className="bg-linear-to-r from-purple-600 to-pink-600 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
              <Quote className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white/80 text-sm mb-2 flex items-center gap-1">
                <FaHeart className="w-3 h-3" /> A little encouragement for you
              </p>
              <div className={`transition-opacity duration-300 ${fadeEncouragement ? "opacity-100" : "opacity-0"}`}>
                <p className="text-white text-xl sm:text-2xl font-medium leading-relaxed">
                  "{encouragements[encouragementIndex]}"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Affirmations Card - With Fade Animation */}
        <div className="bg-white rounded-2xl border border-purple-100 shadow-sm mb-8 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
              <span className="text-orange-600 text-sm">✨</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Today's Affirmation</h2>
          </div>
          
          <div className={`transition-opacity duration-300 ${fadeAffirmation ? "opacity-100" : "opacity-0"}`}>
            <p className="text-gray-700 text-lg font-medium text-center py-4">
              {affirmations[affirmationIndex]}
            </p>
          </div>
          
          <div className="flex justify-center gap-1 mt-2">
            {affirmations.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 rounded-full transition-all duration-300 ${
                  idx === affirmationIndex ? "w-4 bg-purple-500" : "w-1 bg-purple-200"
                }`}
              />
            ))}
          </div>
        </div>
    
        {/* Self-Care Reminder */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
              <Coffee className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="font-medium text-gray-800">Don't forget to rest</p>
              <p className="text-xs text-gray-400">
                You deserve a break between classes
              </p>
            </div>
          </div>
        </div>

        {/* Gratitude Section */}
        <div className="text-center pt-4 border-t border-gray-100">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Gift className="w-4 h-4 text-pink-400" />
            <span className="text-sm text-gray-500">
              Thank you for teaching
            </span>
          </div>
          <p className="text-xs text-gray-400">
            Every language you teach opens a new world for someone.
          </p>
        </div>

      </div>
    </div>
  );
}