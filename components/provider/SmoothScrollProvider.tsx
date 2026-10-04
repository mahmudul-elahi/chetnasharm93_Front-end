"use client";

import { useEffect, Suspense } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";

function SmoothScrollHandler() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/dashboard")) return;
    if (pathname.startsWith("/login")) return;
    if (pathname.startsWith("/register")) return;
    if (pathname.startsWith("/manual-payment")) return;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [pathname]);

  return null;
}

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={null}>
        <SmoothScrollHandler />
      </Suspense>
      {children}
    </>
  );
}
