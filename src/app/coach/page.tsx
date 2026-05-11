"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import CustomCursor from "@/components/CustomCursor";
import { motion } from "framer-motion";
import styles from "./Coach.module.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

gsap.registerPlugin(ScrollTrigger);

export default function CoachPage() {
  const [mounted, setMounted] = useState(false);
  const [mediaInView, setMediaInView] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroNameRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  const mediaRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (mediaInView && videoRef.current) {
      videoRef.current.play().catch(e => console.log("Video play error:", e));
    }
  }, [mediaInView]);

  useEffect(() => {
    // Elegant, buttery smooth intro animations
    const tl = gsap.timeline({ defaults: { ease: "power4.out", duration: 1.5 } });

    // Animate Image Reveal
    const mainHeroImage = containerRef.current?.querySelector(`.${styles.mainHeroImageWrapper}`);
    if (mainHeroImage) {
      tl.fromTo(
        mainHeroImage,
        { scale: 0.95, opacity: 0, y: 50 },
        { scale: 1, opacity: 1, y: 0, duration: 1.8 }
      );
    }

    // Staggered reveal for media blocks
    mediaRefs.current.forEach((el, index) => {
      if (!el) return;
      gsap.fromTo(
        el,
        { y: 100, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.5,
          ease: "power4.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          }
        }
      );
    });

    ScrollTrigger.create({
      trigger: `.${styles.mediaGrid}`,
      start: "top 150%", // Load shortly before scrolling into view
      onEnter: () => setMediaInView(true),
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  const renderAnimatedText = (text: string, indexOffset = 0) => {
    const words = text.split(" ");
    
    // Parent container handles the single Intersection Observer for the whole block
    const sentenceVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.03,
          delayChildren: indexOffset * 0.03,
        }
      }
    };

    const charVariants = {
      hidden: { y: "100%", rotateX: -90, opacity: 0 },
      visible: { 
        y: "0%", 
        rotateX: 0, 
        opacity: 1,
        transition: {
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
        }
      }
    };

    return (
      <motion.span
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sentenceVariants}
        style={{ display: "inline-block" }}
      >
        {words.map((word, wordIndex) => (
          <span key={wordIndex} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
            {word.split("").map((char, charIndex) => (
              <motion.span
                key={charIndex}
                className={styles.char}
                variants={charVariants}
                style={{ display: "inline-block", transformOrigin: "bottom center" }}
              >
                {char}
              </motion.span>
            ))}
            {wordIndex !== words.length - 1 && <span>&nbsp;</span>}
          </span>
        ))}
      </motion.span>
    );
  };

  return (
    <main className={`${styles.main} ${inter.className}`} ref={containerRef}>
      <CustomCursor />
      
      {/* Top Meta Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <p className={styles.boldText}>IFBB Pro</p>
          <p className={styles.mutedText}>Founder, Coach</p>
        </div>
        
        <div className={styles.headerCenter}></div>

        <div className={styles.headerRight}>
          <p className={styles.mutedText}>Social</p>
          <div className={styles.socialLinks}>
            <span>IG</span>
            <span>YT</span>
            <span>X</span>
          </div>
        </div>
      </header>

      {/* NEW HERO SECTION: Grid-based with Image */}
      <section className={styles.mainHero}>
        <div className={styles.mainHeroSidebar} ref={heroNameRef}>
          <h1 className={styles.heroTitle}>
            {renderAnimatedText("Sanjeev")}
            <br />
            {renderAnimatedText("Rajput", 10)}
          </h1>
          <p className={styles.heroBio}>
            Over 15 years of elite physical conditioning, transforming athletes into champions. I can't wait to see what the future holds as I continue to push the boundaries of human performance.
          </p>
          <div className={styles.lastUpdated}>
            <span>Role</span>
            <span>Founder & Head Coach</span>
          </div>
        </div>

        <div className={styles.mainHeroImageWrapper}>
          <Image 
            src="/jeff.png" 
            alt="Sanjeev Rajput" 
            fill 
            className={styles.mainHeroImage}
            priority
            unoptimized
          />
        </div>
      </section>

      {/* SECOND SECTION: Bio statement and media grid */}
      <section className={styles.hero}>
        <div className={styles.heroSidebar} ref={subRef}>
        </div>

        <div className={styles.heroMain}>
          <h1 className={styles.massiveTitle} ref={titleRef}>
            {renderAnimatedText("Elite Coach and")}
            <br />
            {renderAnimatedText("IFBB Pro currently", 15)}
            <br />
            {renderAnimatedText("based in India.", 30)}
          </h1>
        </div>
      </section>

      {/* Media Grid Section */}
      <section className={styles.mediaGrid}>
        <div 
          className={styles.mediaBlockLarge} 
          ref={(el) => { if(el) mediaRefs.current[0] = el; }}
        >
          {mediaInView && (
            <video 
              ref={videoRef}
              src="/vid_002_opt.mp4" 
              muted 
              loop 
              playsInline
              className={styles.media}
              style={{ backgroundColor: '#111' }}
            />
          )}
        </div>

        <div 
          className={styles.mediaBlockSmall} 
          ref={(el) => { if(el) mediaRefs.current[1] = el; }}
        >
          {mediaInView && (
            <img 
              src="/sign-up-image.jpg" 
              className={styles.media}
              alt="Coach"
              style={{ backgroundColor: '#111' }}
            />
          )}
        </div>
      </section>

      {/* Process Content */}
      <section className={styles.process}>
        <div className={styles.processMain}>
          <h1 className={styles.massiveTitle}>
            {renderAnimatedText("Driven by science,")}
            <br />
            {renderAnimatedText("backed by real", 15)}
            <br />
            {renderAnimatedText("world results.", 30)}
          </h1>
        </div>
        <div className={styles.processSidebar}>
          <p>
            The training process is meticulously designed around biomechanics and sustained progressive overload. We cut the noise and focus on pure, unadulterated growth.
          </p>
          
          <div className={styles.lastUpdated}>
            <span>Methodology</span>
            <span>Science-Based</span>
          </div>
        </div>
      </section>
      
    </main>
  );
}
