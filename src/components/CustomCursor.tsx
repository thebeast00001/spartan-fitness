"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";
import { Inter } from "next/font/google";

const inter = Inter({ weight: "700", subsets: ["latin"] });

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [hoverText, setHoverText] = useState("");
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice(
        window.matchMedia("(pointer: coarse)").matches || 
        "ontouchstart" in window || 
        navigator.maxTouchPoints > 0
      );
    };
    checkTouch();
    window.addEventListener("resize", checkTouch);
    return () => window.removeEventListener("resize", checkTouch);
  }, []);

  // Use motion values for raw mouse coordinates to enable velocity calculations
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for the primary tracking
  const springX = useSpring(mouseX, { stiffness: 500, damping: 28, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 500, damping: 28, mass: 0.5 });

  // Compute cursor velocity to stretch the cursor organically
  const velocityX = useTransform(mouseX, (val) => val - (mouseX.getPrevious() ?? val));
  const velocityY = useTransform(mouseY, (val) => val - (mouseY.getPrevious() ?? val));
  
  // Skew calculation based on velocity
  const skewX = useTransform(velocityX, [-50, 50], [-15, 15]);
  const skewY = useTransform(velocityY, [-50, 50], [-15, 15]);

  // Scale based on interaction
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
      const isClickable = target.tagName.toLowerCase() === "a" || 
                          target.tagName.toLowerCase() === "button" || 
                          link || button || 
                          window.getComputedStyle(target).cursor === "pointer";
                          
      if (isClickable) {
        setIsHovering(true);
        scale.set(3); // Expand massively on hover
        
        // Dynamically grab text if it's a specific button, or use default "VIEW"
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

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);
    
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [mouseX, mouseY, scale]);

  if (isTouchDevice) return null;

  return (
    <>
      <motion.div
        className={inter.className}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "16px",
          height: "16px",
          backgroundColor: "#fff",
          borderRadius: isHovering ? "4px" : "50%", // Morphs from circle to rounded square
          pointerEvents: "none",
          zIndex: 99999,
          // Mix blend mode difference can sometimes fail on specific background shades, 
          // we use an inversion approach or highly contrasting color instead
          mixBlendMode: "difference",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // The magic variables
          x: useTransform(springX, (val) => val - 8),
          y: useTransform(springY, (val) => val - 8),
          scale: scale,
          skewX: isHovering ? 0 : skewX, // Disable skew when hovering to read text clearly
          skewY: isHovering ? 0 : skewY,
          rotate: useTransform(velocityX, [-100, 100], [-10, 10]) // Slight physical rotation
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
            mixBlendMode: "normal"
          }}
        >
          {hoverText}
        </motion.span>
      </motion.div>
    </>
  );
}
