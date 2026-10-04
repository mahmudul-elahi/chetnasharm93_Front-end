"use client";

import React, { useState, useEffect } from "react";
import { 
  HardHat, 
  AlertTriangle,
  Wrench,
  ChevronRight,
  Mail,
  Loader2,
  Construction,
  Clock
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function UnderConstructionPlayful() {
  const [isNotifying, setIsNotifying] = useState(false);
  const [email, setEmail] = useState("");
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    // Set launch date (7 days from now)
    const launchDate = new Date();
    launchDate.setDate(launchDate.getDate() + 7);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate.getTime() - now;

      if (distance > 0) {
        setDays(Math.floor(distance / (1000 * 60 * 60 * 24)));
        setHours(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
        setMinutes(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
        setSeconds(Math.floor((distance % (1000 * 60)) / 1000));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleNotify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    setIsNotifying(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success("We'll notify you when we're ready!");
    setEmail("");
    setIsNotifying(false);
  };

  return (
    <div className="calc(100vh - 70px) bg-linear-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, #000 0px, #000 2px, transparent 2px, transparent 8px)`
        }} />
      </div>

      <div className="relative container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          {/* Main content */}
          <div className="text-center">
            {/* Animated Construction Icon */}
            <div className="relative mb-8 inline-block">
              <div className="absolute -top-2 -right-2 animate-ping">
                <AlertTriangle className="w-5 h-5 text-primary" />
              </div>
              <div className="relative animate-bounce">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center shadow-lg border-2 border-primary/20">
                  <Construction className="w-16 h-16 text-primary" />
                </div>
              </div>
              {/* Rotating tools */}
              <div className="absolute -bottom-2 -left-2 animate-spin-slow">
                <Wrench className="w-6 h-6 text-primary" />
              </div>
            </div>

            {/* Title with underline effect */}
            <div className="relative inline-block mb-6">
              <h1 className="text-6xl md:text-8xl font-black text-gray-900 dark:text-white tracking-tighter">
                COMING SOON
              </h1>
              <div className="absolute -bottom-2 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-primary/70 to-primary opacity-75 rounded-full" />
            </div>

            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-12">
              We&apos;re building something awesome! This page is currently under construction.
            </p>

            {/* Countdown Timer */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-12">
              {[
                { value: days, label: "Days", color: "primary" },
                { value: hours, label: "Hours", color: "primary" },
                { value: minutes, label: "Minutes", color: "primary" },
                { value: seconds, label: "Seconds", color: "primary" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 border-t-4 border-primary transition-all hover:shadow-xl hover:scale-105"
                >
                  <div className="text-3xl md:text-4xl font-bold text-primary">
                    {String(item.value).padStart(2, "0")}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Notification form */}
            <div className="max-w-md mx-auto mb-8">
              <form onSubmit={handleNotify} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    disabled={isNotifying}
                  />
                </div>
                <Button type="submit" disabled={isNotifying} className="gap-2">
                  {isNotifying ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Notifying...
                    </>
                  ) : (
                    <>
                      Notify Me
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                We'll notify you when this page is ready. No spam, promise!
              </p>
            </div>

            {/* Decorative elements */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px flex-1 max-w-20 bg-linear-to-r from-transparent to-primary" />
              <Clock className="w-4 h-4 text-primary animate-pulse" />
              <div className="h-px flex-1 max-w-20 bg-linear-to-l from-transparent to-primary" />
            </div>

            {/* Back to home */}
            <Link href="/">
              <Button variant="ghost" className="gap-2 hover:text-primary">
                ← Back to Homepage
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}