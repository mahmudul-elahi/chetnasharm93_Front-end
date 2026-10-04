"use client";
import React, { useState } from "react";
import { Mail, Phone, Copy, Check } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useGetSupportInfoQuery } from "@/src/redux/api/home/supportApi";
import MyButton from "@/components/ui/MyButton";
import { RiCustomerService2Fill } from "react-icons/ri";
import Loader from "@/components/ui/Loader";

const ContactPage = () => {
  const { data, isLoading } = useGetSupportInfoQuery(null);
  const supportInfo = data?.data;
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const salesExecutives = [
    {
      name: "Taruna",
      role: "Sales Executive",
      phone: "+1 226 783 5840",
      callLink: "tel:+12267835840",
      whatsappLink: "https://wa.me/12267835840",
    },
    {
      name: "Manisha",
      role: "Sales Executive",
      phone: "+1 226 741 3302",
      callLink: "tel:+12267413302",
      whatsappLink: "https://wa.me/12267413302",
    },
    {
      name: "Surekha",
      role: "Sales Executive",
      phone: "+1 226 540 0680",
      callLink: "tel:+12265400680",
      whatsappLink: "https://wa.me/12265400680",
    },
    {
      name: "Kajal",
      role: "Sales Executive",
      phone: "+1 614 583 5660",
      callLink: "tel:+16145835660",
      whatsappLink: "https://wa.me/16145835660",
    },
    {
      name: "Khushi",
      role: "Sales Executive",
      phone: "+1 226 401 3002",
      callLink: "tel:+12264013002",
      whatsappLink: "https://wa.me/12264013002",
    },
  ];

  const handleCopyEmail = () => {
    const email = supportInfo?.support_email || "support@listenact.com";
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyPhone = () => {
    const phone = supportInfo?.support_number || "+1 800 123 4567";
    navigator.clipboard.writeText(phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans mt-10">
      {/* Main Container */}
      <div className="max-w-350 mx-auto px-4 sm:px-6 py-16 sm:py-24 md:py-32">
        {/* Hero Section */}
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <RiCustomerService2Fill className="w-4 h-4" />
            Get in Touch
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 tracking-tight text-gray-900">
            Let's Talk and
            <br />
            <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
              Start Your Journey
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed px-4">
            Have questions about our language courses? Reach out to our team —
            we're here to help you find the perfect learning path.
          </p>
        </div>

        {/* Creative Support Section - Email & Phone Cards */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-20 sm:mb-28">
          {/* Creative Email Card */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-linear-to-r from-blue-200 to-blue-300 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 hover:border-blue-200 transition-all hover:-translate-y-2">
             
              <div className="relative">
                <div className="w-16 h-16 mx-auto sm:mx-0 bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                  <Mail className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 text-center sm:text-left">
                  Send us an Email
                </h3>

                <p className="text-gray-500 text-sm mb-4 text-center sm:text-left">
                  We'll respond within 24 hours
                </p>

                {/* Email Display with Copy Button */}
                <div className="flex items-center justify-between gap-2 bg-gray-50 border border-gray-200 rounded-xl p-3 mb-5 group/copy">
                  <span className="text-gray-700 text-sm sm:text-base truncate">
                    {supportInfo?.support_email || "support@listenact.com"}
                  </span>
                  <button
                    onClick={handleCopyEmail}
                    className="p-1.5 hover:bg-gray-200 rounded-lg transition shrink-0"
                  >
                    {copiedEmail ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={`mailto:${supportInfo?.support_email || "support@listenact.com"}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all hover:scale-105"
                  >
                    <Mail className="w-4 h-4" />
                    Compose Email
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Creative Phone Card */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-linear-to-r from-green-200 to-green-300 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 hover:border-green-200 transition-all hover:-translate-y-2">
              {/* Animated Icon Background */}
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-linear-to-tr from-green-50 to-transparent rounded-full -ml-10 -mb-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative">
                <div className="w-16 h-16 mx-auto sm:mx-0 bg-linear-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300 shadow-lg">
                  <Phone className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 text-center sm:text-left">
                  Call Us Directly
                </h3>

                <p className="text-gray-500 text-sm mb-4 text-center sm:text-left">
                  Mon-Fri, 9 AM - 6 PM EST
                </p>

                {/* Phone Display with Copy Button */}
                <div className="flex items-center justify-between gap-2 bg-gray-50 border border-gray-200 rounded-xl p-3 mb-5">
                  <span className="text-gray-700 text-sm sm:text-base">
                    {supportInfo?.support_number || "+1 800 123 4567"}
                  </span>
                  <button
                    onClick={handleCopyPhone}
                    className="p-1.5 hover:bg-gray-200 rounded-lg transition flex-shrink-0"
                  >
                    {copiedPhone ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={`tel:${supportInfo?.support_number?.replace(/\s/g, "") || "+18001234567"}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-linear-to-r from-green-500 to-green-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all hover:scale-105"
                  >
                    <Phone className="w-4 h-4" />
                    Call Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sales Executives Section - Responsive Grid */}
        <div className="mb-20 sm:mb-28">
          <div className="text-center mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-200 mb-4">
              <span className="text-sm font-medium text-purple-600">
                Sales Team
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 px-4">
              Talk to Our Language Advisors
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto px-4 text-sm sm:text-base">
              Our sales executives are ready to help you choose the right course
              and schedule
            </p>
          </div>

          {/* Responsive Grid - 1 on mobile, 2 on tablet, 3 on laptop, 5 on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">
            {salesExecutives.map((exec, idx) => (
              <div
                key={idx}
                className="group bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-purple-200"
              >
                {/* Animated Avatar */}
                <div className="w-16 h-16 mx-auto rounded-full bg-linear-to-br from-purple-100 to-pink-100 flex items-center justify-center mb-4 border-2 border-purple-200 group-hover:scale-110 group-hover:border-purple-400 transition-all duration-300">
                  <span className="text-2xl font-bold text-purple-600">
                    {exec.name.charAt(0)}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-gray-800">
                  {exec.name}
                </h3>
                <p className="text-xs text-purple-600 font-medium mb-2">
                  {exec.role}
                </p>

                {/* Phone number with better visibility */}
                <p className="text-sm text-gray-600 font-mono mb-4">
                  {exec.phone}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <a
                    href={exec.callLink}
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-green-50 text-green-600 rounded-lg text-sm font-medium hover:bg-green-100 hover:scale-105 transition-all"
                  >
                    <Phone className="w-3 h-3" />
                    Call
                  </a>
                  <a
                    href={exec.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-medium hover:bg-emerald-100 hover:scale-105 transition-all"
                  >
                    <FaWhatsapp className="w-3 h-3" />
                    WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA Button */}
        <div className="text-center">
          <MyButton>Contact Sales Team</MyButton>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
