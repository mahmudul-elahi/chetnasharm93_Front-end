import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Everything you need to know about Listenact classes, teachers, demo sessions, and payments.",
};

export default function FaqsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
