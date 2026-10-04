"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import MyButton from "./MyButton";

export default function LoginButton() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentUrl = `${pathname}${
    searchParams.toString() ? `?${searchParams.toString()}` : ""
  }`;

  return (
    <Link href={`/login?redirect=${encodeURIComponent(currentUrl)}`}>
      <MyButton className="px-8 hidden lg:block">Sign In</MyButton>
    </Link>
  );
}
