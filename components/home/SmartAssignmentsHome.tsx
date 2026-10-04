import React from "react";
import {
  ClipboardList,
  Target,
  TrendingUp,
  CheckCircle2,
  Clock,
  Zap,
  Award,
  FileText,
  MessageCircle,
  PenTool,
  Mail,
  Mic,
  AlertCircle,
  Timer,
  BarChart,
  UserCheck,
} from "lucide-react";

export default function SmartAssignmentsHome() {
  const assignments = [
    {
      icon: Target,
      title: "Fix Your Weak Areas",
      description: "Personalized tasks targeting your specific mistakes",
      items: [
        "Grammar corrections",
        "Pronunciation practice",
        "Common error fixes",
      ],
      stat: "-45%",
      statLabel: "error reduction",
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
    },
    {
      icon: MessageCircle,
      title: "Build Real-Life English Skills",
      description: "Practical tasks for everyday situations",
      items: ["Email writing", "Meeting participation", "Phone conversations"],
      stat: "+60%",
      statLabel: "confidence boost",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
    },
  ];

  const features = [
    { icon: Timer, text: "15-20 minutes daily" },
    { icon: Zap, text: "Instant feedback" },
    { icon: BarChart, text: "Progress tracking" },
    { icon: FileText, text: "Detailed corrections" },
  ];

  const sampleTasks = [
    {
      number: 1,
      title: "Email Writing Task",
      description:
        "Write a professional email responding to a client complaint",
      duration: "10 min",
      level: "Intermediate",
      review: "Teacher review",
      icon: Mail,
      color: "blue",
    },
    {
      number: 2,
      title: "Speaking Practice",
      description: "Record yourself introducing a new team member",
      duration: "5 min",
      level: "All levels",
      review: "AI feedback",
      icon: Mic,
      color: "purple",
    },
  ];

  return (
    <section className="py-14 sm:py-16 md:py-20 bg-linear-to-br from-slate-50 via-white to-purple-50">
      <div className="max-w-350 mx-auto px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 bg-purple-500/10 rounded-full mb-3 sm:mb-4">
            <ClipboardList className="w-4 h-4 text-purple-600" />
            <span className="text-xs sm:text-sm font-medium text-purple-600">
              Smart Assignments
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
            Assignments That{" "}
            <span className="bg-linear-to-r from-primary via-primary/90 to-secondary bg-clip-text text-transparent">
              Actually Improve You
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-xl mx-auto">
            Not busy work - focused tasks that build real skills
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {assignments.map((item) => (
            <div
              key={item.title}
              className="group relative bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all overflow-hidden"
            >
              {/* Top Gradient Bar */}
              <div className={`h-1 bg-linear-to-r ${item.gradient}`} />

              <div className="p-5 sm:p-6">
                {/* Header with Icon */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      {item.stat}
                    </p>
                    <p className="text-xs text-gray-500">{item.statLabel}</p>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4">{item.description}</p>

                {/* Items List */}
                <ul className="space-y-2">
                  {item.items.map((listItem) => (
                    <li
                      key={listItem}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      <span>{listItem}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Example Assignment Preview */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
            <div className="bg-linear-to-r from-primary to-secondary px-5 py-3">
              <div className="flex items-center gap-2">
                <PenTool className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-medium">
                  Sample Assignment
                </span>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              {sampleTasks.map((task, idx) => (
                <React.Fragment key={task.title}>
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-${task.color}-100 flex items-center justify-center shrink-0`}
                    >
                      <span
                        className={`text-${task.color}-600 font-bold text-xs sm:text-sm`}
                      >
                        {task.number}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 text-sm sm:text-base mb-1">
                        {task.title}
                      </p>
                      <p className="text-gray-600 text-xs sm:text-sm mb-2">
                        {task.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Timer className="w-3 h-3" />
                          {task.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <BarChart className="w-3 h-3" />
                          {task.level}
                        </span>
                        <span className="flex items-center gap-1">
                          <UserCheck className="w-3 h-3" />
                          {task.review}
                        </span>
                      </div>
                    </div>
                  </div>
                  {idx < sampleTasks.length - 1 && (
                    <div className="border-t border-gray-100 my-4" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-10">
          {features.map((feature) => (
            <div
              key={feature.text}
              className="flex items-center justify-center gap-2 p-3 bg-white rounded-xl border border-gray-200"
            >
              <feature.icon className="w-4 h-4 text-primary" />
              <span className="text-xs md:text-sm text-gray-700">
                {feature.text}
              </span>
            </div>
          ))}
        </div>

        {/* Comparison Note */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 rounded-xl p-4 border border-red-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-red-500" />
              </div>
              <p className="text-sm text-gray-700">
                <span className="line-through text-gray-400">
                  Most platforms give you busy work.
                </span>
                <span className="font-semibold text-primary ml-2">
                  {" "}
                  We give you real improvement.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
