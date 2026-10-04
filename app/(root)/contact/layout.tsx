import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us & Support",
  description:
    "Have questions about classes or need help? Contact Listenact support and advisors directly.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
