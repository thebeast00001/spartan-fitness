"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./Programs.module.css";
import { motion, AnimatePresence } from "framer-motion";

const programs = [
  { 
    title: "Personal Mastery", 
    category: "Elite 1-on-1 Coaching",
    image: "/images/program_1.png"
  },
  { 
    title: "Strength Squad", 
    category: "High-Energy Group Training",
    image: "/images/program_2.png"
  },
  { 
    title: "Pro Prep", 
    category: "Contest Ready Conditioning",
    image: "/images/program_1.png" // Reusing or could use another
  },
  { 
    title: "Digital Blueprint", 
    category: "Global Transformation Online",
    image: "/images/program_2.png" // Reusing or could use another
  }
];

const Programs = () => {
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className={styles.programs} id="programs" ref={containerRef}>
      <div className={styles.header}>
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          SELECT <br /> YOUR PATH
        </motion.h2>
        <p style={{ maxWidth: '350px', opacity: 0.6, fontSize: '1.1rem' }}>
          A curated selection of pathways designed for absolute physical evolution.
        </p>
      </div>

      <div className={styles.list}>
        {programs.map((p, i) => (
          <div 
            key={i}
            className={styles.item}
            onMouseEnter={() => setActiveImage(p.image)}
            onMouseLeave={() => setActiveImage(null)}
          >
            <div className={styles.index}>0{i + 1}</div>
            <div className={styles.title}>{p.title}</div>
            <div className={styles.category}>{p.category}</div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {activeImage && (
          <motion.div 
            className={styles.hoverImage}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              x: mousePos.x - 200, // Center relative to width
              y: mousePos.y - 250  // Center relative to height
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", damping: 25, stiffness: 150, mass: 0.5 }}
          >
            <img src={activeImage} alt="Program Preview" />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Programs;
