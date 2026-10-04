import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Expert Tutors & Instructors",
  description:
    "Meet our verified expert English teachers fluent in Hindi and Punjabi. Learn in real-time with personalized feedback.",
};

export default function TutorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
