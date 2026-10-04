import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create an Account",
  description:
    "Join Listenact and start speaking English confidently through live interactive classes with certified tutors.",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
