"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SectionDividerProps {
  fromColor?: string;
  toColor?: string;
}

export default function SectionDivider({ fromColor = "#000", toColor = "#fff" }: SectionDividerProps) {
  const dividerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Line draws from left to right as you scroll past
      gsap.fromTo(lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: dividerRef.current,
            start: "top 80%",
            end: "top 30%",
            scrub: 1,
          }
        }
      );
    }, dividerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={dividerRef}
      style={{
        width: "100%",
        padding: "0 5%",
        background: `linear-gradient(to bottom, ${fromColor}, ${toColor})`,
        height: "20vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        ref={lineRef}
        style={{
          width: "100%",
          height: "1px",
          background: fromColor === "#000" ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)",
          transformOrigin: "left center",
        }}
      />
    </div>
  );
}
