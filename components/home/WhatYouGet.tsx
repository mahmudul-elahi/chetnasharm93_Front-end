import React from "react";
import {
  CheckCircle2,
  TrendingUp,
  Target,
  Clock,
  Users,
  Award,
  BarChart3,
  Calendar,
  Sparkles,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import MyButton from "@/components/ui/MyButton";

export default function WhatYouGet() {
  const benefits = [
    {
      icon: Target,
      title: "Goal-Oriented Learning",
      description: "Clear milestones and achievable targets every month",
    },
    {
      icon: Clock,
      title: "Flexible Schedule",
      description: "Learn at your own pace with 24/7 access to materials",
    },
    {
      icon: UsersRound,
      title: "Community Support",
      description: "Join a community of motivated learners",
    },
    {
      icon: Award,
      title: "Certification",
      description: "Earn certificates for every completed level",
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description: "Visual insights into your improvement",
    },
    {
      icon: Calendar,
      title: "Monthly Structure",
      description: "Clear roadmap of what you'll achieve each month",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-linear-to-bl from-white via-gray-50 to-secondary/5">
      <div className="max-w-350 px-4 sm:px-6 lg:px-8 mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            What You Get
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            At{" "}
            <span className="bg-linear-to-r from-primary via-primary/90 to-secondary bg-clip-text text-transparent">
              ListenAct Classes
            </span>
          </h2>
          <p className="text-gray-600 text-lg">
            Learn, Practice, Improve - With Real Structure
          </p>
        </div>

        {/* Main Value Proposition */}
        <div className="max-w-4xl mx-auto mb-12 md:mb-16">
          <div className="bg-linear-to-r from-primary/5 via-primary/10 to-secondary/5 rounded-2xl p-6 md:p-8 text-center border border-primary/20">
            <p className="text-gray-700 text-lg md:text-xl mb-3">
              At ListenAct Classes, you don't just{" "}
              <span className="line-through text-gray-400">
                "learn English"
              </span>
              ...
            </p>
            <p className="text-2xl md:text-3xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
              you use it, track it, and improve every month.
            </p>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 md:mb-16">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="flex items-start gap-4 p-5 rounded-xl bg-gray-50 border border-gray-200 hover:shadow-md transition-all group"
            >
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors shrink-0">
                <benefit.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  {benefit.title}
                </h4>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
