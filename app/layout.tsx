import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import "../style/phone-input.css";
import ReduxProvider from "@/src/redux/provider";
import { Toaster } from "sonner";
import SmoothScrollProvider from "@/components/provider/SmoothScrollProvider";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Listenact - Learn English Live with Expert Teachers",
    template: "%s | Listenact",
  },
  description:
    "Learn English Live with Expert Teachers in Real-Time. Interactive 1-on-1 and group classes taught through Hindi & Punjabi.",
  keywords: [
    "English Learning",
    "Live English Classes",
    "Learn English Hindi",
    "Learn English Punjabi",
    "IELTS Preparation",
    "Spoken English",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col font-sans outfit-font"
        suppressHydrationWarning
      >
        <ReduxProvider>
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </ReduxProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
