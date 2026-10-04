import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free English Learning Resources",
  description:
    "Free English speaking topics, vocabulary lists, and practice exercises to boost your fluency.",
};

export default function FreeResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
