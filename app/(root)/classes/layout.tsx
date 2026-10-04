import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Live Classes",
  description:
    "Browse live interactive English classes. Learn in real-time with certified instructors and practice speaking in every session.",
};

export default function ClassesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
