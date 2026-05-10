"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import styles from "./Loader.module.css";
import { Anton } from "next/font/google";

const anton = Anton({ weight: "400", subsets: ["latin"] });

const Loader = ({ onFinished }: { onFinished: () => void }) => {
  const [progress, setProgress] = useState(0);
  const containerControls = useAnimation();
  const textControls = useAnimation();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Elegant, physics-based progress counter
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      // Easing curve for progress: fast initially, then slows down, then snaps to 100
      currentProgress += (100 - currentProgress) * 0.1 + 1;
      
      if (currentProgress >= 99) {
        currentProgress = 100;
        clearInterval(progressInterval);
        
        const executeZoomThrough = async () => {
          // Fade out progress indicator
          document.querySelector(`.${styles.progressWrapper}`)?.classList.add(styles.fadeOut);

          await textControls.start({
            scale: 60, // Reduced from 200 to fix GPU rendering lag
            opacity: 0, // Fade out as it scales to hide pixelation
            filter: "blur(10px)", // Add faux motion blur
            transition: { 
              duration: 0.9, 
              ease: [0.76, 0, 0.24, 1] 
            }
          });
          
          // Fade out the container backdrop instantly after zoom
          await containerControls.start({
            opacity: 0,
            transition: { duration: 0.1 }
          });
          
          onFinished();
        };
        
        // Small delay at 100% before the explosive zoom
        setTimeout(executeZoomThrough, 400);
      }
      setProgress(Math.min(Math.round(currentProgress), 100));
    }, 40);

    return () => clearInterval(progressInterval);
  }, [textControls, containerControls, onFinished]);

  return (
    <motion.div 
      className={styles.loaderContainer}
      animate={containerControls}
    >
      <div className={styles.loaderBackground}></div>
      
      {/* Subtle Grain Overlay */}
      <div className={styles.grain}></div>

      {/* 
        The Text Wrapper is what scales massively. 
        It holds "SPARTAN" and "FITNESS" 
      */}
      <motion.div 
        ref={wrapperRef}
        className={styles.zoomWrapper}
        animate={textControls}
        initial={{ scale: 1, opacity: 1, x: 0, y: 0 }}
        style={{ transformOrigin: "48% 52%" }}
      >
        <div className={styles.titleRow}>
          {"SPARTAN".split("").map((char, i) => (
            <motion.span
              key={`s-${i}`}
              className={`${styles.brand} ${anton.className}`}
              initial={{ y: "110%", rotateX: 90 }}
              animate={{ y: "0%", rotateX: 0 }}
              transition={{ duration: 1.2, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              {char}
            </motion.span>
          ))}
        </div>
        
        <div className={styles.titleRow}>
          {"FITNESS".split("").map((char, i) => (
            <motion.span
              key={`f-${i}`}
              className={`${styles.brand} ${anton.className}`}
              initial={{ y: "110%", rotateX: 90 }}
              animate={{ y: "0%", rotateX: 0 }}
              transition={{ duration: 1.2, delay: 0.2 + (i * 0.05), ease: [0.16, 1, 0.3, 1] }}
            >
              {char}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Minimalist Progress Indicator */}
      <div className={styles.progressWrapper}>
        <div className={styles.progressLineContainer}>
          <motion.div 
            className={styles.progressLine}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: progress / 100 }}
            transition={{ ease: "linear", duration: 0.1 }}
            style={{ originX: 0 }}
          />
        </div>
        <div className={`${styles.progressNumber} ${anton.className}`}>
          {progress.toString().padStart(3, '0')}
        </div>
      </div>

    </motion.div>
  );
};

export default Loader;
