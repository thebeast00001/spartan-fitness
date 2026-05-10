"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
    const ctx = gsap.context(() => {
      // Animate the strips shrinking upwards (scaleY to 0) as we scroll past
      gsap.to(stripsRef.current, {
        scaleY: 0,
        ease: "none",
        stagger: 0, // We don't stagger the animation time, the different initial heights create the stagger effect
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%", // Start animating when the transition area is 80% down the screen
          end: "top 20%",   // Finish when it reaches 20% down
          scrub: 1,
        }
      });
    }, containerRef);
    return () => ctx.revert();
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
