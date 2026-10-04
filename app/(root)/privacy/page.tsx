"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Shield,
  Eye,
  Database,
  Mail,
  Cookie,
  Clock,
  Lock,
  Share2,
  AlertCircle,
  CheckCircle,
  Globe,
  Server,
  Users,
  FileText,
  Menu,
  X,
  ChevronRight,
  UserCheck,
  DollarSign,
} from "lucide-react";

interface ContentItem {
  subtitle?: string;
  text?: string;
  list?: string[];
  note?: string;
}

interface Section {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  content: ContentItem[];
}

const PrivacyPolicyPage = () => {
  const lastUpdated = "June 02, 2026";
  const [isJumpMenuOpen, setIsJumpMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const sections: Section[] = [
    {
      id: "summary",
      title: "Summary of Key Points",
      icon: FileText,
      content: [
        {
          text: "This summary provides key points from our Privacy Notice. You can find more details by clicking the links below.",
          list: [
            "What personal information do we process? - We may process personal information depending on how you interact with us.",
            "Do we process sensitive personal information? - We do not process sensitive personal information.",
            "Do we collect information from third parties? - We do not collect any information from third parties.",
            "How do we process your information? - We process your information to provide, improve, and administer our Services.",
            "How do we keep your information safe? - We have adequate organizational and technical processes in place.",
            "What are your rights? - Depending on your location, you may have certain rights regarding your personal information.",
          ],
        },
      ],
    },
    {
      id: "information-collect",
      title: "What Information Do We Collect?",
      icon: Database,
      content: [
        {
          subtitle: "Personal Information You Disclose to Us",
          text: "We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.",
        },
        {
          subtitle: "Personal Information Provided by You",
          text: "The personal information we collect may include:",
          list: [
            "Names",
            "Phone numbers",
            "Email addresses",
            "Usernames",
            "Passwords",
            "Contact preferences",
            "Billing addresses",
            "Contact or authentication data",
            "Mailing addresses",
          ],
        },
        {
          subtitle: "Sensitive Information",
          text: "We do not process sensitive information.",
        },
        {
          subtitle: "Payment Data",
          text: "We may collect data necessary to process your payment, such as your payment instrument number and security code. All payment data is handled and stored by Stripe and PayPal. You may find their privacy notices here:",
          list: [
            "Stripe: https://stripe.com/privacy",
            "PayPal: https://www.paypal.com/us/legalhub/paypal/privacy-full",
          ],
        },
        {
          subtitle: "Information Automatically Collected",
          text: "We automatically collect certain information when you visit, use, or navigate the Services. This information does not reveal your specific identity but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, and other technical information.",
          list: [
            "Log and Usage Data: IP address, device information, browser type, settings, and information about your activity in the Services",
            "Location Data: Information about your device's location (precise or imprecise) based on your IP address. You can opt out by disabling your Location setting.",
          ],
        },
      ],
    },
    {
      id: "how-process",
      title: "How Do We Process Your Information?",
      icon: Eye,
      content: [
        {
          text: "We process your personal information for a variety of reasons, depending on how you interact with our Services, including:",
          list: [
            "To deliver and facilitate delivery of services to the user",
            "To respond to user inquiries/offer support to users",
            "To send administrative information to you",
            "To fulfill and manage your orders, payments, returns, and exchanges",
            "To request feedback and contact you about your use of our Services",
            "To send you marketing and promotional communications (you can opt out at any time)",
            "To deliver targeted advertising to you",
            "To protect our Services (fraud monitoring and prevention)",
            "To identify usage trends to improve our Services",
            "To determine the effectiveness of our marketing and promotional campaigns",
            "To save or protect an individual's vital interest",
          ],
        },
      ],
    },
    {
      id: "legal-bases",
      title: "What Legal Bases Do We Rely On?",
      icon: Shield,
      content: [
        {
          text: "We only process your personal information when we believe it is necessary and we have a valid legal reason to do so under applicable law, like with your consent, to comply with laws, to provide you with services to enter into or fulfill our contractual obligations, to protect your rights, or to fulfill our legitimate business interests.",
        },
        {
          subtitle: "If you are located in the EU or UK:",
          text: "We may rely on the following legal bases:",
          list: [
            "Consent - You have given us permission to use your personal information for a specific purpose",
            "Performance of a Contract - To fulfill our contractual obligations to you",
            "Legitimate Interests - To achieve our legitimate business interests that do not outweigh your rights and freedoms",
            "Legal Obligations - To comply with legal obligations",
            "Vital Interests - To protect your vital interests or those of a third party",
          ],
        },
        {
          subtitle: "If you are located in Canada:",
          text: "We may process your information if you have given us specific permission (express consent) or where your permission can be inferred (implied consent). You can withdraw your consent at any time. In some exceptional cases, we may be legally permitted to process your information without your consent, including for investigations, fraud detection, business transactions under certain conditions, and other specific circumstances.",
        },
      ],
    },
    {
      id: "when-share",
      title: "When and With Whom Do We Share Your Information?",
      icon: Share2,
      content: [
        {
          text: "We may share your personal information in the following situations:",
          list: [
            "Business Transfers - In connection with mergers, sale of company assets, financing, or acquisition of all or a portion of our business",
          ],
        },
      ],
    },
    {
      id: "cookies",
      title: "Do We Use Cookies and Other Tracking Technologies?",
      icon: Cookie,
      content: [
        {
          text: "We may use cookies and similar tracking technologies (like web beacons and pixels) to collect and store your information. Some online tracking technologies help us maintain the security of our Services and your account, prevent crashes, fix bugs, save your preferences, and assist with basic site functions.",
        },
        {
          text: "We also permit third parties and service providers to use online tracking technologies on our Services for analytics and advertising, including to help manage and display advertisements, tailor advertisements to your interests, or send abandoned shopping cart reminders.",
        },
        {
          subtitle: "Google Analytics",
          text: "We may share your information with Google Analytics to track and analyze the use of the Services. The Google Analytics Advertising Features we may use include Remarketing with Google Analytics. To opt out of being tracked by Google Analytics across the Services, visit https://tools.google.com/dlpage/gaoptout. You can opt out of Google Analytics Advertising Features through Ads Settings.",
        },
      ],
    },
    {
      id: "social-logins",
      title: "How Do We Handle Your Social Logins?",
      icon: Users,
      content: [
        {
          text: "Our Services offer you the ability to register and log in using your third-party social media account details (like Facebook or X logins). If you choose to do this, we will receive certain profile information from your social media provider, including your name, email address, friends list, and profile picture, as well as other information you choose to make public.",
        },
        {
          text: "We will use the information we receive only for the purposes described in this Privacy Notice or as otherwise made clear to you on the relevant Services. Please note that we do not control, and are not responsible for, other uses of your personal information by your third-party social media provider.",
        },
      ],
    },
    {
      id: "how-long",
      title: "How Long Do We Keep Your Information?",
      icon: Clock,
      content: [
        {
          text: "We keep your information for as long as necessary to fulfill the purposes outlined in this Privacy Notice unless otherwise required by law. We will keep your personal information for the period of time in which users have an account with us.",
        },
        {
          text: "When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize such information, or if this is not possible, securely store it and isolate it from further processing until deletion is possible.",
        },
      ],
    },
    {
      id: "how-safe",
      title: "How Do We Keep Your Information Safe?",
      icon: Lock,
      content: [
        {
          text: "We have implemented appropriate and reasonable technical and organizational security measures designed to protect the security of any personal information we process. However, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information.",
        },
        {
          text: "Although we will do our best to protect your personal information, transmission of personal information to and from our Services is at your own risk. You should only access the Services within a secure environment.",
        },
      ],
    },
    {
      id: "minors",
      title: "Do We Collect Information From Minors?",
      icon: UserCheck,
      content: [
        {
          text: "We do not knowingly collect, solicit data from, or market to children under 18 years of age or the equivalent age as specified by law in your jurisdiction, nor do we knowingly sell such personal information. By using the Services, you represent that you are at least 18 or the equivalent age as specified by law in your jurisdiction or that you are the parent or guardian of such a minor and consent to such minor dependent's use of the Services.",
        },
        {
          text: "If we learn that personal information from users less than 18 years of age has been collected, we will deactivate the account and take reasonable measures to promptly delete such data from our records. If you become aware of any data we may have collected from children under age 18, please contact us.",
        },
      ],
    },
    {
      id: "privacy-rights",
      title: "What Are Your Privacy Rights?",
      icon: Shield,
      content: [
        {
          text: "Depending on your location, you may have the following rights:",
          list: [
            "Request confirmation of whether we process your personal information",
            "Request access to your personal information",
            "Request correction of inaccurate personal information",
            "Request deletion of your personal information",
            "Object to or restrict processing of your personal information",
            "Request data portability",
            "Withdraw your consent at any time (where processing is based on consent)",
          ],
        },
        {
          subtitle: "Account Information",
          text: "If you would like to review or change the information in your account or terminate your account, you can log in to your account settings and update your user account. Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases.",
        },
        {
          text: "If you have questions or comments about your privacy rights, you may email us at contact@listenact.ca.",
        },
      ],
    },
    {
      id: "dnt",
      title: "Controls for Do-Not-Track Features",
      icon: Eye,
      content: [
        {
          text: "Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track ('DNT') feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. No uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online.",
        },
      ],
    },
    {
      id: "us-residents",
      title: "Do United States Residents Have Specific Privacy Rights?",
      icon: Globe,
      content: [
        {
          text: "If you are a resident of California, Colorado, Connecticut, Delaware, Florida, Indiana, Iowa, Kentucky, Maryland, Minnesota, Montana, Nebraska, New Hampshire, New Jersey, Oregon, Rhode Island, Tennessee, Texas, Utah, or Virginia, you may have the right to request access to and receive details about the personal information we maintain about you, correct inaccuracies, get a copy of, or delete your personal information.",
        },
        {
          text: "We have not disclosed, sold, or shared any personal information to third parties for a business or commercial purpose in the preceding twelve (12) months. We will not sell or share personal information in the future belonging to website visitors, users, and other consumers.",
        },
      ],
    },
    {
      id: "other-regions",
      title: "Do Other Regions Have Specific Privacy Rights?",
      icon: Server,
      content: [
        {
          subtitle: "Australia and New Zealand",
          text: "We collect and process your personal information under the obligations and conditions set by Australia's Privacy Act 1988 and New Zealand's Privacy Act 2020. If you do not wish to provide the personal information necessary to fulfill their applicable purpose, it may affect our ability to provide our services. At any time, you have the right to request access to or correction of your personal information.",
        },
        {
          subtitle: "Republic of South Africa",
          text: "If you are unsatisfied with the manner in which we address any complaint regarding our processing of personal information, you can contact the Information Regulator (South Africa) at enquiries@inforegulator.org.za.",
        },
      ],
    },
    {
      id: "updates",
      title: "Do We Make Updates to This Notice?",
      icon: FileText,
      content: [
        {
          text: "Yes, we will update this notice as necessary to stay compliant with relevant laws. The updated version will be indicated by an updated 'Revised' date at the top of this Privacy Notice. If we make material changes to this Privacy Notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification.",
        },
      ],
    },
    {
      id: "contact",
      title: "How Can You Contact Us About This Notice?",
      icon: Mail,
      content: [
        {
          text: "If you have questions or comments about this notice, you may email us at contact@listenact.ca or contact us by post at:",
          list: [
            "Listenact Limited",
            "49 Palmadeo drive",
            "Nepean",
            "Ottawa, Ontario K2J4Z3",
            "Canada",
          ],
        },
      ],
    },
    {
      id: "review-update",
      title: "How Can You Review, Update, or Delete the Data We Collect From You?",
      icon: Database,
      content: [
        {
          text: "Based on the applicable laws of your country or state of residence in the US, you may have the right to request access to the personal information we collect from you, details about how we have processed it, correct inaccuracies, or delete your personal information. To request to review, update, or delete your personal information, please submit a data subject access request through our platform or contact us directly.",
        },
      ],
    },
  ];

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsJumpMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("[data-section-id]");
      let currentActive = "";

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          currentActive = section.getAttribute("data-section-id") || "";
        }
      });

      setActiveSection(currentActive);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
    setIsJumpMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative bg-linear-to-r from-primary/10 via-secondary/5 to-primary/10 pt-37 pb-25">
        <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Privacy Policy
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                Privacy Policy
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Listenact Limited (doing business as Listenact)
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Last updated: {lastUpdated}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Jump to Section Button - Sticky */}
        <div className="sticky top-20 z-30 mb-8">
          <button
            ref={buttonRef}
            onClick={() => setIsJumpMenuOpen(!isJumpMenuOpen)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group cursor-pointer"
          >
            {isJumpMenuOpen ? (
              <X className="w-4 h-4 text-primary" />
            ) : (
              <Menu className="w-4 h-4 text-primary" />
            )}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Jump to Section
            </span>
            <ChevronRight
              className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
                isJumpMenuOpen ? "rotate-90" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu with Animation */}
          <div
            ref={menuRef}
            className={`absolute left-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 origin-top-left z-20 ${
              isJumpMenuOpen
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
            }`}
          >
            <div className="p-2 max-h-96 overflow-y-auto">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group cursor-pointer ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <div
                      className={`p-1.5 rounded-lg transition-all ${
                        isActive
                          ? "bg-primary/20"
                          : "bg-gray-100 dark:bg-gray-700 group-hover:bg-primary/10"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 ${
                          isActive
                            ? "text-primary"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      />
                    </div>
                    <span
                      className={`text-sm font-medium flex-1 truncate ${
                        isActive
                          ? "text-primary"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {section.title}
                    </span>
                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Policy Sections */}
        <div className="space-y-8">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div
                key={section.id}
                id={section.id}
                data-section-id={section.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden scroll-mt-20 transition-all duration-300 hover:shadow-md"
              >
                <div className="border-b border-gray-200 dark:border-gray-700 bg-linear-to-r from-primary/5 to-secondary/5 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {section.title}
                    </h2>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  {section.content.map((content, idx) => (
                    <div key={idx}>
                      {content.subtitle && (
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                          {content.subtitle}
                        </h3>
                      )}
                      {content.text && (
                        <p className="text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                          {content.text}
                        </p>
                      )}
                      {content.list && (
                        <ul className="space-y-2 mt-3">
                          {content.list.map((item, itemIdx) => (
                            <li key={itemIdx} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                              <span className="text-gray-600 dark:text-gray-400 text-sm">
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {content.note && (
                        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                            <p className="text-sm text-blue-800 dark:text-blue-300">
                              {content.note}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            This Privacy Policy was created for Listenact Limited (doing business as Listenact).
          </p>
          <p className="mt-2">
            For any questions, please contact us at{" "}
            <a
              href="mailto:contact@listenact.ca"
              className="text-primary hover:underline"
            >
              contact@listenact.ca
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;