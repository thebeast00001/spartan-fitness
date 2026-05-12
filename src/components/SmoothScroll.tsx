"use client";

import { ReactNode, useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically load Lenis only on desktop. On mobile / touch devices the native
// scroll is dramatically smoother and avoids the well-known Lenis +
// position:fixed/touch perf issues.
const ReactLenis = dynamic(
  () => import("lenis/react").then((m) => m.ReactLenis),
  { ssr: false }
);

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const [enable, setEnable] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const isNarrow = window.matchMedia("(max-width: 1024px)").matches;
    setEnable(!reduceMotion && !isCoarse && !isNarrow);
  }, []);

  if (!enable) return <>{children}</>;

  return (
    <ReactLenis root options={{ lerp: 0.07, duration: 2.0, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
