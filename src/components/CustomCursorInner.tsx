"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";

export default function CustomCursorInner() {
  const [isHovering, setIsHovering] = useState(false);
  const [hoverText, setHoverText] = useState("");

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springX = useSpring(mouseX, { stiffness: 500, damping: 28, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 500, damping: 28, mass: 0.5 });

  const velocityX = useTransform(mouseX, (val) => val - (mouseX.getPrevious() ?? val));
  const velocityY = useTransform(mouseY, (val) => val - (mouseY.getPrevious() ?? val));

  const skewX = useTransform(velocityX, [-50, 50], [-15, 15]);
  const skewY = useTransform(velocityY, [-50, 50], [-15, 15]);

  const scale = useSpring(isHovering ? 1.5 : 1, { stiffness: 300, damping: 20 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");
      const button = target.closest("button");
      const isClickable =
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button" ||
        link || button ||
        window.getComputedStyle(target).cursor === "pointer";

      if (isClickable) {
        setIsHovering(true);
        scale.set(3);

        if (target.textContent?.includes("TRIAL") || link?.href?.includes("trial")) {
          setHoverText("JOIN");
        } else if (link?.href?.includes("schedule")) {
          setHoverText("PLAN");
        } else {
          setHoverText("GO");
        }
      } else {
        setIsHovering(false);
        scale.set(1);
        setHoverText("");
      }
    };

    window.addEventListener("mousemove", updateMousePosition, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [mouseX, mouseY, scale]);

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "16px",
        height: "16px",
        backgroundColor: "#fff",
        borderRadius: isHovering ? "4px" : "50%",
        pointerEvents: "none",
        zIndex: 99999,
        mixBlendMode: "difference",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-inter), sans-serif",
        x: useTransform(springX, (val) => val - 8),
        y: useTransform(springY, (val) => val - 8),
        scale: scale,
        skewX: isHovering ? 0 : skewX,
        skewY: isHovering ? 0 : skewY,
        rotate: useTransform(velocityX, [-100, 100], [-10, 10]),
      }}
    >
      <motion.span
        animate={{ opacity: isHovering ? 1 : 0 }}
        transition={{ duration: 0.15 }}
        style={{
          fontSize: "4px",
          color: "#000",
          fontWeight: 900,
          letterSpacing: "0.5px",
          mixBlendMode: "normal",
        }}
      >
        {hoverText}
      </motion.span>
    </motion.div>
  );
}
