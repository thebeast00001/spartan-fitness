"use client";

import { useEffect, useRef } from "react";

interface StaggeredTransitionProps {
  prevColor: string;
  nextColor: string;
  direction?: "left-to-right" | "right-to-left";
}

export default function StaggeredTransition({
  prevColor,
  nextColor,
  direction = "left-to-right"
}: StaggeredTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stripsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (reduceMotion || isMobile) {
      // Skip GSAP entirely on mobile — instantly hide strips for a clean section break.
      stripsRef.current.forEach((el) => { if (el) el.style.transform = "scaleY(0)"; });
      return;
    }

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        gsap.to(stripsRef.current, {
          scaleY: 0,
          ease: "none",
          stagger: 0,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            end: "top 20%",
            scrub: 1,
          }
        });
      }, containerRef);
      cleanup = () => ctx.revert();
    })();

    return () => { cancelled = true; if (cleanup) cleanup(); };
  }, []);

  // Set the initial heights of the strips to create the distorted/stepped symmetry
  const getInitialHeight = (index: number) => {
    if (direction === "left-to-right") {
      if (index === 0) return "10vh";
      if (index === 1) return "20vh";
      if (index === 2) return "30vh";
    } else {
      if (index === 0) return "30vh";
      if (index === 1) return "20vh";
      if (index === 2) return "10vh";
    }
    return "0vh";
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        position: "relative",
        background: nextColor, // The background is the incoming section's color
        height: "0px", // The container itself takes up no space in flow
        zIndex: 10,
        pointerEvents: "none",
      }}
    >
      <div style={{ display: "flex", width: "100%", position: "absolute", top: 0, left: 0 }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            ref={(el) => { stripsRef.current[i] = el; }}
            style={{
              width: "33.3333%",
              height: getInitialHeight(i),
              backgroundColor: prevColor, // The strips are the outgoing section's color
              transformOrigin: "top center", // They shrink upward
            }}
          />
        ))}
      </div>
    </div>
  );
}
