"use client";

import { useState, useEffect, useRef } from "react";
import { Heart, Coffee, Quote, Gift, FileText, Calendar } from "lucide-react";
import { FaHeart } from "react-icons/fa";
import { useGetActivityNotesQuery } from "@/src/redux/api/student/studentDashboardApi";
import Pagination from "@/components/ui/Pagination";

export default function StudentSettings() {
  const [encouragementIndex, setEncouragementIndex] = useState(0);
  const [affirmationIndex, setAffirmationIndex] = useState(0);
  const [fadeEncouragement, setFadeEncouragement] = useState(true);
  const [fadeAffirmation, setFadeAffirmation] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const previousPageRef = useRef(currentPage);

  const { data: activityNotesData, isLoading: activityNotesLoading } =
    useGetActivityNotesQuery({ page: currentPage, per_page: itemsPerPage });
  const activityNotes = activityNotesData?.data || [];
  const pagination = activityNotesData?.pagination || {};

  const encouragements = [
    "Every word you learn opens a new door.",
    "Mistakes are proof that you're trying.",
    "Your journey matters. Keep going.",
    "Learning a language is learning a new way to think.",
    "You're braver than you believe, stronger than you seem.",
    "Small steps every day lead to big changes.",
    "The hardest part is starting. You already did.",
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

  // Scroll to top when page changes and data loads
  useEffect(() => {
    // Only scroll if page has actually changed (not on initial load)
    if (previousPageRef.current !== currentPage && !activityNotesLoading && pagination.total > 0) {
      // Use setTimeout to ensure DOM is fully updated after data load
      const timer = setTimeout(() => {
        const scrollElement = document.getElementById("scroll-to-top");
        if (scrollElement) {
          const elementPosition = scrollElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - 20;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }, 300);
      
      // Update previous page ref
      previousPageRef.current = currentPage;
      
      return () => clearTimeout(timer);
    }
  }, [currentPage, activityNotesLoading, pagination.total]);

  return (
    <div className="min-h-screen ">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 lg:py-0">
        {/* Warm Welcome */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-blue-100 mb-6">
            <Heart className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-600">For You, Dear Student</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Hello, Amazing Student
          </h1>

          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Before you start your next lesson, take a moment for yourself.
          </p>
        </div>

        {/* Daily Encouragement Card - With Fade Animation */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
              <Quote className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white/80 text-sm mb-2 flex items-center gap-1">
                <FaHeart className="w-3 h-3" /> A little encouragement for you
              </p>
              <div
                className={`transition-opacity duration-300 ${fadeEncouragement ? "opacity-100" : "opacity-0"}`}
              >
                <p className="text-white text-xl sm:text-2xl font-medium leading-relaxed">
                  "{encouragements[encouragementIndex]}"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Notes Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Activity Notes
              </h2>
              <p className="text-sm text-gray-500">
                Feedback from your teachers
              </p>
            </div>
          </div>

          {activityNotesLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-pulse"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : activityNotes.length > 0 ? (
            <div id="scroll-to-top" className="space-y-4">
              {activityNotes.map((note: any) => (
                <div
                  key={note.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {note.batch_name}
                      </h3>
                      <p className="text-sm font-semibold text-gray-600">
                        - {note.teacher_name}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(
                        note.status,
                      )}`}
                    >
                      {formatStatus(note.status)}
                    </span>
                  </div>

                  <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    {note.comment}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {new Date(note.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No activity notes yet</p>
              <p className="text-gray-400 text-xs mt-1">
                Your teachers will provide feedback here
              </p>
            </div>
          )}

          {/* Pagination Component */}
          {pagination.total > 0 && (
            <div className="mt-6">
              <Pagination
                currentPage={pagination.current_page}
                totalPages={pagination.last_page}
                totalItems={pagination.total}
                itemsPerPage={itemsPerPage}
                onPageChange={(page) => setCurrentPage(page)}
                className="mb-6"
              />
            </div>
          )}
        </div>
        {/* Self-Care Reminder */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
              <Coffee className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="font-medium text-gray-800">
                Take breaks while learning
              </p>
              <p className="text-xs text-gray-400">
                Your brain needs rest to absorb new information
              </p>
            </div>
          </div>
        </div>

        {/* Gratitude Section */}
        <div className="text-center pt-4 border-t border-gray-100">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Gift className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-500">Proud of your journey</span>
          </div>
          <p className="text-xs text-gray-400">
            Every new word you learn brings you closer to fluency.
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper function to get status badge color
function getStatusColor(status: string): string {
  switch (status) {
    case "excellent":
      return "bg-green-100 text-green-700 border border-green-200";
    case "good":
      return "bg-blue-100 text-blue-700 border border-blue-200";
    case "average":
      return "bg-yellow-100 text-yellow-700 border border-yellow-200";
    case "needs_improvement":
      return "bg-orange-100 text-orange-700 border border-orange-200";
    case "requires_support":
      return "bg-red-100 text-red-700 border border-red-200";
    default:
      return "bg-gray-100 text-gray-700 border border-gray-200";
  }
}

// Helper function to format status text
function formatStatus(status: string): string {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
