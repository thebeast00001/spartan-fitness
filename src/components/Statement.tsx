"use client";

import { useEffect, useRef } from "react";
import styles from "./Statement.module.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const statementText = "We do not sell access. We forge discipline. This facility is a sanctuary reserved exclusively for the relentless.";

const Statement = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      
      // 2. The Word Light-up Animation
      const words = textRef.current?.children;

      if (words) {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top top",
          end: "+=150%", // Pin for 150% of screen height
          pin: true,
          scrub: 1, // Smooth scrub
          animation: gsap.fromTo(words, 
            { opacity: 0.1, y: 30 },
            { 
              opacity: 1, 
              y: 0, 
              stagger: 0.1, 
              ease: "power2.out" 
            }
          ),
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Wrap the word "relentless." in italics for editorial emphasis
  const renderWord = (word: string, index: number) => {
    const isEmphasized = word.includes("relentless") || word.includes("discipline");
    return (
      <span 
        key={index} 
        className={`${styles.word} ${isEmphasized ? styles.highlight : ''}`}
      >
        {word}&nbsp;
      </span>
    );
  };

  return (
    <section className={styles.statementSection} ref={containerRef}>
      <h2 className={styles.statementText} ref={textRef}>
        {statementText.split(" ").map((word, i) => renderWord(word, i))}
      </h2>
    </section>
  );
};

export default Statement;
