"use client";

import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

const emptySubscribe = () => () => {};

export function ModalPortal({ children }: { children: React.ReactNode }) {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!isMounted) return null;

  return createPortal(children, document.body);
}