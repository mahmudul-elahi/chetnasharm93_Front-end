import { Shield, Users, UsersRound, Zap } from "lucide-react";
import React from "react";
const features = [
  {
    icon: Shield,
    title: "Secure Learning",
    desc: "Your data is protected with enterprise-grade security",
    bgClass: "bg-blue-100 dark:bg-blue-900/30",
    iconClass: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: Zap,
    title: "Instant Access",
    desc: "Get immediate access to all your purchased courses",
    bgClass: "bg-purple-100 dark:bg-purple-900/30",
    iconClass: "text-purple-600 dark:text-purple-400",
  },
  {
    icon: UsersRound,
    title: "Community Support",
    desc: "Join 10,000+ learners and get support from experts",
    bgClass: "bg-green-100 dark:bg-green-900/30",
    iconClass: "text-green-600 dark:text-green-400",
  },
];
const RegisterFeatureInfo = () => {
  return (
    <div className="hidden lg:flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Join Our Learning Community! 🚀
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Create an account and start your learning journey today.
        </p>
      </div>

      {/* Feature list */}
      <div className="flex flex-col gap-6">
        {features.map(({ icon: Icon, title, desc, bgClass, iconClass }) => (
          <div key={title} className="flex items-start gap-3">
            <div
              className={`w-10 h-10 ${bgClass} rounded-lg flex items-center justify-center shrink-0`}
            >
              <Icon className={`w-5 h-5 ${iconClass}`} />
            </div>
            <div className="flex flex-col gap-0.5">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
        {[
          { value: "10K+", label: "Learners" },
          { value: "500+", label: "Courses" },
          { value: "4.9★", label: "Rating" },
        ].map(({ value, label }) => (
          <div key={label} className="flex flex-col gap-0.5">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {value}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegisterFeatureInfo;
