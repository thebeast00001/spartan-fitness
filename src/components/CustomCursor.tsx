"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Touch / coarse-pointer devices never need the custom cursor and shouldn't
// pay the cost of loading framer-motion just to render nothing. We short
// circuit before importing the heavy inner component.
const CursorInner = dynamic(() => import("./CustomCursorInner"), { ssr: false });

export default function CustomCursor() {
  const [enable, setEnable] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isCoarse =
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0;
    const narrow = window.matchMedia("(max-width: 1024px)").matches;
    if (!isCoarse && !narrow) setEnable(true);
  }, []);

  if (!enable) return null;
  return <CursorInner />;
}
