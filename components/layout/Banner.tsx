"use client";
import {
  ArrowRight,
  Star,
  Users,
  Video,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  Mic,
  ChevronsRight,
  Earth,
} from "lucide-react";
import MyButton from "../ui/MyButton";
import TalkToAnAdvisorButton from "./components/TalkToAnAdvisorButton";

const Banner = () => {
  return (
    <section className="pt-5 relative min-h-screen w-full bg-linear-to-br from-slate-50 via-purple-50 to-indigo-100">
      <div className="relative max-w-350 mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center py-12 sm:py-16 md:py-20">
        <div className="grid lg:grid-cols-2 gap-0 lg:gap-16 items-center w-full">
          {/* Left Content */}
          <div className="space-y-5 md:space-y-6 lg:space-y-7">
            {/* Headline */}
            <div className="space-y-2 md:space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-linear-to-r from-purple-500/10 to-indigo-500/10 rounded-full border border-purple-200/30">
                <Earth className="w-3.5 h-3.5 md:w-4 md:h-4 text-purple-600" />
                <span className="text-xs md:text-sm font-medium text-purple-700">
                  Language Learning Platform
                </span>
              </div>

              <div>
                <h1 className="text-[32px] sm:text-4xl md:text-5xl lg:text-6xl font-bold lg:leading-18">
                  Learn English Through{" "}
                  <span className="bg-linear-to-r from-primary via-primary/90 to-secondary bg-clip-text text-transparent">
                    Hindi & Punjabi
                  </span>
                  <p className="text-[28px] sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800">
                    Speak Confidently, Faster
                  </p>
                </h1>
              </div>
            </div>

            {/* Subheading */}
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-lg leading-relaxed">
              No confusion. No guessing.
              <br />
              Understand English in your own language — and start speaking from
              Day 1.
            </p>

            {/* Punjabi Line */}
            <div className="relative">
              <div className="absolute -left-2 -top-2 text-3xl md:text-4xl text-green-400/30 font-serif">
                "
              </div>
              <div className="inline-block px-4 py-2 md:px-6 md:py-3 bg-linear-to-r from-green-100 to-green-100 border-l-4 border-green-500 rounded-r-xl shadow-sm">
                <p className="text-sm md:text-base lg:text-lg font-medium text-black italic">
                  "Apni maa-boli naal English sikho — samajh ke, bol ke,
                  confidently."
                </p>
              </div>
            </div>

            {/* Main Image Card mobile */}
            <div className="relative lg:hidden mt-8">
              <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/20">
                <div className="absolute inset-0 bg-linear-to-tr from-purple-600/20 via-transparent to-indigo-600/20 z-10" />
                <img
                  src="/assets/hero.webp"
                  alt="Punjabi student learning English in online live class with teacher"
                  className="w-full h-auto object-cover"
                />

                {/* Floating Cards with Float Animation */}
                <div className="hidden md:block absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-xl p-2 shadow-lg z-20 animate-float">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                      <Star className="w-4 h-4 text-white fill-current" />
                    </div>
                    <div>
                      <div className="text-xs font-bold">4.9 Rating</div>
                      <div className="text-[10px] text-gray-500">
                        From 1,284 students
                      </div>
                    </div>
                  </div>
                </div>

                <div className="hidden md:flex absolute bottom-4 left-4 bg-white/95 backdrop-blur-md rounded-xl p-2 shadow-lg z-20 animate-float-delayed">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-xs font-bold">Bilingual Support</div>
                      <div className="text-[10px] text-gray-500">
                        Hindi & Punjabi
                      </div>
                    </div>
                  </div>
                </div>

                <div className="hidden lg:flex absolute bottom-4 right-4 bg-linear-to-br from-purple-600 to-indigo-600 backdrop-blur-md rounded-xl p-2 shadow-lg z-20 animate-float">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                      <Mic className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-white whitespace-nowrap">
                        Speaking Practice
                      </div>
                      <div className="text-[8px] text-purple-200">
                        Daily Live
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Indicator Badge with Pulse Animation */}
              <div className=" absolute -top-3 -right-3 bg-linear-to-r from-red-500 to-rose-500 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold shadow-lg z-30 flex items-center gap-1.5 md:gap-2 animate-pulse-slow">
                <span className="relative flex h-2 w-2 md:h-2.5 md:w-2.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 md:h-2.5 md:w-2.5 bg-white"></span>
                </span>
                <span>Live Class Now</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2">
              <a
                href="https://listenact.ca/book-free-demo/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MyButton className="gap-3 w-full md:w-fit relative group overflow-hidden">
                    Book a Free Demo Class
                    <ArrowRight className="size-4 md:size-5 transition-transform group-hover:translate-x-1" />
                </MyButton>
              </a>
              <TalkToAnAdvisorButton />
            </div>

            {/* NO MORE HESITATION Banner */}
            <div className="relative overflow-hidden bg-linear-to-r from-primary/10 to-secondary/20 border border-primary rounded-xl md:rounded-2xl p-3 md:p-4 shadow-sm">
              <div className="relative flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-4">
                <div className="flex items-center gap-3 md:gap-4">
                  <div>
                    <div className="font-black text-primary text-sm sm:text-base md:text-lg tracking-wide flex items-center gap-2">
                      <ChevronsRight /> NO MORE HESITATION
                    </div>
                    <div className="font-black text-primary text-sm sm:text-base md:text-lg tracking-wide flex items-center gap-2">
                      <ChevronsRight /> NO MORE FEAR
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-700 bg-white/60 px-3 py-1.5 md:px-4 md:py-2 rounded-full">
                  <Mic className="w-3.5 h-3.5 md:w-4 md:h-4 text-red-500" />
                  <span className="text-xs sm:text-sm font-medium">
                    Practice with Expert & start speaking
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Image Section */}
          <div className="relative mt-8 lg:mt-0">
            <div className="relative z-10">
              {/* Main Image Card */}
              <div className="relative hidden lg:block">
                <div className=" relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/20">
                  <div className="absolute inset-0 bg-linear-to-tr from-purple-600/20 via-transparent to-indigo-600/20 z-10" />
                  <img
                    src="/assets/hero.webp"
                    alt="Punjabi student learning English in online live class with teacher"
                    className="w-full h-auto object-cover"
                  />

                  {/* Floating Cards with Float Animation */}
                  <div className="hidden md:block absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-xl p-2 shadow-lg z-20 animate-float">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                        <Star className="w-4 h-4 text-white fill-current" />
                      </div>
                      <div>
                        <div className="text-xs font-bold">4.9 Rating</div>
                        <div className="text-[10px] text-gray-500">
                          From 1,284 students
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="hidden md:flex absolute bottom-4 left-4 bg-white/95 backdrop-blur-md rounded-xl p-2 shadow-lg z-20 animate-float-delayed">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-linear-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-xs font-bold">
                          Bilingual Support
                        </div>
                        <div className="text-[10px] text-gray-500">
                          Hindi & Punjabi
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="hidden lg:flex absolute bottom-4 right-4 bg-linear-to-br from-purple-600 to-indigo-600 backdrop-blur-md rounded-xl p-2 shadow-lg z-20 animate-float">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                        <Mic className="w-3 h-3 text-white" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-white whitespace-nowrap">
                          Speaking Practice
                        </div>
                        <div className="text-[8px] text-purple-200">
                          Daily Live
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Indicator Badge with Pulse Animation */}
                <div className="absolute -top-3 -right-3 bg-linear-to-r from-red-500 to-rose-500 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold shadow-lg z-30 flex items-center gap-1.5 md:gap-2 animate-pulse-slow">
                  <span className="relative flex h-2 w-2 md:h-2.5 md:w-2.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 md:h-2.5 md:w-2.5 bg-white"></span>
                  </span>
                  <span>Live Class Now</span>
                </div>
              </div>

              {/* Stats - Mobile/Tablet */}
              <div className="lg:hidden">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      value: "50+",
                      label: "Live Classes/Week",
                      icon: Video,
                      bgColor: "bg-purple-100",
                      iconColor: "text-purple-600",
                    },
                    {
                      value: "3K+",
                      label: "Active Learners",
                      icon: Users,
                      bgColor: "bg-indigo-100",
                      iconColor: "text-indigo-600",
                    },
                    {
                      value: "95%",
                      label: "Improvement Rate",
                      icon: TrendingUp,
                      bgColor: "bg-amber-100",
                      iconColor: "text-amber-600",
                    },
                  ].map((stat, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center text-center p-2 rounded-xl bg-white/60 backdrop-blur-sm"
                    >
                      <div
                        className={`w-8 h-8 rounded-full ${stat.bgColor} flex items-center justify-center mb-1`}
                      >
                        <stat.icon className={`w-4 h-4 ${stat.iconColor}`} />
                      </div>
                      <div className="text-base font-bold text-gray-900">
                        {stat.value}
                      </div>
                      <div className="text-[9px] text-gray-500 text-center leading-tight">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Experts Badge - Mobile */}
                <div className="mt-4 flex items-center justify-center gap-3 pt-3 border-t border-gray-200/50">
                  <div className="flex -space-x-2">
                    {["JD", "MK", "AL", "SR"].map((initial, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full border-2 border-white bg-linear-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold shadow-md"
                      >
                        {initial}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm flex items-center gap-1">
                      Expert Live Tutors
                      <Sparkles className="w-3 h-3 text-amber-500" />
                    </div>
                    <div className="text-xs text-gray-500">
                      20+ certified instructors
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Section - Desktop */}
            <div className="hidden lg:block mt-6 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg">
              <div className="flex flex-wrap items-center justify-center gap-6">
                <div className="flex items-center gap-6">
                  {[
                    {
                      value: "50+",
                      label: "Live Classes/Week",
                      icon: Video,
                      bgColor: "bg-purple-100",
                      iconColor: "text-purple-600",
                    },
                    {
                      value: "3K+",
                      label: "Active Learners",
                      icon: Users,
                      bgColor: "bg-indigo-100",
                      iconColor: "text-indigo-600",
                    },
                    {
                      value: "95%",
                      label: "Improvement Rate",
                      icon: TrendingUp,
                      bgColor: "bg-amber-100",
                      iconColor: "text-amber-600",
                    },
                  ].map((stat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-full ${stat.bgColor} flex items-center justify-center`}
                      >
                        <stat.icon className={`w-4 h-4 ${stat.iconColor}`} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">
                          {stat.value}
                        </div>
                        <div className="text-[10px] text-gray-500 whitespace-nowrap">
                          {stat.label}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-[linear-gradient(to_right,#ffffff,#3b82f6,#8b5cf6,#ffffff)] h-px w-full"></div>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {["JD", "MK", "AL", "SR"].map((initial, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full border-2 border-white bg-linear-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold shadow-md"
                      >
                        {initial}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-xs flex items-center gap-1">
                      Expert Live Tutors
                      <Sparkles className="w-3 h-3 text-amber-500" />
                    </div>
                    <div className="text-[10px] text-gray-500 whitespace-nowrap">
                      20+ certified instructors
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
          }
          50% {
            transform: scale(1.02);
            box-shadow: 0 0 0 8px rgba(239, 68, 68, 0);
          }
        }

        @keyframes ping {
          75%,
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 3s ease-in-out infinite 1.5s;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }

        .animate-ping {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        @media (min-width: 480px) {
          .xs\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
      `}</style>
    </section>
  );
};

export default Banner;