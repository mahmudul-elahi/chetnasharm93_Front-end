"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Heart,
  BookOpen,
  Headphones,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa";
import SupportInfo from "./components/SupportInfo";

const Footer = () => {
  const [currentYear, setCurrentYear] = useState<number>(2026);

  React.useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const navigation = {
    company: [
      { name: "About Us", href: "/about" },
      { name: "Contact", href: "/contact" },
    ],
    classes: [
      { name: "All Classes", href: "/classes" },
      { name: "English", href: "/classes" },
      { name: "French", href: "/classes" },
      { name: "Panjabi", href: "/classes" },
      { name: "Hindi", href: "/classes" },
    ],
    support: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Refund Policy", href: "/refund-policy" },
      { name: "Terms and Conditions", href: "/terms" },
      { name: "Payment Options", href: "/payment-options" },
    ],
  };

  const socialLinks = [
    {
      name: "YouTube",
      icon: FaYoutube,
      href: "https://www.youtube.com/@listenactltd",
      color: "hover:bg-[#ff0000]",
    },
    {
      name: "Tiktok",
      icon: FaTiktok,
      href: "https://www.tiktok.com/@listenact",
      color: "hover:bg-linear-to-br from-[#00f2ea] to-[#ff0050]",
    },
    {
      name: "Instagram",
      icon: FaInstagram,
      href: "https://instagram.com",
      color: "hover:bg-linear-to-br from-[#f09433] to-[#bc1888]",
    },
    {
      name: "LinkedIn",
      icon: FaLinkedin,
      href: "https://www.linkedin.com/company/listenact/",
      color: "hover:bg-[#0a66c2]",
    },
    {
      name: "Facebook",
      icon: FaFacebook,
      href: "https://www.facebook.com/listenact.ca",
      color: "hover:bg-[#1877f2]",
    },
  ];

  return (
    <footer className="relative bg-linear-to-br from-gray-900 via-gray-900 to-gray-800 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900 text-white">
      {/* Animated Gradient Border Top */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-br from-primary via-secondary to-primary animate-gradient-x" />

      <div className="relative max-w-350 mx-auto px-5 sm:px-6 lg:px-8 pt-8 pb-10 sm:py-12">
        {/* Main Footer Content - 4 Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <Link href="/" className="inline-block mb-3">
              <div className="flex items-center gap-2">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="w-48 px-4 py-2 bg-white rounded"
                />
              </div>
            </Link>
            <p className="text-gray-400 text-sm mb-3 leading-relaxed">
              Master new languages through immersive live classes with expert
              teachers.
            </p>

            {/* Contact Info */}
            <SupportInfo />

            {/* Social Links */}
            <div className="flex gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110 ${social.color} hover:text-white`}
                  aria-label={social.name}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-primary" />
              Company
            </h3>
            <ul className="space-y-2">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center gap-1 group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                    <span className="group-hover:translate-x-1 transition-transform">
                      {item.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Live Classes Links */}
          <div>
            <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
              <BookOpen className="w-3 h-3 text-primary" />
              Live Classes
            </h3>
            <ul className="space-y-2">
              {navigation.classes.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center gap-1 group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                    <span className="group-hover:translate-x-1 transition-transform">
                      {item.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
              <Headphones className="w-3 h-3 text-primary" />
              Support
            </h3>
            <ul className="space-y-2 mb-4">
              {navigation.support.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center gap-1 group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                    <span className="group-hover:translate-x-1 transition-transform">
                      {item.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-xs text-gray-400">
              © {currentYear} ListenAct. All rights reserved.
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Heart className="w-3 h-3 text-red-500 animate-pulse" />
                <span>Language learners</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-x {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
